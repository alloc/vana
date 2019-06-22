import { $O } from '../shared'
import { OLens } from './bind'

/**
 * Get the latest revision of the given value.
 *
 * Note: Only useful for observable values, but normal values are returned as-is.
 */
export function latest<T>(value: T | OLens<T>): T {
  const target = value && value[$O]
  return target ? target.get() : value
}
