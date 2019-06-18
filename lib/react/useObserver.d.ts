import { Observed } from '../core';
/**
 * Listen for changes to an observable value.
 */
export declare function useObserver<T>(source: T, onUpdate: (value: Observed<T>) => void, inputs?: any[]): void;
