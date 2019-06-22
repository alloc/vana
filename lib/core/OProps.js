"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// tslint:disable:variable-name
var immer_1 = require("immer");
var shared_1 = require("../shared");
var commit_1 = require("./commit");
var freeze_1 = require("./freeze");
var Observable_1 = require("./Observable");
/** An observable object with observable properties */
var OProps = /** @class */ (function (_super) {
    tslib_1.__extends(OProps, _super);
    function OProps(source) {
        return _super.call(this, source) || this;
    }
    OProps.prototype.watch = function (prop) {
        var watched = this.watched || (this.watched = Object.create(null));
        return watched[prop] || (watched[prop] = new OProp(this, prop));
    };
    /** @internal */
    OProps.prototype['_onChange'] = function (change) {
        // When a property has an observable value, it notifies us of changes using
        // itself as the target.
        if (change.target !== this) {
            var currProps = this.get();
            // When a change is from Immer, we must check if its state (or its parent state)
            // is related to us. If so, Immer will update our underlying value for us.
            if (change.state) {
                var _a = change.state, copy = _a.copy, parent = _a.parent;
                if (copy == currProps)
                    return;
                // Check against `parent.base` instead of `parent.copy` because changes
                // are processed from bottom-to-top, which means our underlying value
                // has not been updated yet when we are the parent of this change.
                if (parent && parent.base == currProps)
                    return;
            }
            var target = change.target;
            var nextProps = shared_1.shallowCopy(currProps);
            nextProps[target.prop] = change.newValue;
            // Bind `this` to its next value.
            shared_1.definePrivate(nextProps, shared_1.$O, this);
            this._rebind(nextProps);
            freeze_1.freeze(nextProps);
            // Reuse the change object, since only we receive it.
            change.target = this;
            change.prop = target.prop;
            this._onChange(change);
            // Reuse it again for the root change.
            change.prop = null;
            change.oldValue = currProps;
            change.newValue = nextProps;
        }
        // Notify property observers first.
        else if (change.prop !== null) {
            var prop = change.prop, oldValue = change.oldValue, newValue = change.newValue;
            var oldObservable = oldValue && oldValue[shared_1.$O];
            if (newValue) {
                var observable = Observable_1.getObservable(newValue);
                // Plain objects/arrays are made observable automatically.
                if (!observable && !freeze_1.isFrozen(newValue) && immer_1.isDraftable(newValue)) {
                    observable = bindProps(newValue);
                }
                // Always watch any property that has an observable value.
                if (observable && !oldObservable) {
                    this.watch(prop);
                }
            }
            if (this.watched) {
                var target = this.watched[prop];
                if (target) {
                    commit_1.commit(target, oldValue, newValue, null, false, change.state);
                }
            }
        }
        // Notify root observers.
        _super.prototype._onChange.call(this, change);
    };
    return OProps;
}(Observable_1.Observable));
exports.OProps = OProps;
var OProp = /** @class */ (function (_super) {
    tslib_1.__extends(OProp, _super);
    function OProp(parent, prop) {
        var _this = _super.call(this, function () { return parent.get()[prop]; }) || this;
        _this.parent = parent;
        _this.prop = prop;
        /** Exists when the observed property name has an observable value */
        _this._observedValue = undefined;
        _this._observeValue(_this.get());
        return _this;
    }
    /** @internal */
    OProp.prototype['_onChange'] = function (change) {
        if (change.target === this) {
            this._observeValue(change.newValue);
            _super.prototype._onChange.call(this, change);
        }
        // Changes to `_observedValue` are first handled by our parent.
        else if (change.prop === null) {
            this.parent._onChange(tslib_1.__assign({}, change, { target: this }));
        }
    };
    OProp.prototype.activate = function () {
        // Already active if the value is observable.
        if (!this._observedValue) {
            var watched = this.parent.watched;
            var target = watched[this.prop];
            if (!target) {
                watched[this.prop] = this;
            }
            else if (target !== this) {
                // Never store an OProp longer than you need to.
                throw Error('Cannot observe an old observable');
            }
        }
    };
    OProp.prototype.deactivate = function () {
        // Skip deactivation unless the value is *not* observable.
        // Otherwise, deep observability is prevented.
        if (!this._observedValue) {
            delete this.parent.watched[this.prop];
        }
    };
    OProp.prototype._observeValue = function (value) {
        // Avoid throwing on stale values.
        var observed = value && value[shared_1.$O];
        if (observed) {
            if (observed !== this._observedValue) {
                if (this._observedValue) {
                    this._observedValue._removeObserver(this);
                }
                if (!this._observers) {
                    this.activate();
                }
                observed._addObserver(this, true);
                this._observedValue = observed;
            }
        }
        else if (this._observedValue) {
            this._observedValue._removeObserver(this);
            this._observedValue = undefined;
            if (!this._observers) {
                this.deactivate();
            }
        }
    };
    return OProp;
}(Observable_1.Observable));
exports.OProp = OProp;
function bindProps(root) {
    if (freeze_1.isFrozen(root)) {
        throw Error('Frozen objects cannot become observable');
    }
    if (immer_1.isDraft(root)) {
        throw Error('Immer drafts cannot become observable');
    }
    if (!immer_1.isDraftable(root)) {
        throw Error('This object has no observable type');
    }
    var rootObservable = new OProps(root);
    shared_1.definePrivate(root, shared_1.$O, rootObservable);
    var observeTree = function (parent, observer) {
        // Only enumerable keys are made observable.
        Object.keys(parent).forEach(function (prop) {
            var value = parent[prop];
            if (shared_1.isObject(value)) {
                var observable = Observable_1.getObservable(value);
                if (!observable) {
                    if (freeze_1.isFrozen(value) || !immer_1.isDraftable(value))
                        return;
                    observable = new OProps(value);
                    shared_1.definePrivate(value, shared_1.$O, observable);
                    observeTree(value, observable);
                }
                // To support deep observation, any property with an
                // observable value must be watched.
                observer.watch(prop);
            }
        });
        freeze_1.freeze(parent);
    };
    // The entire state tree is made observable (when possible).
    observeTree(root, rootObservable);
    return rootObservable;
}
exports.bindProps = bindProps;
//# sourceMappingURL=OProps.js.map