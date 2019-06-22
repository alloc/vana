"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var use_memo_one_1 = require("use-memo-one");
var core_1 = require("../core");
var common_1 = require("./common");
/**
 * Map the given array, memoizing each mapped element.
 *
 * This provides an efficient update mechanism for observable arrays.
 */
function useMemos(input, compute) {
    var target = core_1.Observable.from(input);
    var output = use_memo_one_1.useMemoOne(function () {
        return target ? target.get().map(compute) : [];
    }, [target, compute]);
    var forceUpdate = common_1.useForceUpdate();
    react_1.useEffect(function () {
        if (target) {
            var observer_1 = target._addObserver({
                _onChange: function (change) {
                    var prop = change.prop;
                    if (prop == null)
                        return;
                    if (prop === 'length') {
                        if (change.newValue < change.oldValue) {
                            output.splice(change.newValue, Infinity);
                            forceUpdate();
                        }
                    }
                    else if (!change.deleted) {
                        var index = Number(prop);
                        var newValue = compute(change.newValue, index, target.get());
                        if (newValue !== output[index]) {
                            output[index] = newValue;
                            forceUpdate();
                        }
                    }
                },
            });
            return function () {
                target._removeObserver(observer_1);
            };
        }
    }, [output]);
    return output;
}
exports.useMemos = useMemos;
//# sourceMappingURL=useMemos.js.map