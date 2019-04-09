import { IThenable } from '../common';
import { Observable } from './Observable';
export declare type PromiseState<T = any> = PendingState | FulfilledState<T> | RejectedState;
export declare type PendingState = {
    readonly resolved: false;
};
export declare type FulfilledState<T = any> = {
    readonly resolved: true;
    readonly result: T;
    readonly error: undefined;
};
export declare type RejectedState = {
    readonly resolved: true;
    readonly result: undefined;
    readonly error: Error;
};
export declare type PromiseResolver<T = any> = (resolve: (result: T | IThenable<T>) => void, reject: (error: Error) => void) => void;
export declare class OPromise<T = any> extends Observable<PromiseState<T>> {
    private _state;
    constructor(resolver?: PromiseResolver<T>);
    resolve<T>(result: IThenable<T>): void;
    resolve<T>(result: T): void;
    reject(error: any): void;
    /** @internal */
    ['_isCurrent'](value: any): boolean;
    static resolve<T>(result: IThenable<T>): OPromise<T>;
    static resolve<T>(result: T): OPromise<T>;
    private _fulfill;
    private _reject;
}
/** @internal */
export declare function bindPromise<T>(promise: IThenable<T>): Observable<any>;
