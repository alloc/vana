import { bind, keepAlive, o, revise, tap } from '../src'

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
})
