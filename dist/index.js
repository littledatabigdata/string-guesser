"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareList = exports.compare = void 0;
var comparer_1 = require("./comparer");
// returns similarity 0-1
function compare(a, b) {
    if (!a.length || !b.length)
        return 0;
    var jw = function (q) { return function () { return comparer_1.jaroWinker(a, b, q); }; };
    // weighting for all the comparers
    // tweak this, default is every comparer is treated equally
    var weight = [0.25, 0.25, 0.25, 0.25];
    var func = [comparer_1.cosine, comparer_1.jaccard, jw(0.1), jw(0.2)];
    var res = func.map(function (fun) { return fun.apply(null, [a, b]); })
        .map(function (x, i) { return x * weight[i]; })
        .reduce(function (x, acc) { return x + acc; }, 0);
    return res;
}
exports.compare = compare;
function compareList(a, b, threshold) {
    if (threshold === void 0) { threshold = 0.75; }
    a = a.toLocaleLowerCase();
    b = b.map(function (x) { return x.toLocaleLowerCase(); });
    if (typeof a != "string")
        throw 'arguments are not strings';
    var tuple = [null, 0];
    if (!a.length || !b.length)
        return tuple;
    var confidence = b.map(function (s) {
        return {
            name: s,
            score: compare(a, s)
        };
    });
    confidence = confidence.sort(function (a, b) { return b.score - a.score; });
    console.log(confidence);
    for (var i = 0; i < confidence.length; i++) {
        if (confidence[i].score >= threshold) {
            tuple = [confidence[i].name, confidence[i].score];
            break;
        }
    }
    return tuple;
}
exports.compareList = compareList;
