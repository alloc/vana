import { IDisposable } from '../shared';
import { Observable } from './Observable';
export declare type Driver<T = any> = (next: (value: T) => void) => IDisposable | (() => void) | void;
/**
 * An observable sink that binds to an event stream.
 *
 * The binding is lazy, which means no value exists until observed.
 *
 * The current value is always `undefined` when no observers exist.
 */
export declare class OSink<T = any> extends Observable<T> {
    driver: Driver<T>;
    private _binding?;
    constructor(driver: Driver<T>);
    protected activate(): void;
    protected deactivate(): void;
}
