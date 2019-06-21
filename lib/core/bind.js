"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var Observable_1 = require("./Observable");
var OProps_1 = require("./OProps");
var revise_1 = require("./revise");
/**
 * Wrap an observable object or property in a getter/setter function.
 *
 * The returned function is also observable.
 *
 * For object values, the setter merges any objects passed to it, instead of
 * replacing the entire object value.
 */
function bind(state, prop) {
    var target = Observable_1.getObservable(state);
    if (!(target instanceof OProps_1.OProps)) {
        throw Error('Expected an observable object');
    }
    var lens = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var state = target.get();
        if (!args.length) {
            return prop == null ? state : state[prop];
        }
        var newValue = args[0];
        if (prop == null) {
            return revise_1.revise(state, newValue);
        }
        var oldValue = state[prop];
        if (oldValue && oldValue[shared_1.$O] && shared_1.isObject(newValue)) {
            return revise_1.revise(oldValue, newValue);
        }
        revise_1.revise(state, (_a = {}, _a[prop] = newValue, _a));
        return newValue;
    };
    shared_1.definePrivate(lens, shared_1.$O, prop == null ? target : target.watch(prop));
    shared_1.definePrivate(lens, shared_1.$ALIVE, true);
    return lens;
}
exports.bind = bind;
