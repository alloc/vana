"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var core_1 = require("../core");
var common_1 = require("./common");
function useObserved(source, prop) {
    var target = core_1.Observable.from(source);
    if (prop !== undefined && target instanceof core_1.OProps) {
        target = target.watch(prop);
    }
    var forceUpdate = common_1.useForceUpdate();
    react_1.useEffect(function () {
        if (target)
            return target.tap(forceUpdate).dispose;
    }, [target]);
    return target ? target.get() : source;
}
exports.useObserved = useObserved;
