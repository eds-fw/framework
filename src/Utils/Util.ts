import arr_equal from "array-equal";
import obj_equal from "fast-deep-equal";
import { setTimeout } from "timers/promises";

/**
 * Converts all time values found to milliseconds. Example: `4h7m` -> `14820000`
 */
export function parseTime(time: string): number
{
    let regExpsNotation: {[key: string]: string} = {
        'm': '([0-9])+m',
        's': '([0-9])+s',
        'h': '([0-9])+h',
        'd': '([0-9])+d',

        'м': '([0-9])+м',
        'с': '([0-9])+с',
        'ч': '([0-9])+ч',
        'д': '([0-9])+д',
    }, msInTime: {[key: string]: number} = {
        'm': 60000,
        's': 1000,
        'h': 3600000,
        'd': 86400000,

        'м': 60000,
        'с': 1000,
        'ч': 3600000,
        'д': 86400000,
    }, milli = 0;
    for (let timeNotation in regExpsNotation) {
        let timeValRegExps = new RegExp(regExpsNotation[timeNotation]);
        if (time.match(timeValRegExps)) {
            let matches = time.match(timeValRegExps);
            if (!matches) return 0;
            let timeValRaw = matches[0].replace(timeNotation, '');
            milli += parseInt(timeValRaw) * msInTime[timeNotation];
        };
    };
    return milli;
}

/**
 * Nicely divides a number into units, tens, hundreds, thousands, etc. Example: `1234567` -> `1 234 567`
 */
export const prettyNumber = (x: number) => x
    .toString()
    .split('')
    .reverse()
    .map(($, i) => (i + 1) % 3 > 0 ? $ : ' ' + $)
    .reverse()
    .join('')
    .trim();

/**
 * Prints to the console information about the memory usage of the given process.
 */
export function reportMemory(): void
{
    let prUsage = prettyNumber(process.memoryUsage().heapUsed);
    let prTotal = prettyNumber(process.memoryUsage().heapTotal);

    let kUsage = prettyNumber(~~(process.memoryUsage().heapUsed / 1024));
    let kTotal = prettyNumber(~~(process.memoryUsage().heapTotal) / 1024);

    console.log(" __________________________________________________");
    console.log(`| ${prUsage} B${" ".repeat(24 - prUsage.split('').length)}/ ${prTotal} B`);
    console.log(`| ${kUsage} KB ${" ".repeat(22 - kUsage.split('').length)}/ ${kTotal} KB`);
    console.log("|__________________________________________________");
}

/**
 * Returns random number from `min` to `max`
 */
export function random(min: number, max: number)
{
    return Math.floor(Math.random() * (max + 1)) + min;
}

/**
 * Checks for equality data of primitive and reference types
 */
export function equal(v1: any, v2: any)
{
    let result: boolean[] = [];
    Promise.all([
        v1 == v2, arr_equal(v1, v2), obj_equal(v1, v2)
    ]).then($ => result = $);
    return result.includes(true);
}

/**
 * Fluently compares texts for the presence of the same
 */
export async function quickTextCompare(v1: string, v2: string)
{
    let v1w = v1.split(' '), v1eq = 0;
    let v2w = v2.split(' '), v2eq = 0;
    let inaccuracy = ~~(v1w.length / 15) ?? 1;
    for (const word of v1w)
        if (v2w.includes(word))
            v1eq++;
    for (const word of v2w)
        if (v1w.includes(word))
            v2eq++;
    //
    if (v1eq + inaccuracy >= v2eq
        && v2eq + inaccuracy >= v1eq
        && v1eq + (inaccuracy * 1.5) >= v1w.length
        && v2eq + (inaccuracy * 1.5) >= v2w.length
    ) return true;
    else return false;
}

/**
 * Checks if an array contains all specified values
 */
export function includesAll<T extends any[]>(arr: T, values: T)
{
    for (const value of values)
    {
        if (!arr.includes(value)) return false;
    }
    return true;
}

/**
 * Stops code execution for the specified duration
 */
export async function wait(time_ms: number)
{
    await setTimeout(time_ms);
}

export function arrayFromIterator<T>(iterator: IterableIterator<T>)
{
    return new Promise<T[]>((resolve, reject) => {
        let result = [];
        for (const value of iterator)
            result.push(value);
        resolve(result);
    });
} 