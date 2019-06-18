import { Driver } from '../core';
/**
 * Create an observable value. The latest revision is always returned, but
 * changes will *not* trigger a re-render.
 *
 * If you pass an object that's already observable, it will be copied.
 *
 * Pass a function to create an observable subscriber.
 */
export declare function useO<T>(source: T | Driver<T>, deps?: any[]): T;
