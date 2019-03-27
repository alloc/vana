import { Observable } from '../types/Observable';
/**
 * If the given value is an array or object, create and return an `Observable`
 * instance after binding it to the given value.
 */
export declare function bind<T extends object>(value: T): Observable<T> | undefined;
/**
 * Bind the given observable to the given value.
 */
export declare function bind<T extends object>(value: T, observable: Observable<T>): Observable<T>;
