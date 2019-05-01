"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var become_1 = require("./funcs/become");
var commitArray_1 = require("./funcs/commitArray");
var commitIndices_1 = require("./funcs/commitIndices");
function append(base) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var copy = base.slice();
    copy.push.apply(copy, values);
    if (become_1.become(base, copy)) {
        commitIndices_1.commitIndices(base, copy, base.length, values.length);
        commitArray_1.commitArray(base, copy);
    }
    return copy;
}
exports.append = append;
function prepend(base) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var copy = values.concat(base);
    if (become_1.become(base, copy)) {
        commitIndices_1.commitIndices(base, copy, 0, copy.length);
        commitArray_1.commitArray(base, copy);
    }
    return copy;
}
exports.prepend = prepend;
function insert(base, index) {
    var values = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        values[_i - 2] = arguments[_i];
    }
    while (index < 0)
        index += base.length;
    var copy = base.slice(0, index).concat(values, base.slice(index));
    if (become_1.become(base, copy)) {
        commitIndices_1.commitIndices(base, copy, index, copy.length - index);
        commitArray_1.commitArray(base, copy);
    }
    return copy;
}
exports.insert = insert;
function concat(base) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var copy = base.concat.apply(base, values);
    var delta = copy.length - base.length;
    if (delta == 0) {
        return base;
    }
    if (become_1.become(base, copy)) {
        commitIndices_1.commitIndices(base, copy, base.length, delta);
        commitArray_1.commitArray(base, copy);
    }
    return copy;
}
exports.concat = concat;
function remove(base, index, count) {
    if (count === void 0) { count = 1; }
    while (index < 0)
        index += base.length;
    if (count <= 0 || index >= base.length || index + count <= 0) {
        return base;
    }
    var copy = index <= 0
        ? base.slice(index + count)
        : index + count >= base.length
            ? base.slice(0, index)
            : base.slice(0, index).concat(base.slice(index + count));
    if (become_1.become(base, copy)) {
        commitIndices_1.commitIndices(base, copy, index, base.length - index);
        commitArray_1.commitArray(base, copy);
    }
    return copy;
}
exports.remove = remove;
