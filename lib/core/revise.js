"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = require("immer");
var shared_1 = require("../shared");
var immer_2 = require("../shared/immer");
var commit_1 = require("./commit");
var freeze_1 = require("./freeze");
var getPropDesc = Object.getOwnPropertyDescriptor, defineProp = Object.defineProperty;
/** @internal */
function revise(base, reviser) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var observable = base[shared_1.$O];
    if (observable && !base[shared_1.$ALIVE] && !observable._isCurrent(base)) {
        throw Error('Outdated values cannot be revised');
    }
    return typeof reviser == 'object'
        ? assignToCopy(base, reviser)
        : immer_2.produce(base, args.length ? function (draft) { return reviser.apply(void 0, [draft].concat(args)); } : reviser);
}
exports.revise = revise;
/** @internal Supports observable and non-observable objects */
function assignToCopy(base, changes) {
    var copy;
    var observable = base[shared_1.$O];
    // To know if nothing changed as early as possible, apply the changes first.
    for (var prop in changes) {
        var desc = getPropDesc(base, prop);
        if (desc && shared_1.has(desc, 'get')) {
            throw Error('Cannot mutate a computed property');
        }
        var value = changes[prop];
        if (value !== base[prop]) {
            if (!copy) {
                if (immer_1.isDraftable(base)) {
                    copy = Object.create(shared_1.getProto(base));
                }
                else {
                    throw Error('Expected a plain object');
                }
            }
            if (desc) {
                desc.value = value;
                defineProp(copy, prop, desc);
            }
            else {
                copy[prop] = value;
            }
        }
    }
    if (copy) {
        // Only enumerable keys are observable.
        var changed = Object.keys(copy);
        // Copy over the unchanged properties now that we know a copy is necessary.
        shared_1.each(base, function (prop) {
            if (shared_1.has(copy, prop))
                return;
            defineProp(copy, prop, getPropDesc(base, prop));
        });
        if (observable && !immer_1.isDraft(base)) {
            observable._rebind(copy);
            for (var _i = 0, changed_1 = changed; _i < changed_1.length; _i++) {
                var prop = changed_1[_i];
                commit_1.commit(observable, base[prop], copy[prop], prop);
            }
            commit_1.commit(observable, base, copy);
        }
        // Freeze the copy only if the base is frozen.
        return freeze_1.isFrozen(base) ? freeze_1.freeze(copy) : copy;
    }
    return base;
}
