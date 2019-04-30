"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:unified-signatures */
var common_1 = require("../common");
var commit_1 = require("../funcs/commit");
var freeze_1 = require("../funcs/freeze");
var symbols_1 = require("../symbols");
var Observable_1 = require("./Observable");
var freezeState = freeze_1.freeze;
var PENDING = freezeState({ resolved: false });
var OPromise = /** @class */ (function (_super) {
    tslib_1.__extends(OPromise, _super);
    function OPromise(resolver) {
        var _this = _super.call(this, function () { return _this._state; }) || this;
        _this._state = PENDING;
        if (resolver) {
            try {
                resolver(_this.resolve.bind(_this), _this.reject.bind(_this));
            }
            catch (e) {
                _this.reject(e);
            }
        }
        return _this;
    }
    OPromise.prototype.resolve = function (result) {
        if (this._state !== PENDING)
            return;
        if (common_1.isThenable(result)) {
            // Create our own pending state to prevent other `resolve` and `reject` calls.
            this._state = freezeState({ resolved: false });
            result
                .then(this._fulfill.bind(this), this._reject.bind(this))
                .then(common_1.noop, console.error); // tslint:disable-line
        }
        else {
            this._fulfill(result);
        }
    };
    OPromise.prototype.reject = function (error) {
        if (this._state === PENDING) {
            this._reject(error);
        }
    };
    /** @internal */
    OPromise.prototype['_isCurrent'] = function (value) {
        // OPromise instances are never bound to more than one Promise.
        return value && value[symbols_1.$O] === this;
    };
    /** Create a promise and resolve it immediately */
    OPromise.resolve = function (result) {
        var p = new OPromise();
        p.resolve(result);
        return p;
    };
    OPromise.prototype._fulfill = function (result) {
        this._state = freezeState({ resolved: true, result: result, error: undefined });
        commit_1.commit(this, PENDING, this._state);
    };
    OPromise.prototype._reject = function (error) {
        this._state = freezeState({ resolved: true, result: undefined, error: error });
        commit_1.commit(this, PENDING, this._state);
    };
    return OPromise;
}(Observable_1.Observable));
exports.OPromise = OPromise;
/** @internal */
function bindPromise(promise) {
    var observable = Observable_1.getObservable(promise);
    if (!observable) {
        observable = OPromise.resolve(promise);
        common_1.definePrivate(promise, symbols_1.$O, observable);
    }
    return observable;
}
exports.bindPromise = bindPromise;
