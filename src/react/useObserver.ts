import { useLayoutEffect } from 'react'
import { Observable, Observed } from '../core'
import { emptyArray } from './common'

/**
 * Listen for changes to an observable value.
 */
export function useObserver<T>(
  source: T,
  onUpdate: (value: Observed<T>) => void,
  inputs = emptyArray
) {
  const target = Observable.from(source)
  useLayoutEffect(
    () => {
      if (target) return target.tap(onUpdate).dispose
    },
    [target, onUpdate, ...inputs]
  )
}
