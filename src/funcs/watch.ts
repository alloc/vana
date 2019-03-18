import { isDraftable } from 'immer'
import {
  AnyProp,
  createDescriptor,
  definePrivate,
  Dictionary,
  each,
  isArray,
} from '../common'
import { immer } from '../immer'
import { $O } from '../symbols'
import { getObservable, Observable } from '../types/Observable'
import { OPath } from '../types/OPath'

/**
 * Create a proxy that mimics the shape of the given object, but its values are
 * converted into nested proxies (for objects) or an observable (for leaf nodes).
 */
export function watch<T extends object>(
  root: Exclude<T, NotProxyable>
): WatchProxy<T>

/**
 * Create a "watch proxy" and pass it into the given function.
 *
 * This is useful when one or more properties have multiple possible types.
 */
export function watch<
  T extends object,
  S extends (proxy: WatchProxy<T>) => any
>(root: Exclude<T, NotProxyable>, selector: S): ReturnType<S>

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
  ? { readonly [P in keyof T]-?: WatchNode<T[P]> }
  : never

/**
 * Internal
 */

type NotProxyable = Set<any> | Map<any, any> | Promise<any> | Date

// TODO: Prevent proxying of arbitrary class instances (once possible).
type Proxyable<T> = Exclude<Extract<T, object>, NotProxyable>

type WatchNode<T> = {
  // T is never proxyable
  1: Observable<T>
  // T is always proxyable
  2: WatchProxy<T>
  // T is maybe proxyable but never nullable
  3: WatchProxy<Proxyable<T>> | Observable<Exclude<T, Proxyable<T>>>
  // T is maybe proxyable and maybe nullable
  4: NullableBranch<Proxyable<T>> | WatchLeaf<T>
  //
}[[Proxyable<T>] extends [never]
  ? 1
  : [T] extends [Proxyable<T>]
  ? 2
  : [T] extends [NonNullable<T>]
  ? 3
  : 4]

// When a proxyable node is nullable, its nullability is inherited by every
// leaf node contained therein. As such, the entire branch becomes nullable.
type NullableBranch<T> = Solve<
  { readonly [P in keyof T]-?: WatchNode<T[P] | undefined> }
>

// Leaf nodes are wrapped in an Observable<T> type.
type WatchLeaf<T> = [NonNullable<T>] extends [Proxyable<T>]
  ? never // All non-nullable types are proxyable.
  : Observable<Exclude<T, Proxyable<T>>>

// For eagerly solving generic types.
type Solve<T> = T

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
    if (prop == $O) {
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

  definePrivate(proxy, $O, observable)

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
