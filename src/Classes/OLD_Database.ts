import { accessSync, readFileSync, writeFileSync } from "fs";
import { type eds, Storage } from "..";
import { deprecatedWarning } from "../Utils/DeprecatedWarning";
import { eds_errors } from "../errors";

/**
 * A simple JSON database. Built on a `Map`-object
 * @deprecated use `Storage`
 */
export class Database<V extends eds.JSONSupportedValueTypes = eds.JSONSupportedValueTypes> extends Storage<V>
{
    /**
     * Raw map-object
     */
    public readonly Map: Map<string, V>;

    public constructor(path: string, autosave?: boolean | number)
    {
deprecatedWarning("Datebase", "Class");
        try {
            accessSync(path);
        } catch (err) {
            throw new Error(eds_errors.Database.invalidPath(path, err));
        }

        const entries: [string, V][] = Object.entries(JSON.parse(readFileSync(path).toString() || "{}"));
        let map = new Map(entries);

        if (!_isMigrated(map))
            map = _migrate<V>(map as Map<string, [V, LegacyDBTag]>);

        writeFileSync(path, Storage.asJSON(map));
        super(path, autosave);
        this.Map = this;
    }

    public del(key: string): void
    {
deprecatedWarning("Datebase#del", "Method");
        this.Map.delete(key);
    }
}

type LegacyDBTag = null | undefined | { $ref$?: string; $weak$?: boolean; $const$?: boolean; };
const _allowedDBTagObjKeys = ["$ref$", "$weak$", "$const$"];
const _isDBTag = (maybe_tag: LegacyDBTag) =>
    maybe_tag === null
    || maybe_tag === undefined
    || (typeof maybe_tag == "object" && (
        Object.getOwnPropertyNames(maybe_tag).length == 0
        || Object.getOwnPropertyNames(maybe_tag).every(key => _allowedDBTagObjKeys.includes(key))
    ));
function _isMigrated<V>(map: Readonly<Map<string, V>>): map is Map<string, V>
{
    const legacy_elements: boolean[] = [];
    map.forEach(value => legacy_elements.push(Array.isArray(value) && _isDBTag(value[1])));
    return legacy_elements.includes(false);
}
function _migrate<V>(map: Map<string, [V, LegacyDBTag]>): Map<string, V>
{
    const new_map = new Map();
    map.forEach((v, k) => new_map.set(k, v[0]));
    return new_map;
}

export default Database;
