import { IThenable } from '../common';
import { IObserver } from '../types/Observable';
import { PromiseState } from '../types/OPromise';
export declare type Tapped<T> = T extends IThenable<infer U> ? PromiseState<U> : T;
/** Listen to an observable value for changes. */
export declare function tap<T extends object>(target: T, onUpdate: (value: Tapped<T>) => void): IObserver<Tapped<T>>;
