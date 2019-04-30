"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = require("../symbols");
/**
 * Get the latest revision of the given value.
 *
 * Note: Only useful for observable values, but normal values are returned as-is.
 */
function latest(value) {
    var target = value && value[symbols_1.$O];
    return target ? target.get() : value;
}
exports.latest = latest;
