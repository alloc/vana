"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = require("immer");
var common_1 = require("../common");
var symbols_1 = require("../symbols");
var OProps_1 = require("../types/OProps");
var freeze_1 = require("./freeze");
/** @internal */
function bind(source, observable) {
    if (source[symbols_1.$O]) {
        throw Error('Already observable');
    }
    if (freeze_1.isFrozen(source)) {
        throw Error('Frozen objects cannot become observable');
    }
    if (observable) {
        observable._rebind(source);
    }
    else if (immer_1.isDraftable(source)) {
        observable = new OProps_1.OProps(source);
    }
    else
        return;
    common_1.definePrivate(source, symbols_1.$O, observable);
    return observable;
}
exports.bind = bind;
