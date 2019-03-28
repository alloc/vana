"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../types/Observable");
var tap_1 = require("./tap");
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
            return typeof value === 'function' ? value.bind(state) : value;
        },
    });
}
exports.keepAlive = keepAlive;
