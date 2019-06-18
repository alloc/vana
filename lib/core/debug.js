"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
/** Global debug mode */
var isDebug = false;
exports.getDebug = function (obj) {
    return obj && obj[shared_1.$DEBUG] !== undefined ? !!obj[shared_1.$DEBUG] : isDebug;
};
/** Enable debug mode globally or for the given observable object(s) */
function setDebug(debug) {
    var objs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objs[_i - 1] = arguments[_i];
    }
    if (objs.length) {
        for (var _a = 0, objs_1 = objs; _a < objs_1.length; _a++) {
            var obj = objs_1[_a];
            var observable = obj[shared_1.$O];
            if (observable) {
                observable[shared_1.$DEBUG] = debug;
            }
            else {
                // Useful for prototypes.
                obj[shared_1.$DEBUG] = debug;
            }
        }
    }
    else {
        isDebug = debug;
    }
}
exports.setDebug = setDebug;
/** Reset debug mode for the given observable object(s) */
function unsetDebug() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    for (var _a = 0, objs_2 = objs; _a < objs_2.length; _a++) {
        var obj = objs_2[_a];
        var observable = obj[shared_1.$O];
        if (observable) {
            delete observable[shared_1.$DEBUG];
        }
        else {
            delete obj[shared_1.$DEBUG];
        }
    }
}
exports.unsetDebug = unsetDebug;
