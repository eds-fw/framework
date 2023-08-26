import arr_equal from "array-equal";
import obj_equal from "fast-deep-equal";
import { setTimeout } from "timers/promises";

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
 * Returns pseudo-random number from `min` to `max`
 */
export function random(min: number, max: number)
{
    return Math.floor(Math.random() * (max + 1)) + min;
}

/**
 * Returns a random array element
 */
export function arrRandom<T extends any>(arr: T[]): T
{
    return arr[random(0, arr.length - 1)];
}

/**
 * Returns a random key of the specified object with a chance equal to the value of this key
 * 
 * Algorithm: https://github.com/jotson/LootTable.js
 * @param elements object as {"key": chance}
 */
export function chanceRandom(elements: Record<string, number>): string
{
    const table = Object.entries(elements);
    let i;
    let totalWeight = 0;
    
    for (i = 0; i < table.length; i++)
        totalWeight += table[i][1];

    let choice = 0;
    const randomNumber = Math.floor(Math.random() * totalWeight + 1);

    let weight = 0;
    for (i = 0; i < table.length; i++)
    {
        weight += table[i][1];
        if (randomNumber <= weight)
        {
            choice = i;
            break;
        }
    }

    return table[choice][0];
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
export function quickTextCompare(v1: string, v2: string)
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