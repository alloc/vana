import { Immutable, isDraftable } from 'immer'
import {
  Any,
  copyProp,
  each,
  getProto,
  isArray,
  isFunction,
  isObject,
  isThenable,
} from '../shared'
import { $O } from '../shared'
import { isObservable, Observable } from './Observable'
import { bindPromise } from './OPromise'
import { bindProps } from './OProps'
import { Driver, OSink } from './OSink'

/**
 * Create an Observable with the given driver.
 *
 * The driver may return a "dispose" function or an IDisposable object.
 */
export function o<T = unknown>(driver: Driver<T>): Observable<T>

/**
 * ⚠️ Arbitrary function values are not supported.
 */
export function o<T extends Function>(
  value: [T] extends [Any] ? never : T
): never

/**
 * Make the given object readonly and observable, then return it.
 *
 * An observable clone is returned when the given object is already observable.
 *
 * An error is thrown when the given object is both frozen and _not_ observable.
 */
export function o<T extends {}>(
  root: [T] extends [Any] ? never : T
): Immutable<T extends never[] ? any[] : T>

/**
 * Create an Observable with the given value.
 */
export function o<T>(value: T): [T] extends [Any] ? any : Observable<T>

/** @internal */
export function o(arg: any) {
  if (isFunction(arg)) {
    return new OSink(arg)
  }
  if (isObject(arg)) {
    if (isThenable(arg)) {
      bindPromise(arg)
      return arg
    }
    if (arg[$O]) {
      return clone(arg)
    }
    bindProps(arg)
    return arg
  }
  return new Observable(arg)
}

/** Clone an observable object. Nested revisions are checked for staleness */
function clone(src: object) {
  let dest = isArray(src) ? [] : Object.create(getProto(src))
  each(src, prop => {
    if (prop !== $O) {
      let desc = copyProp(src, prop, dest)

      // Only enumerable keys are made observable.
      if (desc.enumerable && isDraftable(desc.value)) {
        if (isObservable(desc.value)) return
        dest[prop] = clone(desc.value)
      }
    }
  })
  bindProps(dest)
  return dest
}
