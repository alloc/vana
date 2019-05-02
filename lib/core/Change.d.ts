import { ImmerState } from 'immer';
import { AnyProp } from '../shared';
/** An observed change */
export declare type Change<T = any> = IRootChange<T> | (T extends object ? keyof T extends infer P ? P extends keyof T ? IPropChange<T, P> | IPropDeletion<T, P> : never : never : never);
/** An object that receives change events */
export interface IChangeTarget<T = any> {
    ['_onChange'](change: Change<T>): void;
}
interface IChange {
    /** The event target */
    target: IChangeTarget;
    /** The property being changed. When null, this change is for the root value. */
    prop: AnyProp | null;
    /** The previous value */
    oldValue: unknown;
    /** The next value */
    newValue: unknown;
    /** Whether the property has been deleted */
    deleted: boolean;
    /** Exists only when this event was triggered by Immer */
    state: Readonly<ImmerState> | null;
}
interface IRootChange<T> extends IChange {
    prop: null;
    oldValue: T;
    newValue: T;
    deleted: false;
}
interface IPropChange<T extends object, P extends keyof T = keyof T> extends IChange {
    prop: P;
    oldValue: T[P] | undefined;
    newValue: T[P];
    deleted: false;
}
interface IPropDeletion<T extends object, P extends keyof T = keyof T> extends IChange {
    prop: P;
    oldValue: T[P];
    newValue: undefined;
    deleted: true;
}
export {};
