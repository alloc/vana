"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var latest_1 = require("./latest");
var revise_1 = require("./revise");
var watch_1 = require("./watch");
/**
 * Wrap an observable property in a getter/setter function.
 *
 * The returned function is also observable.
 */
function bind(state, prop) {
    // tslint:disable-next-line
    var binding = function (newValue) {
        var _a;
        if (!arguments.length)
            return latest_1.latest(state)[prop];
        revise_1.revise(latest_1.latest(state), (_a = {}, _a[prop] = newValue, _a));
    };
    shared_1.definePrivate(binding, shared_1.$O, watch_1.watch(state, prop));
    shared_1.definePrivate(binding, shared_1.$ALIVE, true);
    return binding;
}
exports.bind = bind;
