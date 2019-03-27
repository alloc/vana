import { Dictionary } from '../common';
import { Change } from '../funcs/commit';
import { IObserver } from './Observable';
/**
 * The `Domain` class ensures every object it contains is always the latest revision.
 *
 * Domains are __mutable__.
 */
export declare class Domain<T extends object = any> implements IObserver<T> {
    readonly key: string | number;
    private data;
    constructor(key: string | number);
    get(key: string | number): T | undefined;
    add(value: T): boolean;
    delete(key: any): boolean;
    /** Replace the existing set of objects. */
    reset(data: Dictionary<T> | T[]): void;
    /** Stop observing all objects within this domain. */
    dispose(): void;
    /** @internal */
    ['_onChange'](change: Change<T>): void;
}
