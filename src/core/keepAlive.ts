import { $ALIVE, Disposable, has, isFunction } from '../shared'
import { isObservable } from './Observable'
import { tap } from './tap'

/**
 * Tap the given object, and return an object whose values reflect any changes
 * to the given object and its descendants.
 */
export function keepAlive<T extends object>(initialState: T): Disposable<T> {
  if (!isObservable(initialState)) {
    throw Error('Expected an observable object')
  }
  const target: any = { state: initialState }
  const observer = tap(initialState, nextState => {
    target.state = nextState
  })
  return new Proxy(target, {
    get(_, prop) {
      if (prop === $ALIVE) {
        return true
      }
      const value = target.state[prop]
      if (prop === 'dispose') {
        return () => {
          observer.dispose()
          if (isFunction(value)) {
            value.call(target.state)
          }
        }
      }
      // Auto-bind methods from the prototype.
      if (!has(target.state, prop) && isFunction(value)) {
        return value.bind(target.state)
      }
      return value
    },
    ownKeys() {
      return Reflect.ownKeys(target.state)
    },
    getOwnPropertyDescriptor(_, prop) {
      const desc = Object.getOwnPropertyDescriptor(target.state, prop)
      if (desc) {
        desc.writable = false
        desc.configurable = true
      }
      return desc
    },
  }) as any
}
