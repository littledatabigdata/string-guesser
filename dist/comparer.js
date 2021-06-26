"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jaroWinker = exports.jaccard = exports.cosine = exports.qgram = exports.levenshtein = exports.hammingDist = void 0;
function hammingDist(a, b) {
    var dist = 0;
    var minLen = Math.min(a.length, b.length);
    for (var i = 0; i < minLen; i++) {
        if (a[i] === b[i])
            dist++;
    }
    return dist;
}
exports.hammingDist = hammingDist;
// edit distance
function levenshtein(a, b) {
    var tmp;
    if (a.length === 0) {
        return b.length;
    }
    if (b.length === 0) {
        return a.length;
    }
    if (a.length > b.length) {
        tmp = a;
        a = b;
        b = tmp;
    }
    var i, j, dist, alen = a.length, blen = b.length, row = Array(alen);
    for (i = 0; i <= alen; i++) {
        row[i] = i;
    }
    for (i = 1; i <= blen; i++) {
        dist = i;
        for (j = 1; j <= alen; j++) {
            tmp = row[j - 1];
            row[j - 1] = dist;
            dist = b[i - 1] === a[j - 1] ? tmp : Math.min(tmp + 1, Math.min(dist + 1, row[j] + 1));
        }
    }
    return dist;
}
exports.levenshtein = levenshtein;
// n-gram vector strings between two strings
function ngram(a, b, q) {
    if (q === void 0) { q = 2; }
    var vectors = [];
    for (var i = 0; i < a.length - 1; i++) {
        vectors.push(a.slice(i, i + q));
    }
    for (var j = 0; j < b.length - 1; j++) {
        vectors.push(b.slice(j, j + q));
    }
    return Array.from(new Set(vectors));
}
// sum of absolute differences between
// contiguous N gram vectors of two strings
function qgram(a, b, q) {
    if (q === void 0) { q = 2; }
    var dist = 0;
    var vectors = ngram(a, b, q);
    vectors.forEach(function (vector) {
        if (!a.includes(vector) || !b.includes(vector)) {
            dist++;
        }
    });
    return dist;
}
exports.qgram = qgram;
// cosine similarity
function cosine(a, b, q) {
    if (q === void 0) { q = 2; }
    var vectors = ngram(a, b, q);
    var aVec = vectors.map(function (x) { return a.includes(x) ? 1 : 0; });
    var bVec = vectors.map(function (x) { return b.includes(x) ? 1 : 0; });
    // norm
    var dot = function (v1, v2) {
        return v1.map(function (x, i) { return v1[i] * v2[i]; }).reduce(function (m, n) { return m + n; });
    };
    // dot product
    var numerator = dot(aVec, bVec);
    var denom = Math.sqrt(dot(aVec, aVec)) * Math.sqrt(dot(bVec, bVec));
    return numerator / denom;
}
exports.cosine = cosine;
function jaccard(a, b, q) {
    if (q === void 0) { q = 2; }
    var vectors = ngram(a, b, q);
    var shared = vectors.filter(function (v) { return a.includes(v) && b.includes(v); });
    return shared.length / vectors.length;
}
exports.jaccard = jaccard;
function jaroWinker(a, b, p) {
    if (p === void 0) { p = 0.1; }
    var dist = function (al, bl, m, t) {
        if (m == 0)
            return 0;
        return (1 / 3) * (m / al + m / bl + (m - t) / m);
    };
    var tmp;
    if (a.length > b.length) {
        tmp = a;
        a = b;
        b = tmp;
    }
    // number of shared characters
    var m = 0;
    var chars = new Set(a.split('').concat(b.split('')));
    chars.forEach(function (c) {
        if (a.includes(c) && b.includes(c)) {
            m++;
        }
    });
    // edit distance
    var t = levenshtein(a, b);
    var l = 0;
    // number of chars before first mismatch
    for (var i = 0; i < a.length; i++) {
        if (a[i] == b[i])
            l++;
        if (l >= 4)
            break;
    }
    return dist(a.length, b.length, m, t) * (1 - l * p) + l * p;
}
exports.jaroWinker = jaroWinker;
