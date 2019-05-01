import {
  getObservable,
  getObservers,
  o,
  OProp,
  OProps,
  revise,
  tap,
  watch,
} from '../src'

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
    it('creates an OProp for the property name', () => {
      let base = o({ a: {} })
      let { watched } = getObservable(base) as OProps
      expect(watched!.a).toBeInstanceOf(OProp)
    })

    it('keeps its OProp activated when its last observer is removed', () => {
      let base = o({ a: {} })
      let { watched } = getObservable(base) as OProps
      let observer = watch(base, 'a').tap(() => {})
      observer.dispose()
      expect(watched!.a).toBeInstanceOf(OProp)
    })
  })

  describe('when a property value becomes observable', () => {
    it('deeply observes its value', () => {
      let base: any = o({ a: 1 })
      let baseObservable = getObservable(base) as OProps
      expect(baseObservable.watched).toBeUndefined()
      baseObservable.tap(copy => {
        base = copy
      })

      // Set the property to an observable object.
      revise(base, { a: { b: { c: 1 } } })
      expect(baseObservable.watched!.a).toBeInstanceOf(OProp)

      // Set a deep property.
      let prevBase = base
      revise(base.a.b, { c: 2 })

      // Ensure `base` was updated.
      expect(base).not.toBe(prevBase)
      expect(base.a.b.c).toBe(2)
    })
  })

  describe('when a property goes from being observable to not', () => {
    it('deactivates its OProp when no observers exist', () => {
      let base: any = o({ a: {} })
      let baseObservable = getObservable(base) as OProps

      revise(base, { a: undefined })
      expect(baseObservable.watched!.a).toBeUndefined()
    })

    it('keeps its OProp activated when observers exist', () => {
      type Base = { a?: { b: number } }
      let base: Base = o({ a: { b: 1 } })
      let baseObservable = getObservable(base) as OProps
      let propObservable = baseObservable.watched!.a!
      let observer = watch(base, 'a').tap(() => {})

      revise(base, { a: undefined })
      expect(baseObservable.watched!.a).toBeDefined()
      expect(getObservers(propObservable)).toEqual([observer])
    })
  })

  describe('order of observers for a nested observable', () => {
    it('ensures the first observer is its OProp', () => {
      let nested = o({ b: 1 })
      let observer = tap(nested, () => {})
      expect(getObservers(nested)).toEqual([observer])

      let base: any = o({ a: nested })
      let baseObservable = getObservable(base) as OProps
      expect(getObservers(nested)).toEqual([
        baseObservable.watched!.a,
        observer,
      ])
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
})
