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
function jaccard(a, b, q) {
    if (q === void 0) { q = 2; }
    var vectors = ngram(a, b, q);
    var shared = vectors.filter(function (v) { return a.includes(v) && b.includes(v); });
    return shared.length / vectors.length;
}
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

// returns similarity 0-1
function compare(a, b) {
    if (!a.length || !b.length)
        return 0;
    var jw = function (q) { return function () { return jaroWinker(a, b, q); }; };
    // weighting for all the comparers
    // tweak this, default is every comparer is treated equally
    var weight = [0.25, 0.25, 0.25, 0.25];
    var func = [cosine, jaccard, jw(0.1), jw(0.2)];
    var res = func.map(function (fun) { return fun.apply(null, [a, b]); })
        .map(function (x, i) { return x * weight[i]; })
        .reduce(function (x, acc) { return x + acc; }, 0);
    return res;
}
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

export { compare, compareList };
