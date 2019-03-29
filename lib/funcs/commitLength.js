"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = require("../symbols");
var commit_1 = require("./commit");
/**
 * Emit a change for the `length` property, then emit another change for the
 * entire observable array.
 */
function commitLength(base, copy) {
    commit_1.commit(copy[symbols_1.$O], base.length, copy.length, 'length');
    commit_1.commit(copy[symbols_1.$O], base, copy);
}
exports.commitLength = commitLength;
