export declare const getDebug: (obj?: object | undefined) => boolean;
/** Enable debug mode globally or for the given observable object(s) */
export declare function setDebug(debug: boolean, ...objs: object[]): void;
/** Reset debug mode for the given observable object(s) */
export declare function unsetDebug(...objs: object[]): void;
