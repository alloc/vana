import { bind, keepAlive, latest, o, revise, tap } from '../src'

describe('bind() return value', () => {
  it('can be used as a getter', () => {
    let state = o({ foo: 1 })

    const foo = bind(state, 'foo')
    expect(foo()).toBe(1)

    state = revise(state, { foo: 2 })
    expect(foo()).toBe(2)
  })

  it('can be used as a setter', () => {
    const initialState = o({ foo: 1 })
    const state = keepAlive(initialState)
    const foo = bind(initialState, 'foo')

    foo(2)
    expect(state.foo).toBe(2)
  })

  it('can be observed', () => {
    let state = o({ foo: 1 })

    const foo = bind(state, 'foo')
    const spy = jest.fn()
    tap(foo, spy)

    state = revise(state, { foo: 2 })
    expect(spy).toBeCalledWith(2)

    foo(3)
    expect(spy).toBeCalledWith(3)
  })

  describe('when the property value is an object', () => {
    it('merges any partial passed to it', () => {
      const state = o({ foo: { a: 1, b: 1, c: 1 } })
      const foo = bind(state, 'foo')
      foo({ a: 2, c: 2 })

      expect(foo()).toBe(latest(state.foo))
      expect(foo()).toEqual({ a: 2, b: 1, c: 2 })
    })
  })

  describe('when no property is passed', () => {
    it('merges any partial passed to it', () => {
      const state = o({ a: 1, b: 1, c: 1 })
      const lens = bind(state)
      lens({ a: 2, c: 2 })

      expect(lens()).toBe(latest(state))
      expect(lens()).toEqual({ a: 2, b: 1, c: 2 })
    })

    it('throws when the object is not observable', () => {
      expect(() => {
        bind({})
      }).toThrowErrorMatchingSnapshot()
    })
  })
})
