import { o, tap } from '../src'

describe('new OPromise()', () => {
  it('observes fulfillment', () => {
    let p = o(defer())

    let spy = jest.fn()
    tap(p, spy)

    p.resolve('test')
    return p.then(() => {
      expect(spy).toBeCalled()
      expect(spy.mock.calls).toMatchSnapshot()
    })
  })

  it('observes rejection', () => {
    let p = o(defer())
    p.catch(() => {})

    let spy = jest.fn()
    tap(p, spy)

    p.reject('test')
    return p.catch(() => {
      expect(spy).toBeCalled()
      expect(spy.mock.calls).toMatchSnapshot()
    })
  })
})

interface Deferred<T> extends Promise<T> {
  resolve(value: T): void
  reject(error: any): void
}

function defer<T = any>(): Deferred<T> {
  let resolve: (_: any) => void
  let reject: (_: any) => void
  let promise: any = new Promise(($1, $2) => {
    resolve = $1
    reject = $2
  })
  promise.resolve = resolve!
  promise.reject = reject!
  return promise
}
