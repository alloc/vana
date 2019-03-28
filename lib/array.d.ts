import { AnyArray } from './common';
export declare function append<T extends AnyArray>(base: T, first: T[number], ...rest: Array<T[number]>): T;
export declare function prepend<T extends AnyArray>(base: T, first: T[number], ...rest: Array<T[number]>): T;
export declare function insert<T extends AnyArray>(base: T, index: number, first: T[number], ...rest: Array<T[number]>): T;
export declare function concat<T extends AnyArray>(base: T, first: Exclude<T[number], AnyArray> | T, ...rest: Array<typeof first>): T;
export declare function remove<T extends AnyArray>(base: T, index: number, count?: number): T;
