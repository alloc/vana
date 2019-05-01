import { getObservers, isObservable, o, OTuple, revise, tap } from '../src'

describe('new OTuple()', () => {
  it('observes its elements deeply', () => {
    let foo = o({ a: { b: 1 } })
    tap(foo, $ => (foo = $))

    let tup = new OTuple([foo])
    let fn = jest.fn()
    tup.tap(fn)

    revise(foo.a, { b: 2 })
    expect(fn).toHaveBeenCalledWith(tup.get())

    revise(foo.a, { b: 3 })
    expect(fn).toHaveBeenLastCalledWith(tup.get())
  })

  it('ignores non-observable elements', () => {
    let foo = o({ a: 1 })
    let bar = { a: 2 }
    let tup = new OTuple([1, foo, bar])
    tup.tap(() => {})

    // Non-observable objects are never made observable.
    expect(isObservable(bar)).toBeFalsy()
    expect(getObservers(foo)).toContain(tup)
  })

  it('never observes the same target twice', () => {
    let foo = o({ a: 1 })
    let tup = new OTuple([foo, foo])
    tup.tap(() => {})

    expect(getObservers(foo)!.length).toBe(1)
  })

  it('creates a new array for every change', () => {
    let foo = o({ a: 1 })
    tap(foo, $ => (foo = $))

    let tup = new OTuple([foo, foo])
    tup.tap(() => {})

    let prev = tup.get()
    revise(foo, { a: 2 })
    expect(tup.get()).not.toBe(prev)
    expect(tup.get()).toEqual([foo, foo])

    prev = tup.get()
    revise(foo, { a: 3 })
    expect(tup.get()).not.toBe(prev)
    expect(tup.get()).toEqual([foo, foo])
  })
})
