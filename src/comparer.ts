
export function hammingDist(a: string, b: string): number {

    let dist = 0;
    const minLen = Math.min(a.length, b.length)

    for (let i = 0; i < minLen; i++) {
        if(a[i] === b[i]) dist++
    }

    return dist;
}

// edit distance
export function levenshtein(a: string, b: string): number {
	let tmp;
    if (a.length === 0) { return b.length; }
	if (b.length === 0) { return a.length; }
	if (a.length > b.length) { tmp = a; a = b; b = tmp; }

	let i, j, dist, alen = a.length, blen = b.length, row = Array(alen);
	for (i = 0; i <= alen; i++) { row[i] = i; }

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
function ngram(a: string, b: string, q = 2): Array<string> {
    let vectors: Array<string> = [];

    for(let i = 0; i < a.length - 1; i++) {
        vectors.push(a.slice(i, i + q))
    }

    for(let j = 0; j < b.length - 1; j++) {
        vectors.push(b.slice(j, j + q))
    }

    return Array.from(new Set(vectors))
}


// sum of absolute differences between
// contiguous N gram vectors of two strings
export function qgram(a: string, b: string, q: number = 2): number {
    let dist = 0;
    let vectors = ngram(a, b, q)

    vectors.forEach(vector => {
        if(!a.includes(vector) || !b.includes(vector)) {
            dist++;
        }
    })

    return dist;
}

// cosine similarity
export function cosine(a: string, b: string, q: number = 2): number {
    let vectors = ngram(a, b, q)
    let aVec = vectors.map(x => a.includes(x) ? 1 : 0)
    let bVec = vectors.map(x => b.includes(x) ? 1 : 0)

    // norm
    const dot = (v1: Array<number>, v2: Array<number>) => {
        return v1.map((x, i) => v1[i] * v2[i]).reduce((m, n) => m + n);
    }

    // dot product
    let numerator = dot(aVec, bVec)
    let denom = Math.sqrt(dot(aVec, aVec)) * Math.sqrt(dot(bVec, bVec))

    return numerator/denom
}

export function jaccard(a: string, b: string, q: number = 2): number {
    let vectors = ngram(a, b, q)
    let shared = vectors.filter(v => a.includes(v) && b.includes(v))

    return shared.length / vectors.length
}

export function jaroWinker(a: string, b: string, p: number = 0.1): number {
    const dist = (al: number, bl: number, m: number, t: number) => {
        if(m == 0) return 0;
        return (1/3) * (m/al + m/bl + (m - t)/m)
    }

    let tmp;
	if (a.length > b.length) { tmp = a; a = b; b = tmp; }
    
    // number of shared characters
    let m = 0

    let chars = new Set(a.split('').concat(b.split('')))
    chars.forEach(c => {
        if(a.includes(c) && b.includes(c)) {
            m++
        }
    })

    // edit distance
    let t = levenshtein(a, b)

    let l = 0;
    // number of chars before first mismatch
    for(let i = 0; i < a.length; i++) {
        if(a[i] == b[i]) l++
        if(l >= 4) break;
    }

    return dist(a.length, b.length, m, t) * (1 - l * p) + l * p
}