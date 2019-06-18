import { useEffect } from 'react'
import { useMemoOne } from 'use-memo-one'
import { Observable } from '../core'
import { useForceUpdate } from './common'

/**
 * Map the given array, memoizing each mapped element.
 *
 * This provides an efficient update mechanism for observable arrays.
 */
export function useMemos<T extends ReadonlyArray<any>, U>(
  input: T,
  compute: (value: T[number], index: number, array: T) => U
): U[] {
  const target = Observable.from(input)
  const output = useMemoOne(
    () => {
      return target ? target.get().map(compute) : []
    },
    [target, compute]
  )

  const forceUpdate = useForceUpdate()
  useEffect(
    () => {
      if (target) {
        const observer = target._addObserver({
          _onChange(change) {
            const { prop } = change
            if (prop == null) return
            if (prop === 'length') {
              if (change.newValue < change.oldValue) {
                output.splice(change.newValue, Infinity)
                forceUpdate()
              }
            } else if (!change.deleted) {
              const index = Number(prop)
              const newValue = compute(change.newValue, index, target.get())
              if (newValue !== output[index]) {
                output[index] = newValue
                forceUpdate()
              }
            }
          },
        })
        return () => {
          target._removeObserver(observer)
        }
      }
    },
    [output]
  )

  return output
}
