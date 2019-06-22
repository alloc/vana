"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
exports.emptyArray = [];
exports.useForceUpdate = function () {
    return react_1.useReducer(function () { return ({}); }, {})[1];
};
//# sourceMappingURL=common.js.map