import { AnyArray } from '../common'
import { $O } from '../symbols'
import { Observable } from '../types'
import { commit } from './commit'

/**
 * Emit a change for the `length` property, then emit another change for the
 * entire observable array.
 */
export function commitLength(base: AnyArray, copy: AnyArray) {
  commit(copy[$O] as Observable<any>, base.length, copy.length, 'length')
  commit(copy[$O], base, copy)
}
