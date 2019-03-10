import { getObservable } from '../types/Observable'
import { bind } from './bind'
import { commit } from './commit'
import { freeze, Frozen } from './freeze'

/**
 * Make `copy` the next revision of `base`, then freeze the `copy`.
 */
export function become<T extends object>(base: T, copy: T): Frozen<T> {
  const target = getObservable(base)
  if (target) {
    bind(copy, target)
    commit(target, base, copy)
  }
  return freeze(copy)
}
