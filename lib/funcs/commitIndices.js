"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = require("../symbols");
var commit_1 = require("./commit");
/**
 * Emit a change for each index in the given range.
 */
function commitIndices(base, copy, index, count) {
    var target = copy[symbols_1.$O];
    for (var i = index; i < index + count; i++) {
        // Coerce indices to strings, because Immer does the same.
        commit_1.commit(target, base[i], copy[i], String(i), i >= copy.length);
    }
}
exports.commitIndices = commitIndices;
