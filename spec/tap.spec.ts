import { o, produce, tap } from '../src'

describe('tap()', () => {
  it('works with arrays', () => {
    let base = o([])
    let push = produce<any[], any[]>((draft, ...values) => {
      draft.push(...values)
    })

    let listener = jest.fn()
    let observer = tap(base, listener)

    let copy = base
    for (let i = 0; i < 2; i++) {
      copy = push(copy, 1)
      expect(listener).toBeCalledWith(copy)
      listener.mockReset()
    }

    observer.dispose()
    copy = push(copy, 1)
    expect(listener).not.toBeCalled()
  })

  it('works with objects', () => {
    let base = o({ a: 1 })
    let increment = produce<typeof base>(draft => {
      draft.a++
    })

    let listener = jest.fn()
    let observer = tap(base, listener)

    let copy = base
    for (let i = 0; i < 2; i++) {
      copy = increment(copy)
      expect(listener).toBeCalledWith(copy)
      listener.mockReset()
    }

    observer.dispose()
    copy = increment(copy)
    expect(listener).not.toBeCalled()
  })
})
