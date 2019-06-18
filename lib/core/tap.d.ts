import { IThenable } from '../shared';
import { OBinding } from './bind';
import { IObserver } from './Observable';
import { PromiseState } from './OPromise';
export declare type Tapped<T> = T extends IThenable<infer U> ? PromiseState<U> : T extends OBinding<infer U> ? U : T;
/** Listen to an observable value for changes. */
export declare function tap<T extends object>(target: T, onUpdate: (value: Tapped<T>) => void): IObserver<Tapped<T>>;
