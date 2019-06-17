"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var core_1 = require("../core");
var common_1 = require("./common");
/**
 * Create an observable value. The latest revision is always returned, but
 * changes will *not* trigger a re-render.
 *
 * If you pass an object that's already observable, it will be copied.
 *
 * Pass a function to create an observable subscriber.
 */
function useO(source, deps) {
    if (deps === void 0) { deps = common_1.emptyArray; }
    return react_1.useMemo(function () { return core_1.Observable.from(core_1.o(source)); }, deps).get();
}
exports.useO = useO;
