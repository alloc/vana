import { $ALIVE, $O, definePrivate } from '../shared'
import { latest } from './latest'
import { revise } from './revise'
import { watch } from './watch'

/**
 * An observable property wrapped in a function.
 *
 * Can be passed to the `useObserved` or `tap` functions.
 */
export interface OBinding<T = any> {
  (): T
  (newValue: T): void
}

/**
 * Wrap an observable property in a getter/setter function.
 *
 * The returned function is also observable.
 */
export function bind<T extends object, P extends keyof T>(
  state: T,
  prop: P
): OBinding<T[P]> {
  // tslint:disable-next-line
  const binding = function(newValue?: T) {
    if (!arguments.length) return latest(state)[prop]
    revise(latest(state), { [prop]: newValue } as any)
  }
  definePrivate(binding, $O, watch(state, prop as any))
  definePrivate(binding, $ALIVE, true)
  return binding as any
}
