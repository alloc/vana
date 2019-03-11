import { definePrivate } from '../common'
import { $O } from '../symbols'
import { getObservable } from '../types/Observable'
import { freeze, isFrozen } from './freeze'

/**
 * Mark `copy` as the "next revision" of `base` (which makes `copy` observable).
 *
 * Returns `copy` only if `base` is observable (and `copy` is frozen only if
 * `base` is). Else return undefined.
 */
export function become<T extends object>(base: T, copy: T): T | undefined {
  const target = getObservable(base)
  if (target) {
    target._rebind(copy)
    definePrivate(copy, $O, target)
    return isFrozen(base) ? (freeze(copy) as T) : copy
  }
}
