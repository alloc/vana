"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var flip = function (v) { return !v; };
exports.emptyArray = [];
function useForceUpdate() {
    var _a = react_1.useState(false), u = _a[1];
    return react_1.useCallback(function () { return u(flip); }, exports.emptyArray);
}
exports.useForceUpdate = useForceUpdate;
