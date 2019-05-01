import { useEffect } from 'react'
import { Observable, Observed, OProps } from '../core'
import { useForceUpdate } from './common'

/**
 * Subscribe to an observable value, and render whenever it changes.
 */
export function useObserved<T>(source: T): Observed<T>
export function useObserved<T extends object, P extends keyof T>(
  source: T,
  prop: P
): Observed<T[P]>

export function useObserved(source: any, prop?: string | number) {
  let target = Observable.from(source)
  if (prop !== undefined && target instanceof OProps) {
    target = target.watch(prop)
  }

  const forceUpdate = useForceUpdate()
  useEffect(
    () => {
      if (target) return target.tap(forceUpdate).dispose
    },
    [target]
  )

  return target ? target.get() : source
}
