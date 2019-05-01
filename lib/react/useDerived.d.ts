import { ObservedTuple } from '../core';
/**
 * The given function is called whenever its array of inputs (which may or
 * may not contain observable values) is changed.
 *
 * The caller is re-rendered when the result is _not_ strictly equal to the
 * previous result.
 *
 * If none of the inputs will ever be an observable value, you should avoid
 * using this hook.
 */
export declare function useDerived<T extends any[], U>(derive: (...args: ObservedTuple<T>) => U, inputs: T): U;
