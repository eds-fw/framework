import { accessSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { type eds, runtimeStorage, equal } from "..";
import { eds_errors } from "../errors";

const DEFAULT_AUTOSAVE_INTERVAL = 60_000; //1 minute

export class Storage<V extends eds.JSONSupportedValueTypes = eds.JSONSupportedValueTypes> extends Map<string, V>
{
    #saving = false;
    public path!: string;

    public constructor(path: string, autosave?: boolean | number)
    {
        try {
            accessSync(path);
        } catch (err)
        {
            throw new Error(eds_errors.Database.invalidPath(path, err));
        }

        if (path in runtimeStorage.__loadedStorages)
            return runtimeStorage.__loadedStorages[path] as Storage<V>;
        else {
            const entries: [string, V][] = Object.entries(JSON.parse(readFileSync(path).toString() || "{}"));
            super(entries);
        }

        this.path = path;

        if (autosave)
        setInterval(() => this.save(), typeof autosave === "number" ? autosave : DEFAULT_AUTOSAVE_INTERVAL);
    }

    public async save(): Promise<void>
    {
        if (this.#saving) return;
        this.#saving = true;
        await writeFile(this.path, this.MapJSON);
        this.#saving = false;
    }

    public hasValue(value: V): boolean
    {
        for (const val of this.values())
            if (equal(value, val))
            return true;
        return false;
    }
    public getKey(value: V, single: boolean = false): string[]
    {
        const result: string[] = [];
        for (const ent of this.entries())
            if (equal(value, ent[0][1]))
            {
                result.push(ent[0]);
                if (single) break;
            }
        return result;
    }

    /**
     * Raw map-object in JSON format
     */
    public get MapJSON(): string
    {
        return Storage.asJSON(this);
    }

    public static asJSON(map: Map<string, eds.JSONSupportedValueTypes>): string
    {
        if (map.size == 0) return "{}";
        let entries = "";

        map.forEach((v, k) => {
            entries += ',\n\t' + `"${k}": ${JSON.stringify(v)}`
        });

        return '{' + entries.slice(1) + '\n}';
    }
}
