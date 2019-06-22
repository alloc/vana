import { AnyArray } from '../shared';
import { Recipe } from '../shared/immer';
declare type AnySet<T = any> = Set<T> | WeakSet<T & object> | ReadonlySet<T>;
declare type AnyMap<K = any, V = any> = Map<K, V> | WeakMap<K & object, V> | ReadonlyMap<K, V>;
/**
 * Like `produce` in Immer, but observable!
 *
 * Additional arguments are forwarded to the effect function.
 *
 * The object returned by `revise` is only observable when either (1) the base
 * object was/is observable and your producer returns nothing, or (2) your
 * producer returns an observable value.
 */
export declare function revise<T extends object, Args extends any[]>(base: T, producer: Recipe<T, Args>, ...args: Args): T;
/**
 * Clone the first argument and merge the second argument into it.
 *
 * The observability of the returned object is inherited from the base object.
 */
export declare function revise<T extends object, U extends Partial<T>>(base: T extends AnyArray | Function | AnyMap | AnySet ? 'This value must be revised with a producer. Try passing a function as the 2nd argument' : T, changes: U extends AnyArray ? 'Cannot merge an array into an object' : U extends Function ? U & Recipe<T> : U): T & U;
export {};
