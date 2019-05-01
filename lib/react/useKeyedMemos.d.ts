/**
 * Similar to `useMemos` except all memoized values are cached by the identity
 * of their `input` element (determined by the given `keyof` function).
 *
 * Each cached value is reused until its associated `input` element is removed,
 * which means `compute` is only called for new `input` elements.
 */
export declare function useKeyedMemos<T extends object, U>(input: ReadonlyArray<T>, keyof: (value: T) => string | number, compute: (value: T, index: number, array: ReadonlyArray<T>) => U): U[];
