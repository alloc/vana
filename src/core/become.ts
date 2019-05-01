import { $O, definePrivate } from '../shared'
import { freeze, isFrozen } from './freeze'
import { getObservable } from './Observable'

/**
 * Mark `copy` as the "next revision" of `base` (which makes `copy` observable).
 *
 * - Returns `copy` only if `base` is observable.
 * - Freeze `copy` only if `base` is frozen.
 * - Do nothing if `base` is not observable.
 * - Throws if `base` is an old revision.
 */
export function become<T extends object>(base: T, copy: T): T | undefined {
  const target = getObservable(base)
  if (target) {
    target._rebind(copy)
    definePrivate(copy, $O, target)
    return isFrozen(base) ? (freeze(copy) as T) : copy
  }
}
