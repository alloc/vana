import { useEffect, useRef } from 'react'
import { useMemoOne } from 'use-memo-one'
import { ObservedTuple, OTuple } from '../core'
import { useForceUpdate } from './common'

/**
 * The given function is called whenever its array of inputs (which may or
 * may not contain observable values) is changed.
 *
 * The caller is re-rendered when the result is _not_ strictly equal to the
 * previous result.
 *
 * If none of the inputs will ever be an observable value, you should avoid
 * using this hook.
 */
export function useDerived<T extends any[], U>(
  derive: (...args: ObservedTuple<T>) => U,
  inputs: T
): U {
  const target = useMemoOne(() => new OTuple(inputs), inputs)
  const result = useRef<U>(undefined as any)

  // Ensure the result is never outdated.
  useMemoOne(
    () => {
      result.current = derive(...(target.get() as any))
    },
    [target, derive]
  )

  const forceUpdate = useForceUpdate()
  useEffect(
    () => {
      // Re-compute the result when an input changes.
      // Re-render when the result changes.
      return target.tap(() => {
        const nextResult = derive(...(target.get() as any))
        if (result.current !== nextResult) {
          result.current = nextResult
          forceUpdate()
        }
      }).dispose
    },
    [target, derive]
  )

  return result.current
}
