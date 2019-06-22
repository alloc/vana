"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var shared_1 = require("../shared");
var Observable_1 = require("./Observable");
/**
 * An observable sink that binds to an event stream.
 *
 * The binding is lazy, which means no value exists until observed.
 *
 * The current value is always `undefined` when no observers exist.
 */
var OSink = /** @class */ (function (_super) {
    tslib_1.__extends(OSink, _super);
    function OSink(driver) {
        var _this = _super.call(this, undefined) || this;
        _this.driver = driver;
        return _this;
    }
    OSink.prototype.activate = function () {
        var _this = this;
        var result = this.driver(function (newValue) { return _this.set(newValue, true); });
        if (result) {
            this._binding = shared_1.isFunction(result) ? { dispose: result } : result;
        }
    };
    OSink.prototype.deactivate = function () {
        this._value = undefined;
        if (this._binding) {
            this._binding.dispose();
            this._binding = undefined;
        }
    };
    return OSink;
}(Observable_1.Observable));
exports.OSink = OSink;
