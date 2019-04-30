import { $O } from '../symbols'

/**
 * Get the latest revision of the given value.
 *
 * Note: Only useful for observable values, but normal values are returned as-is.
 */
export function latest<T>(value: T): T {
  const target = value && value[$O]
  return target ? target.get() : value
}
