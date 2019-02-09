import { Immutable, isDraft, isDraftable } from 'immer'
import { each, Except, getProto, has } from '../common'
import { produce, Recipe } from '../immer'
import { __$observable } from '../types/Observable'
import { OProps } from '../types/OProps'
import { commit } from './commit'
import { freeze } from './freeze'

const {
  getOwnPropertyDescriptor: getPropDesc,
  defineProperty: defineProp,
} = Object

/**
 * Like `produce` in Immer, but observable!
 *
 * Additional arguments are forwarded to the effect function.
 *
 * The observability of the returned object is inherited from the base object,
 * except when the producer returns a new object.
 */
export function revise<T extends object, Args extends any[]>(
  base: T,
  produce: Recipe<T, Args>,
  ...args: Args
): Immutable<T>

/**
 * Clone the first argument and merge the second argument into it.
 *
 * The observability of the returned object is inherited from the base object.
 */
export function revise<T extends object, U extends Partial<T>>(
  base: Except<T, Function | ReadonlyArray<any>>,
  changes: U
): Immutable<T>

/** @internal */
export function revise(base: object, reviser: any, ...args: any[]) {
  let observable = base[__$observable]
  if (observable && !observable._isCurrent(base)) {
    throw Error('Outdated values cannot be revised')
  }
  return typeof reviser == 'object'
    ? assignToCopy(base, reviser)
    : produce(base, args.length ? draft => reviser(draft, ...args) : reviser)
}

/** @internal Supports observable and non-observable objects */
export function assignToCopy<T extends object>(
  base: Readonly<T>,
  changes: Partial<T>
): Readonly<T> {
  let copy: any
  let observable = base[__$observable] as OProps

  // To know if nothing changed as early as possible, apply the changes first.
  for (let prop in changes) {
    let desc = getPropDesc(base, prop)
    if (desc && has(desc, 'get')) {
      throw Error('Cannot mutate a computed property')
    }
    let value = changes[prop]
    if (value !== base[prop]) {
      if (!copy) {
        if (isDraftable(base)) {
          copy = Object.create(getProto(base))
        } else {
          throw Error('Expected a plain object')
        }
      }
      if (desc) {
        desc.value = value
        defineProp(copy, prop, desc)
      } else {
        copy[prop] = value
      }
    }
  }

  if (copy) {
    // Only enumerable keys are observable.
    let changed = Object.keys(copy)

    // Copy over the unchanged properties now that we know a copy is necessary.
    each(base, prop => {
      if (has(copy, prop)) return
      defineProp(copy, prop, getPropDesc(base, prop)!)
    })

    if (observable && !isDraft(base)) {
      observable._rebind(copy)
      for (let prop of changed) {
        commit(observable, base[prop], copy[prop], prop)
      }
      if (observable._observers) {
        commit(observable, base, copy)
      }
    }

    return freeze(copy) as any
  }
  return base
}
