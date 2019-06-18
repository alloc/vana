/**
 * Mark `copy` as the "next revision" of `base` (which makes `copy` observable).
 *
 * - Returns `copy` only if `base` is observable.
 * - Freeze `copy` only if `base` is frozen.
 * - Do nothing if `base` is not observable.
 * - Throws if `base` is an old revision.
 */
export declare function become<T extends object>(base: T, copy: T): T | undefined;
