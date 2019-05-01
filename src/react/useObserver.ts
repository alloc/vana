import { useEffect } from 'react'
import { Observable, Observed } from '../core'
import { emptyArray } from './common'

/**
 * Listen for changes to an observable value.
 */
export function useObserver<T>(
  source: T,
  onUpdate: (value: Observed<T>) => void,
  inputs: any[] = emptyArray
) {
  const target = Observable.from(source)
  useEffect(
    () => {
      if (target) return target.tap(onUpdate).dispose
    },
    [target, onUpdate, ...inputs]
  )
}
