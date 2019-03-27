/**
 * Mark `copy` as the "next revision" of `base` (which makes `copy` observable).
 *
 * Returns `copy` only if `base` is observable (and `copy` is frozen only if
 * `base` is). Else return undefined.
 */
export declare function become<T extends object>(base: T, copy: T): T | undefined;
