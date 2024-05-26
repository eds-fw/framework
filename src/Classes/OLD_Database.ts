import { accessSync, constants, mkdirSync, readFileSync, writeFileSync } from "fs";
import { eds } from "..";
import { eds_errors } from "../errors";
import { writeFile } from "fs/promises";
import { deprecatedWarning } from "../Utils/DeprecatedWarning";

/**
 * A simple JSON database. Built on a `Map`-object
 * @deprecated
 */
export class Database<V extends eds.JSONSupportedValueTypes = eds.JSONSupportedValueTypes>
{
    /**
     * Raw map-object
     */
    public Map: Map<string, Database.Value<V>>;

    public constructor(private path: string, autosave?: boolean | number, private dump_path?: string)
    {
deprecatedWarning("Datebase", "Class");
        try {
            accessSync(path);
        } catch (err) {
            throw new Error(eds_errors.Database.invalidPath(path, err));
        }

        const entries: [string, Database.Value<V>][] = Object.entries(JSON.parse(readFileSync(path).toString() || "{}"));
        this.Map = new Map(entries);

        if (autosave)
        setInterval(() => this.save(), typeof autosave === "number" ? autosave : 60_000);

        if (dump_path)
        try {
            accessSync(dump_path, constants.R_OK | constants.W_OK);
        } catch (err)
        {
            const splitted = dump_path.replaceAll('\\', '/').split('/');
            mkdirSync(splitted.slice(0, -1).join('/'), { recursive: true });
            writeFileSync(splitted.join('/'), '{}');
        }
    }

    public async save(): Promise<void>
    {
        
        await writeFile(this.path, this.MapJSON);
        if (this.dump_path)
        writeFile(this.dump_path, this.MapJSON);
    }

    public set(key: string, value: V, tags?: never, save?: boolean): void
    {
        this.Map.set(key, [value, null]);
        if (save) this.save();
    }

    public get(key: string): V | undefined
    {
        const data = this.Map.get(key);
        return data?.[0];
    }
    public getKey(value: V, single: boolean = false): string[]
    {
        const result: string[] = [];
        for (const ent of this.Map.entries())
            if (eds.equal(value, ent[0][1]))
            {
                result.push(ent[0]);
                if (single) break;
            }
        return result;
    }
    public getFull(key: string): Database.Value<V> | undefined
    {
        const data = this.Map.get(key);
        return data;
    }
    public has(key: string): boolean
    {
        return this.Map.has(key);
    }

    public hasValue(value: V): boolean
    {
        for (const val of this.Map.values())
            if (eds.equal(value, val[0]))
            return true;
        return false;
    }

    public del(key: string): void
    {
        this.Map.delete(key);
    }

    /**
     * Raw map-object in JSON format
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
}

/** @deprecated */
namespace Database
{
    /** @deprecated */
    export type Value<V> = [V, null];
}

export default Database;