"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var shared_1 = require("../shared");
var Observable_1 = require("./Observable");
/**
 * An observable property whose ancestors are also observed. The property value
 * is deeply observed when possible.
 */
var OPath = /** @class */ (function (_super) {
    tslib_1.__extends(OPath, _super);
    function OPath(root, path) {
        var _this = _super.call(this, function () {
            if (_this._lastParent) {
                return _this._lastParent[path[path.length - 1]];
            }
        }) || this;
        _this.root = root;
        _this.path = path;
        _this._changed = false;
        _this._lastParent = undefined;
        _this._observedValue = undefined;
        _this._observedParents = undefined;
        return _this;
    }
    OPath.prototype.watch = function (prop) {
        return new OPath(this.root, this.path.concat(prop));
    };
    /** @internal */
    OPath.prototype['_isCurrent'] = function () {
        // By the time this is called, freshness is guaranteed.
        return true;
    };
    /** @internal */
    OPath.prototype['_onChange'] = function (change) {
        var prop = change.prop;
        if (!this._changed) {
            // The target is either a parent object or the property value.
            var index = this._observedParents.indexOf(change.target);
            var changed = index >= 0
                ? prop === this.path[index]
                : prop === null && change.target === this._observedValue;
            if (changed) {
                this._changed = index < 0 || this.get() !== this._evaluatePath(index);
            }
        }
        // The path is re-observed once the root object is notified of the change.
        else if (prop === null && change.target === this.root) {
            this._changed = false;
            var oldValue = this.get();
            this._observePath();
            _super.prototype._onChange.call(this, {
                target: this,
                oldValue: oldValue,
                newValue: this.get(),
                prop: null,
                deleted: false,
                state: null,
            });
        }
    };
    OPath.prototype.activate = function () {
        this._observePath();
    };
    OPath.prototype.deactivate = function () {
        var _this = this;
        if (this._observedParents) {
            this._observedParents.forEach(function (p) { return p._removeObserver(_this); });
            this._observedParents = undefined;
        }
        if (this._observedValue) {
            this._observedValue._removeObserver(this);
            this._observedValue = undefined;
        }
    };
    OPath.prototype._evaluatePath = function (fromIndex) {
        var last = this.path.length - 1;
        var parent = this._observedParents[fromIndex].get();
        for (var i = fromIndex; i <= last; i++) {
            var value = parent[this.path[i]];
            if (i == last) {
                return value;
            }
            if (!shared_1.isPlainObject(value)) {
                return; // Evaluation failed.
            }
            parent = value;
        }
    };
    OPath.prototype._observePath = function () {
        var _this = this;
        if (!this.path.length) {
            throw Error('Observable path cannot be empty');
        }
        if (this._observedParents) {
            this._observedParents.forEach(function (p) { return p._removeObserver(_this); });
            this._observedParents.length = 0;
        }
        else {
            this._observedParents = [];
        }
        var parent = this.root.get();
        this._observeParent(parent);
        var last = this.path.length - 1;
        for (var i = 0; i < last; i++) {
            var value = parent[this.path[i]];
            if (!shared_1.isPlainObject(value)) {
                this._lastParent = undefined;
                return;
            }
            parent = value;
            this._observeParent(parent);
        }
        this._lastParent = parent;
        this._observeValue(this.get());
    };
    OPath.prototype._observeParent = function (parent) {
        var target = Observable_1.getObservable(parent);
        if (target) {
            target._addObserver(this);
            this._observedParents.push(target);
        }
        else {
            throw Error('Parent must be observable');
        }
    };
    OPath.prototype._observeValue = function (value) {
        var observed = this._observedValue;
        if (observed) {
            observed._removeObserver(this);
        }
        // Avoid throwing on stale values.
        if (Observable_1.isObservable(value)) {
            observed = Observable_1.getObservable(value);
            observed._addObserver(this);
            this._observedValue = observed;
        }
        else if (observed) {
            this._observedValue = undefined;
        }
    };
    return OPath;
}(Observable_1.Observable));
exports.OPath = OPath;
//# sourceMappingURL=OPath.js.map