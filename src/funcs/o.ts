/* tslint:disable:unified-signatures */
import { isObject, isThenable, shallowCopy } from '../common'
import { Immutable } from '../immer'
import { Driver, OBinding } from '../types/OBinding'
import { __$observable, Observable } from '../types/Observable'
import { bindPromise } from '../types/OPromise'
import { bindProps } from '../types/OProps'

// Avoid copying these properties.
const neverCopied = [__$observable] as [typeof __$observable]

/**
 * Create an Observable with the given driver.
 *
 * The driver may return a "dispose" function or an IDisposable object.
 */
export function o<T = unknown>(driver: Driver<T>): Observable<T>

/**
 * ⚠️ Arbitrary function values are not supported.
 */
export function o<T extends Function>(value: any extends T ? never : T): never

/**
 * Make the given object readonly and observable, then return it.
 *
 * An observable clone is returned when the given object is already observable.
 *
 * An error is thrown when the given object is both frozen and _not_ observable.
 */
export function o<T extends object>(
  root: any extends T ? never : T
): Immutable<T>

/**
 * Create an Observable with the given value.
 */
export function o<T>(value: T): any extends T ? any : Observable<T>

/** @internal */
export function o(value: unknown) {
  if (typeof value === 'function') {
    return new OBinding(value as any)
  }
  if (isObject(value)) {
    if (isThenable(value)) {
      bindPromise(value)
      return value
    }
    // Create an observable clone if already observable.
    if (value[__$observable]) {
      let copy = shallowCopy(value, neverCopied)
      bindProps(copy)
      return copy
    }
    bindProps(value)
    return value
  }
  return new Observable(value)
}
