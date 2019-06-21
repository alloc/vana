export * from './symbols';
/** Give `any` its own class */
export declare abstract class Any {
    protected _: any;
}
/** Resolve object intersections */
export declare type Id<T> = {
    [P in keyof T]: T[P];
};
/** Any property name */
export declare type AnyProp = keyof any;
/** Any array type */
export declare type AnyArray = ReadonlyArray<any>;
/** Used in place of `object` when necessary */
export declare type Dictionary<T> = {
    [key: string]: T | undefined;
    [index: number]: T | undefined;
};
/** Add `dispose` method to type T */
export declare type Disposable<T extends object = any> = Id<T & IDisposable>;
/** Object with `dispose` method */
export interface IDisposable {
    dispose: () => void;
}
/** `Object#hasOwnProperty` bound to `Function#call` */
export declare const has: (obj: object, prop: string | number | symbol) => boolean;
/** Create a function that reuses a property descriptor */
export declare const createDescriptor: (desc: object) => (obj: object, prop: string | number | symbol, value: any) => object;
/** For defining a non-enumerable property */
export declare const definePrivate: (obj: object, prop: string | number | symbol, value: any) => object;
/** Function that ignores its arguments and always returns nothing */
export declare const noop: (...args: any[]) => void;
export declare const getProto: (o: any) => any;
export declare const isArray: (arg: any) => arg is any[];
export declare function isFunction(value: unknown): value is Function;
export declare function isObject(value: unknown): value is object;
export declare function isPlainObject(value: unknown): value is object;
export interface IThenable<T = any> {
    then(onFulfill: (value: T) => void, onReject?: (error: Error) => void): IThenable<T>;
}
export declare function isThenable(value: object): value is IThenable;
export declare function shallowCopy<T extends object>(obj: T): T;
export declare function copyProp(src: object, prop: AnyProp, dest: object): PropertyDescriptor;
/** Iterate over the keys of an object */
export declare function each(obj: object, iter: (prop: AnyProp) => void): void;
