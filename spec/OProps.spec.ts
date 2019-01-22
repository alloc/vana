import { o, revise, tap, watch } from '../src'
import { getObservable } from '../src/types/Observable'
import { OProp, OProps } from '../src/types/OProps'

describe('new OProps()', () => {
  it('observes deep changes', () => {
    let base = o({ a: { b: { c: 1 } } })
    tap(base, copy => {
      expect(copy.a.b.c).toBe(2)
    })
    revise(base.a.b, { c: 2 })
    expect.assertions(1)
  })

  describe('when a property value is observable', () => {
    it('creates an OProp<T> for the property name', () => {
      let base = o({ a: {} })
      let { watched } = getObservable(base) as OProps
      expect(watched).not.toBeUndefined()
      expect(watched!.get('a')).toBeInstanceOf(OProp)
    })
  })

  describe('when a property is changed with Immer', () => {
    // To be "revised directly" means no parent objects were drafted,
    // so we need to manually propagate changes to those parents.
    describe('when the property is revised directly', () => {
      it('is notified of a change', () => {
        let base = o({ a: { b: 1 } })
        tap(base, copy => {
          expect(copy.a.b).toBe(2)
        })
        revise(base.a, { b: 2 })
        expect.assertions(1)
      })

      it('is notified of a deletion', () => {
        type Base = { a: { b?: number } }
        let base: Base = o({ a: { b: 1 } })
        tap(base, copy => {
          expect('b' in copy.a).toBeFalsy()
        })
        revise(base.a, a => {
          delete a.b
        })
        expect.assertions(1)
      })

      it('is notified of an addition', () => {
        type Base = { a: { b?: number } }
        let base: Base = o({ a: {} })
        tap(base, copy => {
          expect(copy.a.b).toBe(1)
        })
        revise(base.a, { b: 1 })
        expect.assertions(1)
      })
    })
  })

  describe('when a property goes from being observable to not', () => {
    it('preserves the property if it still has observers', () => {
      type Base = { a?: { b: number } }
      let base: Base = o({ a: { b: 1 } })
      let baseObservable = getObservable(base) as OProps
      let propObservable = baseObservable.watched!.get('a')!
      let observer = watch(base, 'a').tap(() => {})

      revise(base, { a: undefined })
      expect(baseObservable.watched).not.toBeUndefined()
      expect(propObservable._observers).toEqual([observer])
    })
  })
})
