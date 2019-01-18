import { original } from 'immer'
import { isObservable, o, revise, tap } from '../src'
import { getObservable, getObservers } from '../src/types/Observable'
import { OProps } from '../src/types/OProps'

describe('revise()', () => {
  describe('when the 2nd argument is a plain object', () => {
    it('cannot revise a stale object', () => {
      let base = o({ a: 1 })
      revise(base, { a: 2 })
      expect(() => {
        revise(base, { a: 3 })
      }).toThrowErrorMatchingSnapshot()
    })

    it('is a no-op if no values changed', () => {
      let base = o({ a: 1 })
      expect(revise(base, {})).toBe(base)
      expect(revise(base, { a: 1 })).toBe(base)
    })

    it('never mutates the base object', () => {
      let base = o({ a: 1 })
      let copy = revise(base, { a: 2 })
      expect(copy.a).toBe(2)
      expect(base.a).toBe(1)
    })

    it('binds the Observable to the copy', () => {
      let base = o({ a: 1 })
      let baseObservable = getObservable(base)!

      let copy = revise(base, { a: 2 })
      expect(baseObservable).toBe(getObservable(copy))
      expect(baseObservable.get()).toBe(copy)
    })

    it('always does a shallow copy', () => {
      let base = { a: { b: 1 }, c: 1 }
      let changes = { a: { b: 2 } }
      let copy = revise(base, changes)
      expect(copy.a).toBe(changes.a)
      expect(copy).toEqual({ ...base, ...changes })
    })

    it('throws when the base object has a getter', () => {
      let base = {}
      Object.defineProperty(base, 'a', {
        get: () => 1,
        enumerable: true,
      })

      expect(() => {
        revise(base, { a: 2 })
      }).toThrowErrorMatchingSnapshot()
    })

    it('preserves non-enumerable properties', () => {
      let base = { a: 1 } as { a: number; b: number }
      Object.defineProperty(base, 'b', {
        value: 1,
      })

      let copy = revise(base, { a: 2 })
      expect(copy.a).toBe(2)
      expect(copy.b).toBe(1)

      copy = revise(copy, { b: 2 })
      expect(copy.a).toBe(2)
      expect(copy.b).toBe(2)
    })

    it('preserves the prototype of null objects', () => {
      let base = Object.create(null)
      let copy = revise(base, { a: 1 })
      expect(Object.getPrototypeOf(copy)).toBe(null)
      expect(copy.a).toBe(1)
    })

    it('throws when the base object is a class instance', () => {
      class Foo {}
      let base = new Foo()
      expect(() => {
        revise(base, { a: 1 })
      }).toThrowErrorMatchingSnapshot()
    })

    describe('when a new value is a plain object', () => {
      it('makes the value deeply observable', () => {
        let base: { a: any } = o({ a: 1 })
        let copy = revise(base, {
          a: {
            b: {},
            c: Object.freeze({}), // Frozen objects are skipped.
          },
        })
        expect(isObservable(copy.a)).toBeTruthy()
        expect(isObservable(copy.a.b)).toBeTruthy()
        expect(isObservable(copy.a.c)).toBeFalsy()
      })
    })

    // TODO: it('works inside a producer', () => {})
  })

  describe('when the 2nd argument is a recipe function', () => {
    it('can delete a property', () => {
      let base = o({ a: 1 })
      let spy = jest.fn()
      tap(base, spy)

      let copy = revise(base, draft => {
        delete draft.a
      })
      expect(spy).toBeCalledWith(copy)
    })

    describe('when changes are made', () => {
      it('returns an observable copy', () => {
        type Base = { a: number; b?: number }
        let base: Base = o({ a: 0 })
        let copy = revise(base, draft => {
          draft.a = 1
          draft.b = 1
        })

        expect(copy).not.toBe(base)
        expect(copy).toEqual({ a: 1, b: 1 })

        expect(isObservable(copy)).toBeTruthy()
        expect(isObservable(base)).toBeFalsy()
      })
    })

    describe('when nothing changes', () => {
      it('returns the original object', () => {
        let base = o({ a: 0 })
        let copy = revise(base, () => {})
        expect(copy).toBe(base)
      })
    })

    it('passes a mutable draft to the recipe function', () => {
      let base = o({ a: 0 })
      revise(base, draft => {
        expect(draft).not.toBe(base)
        draft.a = 1
        expect(draft.a).toBe(1)
      })
    })

    it('can pass extra arguments to the recipe function', () => {
      let obj = o({ a: 0 })
      let args = [1, 2, 3, 4, 5, 6]
      revise(
        obj,
        (draft: any, ...rest: any[]) => {
          expect(original(draft)).toBe(obj)
          expect(rest).toEqual(args)
        },
        ...args
      )
    })

    it('works with non-observable objects', () => {
      type Base = { a: number; b: number; c?: number }
      let base: Base = { a: 0, b: 0 }
      let changes = { a: 1, c: 1 }
      let copy = revise(base, changes)
      expect(base).not.toBe(copy)
      expect(copy).toEqual({ ...base, ...changes })
      expect(revise(copy, { a: 1 })).toBe(copy)
    })

    it('supports replacing an observable value with another', () => {
      let a1 = o({})
      let base = o({ a: a1 })
      let baseObservable = getObservable(base) as OProps
      let propObservable = baseObservable.watched!.get('a')!

      let a2 = o({})
      revise(base, draft => {
        draft.a = a2
      })
      expect(getObservers(a1)).toBeUndefined()
      expect(getObservers(a2)).toEqual([propObservable])
    })
  })
})
