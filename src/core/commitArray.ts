import { $O, AnyArray } from '../shared'
import { commit } from './commit'
import { Observable } from './Observable'

/**
 * If `base` and `copy` have different lengths, emit a change for the "length"
 * property. Afterwards, emit a change for the entire array even if the lengths
 * were equal.
 */
export function commitArray(base: AnyArray, copy: AnyArray) {
  if (base.length !== copy.length) {
    commit(copy[$O] as Observable<any>, base.length, copy.length, 'length')
  }
  commit(copy[$O], base, copy)
}
