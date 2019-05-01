/** Frozen object type */
export declare type Frozen<T extends object> = T extends ReadonlyArray<infer U> ? ReadonlyArray<U> : Readonly<T>;
/** Same as `Object.isFrozen` */
export declare const isFrozen: (o: any) => boolean;
/** Freezes the given object if `setAutoFreeze(false)` has not been called. */
export declare function freeze<T extends object>(base: T): Frozen<T>;
