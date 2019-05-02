"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var shared_1 = require("../shared");
var Observable_1 = require("./Observable");
/**
 * Observable tuples are **atomic units** and they _never_ change in length.
 * They observe every element in their source array. Non-observable elements are
 * _never_ made observable.
 */
var OTuple = /** @class */ (function (_super) {
    tslib_1.__extends(OTuple, _super);
    function OTuple(source) {
        var _this = _super.call(this, source.map(toValue)) || this;
        _this._source = source;
        return _this;
    }
    /** @internal */
    OTuple.prototype['_onChange'] = function () {
        var oldValue = this.get();
        var newValue = this._source.map(toLastValue);
        this._value = newValue;
        _super.prototype._onChange.call(this, {
            target: this,
            oldValue: oldValue,
            newValue: newValue,
            prop: null,
            deleted: false,
            state: null,
        });
    };
    OTuple.prototype.activate = function () {
        var _this = this;
        var targets = [];
        this._source.forEach(function (elem) {
            var target = getTarget(elem);
            if (target && targets.indexOf(target) < 0) {
                target['_addObserver'](_this);
                targets.push(target);
            }
        });
    };
    OTuple.prototype.deactivate = function () {
        var _this = this;
        this._source.forEach(function (elem) {
            var target = getTarget(elem);
            if (target) {
                target['_removeObserver'](_this);
            }
        });
    };
    return OTuple;
}(Observable_1.Observable));
exports.OTuple = OTuple;
function getTarget(value) {
    if (value instanceof Observable_1.Observable)
        return value;
    return (value && value[shared_1.$O]) || null;
}
function toValue(value) {
    if (value instanceof Observable_1.Observable) {
        return value.get();
    }
    var target = shared_1.isObject(value) ? Observable_1.getObservable(value) : null;
    return target ? target.get() : value;
}
// Like `toValue` but tolerant of old revisions
function toLastValue(value) {
    if (value instanceof Observable_1.Observable) {
        return value.get();
    }
    var target = value && value[shared_1.$O];
    return target ? target.get() : value;
}
