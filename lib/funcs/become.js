"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var symbols_1 = require("../symbols");
var Observable_1 = require("../types/Observable");
var freeze_1 = require("./freeze");
/**
 * Mark `copy` as the "next revision" of `base` (which makes `copy` observable).
 *
 * - Returns `copy` only if `base` is observable.
 * - Freeze `copy` only if `base` is frozen.
 * - Do nothing if `base` is not observable.
 * - Throws if `base` is an old revision.
 */
function become(base, copy) {
    var target = Observable_1.getObservable(base);
    if (target) {
        target._rebind(copy);
        common_1.definePrivate(copy, symbols_1.$O, target);
        return freeze_1.isFrozen(base) ? freeze_1.freeze(copy) : copy;
    }
}
exports.become = become;
