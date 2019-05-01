"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var symbols_1 = require("../symbols");
var Observable_1 = require("../types/Observable");
var tap_1 = require("./tap");
var returnTrue = function () { return true; };
var observableProxy = {
    get: function (target, prop) {
        // Let `revise` be passed a `keepAlive` object.
        return prop == '_isCurrent' ? returnTrue : target[prop];
    },
};
/**
 * Tap the given object, and return an object whose values reflect any changes
 * to the given object and its descendants.
 */
function keepAlive(initialState) {
    if (!Observable_1.isObservable(initialState)) {
        throw Error('Expected an observable object');
    }
    var target = { state: initialState };
    var observer = tap_1.tap(initialState, function (nextState) {
        target.state = nextState;
    });
    return new Proxy(target, {
        get: function (_, prop) {
            var value = target.state[prop];
            if (prop == symbols_1.$O) {
                return new Proxy(value, observableProxy);
            }
            if (prop == 'dispose') {
                return function () {
                    observer.dispose();
                    if (typeof value == 'function') {
                        value.call(target.state);
                    }
                };
            }
            // Auto-bind methods from the prototype.
            if (!common_1.has(target.state, prop) && typeof value == 'function') {
                return value.bind(target.state);
            }
            return value;
        },
        ownKeys: function () {
            return Reflect.ownKeys(target.state);
        },
        getOwnPropertyDescriptor: function (_, prop) {
            var desc = Object.getOwnPropertyDescriptor(target.state, prop);
            if (desc) {
                desc.writable = true;
                desc.configurable = true;
            }
            return desc;
        },
    });
}
exports.keepAlive = keepAlive;
