import { ImmerState } from 'immer';
import { AnyProp } from '../common';
/** An observed change */
export declare type Change<T = any> = RootChange<T> | (T extends object ? keyof T extends infer P ? P extends any ? NestedChange<T, P> : never : never : never);
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
declare type RootChange<T> = IChange & {
    prop: null;
    oldValue: T;
    newValue: T;
    deleted: false;
};
declare type NestedChange<T extends object, P extends keyof T = keyof T> = (IChange & {
    prop: P;
    oldValue: T[P] | undefined;
    newValue: T[P];
    deleted: false;
}) | (IChange & {
    prop: P;
    oldValue: T[P];
    newValue: undefined;
    deleted: true;
});
export {};
