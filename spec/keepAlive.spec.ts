import { immerable, keepAlive, o, revise } from '../src'

describe('keepAlive()', () => {
  it('throws if given object is not observable', () => {
    expect(() => {
      keepAlive({})
    }).toThrowErrorMatchingSnapshot()
  })
  it('throws if given object is not the latest revision', () => {
    const stale = o({ a: 1 })
    revise(stale, { a: 2 })
    expect(() => {
      keepAlive(stale)
    }).toThrowErrorMatchingSnapshot()
  })

  describe('returned proxy', () => {
    it('always points to the latest revision', () => {
      const init = o({ a: 1 })
      const state = keepAlive(init)
      expect(state.a).toBe(1)

      let next = revise(init, { a: 2 })
      expect(state.a).toBe(2)

      next = revise(next, { a: 3 })
      expect(state.a).toBe(3)
    })
    it('has a "dispose" method', () => {
      const init = o({ a: 1 })
      const state = keepAlive(init)
      expect(typeof state.dispose).toBe('function')

      state.dispose()
      revise(init, { a: 2 })
      expect(state.a).toBe(1)
    })
    it('auto-binds its methods to the current revision', () => {
      class Thing {
        [immerable] = true
        foo = false

        test() {
          return this
        }
      }
      const init = o(new Thing())
      const state = keepAlive(init)
      expect(state.test()).toBe(init)
      expect((void 0, state.test)()).toBe(init) // tslint:disable-line

      const next = revise(init, { foo: true })
      expect(state.test()).toBe(next)
      expect((void 0, state.test)()).toBe(next) // tslint:disable-line
    })
    it('works with Object.keys', () => {
      const init = o({ a: 1 })
      const state = keepAlive(init)
      expect(Object.keys(state)).toEqual(['a'])
    })
    it('works with Object.getOwnPropertyDescriptor', () => {
      const init = o({ a: 1 })
      const state = keepAlive(init)
      expect(Object.getOwnPropertyDescriptor(state, 'a')).toMatchObject({
        value: 1,
        writable: false,
        enumerable: true,
        configurable: true,
      })
    })
    it('works with Object.prototype.hasOwnProperty', () => {
      const init = o({ a: 1 })
      const state = keepAlive(init)
      expect(state.hasOwnProperty('a')).toBeTruthy()
    })
  })
})
