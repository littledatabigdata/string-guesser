import {qgram, cosine, jaccard, jaroWinker} from './comparer';


// returns similarity 0-1
export function compare(a: string, b: string) {
    if(!a.length || !b.length) return 0;
    let jw = (q: number) => () => jaroWinker(a, b, q)

    // weighting for all the comparers
    // tweak this, default is every comparer is treated equally
    let weight = [0.25, 0.25, 0.25, 0.25]
    let func = [cosine, jaccard, jw(0.1), jw(0.2)]
    let res = func.map(fun => fun.apply(null, [a, b]))
        .map((x, i) => x * weight[i])
        .reduce((x, acc) => x + acc, 0)

    return res;
}

export function compareList(a: string, b: string[], threshold: number = 0.75): [string|null, number] {
    a = a.toLocaleLowerCase()
    b = b.map(x => x.toLocaleLowerCase())

    if(typeof a != "string") throw 'arguments are not strings'
    let tuple: [string|null, number] = [null, 0]
    if(!a.length || !b.length) return tuple;

    let confidence = b.map(s => {
        return {
            name: s,
            score: compare(a, s)
        }
    })
    
    confidence = confidence.sort((a, b) => b.score - a.score)
    console.log(confidence)
    for(let i = 0; i < confidence.length; i++) {
        if(confidence[i].score >= threshold) {
            tuple = [confidence[i].name, confidence[i].score]
            break;
        }
    }

    return tuple;
}