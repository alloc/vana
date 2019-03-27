"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var o_1 = require("./funcs/o");
exports.o = o_1.o;
var tap_1 = require("./funcs/tap");
exports.tap = tap_1.tap;
var watch_1 = require("./funcs/watch");
exports.watch = watch_1.watch;
var revise_1 = require("./funcs/revise");
exports.revise = revise_1.revise;
var keepAlive_1 = require("./funcs/keepAlive");
exports.keepAlive = keepAlive_1.keepAlive;
var Observable_1 = require("./types/Observable");
exports.Observable = Observable_1.Observable;
exports.isObservable = Observable_1.isObservable;
exports.getObservable = Observable_1.getObservable;
// Immer exports
var immer_1 = require("immer");
exports.isDraft = immer_1.isDraft;
exports.nothing = immer_1.nothing;
exports.original = immer_1.original;
exports.immerable = immer_1.immerable;
var immer_2 = require("./immer");
exports.produce = immer_2.produce;
exports.setUseProxies = immer_2.setUseProxies;
exports.setAutoFreeze = immer_2.setAutoFreeze;
// Common exports
var freeze_1 = require("./funcs/freeze");
exports.freeze = freeze_1.freeze;
