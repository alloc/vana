import { ImmerState } from 'immer'
import { AnyProp } from '../common'

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

/** An observed change */
export type Change<T = any> =
  | RootChange<T>
  | (T extends object
      ? keyof T extends infer P
        ? P extends any
          ? NestedChange<T, P>
          : never
        : never
      : never)

export interface IChangeTarget<T = any> {
  ['_onChange'](change: Change<T>): void
}

interface IChange {
  /** The event target */
  target: IChangeTarget
  /** The property being changed. When null, this change is for the root value. */
  prop: AnyProp | null
  /** The previous value */
  oldValue: unknown
  /** The next value */
  newValue: unknown
  /** Whether the property has been deleted */
  deleted: boolean
  /** Exists only when this event was triggered by Immer */
  state: Readonly<ImmerState> | null
}

type RootChange<T> = IChange & {
  prop: null
  oldValue: T
  newValue: T
  deleted: false
}

type NestedChange<T extends object, P extends keyof T = keyof T> =
  | (IChange & {
      prop: P
      oldValue: T[P] | undefined
      newValue: T[P]
      deleted: false
    })
  | (IChange & {
      prop: P
      oldValue: T[P]
      newValue: undefined
      deleted: true
    })
