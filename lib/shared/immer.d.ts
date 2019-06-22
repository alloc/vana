import { Draft, Immer, IProduce } from 'immer';
/** Function that modifies a draft */
export declare type Recipe<T extends object = any, Args extends any[] = any[], Result = any> = (draft: Draft<T>, ...args: Args) => Result;
export declare const immer: Immer;
declare const _default: IProduce;
export default _default;
export declare const produce: IProduce;
export declare const setAutoFreeze: (autoFreeze: boolean) => void;
export declare const setUseProxies: (useProxies: boolean) => void;
