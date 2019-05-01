import { immer } from '../shared/immer'

/** Frozen object type */
export type Frozen<T extends object> = T extends ReadonlyArray<infer U>
  ? ReadonlyArray<U>
  : Readonly<T>

/** Same as `Object.isFrozen` */
export const isFrozen = Object.isFrozen

/** Freezes the given object if `setAutoFreeze(false)` has not been called. */
export function freeze<T extends object>(base: T): Frozen<T> {
  if (immer.autoFreeze) Object.freeze(base)
  return base as any
}
