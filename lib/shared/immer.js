"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = require("immer");
var _1 = require(".");
var commit_1 = require("../core/commit");
exports.immer = new immer_1.Immer({
    onAssign: function (state, prop) {
        state.assigned[prop] = true;
    },
    onDelete: function (state, prop) {
        state.assigned[prop] = false;
    },
    onCopy: function (state) {
        var base = state.base;
        var target = base && base[_1.$O];
        if (target) {
            var copy = state.copy, assigned = state.assigned;
            if (_1.isArray(base)) {
                // $O is missing, because Immer only copies the indices.
                _1.definePrivate(copy, _1.$O, target);
            }
            target._rebind(copy);
            for (var prop in assigned) {
                commit_1.commit(target, base[prop], copy[prop], prop, !assigned[prop], state);
            }
            commit_1.commit(target, base, copy, null, false, state);
        }
    },
});
// tslint:disable:no-default-export
exports.default = exports.immer.produce;
exports.produce = exports.immer.produce;
exports.setAutoFreeze = exports.immer.setAutoFreeze.bind(exports.immer);
exports.setUseProxies = exports.immer.setUseProxies.bind(exports.immer);
