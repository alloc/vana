import { Observed } from '../core';
/**
 * Subscribe to an observable value, and render whenever it changes.
 */
export declare function useObserved<T>(source: T): Observed<T>;
export declare function useObserved<T extends object, P extends keyof T>(source: T, prop: P): Observed<T[P]>;
