export * from './symbols'

/** Give `any` its own class */
export abstract class Any {
  protected _: any
}

/** Resolve object intersections */
export type Id<T> = { [P in keyof T]: T[P] }

/** Any property name */
export type AnyProp = keyof any

/** Any array type */
export type AnyArray = ReadonlyArray<any>

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
export const createDescriptor = (desc: object) => {
  const attr = has(desc, 'get') ? 'get' : 'value'
  return (obj: object, prop: AnyProp, value: any) => {
    desc[attr] = value
    Object.defineProperty(obj, prop, desc)
    desc[attr] = undefined
    return obj
  }
}

/** For defining a non-enumerable property */
export const definePrivate = createDescriptor({ value: undefined })

/** Function that ignores its arguments and always returns nothing */
export const noop = Function.prototype as (...args: any[]) => void

export const getProto = Object.getPrototypeOf
export const isArray = Array.isArray

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

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

export interface IThenable<T = any> {
  then(
    onFulfill: (value: T) => void,
    onReject?: (error: Error) => void
  ): IThenable<T>
}

export function isThenable(value: object): value is IThenable {
  return typeof value['then'] == 'function'
}

export function shallowCopy<T extends object>(obj: T): T {
  if (isArray(obj)) {
    return obj.slice() as any
  } else {
    let copy = Object.create(getProto(obj))
    each(obj, prop => copyProp(obj, prop, copy))
    return copy
  }
}

export function copyProp(src: object, prop: AnyProp, dest: object) {
  let desc = Object.getOwnPropertyDescriptor(src, prop)!
  if (desc.get) {
    throw Error('Getters are only allowed on prototypes')
  }
  if (desc.enumerable) {
    dest[prop] = desc.value
  } else {
    Object.defineProperty(dest, prop, {
      value: desc.value,
      writable: true,
      configurable: true,
    })
  }
  return desc
}

/** Iterate over the keys of an object */
export function each(obj: object, iter: (prop: AnyProp) => void) {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) iter(i)
  } else if (typeof Reflect !== 'undefined') {
    Reflect.ownKeys(obj).forEach(iter)
  } else {
    Object.getOwnPropertyNames(obj).forEach(iter)
    Object.getOwnPropertySymbols(obj).forEach(iter)
  }
}
