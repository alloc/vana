import { AnyArray } from '../common'
import { $O } from '../symbols'
import { Observable } from '../types'
import { commit } from './commit'

/**
 * Emit a change for each index in the given range.
 */
export function commitIndices(
  base: AnyArray,
  copy: AnyArray,
  index: number,
  count: number
) {
  const target: Observable<any> = copy[$O]
  for (let i = index; i < index + count; i++) {
    // Coerce indices to strings, because Immer does the same.
    commit(target, base[i], copy[i], String(i), i >= copy.length)
  }
}
