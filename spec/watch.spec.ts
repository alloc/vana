import { o, Observable, revise, tap, watch } from '../src'
import { immer } from '../src/immer'
import { getObservable, getObservers } from '../src/types/Observable'
import { OPath } from '../src/types/OPath'

createTests(true, 'es2015+')
createTests(false, 'legacy')

function createTests(useProxies: boolean, title: string) {
  beforeAll(() => {
    immer.setUseProxies(useProxies)
  })
  afterAll(() => {
    immer.setUseProxies(true)
  })

  describe('watch() - ' + title, () => {
    describe('when only an object is passed`', () => {
      it('returns a proxy for deep watching', () => {
        let base = o({ a: { b: { c: 1 } } })
        let op = watch(base).a.b.c as OPath
        expect(op).toBeInstanceOf(OPath)
        expect(op.path).toEqual(['a', 'b', 'c'])
        expect(op.root).toBe(getObservable(base))
      })
    })

    describe('when the 2nd argument is a function', () => {
      it('calls the function with a proxy for deep watching', () => {
        let base = o({ a: { b: { c: 1 } } })
        let op = watch(base, base => base.a.b.c) as OPath
        expect(op).toBeInstanceOf(OPath)
        expect(op.path).toEqual(['a', 'b', 'c'])
        expect(op.root).toBe(getObservable(base))
      })
    })

    describe('when the 2nd argument is a property name', () => {
      it('returns an Observable for a shallow property', () => {
        let base = o({ a: 1 })
        let op = watch(base, 'a')
        expect(op).toBeInstanceOf(Observable)
        expect(op.get()).toBe(1)

        let spy = jest.fn()
        op.tap(spy)

        revise(base, { a: 2 })
        expect(spy).toBeCalledWith(2)
      })
    })
  })

  // @internal
  describe('new OPath() - ' + title, () => {
    it('has no value until observed', () => {
      let base = o({ a: 1 })
      let op = watch(base).a
      expect(op.get()).toBeUndefined()
      op.tap(() => {})
      expect(op.get()).toBe(1)
    })

    it('observes changes to the root object', () => {
      let base = o({ a: { b: 1 } })
      let op = watch(base).a.b

      let spy = jest.fn()
      op.tap(spy)

      revise(base, { a: { b: 2 } })
      expect(spy).toBeCalledWith(2)
      expect(op.get()).toBe(2)
    })

    it('observes changes to its associated properties', () => {
      let base = o({ a: { b: { c: 1 } } })
      let op = watch(base).a.b.c

      let spy = jest.fn()
      op.tap(spy)

      revise(base.a, { b: { c: 2 } })
      expect(spy).toBeCalledWith(2)
    })

    it('ignores changes to unwatched properties', () => {
      let base = o({ a: { b: 1, c: 1 } })
      let op = watch(base).a.b

      let spy = jest.fn()
      op.tap(spy)

      revise(base.a, { c: 2 })
      expect(spy).not.toBeCalled()
    })

    it('supports deleted parent object', () => {
      type Base = { a: { b?: { c: number } } }
      let base: Base = o({ a: { b: { c: 1 } } })
      let op = watch(base).a.b.c

      let spy = jest.fn()
      op.tap(spy)

      // Delete a parent:
      revise(base, base => {
        delete base.a.b
      })
      expect(spy).toBeCalledWith(undefined)
      expect(op.get()).toBeUndefined()

      // Re-add the deleted parent:
      revise(base, base => {
        base.a.b = { c: 2 }
      })
      expect(spy).toBeCalledWith(2)
      expect(op.get()).toBe(2)
    })

    it('can be disposed of', () => {
      let base = o({ a: { b: 1 } })
      let op = watch(base).a.b

      let spy = jest.fn()
      op.tap(spy)

      op.dispose()
      revise(base.a, { b: 2 })
      expect(spy).not.toBeCalled()
    })

    describe('when the last property name has an observable value', () => {
      it('observes changes to the Observable of that property value', () => {
        let base = o({ a: { b: { c: 1 } } })
        let op = watch(base).a.b

        let spy = jest.fn()
        tap(op, spy)

        let copy = revise(base.a.b, { c: 2 })
        expect(spy).toBeCalledWith(copy)
        spy.mockReset()

        copy = revise(copy, { c: 3 })
        expect(spy).toBeCalledWith(copy)
      })

      it('stops observing when replaced with a non-observable value', () => {
        type Base = { foo: number | { a: number } }
        let foo = { a: 1 }
        let base: Base = o({ foo })

        let op = watch(base).foo
        tap(op, foo => {
          expect(foo).toBe(1)
        })

        revise(base, { foo: 1 })
        expect(getObservers(foo)).toBeUndefined()
        expect.assertions(2)
      })

      it('stops observing when deleted', () => {
        type Base = { foo?: { a: number } }
        let foo = { a: 1 }
        let base: Base = o({ foo })
        let op = watch(base).foo

        let spy = jest.fn()
        tap(op, spy)

        revise(base, base => {
          delete base.foo
        })
        expect(spy).toBeCalledWith(undefined)
        expect(getObservers(foo)).toBeUndefined()
      })
    })
  })
}
