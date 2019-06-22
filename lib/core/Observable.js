"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
var commit_1 = require("./commit");
var debug_1 = require("./debug");
var nextId = 1;
/** An observable value */
var Observable = /** @class */ (function () {
    function Observable(source) {
        this['_observers'] = undefined;
        this.id = nextId++;
        this._rebind(source);
    }
    /** Try coercing the given value into an Observable instance. */
    Observable.from = function (value) {
        return value instanceof Observable ? value : value ? value[shared_1.$O] : undefined;
    };
    /** The current value. */
    Observable.prototype.get = function () {
        return this._get ? this._get() : this._value;
    };
    /**
     * When the source of truth is a getter, this method only notifies observers.
     * Otherwise, this method also updates the current value.
     */
    Observable.prototype.set = function (newValue, force) {
        var oldValue = this.get();
        if (force || newValue !== oldValue) {
            if (!this._get) {
                this._value = newValue;
            }
            commit_1.commit(this, oldValue, newValue);
        }
    };
    /** Listen for changes. */
    Observable.prototype.tap = function (onUpdate) {
        var _this = this;
        var observer = {
            onUpdate: onUpdate,
            dispose: function () { return _this._removeObserver(observer); },
            _onChange: function (change) {
                return change.prop === null && onUpdate(change.newValue);
            },
        };
        this._addObserver(observer);
        return observer;
    };
    /** Remove all observers and perform subclass cleanup (if necessary) */
    Observable.prototype.dispose = function () {
        if (this._observers) {
            this._observers = undefined;
            this.deactivate();
        }
    };
    /** @internal Notify observers of a change */
    Observable.prototype['_onChange'] = function (change) {
        var observers = this._observers;
        if (debug_1.getDebug(this)) {
            // tslint:disable-next-line
            console.debug('%s(%s) changed: (observers: %O, change: %O)', this.constructor.name, this.id, observers ? observers.length : 0, shared_1.shallowCopy(change) // TODO: Deep copy instead
            );
        }
        if (observers) {
            for (var _i = 0, _a = observers.slice(0); _i < _a.length; _i++) {
                var observer = _a[_i];
                observer._onChange(change);
            }
        }
    };
    /** @internal Returns false when the given value is outdated */
    Observable.prototype['_isCurrent'] = function (value) {
        return value === this.get();
    };
    /** @internal Swap out the source of truth for this observable. */
    Observable.prototype['_rebind'] = function (source) {
        this._get = shared_1.isFunction(source) ? source : undefined;
        this._value = this._get ? undefined : source;
    };
    /** @internal */
    Observable.prototype['_addObserver'] = function (observer, prepend) {
        if (this._observers) {
            this._observers[prepend ? 'unshift' : 'push'](observer);
        }
        else {
            this.activate();
            this._observers = [observer];
        }
        return observer;
    };
    /** @internal */
    Observable.prototype['_removeObserver'] = function (observer) {
        var observers = this._observers;
        if (observers) {
            var index = observers.indexOf(observer);
            if (index < 0)
                return;
            if (observers.length > 1) {
                observers.splice(index, 1);
            }
            else {
                this._observers = undefined;
                this.deactivate();
            }
        }
    };
    /** Called when an Observable goes from 0 observers to 1+ */
    Observable.prototype.activate = function () { };
    /** Called when an Observable goes from 1+ observers to 0 */
    Observable.prototype.deactivate = function () { };
    return Observable;
}());
exports.Observable = Observable;
/** Returns true if the given value has been passed to `o()` and is not stale. */
function isObservable(value) {
    if (value) {
        var observable = value[shared_1.$O];
        if (observable) {
            return observable._isCurrent(value);
        }
    }
    return false;
}
exports.isObservable = isObservable;
/** Throws an error when the given object is an old revision */
function getObservable(value) {
    var observable = value[shared_1.$O];
    if (observable) {
        if (!value[shared_1.$ALIVE] && !observable._isCurrent(value)) {
            throw Error('Outdated values cannot be observed');
        }
        return observable;
    }
}
exports.getObservable = getObservable;
/** @internal */
function getObservers(value) {
    var observable = Observable.from(value);
    if (observable) {
        return observable._observers;
    }
    throw Error('Not observable');
}
exports.getObservers = getObservers;
//# sourceMappingURL=Observable.js.map