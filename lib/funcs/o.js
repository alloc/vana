"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = require("immer");
var common_1 = require("../common");
var symbols_1 = require("../symbols");
var OBinding_1 = require("../types/OBinding");
var Observable_1 = require("../types/Observable");
var OPromise_1 = require("../types/OPromise");
var OProps_1 = require("../types/OProps");
/** @internal */
function o(arg) {
    if (typeof arg === 'function') {
        return new OBinding_1.OBinding(arg);
    }
    if (common_1.isObject(arg)) {
        if (common_1.isThenable(arg)) {
            OPromise_1.bindPromise(arg);
            return arg;
        }
        if (arg[symbols_1.$O]) {
            return clone(arg);
        }
        OProps_1.bindProps(arg);
        return arg;
    }
    return new Observable_1.Observable(arg);
}
exports.o = o;
/** Clone an observable object. Nested revisions are checked for staleness */
function clone(src) {
    var dest = common_1.isArray(src) ? [] : Object.create(common_1.getProto(src));
    common_1.each(src, function (prop) {
        if (prop !== symbols_1.$O) {
            var desc = common_1.copyProp(src, prop, dest);
            // Only enumerable keys are made observable.
            if (desc.enumerable && immer_1.isDraftable(desc.value)) {
                if (Observable_1.isObservable(desc.value))
                    return;
                dest[prop] = clone(desc.value);
            }
        }
    });
    OProps_1.bindProps(dest);
    return dest;
}
