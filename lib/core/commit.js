"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function commit(target, oldValue, newValue, prop, deleted, state) {
    if (prop === void 0) { prop = null; }
    if (deleted === void 0) { deleted = false; }
    if (state === void 0) { state = null; }
    // TODO: See if an object pool is faster or not.
    target._onChange({
        target: target,
        prop: prop,
        oldValue: oldValue,
        newValue: newValue,
        deleted: deleted,
        state: state,
    });
}
exports.commit = commit;
//# sourceMappingURL=commit.js.map