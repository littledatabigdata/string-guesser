import {qgram, cosine, jaccard, jaroWinker} from './comparer';


export function compare(a: string, b: string) {
    let jw = (q: number) => () => jaroWinker(a, b, q)

    let func = [cosine, jaccard, jw(0.1), jw(0.2)]
    let res = func.map(fun => fun.apply(null, [a, b]))
    console.log(func.map(x => x.name))
    console.log(res)

    return res;
}

export function compareList(a: string, b: string[]): string {
    

    return a;
}