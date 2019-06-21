"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./symbols"), exports);
/** Give `any` its own class */
var Any = /** @class */ (function () {
    function Any() {
    }
    return Any;
}());
exports.Any = Any;
/** `Object#hasOwnProperty` bound to `Function#call` */
exports.has = Function.call.bind(Object.hasOwnProperty);
/** Create a function that reuses a property descriptor */
exports.createDescriptor = function (desc) {
    var attr = exports.has(desc, 'get') ? 'get' : 'value';
    return function (obj, prop, value) {
        desc[attr] = value;
        Object.defineProperty(obj, prop, desc);
        desc[attr] = undefined;
        return obj;
    };
};
/** For defining a non-enumerable property */
exports.definePrivate = exports.createDescriptor({ value: undefined });
/** Function that ignores its arguments and always returns nothing */
exports.noop = Function.prototype;
exports.getProto = Object.getPrototypeOf;
exports.isArray = Array.isArray;
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
function isObject(value) {
    return value && typeof value === 'object';
}
exports.isObject = isObject;
function isPlainObject(value) {
    if (value) {
        var proto = exports.getProto(value);
        return proto === null || proto === Object.prototype;
    }
    return false;
}
exports.isPlainObject = isPlainObject;
function isThenable(value) {
    return typeof value['then'] == 'function';
}
exports.isThenable = isThenable;
function shallowCopy(obj) {
    if (exports.isArray(obj)) {
        return obj.slice();
    }
    else {
        var copy_1 = Object.create(exports.getProto(obj));
        each(obj, function (prop) { return copyProp(obj, prop, copy_1); });
        return copy_1;
    }
}
exports.shallowCopy = shallowCopy;
function copyProp(src, prop, dest) {
    var desc = Object.getOwnPropertyDescriptor(src, prop);
    if (desc.get) {
        throw Error('Getters are only allowed on prototypes');
    }
    if (desc.enumerable) {
        dest[prop] = desc.value;
    }
    else {
        Object.defineProperty(dest, prop, {
            value: desc.value,
            writable: true,
            configurable: true,
        });
    }
    return desc;
}
exports.copyProp = copyProp;
/** Iterate over the keys of an object */
function each(obj, iter) {
    if (exports.isArray(obj)) {
        for (var i = 0; i < obj.length; i++)
            iter(i);
    }
    else if (typeof Reflect !== 'undefined') {
        Reflect.ownKeys(obj).forEach(iter);
    }
    else {
        Object.getOwnPropertyNames(obj).forEach(iter);
        Object.getOwnPropertySymbols(obj).forEach(iter);
    }
}
exports.each = each;
