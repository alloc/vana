"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var core_1 = require("../core");
var common_1 = require("./common");
/**
 * Listen for changes to an observable value.
 */
function useObserver(source, onUpdate, inputs) {
    if (inputs === void 0) { inputs = common_1.emptyArray; }
    var target = core_1.Observable.from(source);
    react_1.useEffect(function () {
        if (target)
            return target.tap(onUpdate).dispose;
    }, [target, onUpdate].concat(inputs));
}
exports.useObserver = useObserver;
//# sourceMappingURL=useObserver.js.map