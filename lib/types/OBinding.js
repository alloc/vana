"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Observable_1 = require("./Observable");
/**
 * An observable binding to some other stream-like mechanism.
 *
 * The binding is lazy, which means no value exists until observed.
 *
 * The current value is always `undefined` when no observers exist.
 */
var OBinding = /** @class */ (function (_super) {
    tslib_1.__extends(OBinding, _super);
    function OBinding(driver) {
        var _this = _super.call(this, undefined) || this;
        _this.driver = driver;
        return _this;
    }
    OBinding.prototype.activate = function () {
        var result = this.driver(this.set.bind(this));
        if (result) {
            this._binding = typeof result == 'function' ? { dispose: result } : result;
        }
    };
    OBinding.prototype.deactivate = function () {
        this._value = undefined;
        if (this._binding) {
            this._binding.dispose();
            this._binding = undefined;
        }
    };
    return OBinding;
}(Observable_1.Observable));
exports.OBinding = OBinding;
