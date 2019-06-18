import { useMemoOne } from 'use-memo-one'
import { Driver, o, Observable } from '../core'
import { emptyArray } from './common'

/**
 * Create an observable value. The latest revision is always returned, but
 * changes will *not* trigger a re-render.
 *
 * If you pass an object that's already observable, it will be copied.
 *
 * Pass a function to create an observable subscriber.
 */
export function useO<T>(source: T | Driver<T>, deps: any[] = emptyArray): T {
  return useMemoOne(() => Observable.from(o(source))!, deps).get()
}
