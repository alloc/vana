"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var commit_1 = require("./commit");
/**
 * If `base` and `copy` have different lengths, emit a change for the "length"
 * property. Afterwards, emit a change for the entire array even if the lengths
 * were equal.
 */
function commitArray(base, copy) {
    if (base.length !== copy.length) {
        commit_1.commit(copy[shared_1.$O], base.length, copy.length, 'length');
    }
    commit_1.commit(copy[shared_1.$O], base, copy);
}
exports.commitArray = commitArray;
