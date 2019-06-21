/**
 * Map the given array, memoizing each mapped element.
 *
 * This provides an efficient update mechanism for observable arrays.
 */
export declare function useMemos<T extends ReadonlyArray<any>, U>(input: T, compute: (value: T[number], index: number, array: T) => U): U[];
