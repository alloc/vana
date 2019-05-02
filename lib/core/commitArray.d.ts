import { AnyArray } from '../shared';
/**
 * If `base` and `copy` have different lengths, emit a change for the "length"
 * property. Afterwards, emit a change for the entire array even if the lengths
 * were equal.
 */
export declare function commitArray(base: AnyArray, copy: AnyArray): void;
