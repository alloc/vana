import { useEffect, useMemo } from 'react'
import { Observable } from '../core'
import { useForceUpdate } from './common'

/**
 * Similar to `useMemos` except all memoized values are cached by the identity
 * of their `input` element (determined by the given `keyof` function).
 *
 * Each cached value is reused until its associated `input` element is removed,
 * which means `compute` is only called for new `input` elements.
 */
export function useKeyedMemos<T extends object, U>(
  input: ReadonlyArray<T>,
  keyof: (value: T) => string | number,
  compute: (value: T, index: number, array: ReadonlyArray<T>) => U
): U[] {
  const target = Observable.from(input)
  const cache = useMemo(() => Object.create(null), [target, keyof, compute])
  const output = useMemo(
    () => {
      return target ? target.get().map(keyedCompute(cache, keyof, compute)) : []
    },
    [cache]
  )

  const forceUpdate = useForceUpdate()
  useEffect(
    () => {
      if (target) {
        // Bind the `compute` function to our cache.
        compute = keyedCompute(cache, keyof, compute)

        let truncated = false
        const observer = target._addObserver({
          _onChange(change) {
            const { prop } = change
            if (prop == null) {
              if (truncated) {
                truncated = false

                // Remove unused values from the cache.
                const { newValue, oldValue } = change
                for (let i = newValue.length; i < oldValue.length; i++) {
                  delete cache[keyof(oldValue[i])]
                }

                output.splice(newValue.length, Infinity)
                forceUpdate()
              }
            } else if (prop === 'length') {
              if (change.newValue < change.oldValue) {
                truncated = true
              }
            } else if (!change.deleted) {
              const index = Number(prop)
              const result = compute(change.newValue, index, target.get())
              if (result !== output[index]) {
                output[index] = result
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

function keyedCompute<T extends object, U>(
  cache: { [key: string]: U; [key: number]: U },
  keyof: (value: T) => string | number,
  compute: (value: T, index: number, array: ReadonlyArray<T>) => U
): typeof compute {
  return (value, index, array) => {
    const key = keyof(value)
    const cached = cache[key]
    if (cached) {
      return cached
    }
    const result: any = compute(value, index, array)
    if (result !== undefined && result !== false) {
      cache[key] = result
    }
    return result
  }
}
