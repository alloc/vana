"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var o_1 = require("../funcs/o");
var tap_1 = require("../funcs/tap");
function keep(initialState) {
    var state = o_1.o(initialState);
    tap_1.tap(state, function (newState) {
        state = newState;
    });
    return new Proxy(initialState, {
        get: function (_, prop) {
            return state[prop];
        },
    });
}
exports.keep = keep;
