/**
 * An observable property wrapped in a function.
 *
 * Can be passed to the `useObserved` or `tap` functions.
 */
export interface OBinding<T = any> {
    (): T;
    (newValue: T): void;
}
/**
 * Wrap an observable property in a getter/setter function.
 *
 * The returned function is also observable.
 */
export declare function bind<T extends object, P extends keyof T>(state: T, prop: P): OBinding<T[P]>;
