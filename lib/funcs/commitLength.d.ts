import { AnyArray } from '../common';
/**
 * Emit a change for the `length` property, then emit another change for the
 * entire observable array.
 */
export declare function commitLength(base: AnyArray, copy: AnyArray): void;
