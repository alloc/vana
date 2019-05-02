import { Dictionary } from '../shared';
import { Change } from './Change';
import { Observable } from './Observable';
/** An observable object with observable properties */
export declare class OProps<T extends Dictionary<any> = any> extends Observable<T> {
    watched?: Dictionary<OProp<T>>;
    constructor(source: Exclude<T, Function>);
    watch<P extends string | number>(prop: P): OProp<T, P>;
    /** @internal */
    ['_onChange'](change: Change<T>): void;
}
export declare class OProp<T extends Dictionary<any> = any, P extends string | number = any> extends Observable<T[P]> {
    readonly parent: OProps<T>;
    readonly prop: P;
    /** Exists when the observed property name has an observable value */
    private _observedValue?;
    constructor(parent: OProps<T>, prop: P);
    /** @internal */
    ['_onChange'](change: Change<T[P]>): void;
    protected activate(): void;
    protected deactivate(): void;
    private _observeValue;
}
export declare function bindProps<T extends object>(root: Exclude<T, Function>): OProps<T>;
