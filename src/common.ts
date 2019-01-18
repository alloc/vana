/** Resolve object intersections */
export type Id<T> = { [P in keyof T]: T[P] }

/** Any property name */
export type AnyProp = keyof any

export type Except<T, U> = T extends U ? never : T

/** Used in place of `object` when necessary */
export type Dictionary<T> = {
  [key: string]: T | undefined
  [index: number]: T | undefined
}

/** Add `dispose` method to type T */
export type Disposable<T extends object = any> = Id<T & IDisposable>

/** Object with `dispose` method */
export interface IDisposable {
  dispose: () => void
}

/** `Object#hasOwnProperty` bound to `Function#call` */
export const has = Function.call.bind(Object.hasOwnProperty) as (
  obj: object,
  prop: AnyProp
) => boolean

/** Create a function that reuses a property descriptor */
export const PropertyDescriptor = (desc: object) => {
  const attr = has(desc, 'get') ? 'get' : 'value'
  return (obj: object, prop: AnyProp, value: any) => {
    desc[attr] = value
    Object.defineProperty(obj, prop, desc)
    desc[attr] = undefined
    return obj
  }
}

/** For defining a non-enumerable property */
export const definePrivate = PropertyDescriptor({ value: undefined })

/** Function that ignores its arguments and always returns nothing */
export const noop = Function.prototype as (...args: any[]) => void

export const getProto = Object.getPrototypeOf
export const isArray = Array.isArray

export function isObject(value: unknown): value is object {
  return value && typeof value === 'object'
}

export function isPlainObject(value: unknown): value is object {
  if (value) {
    const proto = getProto(value)
    return proto === null || proto === Object.prototype
  }
  return false
}

export function isCopyable(value: unknown) {
  return isArray(value) || isPlainObject(value)
}

export interface IThenable<T = any> {
  then(
    onFulfill: (value: T) => void,
    onReject?: (error: Error) => void
  ): IThenable<T>
}

export function isThenable(value: object): value is IThenable {
  return typeof value['then'] == 'function'
}

export function isGetter<T>(fn: Function): fn is () => T {
  return !fn.length
}

export function shallowCopy<T extends Dictionary<any>>(
  obj: T,
  exclude?: Array<keyof any>
): T {
  if (isArray(obj)) {
    return obj.slice() as any
  }
  let clone = Object.create(Object.getPrototypeOf(obj))
  each(obj, prop => {
    if (exclude && exclude.indexOf(prop) >= 0) return
    let desc = Object.getOwnPropertyDescriptor(obj, prop)!
    if (desc.get) {
      throw Error('Getters are only allowed on prototypes')
    }
    if (desc.enumerable) {
      clone[prop] = desc.value
    } else {
      Object.defineProperty(clone, prop, {
        value: desc.value,
        writable: true,
        configurable: true,
      })
    }
  })
  return clone
}

/** Iterate over the keys of an object */
export function each<T extends object>(obj: T, iter: (key: keyof T) => void) {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) iter(i as any)
  } else if (typeof Reflect !== 'undefined') {
    Reflect.ownKeys(obj).forEach(iter as any)
  } else {
    Object.getOwnPropertyNames(obj).forEach(iter as any)
    Object.getOwnPropertySymbols(obj).forEach(iter as any)
  }
}
