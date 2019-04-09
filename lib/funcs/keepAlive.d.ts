import { Disposable } from '../common';
/**
 * Tap the given object, and return an object whose values reflect any changes
 * to the given object and its descendants.
 */
export declare function keepAlive<T extends object>(initialState: T): Disposable<T>;
