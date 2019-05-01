import { Immutable } from 'immer';
import { Driver } from '../types/OBinding';
import { Observable } from '../types/Observable';
/**
 * Create an Observable with the given driver.
 *
 * The driver may return a "dispose" function or an IDisposable object.
 */
export declare function o<T = unknown>(driver: Driver<T>): Observable<T>;
/**
 * ⚠️ Arbitrary function values are not supported.
 */
export declare function o<T extends Function>(value: any extends T ? never : T): never;
/**
 * Make the given object readonly and observable, then return it.
 *
 * An observable clone is returned when the given object is already observable.
 *
 * An error is thrown when the given object is both frozen and _not_ observable.
 */
export declare function o<T extends {}>(root: any extends T ? never : T): Immutable<T extends never[] ? any[] : T>;
/**
 * Create an Observable with the given value.
 */
export declare function o<T>(value: T): any extends T ? any : Observable<T>;
