"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../types/Observable");
/** Listen to an observable value for changes. */
function tap(target, onUpdate) {
    var observable = Observable_1.getObservable(target);
    if (observable) {
        return observable.tap(onUpdate);
    }
    throw Error('The given object is not yet observable');
}
exports.tap = tap;
