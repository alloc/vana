import { isDraft, isDraftable } from 'immer'
import { $ALIVE, $O, AnyArray, each, getProto, has } from '../shared'
import { produce, Recipe } from '../shared/immer'
import { commit } from './commit'
import { freeze, isFrozen } from './freeze'
import { OProps } from './OProps'

const {
  getOwnPropertyDescriptor: getPropDesc,
  defineProperty: defineProp,
} = Object

type AnySet<T = any> = Set<T> | WeakSet<T & object> | ReadonlySet<T>
type AnyMap<K = any, V = any> =
  | Map<K, V>
  | WeakMap<K & object, V>
  | ReadonlyMap<K, V>

/**
 * Like `produce` in Immer, but observable!
 *
 * Additional arguments are forwarded to the effect function.
 *
 * The object returned by `revise` is only observable when either (1) the base
 * object was/is observable and your producer returns nothing, or (2) your
 * producer returns an observable value.
 */
export function revise<T extends object, Args extends any[]>(
  base: T,
  producer: Recipe<T, Args>,
  ...args: Args
): T

/**
 * Clone the first argument and merge the second argument into it.
 *
 * The observability of the returned object is inherited from the base object.
 */
export function revise<T extends object, U extends Partial<T>>(
  base: T extends AnyArray | Function | AnyMap | AnySet
    ? 'This value must be revised with a producer. Try passing a function as the 2nd argument'
    : T,
  changes: U extends AnyArray
    ? 'Cannot merge an array into an object'
    : U extends Function
    ? U & Recipe<T>
    : U
): T & U

/** @internal */
export function revise(base: object, reviser: any, ...args: any[]) {
  let observable = base[$O]
  if (observable && !base[$ALIVE] && !observable._isCurrent(base)) {
    throw Error('Outdated values cannot be revised')
  }

  // Replace observable proxies with their latest revision.
  base = observable.get()

  return typeof reviser == 'object'
    ? assignToCopy(base, reviser)
    : produce(base, args.length ? draft => reviser(draft, ...args) : reviser)
}

/** @internal Supports observable and non-observable objects */
function assignToCopy<T extends object>(base: T, changes: Partial<T>): T {
  let copy: any
  let observable = base[$O] as OProps

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
      commit(observable, base, copy)
    }

    // Freeze the copy only if the base is frozen.
    return isFrozen(base) ? freeze(copy) : copy
  }
  return base
}
