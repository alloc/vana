import { AnyArray } from '../common';
import { Observable } from './Observable';
export declare type ObservedTuple<T extends AnyArray> = {
    [P in keyof T]: T[P] extends Observable<infer U> ? U : T[P];
};
/**
 * Observable tuples are **atomic units** and they _never_ change in length.
 * They observe every element in their source array. Non-observable elements are
 * _never_ made observable.
 */
export declare class OTuple<T extends AnyArray> extends Observable<ObservedTuple<T>> {
    private _source;
    constructor(source: T);
    /** @internal */
    ['_onChange'](): void;
    protected activate(): void;
    protected deactivate(): void;
}
