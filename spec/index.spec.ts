// tslint:disable:no-construct
import {
  freeze,
  isObservable,
  o,
  Observable,
  revise,
  setAutoFreeze,
} from '../src'
import { OBinding } from '../src/types/OBinding'
import { getObservable } from '../src/types/Observable'
import { OPromise } from '../src/types/OPromise'

const { isFrozen } = Object

describe('o()', () => {
  beforeAll(() => {
    setAutoFreeze(true)
  })
  afterAll(() => {
    setAutoFreeze(false)
  })

  it('recursively affects all objects inside the root object', () => {
    let obj = {}
    let arr = [obj]
    let base = o({ arr })

    expect(base.arr).toBe(arr)
    expect(isFrozen(arr)).toBeTruthy()
    expect(isObservable(arr)).toBeTruthy()

    expect(base.arr[0]).toBe(obj)
    expect(isFrozen(obj)).toBeTruthy()
    expect(isObservable(obj)).toBeTruthy()
  })

  describe('when a promise is passed', () => {
    it('makes the promise observable', () => {
      let p = o(Promise.resolve())
      expect(isObservable(p)).toBeTruthy()
      expect(getObservable(p)).toBeInstanceOf(OPromise)
    })
  })

  describe('when a driver function is passed', () => {
    it('returns an OBinding', () => {
      let ob = o<number>(next => {})
      expect(ob).toBeInstanceOf(OBinding)
    })
  })

  const objects = {
    'null object': () => Object.create(null),
    'plain object': () => ({}),
    'plain array': () => [],
  }

  for (let name in objects) {
    let getValue = objects[name] as () => object

    describe(`when a ${name} is passed`, () => {
      it('may contain an observable object', () => {
        let inner = o({})
        let outer = getValue()
        outer[0] = inner
        expect(() => o(outer)).not.toThrow()
        expect(isObservable(outer)).toBeTruthy()
        expect(isObservable(inner)).toBeTruthy()
      })

      describe('when value is already observable', () => {
        it('returns an observable copy', () => {
          let base = o(getValue())
          let copy = o(base)
          expect(isObservable(base)).toBeTruthy()
          expect(isObservable(copy)).toBeTruthy()
          expect(copy).not.toBe(base)
          expect(copy).toEqual(base)
        })

        it('even works with old revisions', () => {
          let base = o(getValue())
          let copy1 = revise(base, d => {
            d[0] = true
          })
          expect(isObservable(base)).toBeFalsy()
          let copy2 = o(base)
          expect(copy2).not.toBe(copy1)
          expect(copy2).not.toBe(base)
          expect(copy2).toEqual(base)
        })

        it('deeply clones old revisions', () => {
          let base = getValue()
          base[0] = { a: 1 }
          base[1] = { a: 2 } // <= This one won't be revised.
          revise(o(base), d => {
            d[0].a = 2
          })
          let copy = o(base)
          expect(isObservable(copy[0])).toBeTruthy()
          expect(copy[0]).not.toBe(base[0])
          expect(copy[1]).toBe(base[1])
        })
      })

      describe('when value is not yet observable', () => {
        it('binds an Observable to it', () => {
          let base = o(getValue())
          expect(isObservable(base)).toBeTruthy()
        })

        it('makes the values readonly', () => {
          let base = o(getValue())
          expect(isFrozen(base)).toBeTruthy()
        })

        it('returns the given value', () => {
          let base = getValue()
          expect(o(base)).toBe(base)
        })

        it('throws when the given value is already frozen', () => {
          let base = freeze(getValue())
          expect(() => o(base)).toThrowErrorMatchingSnapshot()
        })
      })
    })
  }

  class Foo {}
  const primitives = {
    string: '',
    boolean: true,
    number: 0,
    symbol: Symbol(),
    'null value': null,
    'undefined value': undefined,

    // Currently, these types throw an error.
    date: new Date(),
    regexp: /^/,
    'class instance': new Foo(),
    'Map object': new Map(),
    'Set object': new Set(),
  }

  for (let name in primitives) {
    const value: unknown = primitives[name]

    describe(`when a ${name} is passed`, () => {
      if (value && typeof value === 'object') {
        // TODO: Could we do something better here?
        it('throws an error', () => {
          expect(() => {
            o(value)
          }).toThrowErrorMatchingSnapshot()
        })
      } else {
        it('returns an Observable', () => {
          expect(o(value)).toBeInstanceOf(Observable)
        })
      }
    })

    it(`skips ${name}s when nested in an object`, () => {
      let base = o({ value })
      expect(isObservable(base.value)).toBeFalsy()
    })
  }
})

describe('isObservable()', () => {
  it('returns true for objects that were just passed to `o()`', () => {
    expect(isObservable(o({}))).toBeTruthy()
  })

  it('returns false for objects never passed to `o()`', () => {
    expect(isObservable({})).toBeFalsy()
  })

  it('returns false for objects that were revised since being passed to `o()`', () => {
    let base = o({ a: 0 })
    revise(base, { a: 1 })
    expect(isObservable(base)).toBeFalsy()
  })
})

describe('new Observable()', () => {
  describe('when a getter is passed', () => {
    it('dictate its value on-demand', () => {
      let val = 1
      let get = jest.fn(() => val)
      let o = new Observable(get)
      expect(o.get()).toBe(1)
      val = 2
      expect(o.get()).toBe(2)
      expect(get).toBeCalledTimes(2)
    })
  })

  describe('set() method', () => {
    it('updates the current value', () => {
      let o = new Observable<number>(1)

      let spy = jest.fn()
      o.tap(spy)

      o.set(2)
      expect(o.get()).toBe(2)
      expect(spy).toBeCalledWith(2)
    })

    it('strictly compares the new/old values before notifying', () => {
      let o = new Observable<number>(1)

      let spy = jest.fn()
      o.tap(spy)

      o.set(1)
      expect(spy).not.toBeCalled()
    })

    describe('when the "source" is a getter', () => {
      it('notifies observers', () => {
        let o = new Observable<number>(() => 1)

        let spy = jest.fn()
        o.tap(spy)

        o.set(2)
        expect(spy).toBeCalledWith(2)
      })

      it('never overrides the getter', () => {
        let o = new Observable<number>(() => 1)

        o.set(2)
        expect(o.get()).toBe(1)
      })
    })
  })
})
