import { Recipe } from '../shared/immer';
/**
 * Like `produce` in Immer, but observable!
 *
 * Additional arguments are forwarded to the effect function.
 *
 * The observability of the returned object is inherited from the base object,
 * except when the producer returns a new object.
 */
export declare function revise<T extends object, Args extends any[]>(base: T, produce: Recipe<T, Args>, ...args: Args): T;
/**
 * Clone the first argument and merge the second argument into it.
 *
 * The observability of the returned object is inherited from the base object.
 */
export declare function revise<T extends object, U extends object>(base: T, changes: {
    [P in keyof U]-?: P extends keyof T ? T[P] : never;
}): T;
/** @internal Supports observable and non-observable objects */
export declare function assignToCopy<T extends object>(base: T, changes: Partial<T>): T;
