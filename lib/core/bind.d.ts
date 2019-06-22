/**
 * An observable object or property wrapped in a function.
 *
 * Can be observed with the `useObserved` and `tap` functions.
 */
export interface OLens<T = any> {
    /** Get the latest value */
    (): T;
    /** Update the latest value */
    (newValue: Partial<T>): T;
}
export declare function bind<T extends object>(state: T): OLens<T>;
export declare function bind<T extends object, P extends keyof T>(state: T, prop: P): OLens<T[P]>;
