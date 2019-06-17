"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = require("immer");
var shared_1 = require("../shared");
var shared_2 = require("../shared");
var Observable_1 = require("./Observable");
var OPromise_1 = require("./OPromise");
var OProps_1 = require("./OProps");
var OSink_1 = require("./OSink");
/** @internal */
function o(arg) {
    if (shared_1.isFunction(arg)) {
        return new OSink_1.OSink(arg);
    }
    if (shared_1.isObject(arg)) {
        if (shared_1.isThenable(arg)) {
            OPromise_1.bindPromise(arg);
            return arg;
        }
        if (arg[shared_2.$O]) {
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
    var dest = shared_1.isArray(src) ? [] : Object.create(shared_1.getProto(src));
    shared_1.each(src, function (prop) {
        if (prop !== shared_2.$O) {
            var desc = shared_1.copyProp(src, prop, dest);
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
