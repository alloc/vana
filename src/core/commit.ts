import { ImmerState } from 'immer'
import { IChangeTarget } from './Change'

/** Notify observers of a change to the root value */
export function commit<T, TT extends T>(
  target: IChangeTarget<T>,
  oldValue: TT,
  newValue: TT,
  prop?: null,
  deleted?: false,
  state?: ImmerState | null
): void

/** Notify observers of a change to some property value */
export function commit<
  T extends object,
  P extends keyof T,
  Deleted extends boolean,
  OldValue extends Deleted extends true ? T[P] : T[P] | undefined,
  NewValue extends Deleted extends true ? undefined : T[P]
>(
  target: IChangeTarget<T>,
  oldValue: OldValue,
  newValue: NewValue,
  prop: P,
  deleted?: Deleted,
  state?: ImmerState | null
): void

export function commit(
  target: any,
  oldValue: any,
  newValue: any,
  prop: any = null,
  deleted: any = false,
  state: any = null
) {
  // TODO: See if an object pool is faster or not.
  target._onChange({
    target,
    prop,
    oldValue,
    newValue,
    deleted,
    state,
  })
}
