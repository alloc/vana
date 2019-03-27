"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = require("../funcs/tap");
function OTap(initialState) {
    var state = o(initialState);
    tap_1.tap(state, function (newState) {
        state = newState;
    });
    return new Proxy(initialState, {
        get: function (_, prop) {
            return state[prop];
        },
    });
}
exports.OTap = OTap;
