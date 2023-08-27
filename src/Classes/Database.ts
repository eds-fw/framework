import { accessSync, readFileSync, writeFileSync } from "fs";
import { eds } from "..";
import { JSONSupportedDataTypes } from "../Types/JSONSupportedDataTypes";

/**
 * A simple JSON database. Built on a `Map`-object
 */
export class Database<V extends JSONSupportedDataTypes = JSONSupportedDataTypes>
{
    /**
     * Raw map-object
     */
    public Map: Map<string, Database.Value<V>>;

    public constructor(private path: string, autosave?: boolean | number)
    {
        try {
            accessSync(path);
        } catch (err) {
            console.log(`Database: Файл не найден.\n\tПуть: '${path}'`);
        }

        const entries: [string, Database.Value<V>][] = Object.entries(JSON.parse(readFileSync(path).toString() ?? "{}"));
        this.Map = new Map(entries);

        if (autosave)
        setInterval(() => this.save(), typeof autosave === "number" ? autosave : 60_000);
    }

    public save(): void
    {
        writeFileSync(this.path, this.MapJSON);
    }

    public set(key: string, value: V, tags?: Database.TagsValues, save?: boolean): void
    {
        this.Map.set(key, [value, tags]);
        if (save) this.save();
    }
    /**
     * Adds a constant value to the database **(VERY SLOW)**
     * 
     * There is a mechanism of "references to keys"
     */
    public set_const(key: string, value: V, tags?: Database.TagsValues, auto_ref: boolean = false, save?: boolean)
    {
        if (auto_ref)
        {
            if (this.hasValue(value))
            {
                let vals = this.getKey(value).filter($ => this.getFull($)?.[1]?.$const$ === true);
                if (vals.length > 0)
                    this.set(key, null as V, { $const$: true, $ref$: vals[0] });
                else
                    this.set(key, value, Object.assign(tags ?? {}, { $const$: true }));
                //
            }
            else this.set(key, value, Object.assign(tags ?? {}, { $const$: true }));
        }
        else
            this.set(key, value, Object.assign(tags ?? {}, { $const$: true }));
        //
        if (save) this.save();
    }

    public get(key: string): V | undefined
    {
        const data = this.Map.get(key);
        if (data?.[1]?.$ref$)
            return this.get(data[1].$ref$);
        else
            return data?.[0];
        //
    }
    public getFull(key: string): Database.Value<V> | undefined
    {
        const data = this.Map.get(key);
        if (data?.[1]?.$ref$)
            return this.getFull(data[1].$ref$);
        else
            return data;
        //
    }

    public has(key: string): boolean
    {
        return this.Map.has(key);
    }

    public hasValue(value: V): boolean
    {
        for (const val of this.Map.values())
        {
            if (eds.equal(value, val[0])) return true;
        }
        return false;
    }

    public getKey(value: V, single: boolean = false): string[]
    {
        let result: string[] = [];
        for (const ent of this.Map.entries())
            if (eds.equal(value, ent[1][0]))
                result.push(ent[0]);
            //
        //
        return single ? [result[0]] : result;
    }

    public del(key: string): void
    {
        this.Map.delete(key);
    }

    /**
     * Raw `Map`-object in JSON format
     */
    public get MapJSON(): string
    {
        if (this.Map.size == 0) return "{}";
        let entries = "";

        this.Map.forEach((v, k) => {
            entries += ',\n\t' + `"${k}": ${JSON.stringify(v)}`
        });

        return '{' + entries.slice(1) + '\n}';
    }

    /**
     * Deletes all elements with `$weak$` tag
     * @returns number of deleted elements
     */
    public clearWeakData()
    {
        return new Promise<number>((resolve, reject) => {
            let i = 0;
            for (const [key, value] of this.Map.entries())
            {
                if (value[1]?.$weak$)
                {
                    this.Map.delete(key);
                    i++;
                }
            }
            this.save();
            resolve(i);
        });
    }
}

namespace Database
{
    export type Tags = '$weak$' | '$const$' | '$ref$';
    export type TagsValues = {
        '$weak$'?: boolean;
        '$const$'?: boolean;
        '$ref$'?: string;
    };

    export type Value<V> = [V, TagsValues | undefined];
}

export default Database;