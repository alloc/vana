"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var freeze_1 = require("./freeze");
var Observable_1 = require("./Observable");
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
        shared_1.definePrivate(copy, shared_1.$O, target);
        return freeze_1.isFrozen(base) ? freeze_1.freeze(copy) : copy;
    }
}
exports.become = become;
