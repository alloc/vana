import { o } from '../src'

describe('new OBinding()', () => {
  it('waits to call the driver until an observer is added', () => {
    let next: (value: number) => void = undefined as any
    let ob = o<number>(_next => {
      next = _next
    })
    expect(next).toBeUndefined()
    ob.tap(() => {})
    expect(typeof next).toBe('function')
  })

  describe('the driver function', () => {
    it('dictates when the value has changed', () => {
      let next: (value: number) => void = undefined as any
      let ob = o<number>(_next => {
        next = _next
      })
      ob.tap(() => {})

      // You should call `next` at least once before the callback returns.
      // Otherwise, the `get` method will return undefined.
      expect(ob.get()).toBeUndefined()

      next(1)
      expect(ob.get()).toBe(1)

      next(0)
      expect(ob.get()).toBe(0)
    })

    it('can return a dispose function', () => {
      let dispose = jest.fn()
      let ob = o<number>(_ => dispose)
      ob.tap(() => {})

      ob.dispose()
      expect(dispose).toBeCalledTimes(1)

      ob.dispose()
      expect(dispose).toBeCalledTimes(1)
    })

    it('can return an IDisposable object', () => {
      let d = { dispose: jest.fn() }
      let ob = o<number>(_ => d)
      ob.tap(() => {})

      ob.dispose()
      expect(d.dispose).toBeCalledTimes(1)

      ob.dispose()
      expect(d.dispose).toBeCalledTimes(1)
    })
  })

  it('is auto-disposed when no observers exist', () => {
    let dispose = jest.fn()
    let ob = o<number>(_ => dispose)

    let observer1 = ob.tap(() => {})
    let observer2 = ob.tap(() => {})

    observer1.dispose()
    expect(dispose).toBeCalledTimes(0)

    observer2.dispose()
    expect(dispose).toBeCalledTimes(1)
  })

  it('supports the set() method', () => {
    let ob = o<number>(_ => {})
    ob.tap(value => {
      expect(value).toBe(2)
      expect(value).toBe(ob.get())
    })
    ob.set(2)
    expect.assertions(2)
  })
})
