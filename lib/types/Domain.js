"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var bind_1 = require("../funcs/bind");
var Observable_1 = require("./Observable");
/**
 * The `Domain` class ensures every object it contains is always the latest revision.
 *
 * Domains are __mutable__.
 */
var Domain = /** @class */ (function () {
    function Domain(key) {
        this.key = key;
        this.data = Object.create(null);
    }
    Domain.prototype.get = function (key) {
        return this.data[key];
    };
    Domain.prototype.add = function (value) {
        var key = value[this.key];
        if (key == null) {
            throw Error("The \"" + this.key + "\" property must exist");
        }
        if (this.data[key]) {
            return false;
        }
        var observable = Observable_1.getObservable(value) || bind_1.bind(value);
        if (!observable) {
            throw Error('This object has no observable type');
        }
        observable._addObserver(this);
        this.data[key] = value;
        return true;
    };
    Domain.prototype.delete = function (key) {
        var value = this.data[key];
        if (value) {
            delete this.data[key];
            value[Observable_1.__$observable]._removeObserver(this);
            return true;
        }
        return false;
    };
    /** Replace the existing set of objects. */
    Domain.prototype.reset = function (data) {
        var _this = this;
        this.dispose();
        this.data = Object.create(null);
        if (common_1.isArray(data)) {
            data.forEach(function (value) { return _this.add(value); });
        }
        else {
            for (var key in data)
                this.add(data[key]);
        }
    };
    /** Stop observing all objects within this domain. */
    Domain.prototype.dispose = function () {
        for (var key in this.data) {
            this.data[key][Observable_1.__$observable]._removeObserver(this);
        }
    };
    /** @internal */
    Domain.prototype['_onChange'] = function (change) {
        if (change.prop == null) {
            var key = change.newValue[this.key];
            if (key == null) {
                throw Error("The \"" + this.key + "\" property must exist");
            }
            if (key !== this.data[key][this.key]) {
                throw Error("The \"" + this.key + "\" property must be constant");
            }
            this.data[key] = change.newValue;
        }
    };
    return Domain;
}());
exports.Domain = Domain;
