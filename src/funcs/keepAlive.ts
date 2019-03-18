import { isObservable } from '../types/Observable'
import { tap } from './tap'

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
      return typeof value === 'function' ? value.bind(state) : value
    },
  })
}
