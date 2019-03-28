import { AnyProp, Dictionary } from '../common';
import { Change } from './Change';
import { Observable } from './Observable';
/**
 * An observable property whose ancestors are also observed. The property value
 * is deeply observed when possible.
 */
export declare class OPath<T = any> extends Observable<T> {
    readonly root: Observable<object>;
    readonly path: ReadonlyArray<AnyProp>;
    private _changed;
    private _lastParent?;
    private _observedValue?;
    private _observedParents?;
    constructor(root: Observable<object>, path: ReadonlyArray<AnyProp>);
    watch<P extends WatchableKeys<T>>(prop: P): OPath<P extends keyof T ? T[P] : never>;
    /** @internal */
    ['_isCurrent'](): boolean;
    /** @internal */
    ['_onChange'](change: Change<T | object>): void;
    protected activate(): void;
    protected deactivate(): void;
    private _evaluatePath;
    private _observePath;
    private _observeParent;
    private _observeValue;
}
declare type NotSupported = Set<any> | Map<any, any> | Promise<any> | Date;
declare type WatchableKeys<T> = Exclude<T, NotSupported> extends Dictionary<any> ? keyof Exclude<T, NotSupported> : never;
export {};
