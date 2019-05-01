import { $O, Disposable, has, isFunction } from '../shared'
import { isObservable } from './Observable'
import { tap } from './tap'

const returnTrue = () => true
const observableProxy = {
  get(target: any, prop: any) {
    // Let `revise` be passed a `keepAlive` object.
    return prop == '_isCurrent' ? returnTrue : target[prop]
  },
}

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
      const value = target.state[prop]
      if (prop == $O) {
        return new Proxy(value, observableProxy)
      }
      if (prop == 'dispose') {
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
        desc.writable = true
        desc.configurable = true
      }
      return desc
    },
  }) as any
}
