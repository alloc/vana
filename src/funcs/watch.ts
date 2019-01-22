import { isDraftable } from 'immer'
import {
  AnyProp,
  createDescriptor,
  definePrivate,
  Dictionary,
  each,
  Except,
  isArray,
} from '../common'
import { immer } from '../immer'
import { __$observable, getObservable, Observable } from '../types/Observable'
import { OPath } from '../types/OPath'

/**
 * Create a proxy that mimics the shape of the given object, but its values are
 * converted into nested proxies (for objects) or an observable (for leaf nodes).
 */
export function watch<T extends object>(
  root: Except<T, NotProxyable>
): WatchProxy<T>

/**
 * Create a "watch proxy" and pass it into the given function.
 *
 * This is useful when one or more properties have multiple possible types.
 */
export function watch<
  T extends object,
  S extends (proxy: WatchProxy<T>) => any
>(root: Except<T, NotProxyable>, selector: S): ReturnType<S>

/** Track any property of an object. */
export function watch<T extends Dictionary<any>, P extends string | number>(
  parent: T,
  prop: P
): Observable<T[P]>

export function watch(parent: any, arg?: any) {
  let observable = getObservable(parent)
  if (!observable) {
    throw Error('Parent must be observable')
  }
  if (arguments.length == 1) {
    if (!isDraftable(parent)) {
      throw Error('Parent cannot be watched')
    }
    observable = new OPath(observable, [])
    return immer.useProxies
      ? new Proxy({ target: parent, observable }, watchProxyHandler)
      : createLegacyProxy(parent, observable)
  }
  if (typeof arg == 'function') {
    return arg(watch(parent))
  }
  if (isWatchable(observable)) {
    return observable.watch(arg)
  }
  throw Error(`Cannot watch property: "${arg}"`)
}

export type WatchProxy<T> = [T] extends [Proxyable<T>] // Always proxyable
  ? { readonly [P in keyof T]-?: WatchProp<T[P]> }
  : never

/**
 * Internal
 */

type NotProxyable = Set<any> | Map<any, any> | Promise<any> | Date

// TODO: Prevent proxying of arbitrary class instances (once possible).
type Proxyable<T> = Exclude<Extract<T, object>, NotProxyable>

// The property type of watch proxies.
type WatchProp<T> = [Proxyable<T>] extends [never] // Never proxyable
  ? Observable<T>
  : [T] extends [Proxyable<T>] // Always proxyable
  ? WatchProxy<T>
  : [T] extends [NonNullable<T>] // Never nullable
  ? WatchProxy<Proxyable<T>> | Observable<Exclude<T, Proxyable<T>>>
  :
      | NullableWatchProxy<Proxyable<T>>
      | ([NonNullable<T>] extends [Proxyable<T>] // Either proxyable or nullable
          ? never
          : Observable<Exclude<T, Proxyable<T>> | undefined>)

// For eagerly solving generic types.
type Solve<T> = T

// This ensures all Observable<T> types have a nullable T.
type NullableWatchProxy<T> = Solve<
  { readonly [P in keyof T]-?: WatchProp<T[P] | undefined> }
>

function isWatchable<T extends any>(
  object: T
): object is T & { watch(prop: AnyProp): Observable } {
  return object && typeof object.watch == 'function'
}

/**
 * ES2015+ Proxy
 */

type ProxyState = { target: object; observable: Observable }

const watchProxyHandler: ProxyHandler<ProxyState> = {
  get(state, prop) {
    if (prop == __$observable) {
      return state.observable
    }
    if (!isWatchable(state.observable)) {
      throw Error('Parent cannot be watched')
    }
    let target = state.target[prop]
    let observable = state.observable.watch(prop)
    return isDraftable(target)
      ? new Proxy({ target, observable }, watchProxyHandler)
      : observable
  },
}

/**
 * Legacy Proxy
 */

const defineGetter = createDescriptor({ get: undefined, enumerable: true })

// For environments without Proxy support.
function createLegacyProxy(target: object, observable: Observable) {
  let proxy = isArray(target)
    ? []
    : Object.create(Object.getPrototypeOf(target))

  definePrivate(proxy, __$observable, observable)

  each(target, prop => {
    if (prop in proxy) return
    defineGetter(proxy, prop, () => {
      if (!isWatchable(observable)) {
        throw Error('Parent cannot be watched')
      }
      let value = target[prop]
      return isDraftable(value)
        ? createLegacyProxy(value, observable.watch(prop))
        : observable.watch(prop)
    })
  })

  return proxy
}
