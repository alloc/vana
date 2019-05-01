import { Dictionary } from '../shared';
import { Observable } from './Observable';
/**
 * Create a proxy that mimics the shape of the given object, but its values are
 * converted into nested proxies (for objects) or an observable (for leaf nodes).
 */
export declare function watch<T extends object>(root: Exclude<T, NotProxyable>): WatchProxy<T>;
/**
 * Create a "watch proxy" and pass it into the given function.
 *
 * This is useful when one or more properties have multiple possible types.
 */
export declare function watch<T extends object, S extends (proxy: WatchProxy<T>) => any>(root: Exclude<T, NotProxyable>, selector: S): ReturnType<S>;
/** Track any property of an object. */
export declare function watch<T extends Dictionary<any>, P extends string | number>(parent: T, prop: P): Observable<T[P]>;
export declare type WatchProxy<T> = [T] extends [Proxyable<T>] ? {
    readonly [P in keyof T]-?: WatchNode<T[P]>;
} : never;
/**
 * Internal
 */
declare type NotProxyable = Set<any> | Map<any, any> | Promise<any> | Date;
declare type Proxyable<T> = Exclude<Extract<T, object>, NotProxyable>;
declare type WatchNode<T> = {
    1: Observable<T>;
    2: WatchProxy<T>;
    3: WatchProxy<Proxyable<T>> | Observable<Exclude<T, Proxyable<T>>>;
    4: NullableBranch<Proxyable<T>> | WatchLeaf<T>;
}[[Proxyable<T>] extends [never] ? 1 : [T] extends [Proxyable<T>] ? 2 : [T] extends [NonNullable<T>] ? 3 : 4];
declare type NullableBranch<T> = Solve<{
    readonly [P in keyof T]-?: WatchNode<T[P] | undefined>;
}>;
declare type WatchLeaf<T> = [NonNullable<T>] extends [Proxyable<T>] ? never : Observable<Exclude<T, Proxyable<T>>>;
declare type Solve<T> = T;
export {};
