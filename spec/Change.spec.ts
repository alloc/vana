import { _, assert } from 'spec.ts'
import { Change } from '../src'

it('works', () => {})

// TODO: fix generics with the Change type?
export function usage<T>() {
  const change = {} as Change<T>

  // assert(change.prop, _ as keyof T | null)
  assert(change.deleted, _ as boolean)
  // assert(change.newValue, _ as T | T[keyof T] | undefined)
  // assert(change.oldValue, _ as T | T[keyof T] | undefined)

  if (change.deleted) {
    // assert(change.prop, _ as keyof T)
    assert(change.deleted, true)
    // assert(change.newValue, undefined)
    // assert(change.oldValue, _ as T[keyof T])
  } else {
    // assert(change.prop, _ as keyof T | null)
    assert(change.deleted, false)
    // assert(change.newValue, _ as T[keyof T])
    // assert(change.oldValue, _ as T[keyof T] | undefined)
  }

  if (change.prop !== null) {
    // assert(change.prop, _ as keyof T)
    assert(change.deleted, _ as boolean)
    // assert(change.newValue, _ as T[keyof T])
    // assert(change.oldValue, _ as T[keyof T] | undefined)
  } else {
    assert(change.prop, _ as null)
    // assert(change.deleted, false)
    // assert(change.newValue, _ as T[keyof T])
    // assert(change.oldValue, _ as T[keyof T])
  }
}
