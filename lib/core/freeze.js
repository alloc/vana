"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = require("../shared/immer");
/** Same as `Object.isFrozen` */
exports.isFrozen = Object.isFrozen;
/** Freezes the given object if `setAutoFreeze(false)` has not been called. */
function freeze(base) {
    if (immer_1.immer.autoFreeze)
        Object.freeze(base);
    return base;
}
exports.freeze = freeze;
