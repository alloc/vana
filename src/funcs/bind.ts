import { isDraftable } from 'immer'
import { definePrivate } from '../common'
import { __$observable, Observable } from '../types/Observable'
import { OProps } from '../types/OProps'
import { isFrozen } from './freeze'

/**
 * If the given value is an array or object, create and return an `Observable`
 * instance after binding it to the given value.
 */
export function bind<T extends object>(value: T): Observable<T> | undefined

/**
 * Bind the given observable to the given value.
 */
export function bind<T extends object>(
  value: T,
  observable: Observable<T>
): Observable<T>

/** @internal */
export function bind(source: object, observable?: Observable) {
  if (source[__$observable]) {
    throw Error('Already observable')
  }
  if (isFrozen(source)) {
    throw Error('Frozen objects cannot become observable')
  }

  if (observable) {
    observable._rebind(source)
  } else if (isDraftable(source)) {
    observable = new OProps(source)
  } else return

  definePrivate(source, __$observable, observable)
  return observable
}
