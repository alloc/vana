"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var core_1 = require("../core");
var common_1 = require("./common");
/**
 * Similar to `useMemos` except all memoized values are cached by the identity
 * of their `input` element (determined by the given `keyof` function).
 *
 * Each cached value is reused until its associated `input` element is removed,
 * which means `compute` is only called for new `input` elements.
 */
function useKeyedMemos(input, keyof, compute) {
    var target = core_1.Observable.from(input);
    var cache = react_1.useMemo(function () { return Object.create(null); }, [target, keyof, compute]);
    var output = react_1.useMemo(function () {
        return target ? target.get().map(keyedCompute(cache, keyof, compute)) : [];
    }, [cache]);
    var forceUpdate = common_1.useForceUpdate();
    react_1.useEffect(function () {
        if (target) {
            // Bind the `compute` function to our cache.
            compute = keyedCompute(cache, keyof, compute);
            var truncated_1 = false;
            var observer_1 = target._addObserver({
                _onChange: function (change) {
                    var prop = change.prop;
                    if (prop == null) {
                        if (truncated_1) {
                            truncated_1 = false;
                            // Remove unused values from the cache.
                            var newValue = change.newValue, oldValue = change.oldValue;
                            for (var i = newValue.length; i < oldValue.length; i++) {
                                delete cache[keyof(oldValue[i])];
                            }
                            output.splice(newValue.length, Infinity);
                            forceUpdate();
                        }
                    }
                    else if (prop === 'length') {
                        if (change.newValue < change.oldValue) {
                            truncated_1 = true;
                        }
                    }
                    else if (!change.deleted) {
                        var index = Number(prop);
                        var result = compute(change.newValue, index, target.get());
                        if (result !== output[index]) {
                            output[index] = result;
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
exports.useKeyedMemos = useKeyedMemos;
function keyedCompute(cache, keyof, compute) {
    return function (value, index, array) {
        var key = keyof(value);
        var cached = cache[key];
        if (cached) {
            return cached;
        }
        var result = compute(value, index, array);
        if (result !== undefined && result !== false) {
            cache[key] = result;
        }
        return result;
    };
}
