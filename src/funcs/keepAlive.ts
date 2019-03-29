import { has } from '../common'
import { $O } from '../symbols'
import { isObservable } from '../types/Observable'
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
export function keepAlive<T extends object>(initialState: T): T {
  if (!isObservable(initialState)) {
    throw Error('Expected an observable object')
  }
  let state: any = initialState
  tap(state, newState => {
    state = newState
  })
  return new Proxy({} as any, {
    get(_, prop) {
      const value = state[prop]
      if (prop == $O) {
        return new Proxy(value, observableProxy)
      }
      // Auto-bind methods from the prototype.
      if (!has(state, prop) && typeof value == 'function') {
        return value.bind(state)
      }
      return value
    },
  })
}
