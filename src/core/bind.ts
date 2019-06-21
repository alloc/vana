import { $ALIVE, $O, definePrivate, isObject } from '../shared'
import { getObservable } from './Observable'
import { OProps } from './OProps'
import { revise } from './revise'

/**
 * An observable property wrapped in a function.
 *
 * Can be passed to the `useObserved` or `tap` functions.
 */
export interface OLens<T = any> {
  /** Get the latest value */
  (): T
  /** Update the latest value */
  (newValue: Partial<T>): T
}

export function bind<T extends object>(state: T): OLens<T>
export function bind<T extends object, P extends keyof T>(
  state: T,
  prop: P
): OLens<T[P]>

/**
 * Wrap an observable object or property in a getter/setter function.
 *
 * The returned function is also observable.
 *
 * For object values, the setter merges any objects passed to it, instead of
 * replacing the entire object value.
 */
export function bind(state: object, prop?: string | number): OLens {
  const target = getObservable(state)
  if (!(target instanceof OProps)) {
    throw Error('Expected an observable object')
  }
  const lens = (...args: any[]) => {
    const state = target.get()
    if (!args.length) {
      return prop == null ? state : state[prop]
    }
    const newValue = args[0]
    if (prop == null) {
      return revise(state, newValue)
    }
    const oldValue = state[prop]
    if (oldValue && oldValue[$O] && isObject(newValue)) {
      return revise(oldValue, newValue)
    }
    revise(state, { [prop]: newValue })
    return newValue
  }
  definePrivate(lens, $O, prop == null ? target : target.watch(prop))
  definePrivate(lens, $ALIVE, true)
  return lens
}
