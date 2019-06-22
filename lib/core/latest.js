"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
/**
 * Get the latest revision of the given value.
 *
 * Note: Only useful for observable values, but normal values are returned as-is.
 */
function latest(value) {
    var target = value && value[shared_1.$O];
    return target ? target.get() : value;
}
exports.latest = latest;
