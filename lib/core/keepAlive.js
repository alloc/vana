"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var Observable_1 = require("./Observable");
var tap_1 = require("./tap");
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
            if (prop === shared_1.$ALIVE) {
                return true;
            }
            var value = target.state[prop];
            if (prop === 'dispose') {
                return function () {
                    observer.dispose();
                    if (shared_1.isFunction(value)) {
                        value.call(target.state);
                    }
                };
            }
            // Auto-bind methods from the prototype.
            if (!shared_1.has(target.state, prop) && shared_1.isFunction(value)) {
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
