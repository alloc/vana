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
    var state = initialState;
    tap_1.tap(state, function (newState) {
        state = newState;
    });
    return new Proxy({}, {
        get: function (_, prop) {
            var value = state[prop];
            if (prop == symbols_1.$O) {
                return new Proxy(value, observableProxy);
            }
            // Auto-bind methods from the prototype.
            if (!common_1.has(state, prop) && typeof value == 'function') {
                return value.bind(state);
            }
            return value;
        },
    });
}
exports.keepAlive = keepAlive;
