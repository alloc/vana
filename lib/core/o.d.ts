import { Immutable } from 'immer';
import { Any } from '../shared';
import { Observable } from './Observable';
import { Driver } from './OSink';
/**
 * Create an Observable with the given driver.
 *
 * The driver may return a "dispose" function or an IDisposable object.
 */
export declare function o<T = unknown>(driver: Driver<T>): Observable<T>;
/**
 * ⚠️ Arbitrary function values are not supported.
 */
export declare function o<T extends Function>(value: [T] extends [Any] ? never : T): never;
/**
 * Make the given object readonly and observable, then return it.
 *
 * An observable clone is returned when the given object is already observable.
 *
 * An error is thrown when the given object is both frozen and _not_ observable.
 */
export declare function o<T extends {}>(root: [T] extends [Any] ? never : T): Immutable<T extends never[] ? any[] : T>;
/**
 * Create an Observable with the given value.
 */
export declare function o<T>(value: T): [T] extends [Any] ? any : Observable<T>;
