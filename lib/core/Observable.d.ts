import { IDisposable } from '../shared';
import { Change, IChangeTarget } from './Change';
/**
 * Observers are disposable "change targets".
 *
 * Use `IChangeTarget<T>` if your observer is not disposable.
 */
export interface IObserver<T = any> extends IChangeTarget<T>, IDisposable {
}
/** The source of truth for an observable */
declare type Source<T = any> = (() => T) | T;
/** An observable value */
export declare class Observable<T = any> implements IObserver<T> {
    ['_observers']?: Array<IChangeTarget<T>>;
    protected _get?: () => T;
    protected _value?: T;
    readonly id: number;
    constructor(source: Source<T>);
    /** Try coercing the given value into an Observable instance. */
    static from<T = any>(value: any): Observable<T> | undefined;
    /** The current value. */
    get(): T;
    /**
     * When the source of truth is a getter, this method only notifies observers.
     * Otherwise, this method also updates the current value.
     */
    set(newValue: T, force?: boolean): void;
    /** Listen for changes. */
    tap(onUpdate: (value: T) => void): IObserver<T> & {
        onUpdate: (value: T) => void;
    };
    /** Remove all observers and perform subclass cleanup (if necessary) */
    dispose(): void;
    /** @internal Notify observers of a change */
    ['_onChange'](change: Change<T>): void;
    /** @internal Returns false when the given value is outdated */
    ['_isCurrent'](value: any): boolean;
    /** @internal Swap out the source of truth for this observable. */
    ['_rebind'](source: Source<T>): void;
    /** @internal */
    ['_addObserver'](observer: IChangeTarget<T>, prepend?: boolean): IChangeTarget<T>;
    /** @internal */
    ['_removeObserver'](observer: IChangeTarget<T>): void;
    /** Called when an Observable goes from 0 observers to 1+ */
    protected activate(): void;
    /** Called when an Observable goes from 1+ observers to 0 */
    protected deactivate(): void;
}
/** Returns true if the given value has been passed to `o()` and is not stale. */
export declare function isObservable(value: any): value is object;
/** Throws an error when the given object is an old revision */
export declare function getObservable<T = any>(value: object): Observable<T> | undefined;
/** @internal */
export declare function getObservers(value: object): IChangeTarget<any>[] | undefined;
export {};
