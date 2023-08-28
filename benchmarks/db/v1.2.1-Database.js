"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const fs_1 = require("fs");
const __1 = require("../../dist/");
/**
 * A simple JSON database. Built on a `Map`-object
 */
class Database {
    path;
    _Map;
    constructor(path, autosave) {
        this.path = path;
        try {
            (0, fs_1.accessSync)(path);
        }
        catch (err) {
            console.log(`Database: Файл не найден.\n\tПуть: '${path}'`);
        }
        const entries = Object.entries(JSON.parse((0, fs_1.readFileSync)(path).toString() ?? "{}"));
        this._Map = new Map(entries);
        if (autosave)
            setInterval(() => this.save(), typeof autosave === "number" ? autosave : 60_000);
    }
    save() {
        (0, fs_1.writeFileSync)(this.path, this.MapJSON);
    }
    set(key, value, tags, save) {
        this._Map.set(key, [value, tags]);
        if (save)
            this.save();
    }
    /**
     * Adds a constant value to the database **(VERY SLOW)**
     *
     * There is a mechanism of "references to keys"
     */
    set_const(key, value, tags, auto_ref = false, save = false) {
        if (auto_ref) {
            if (this.hasValue(value)) {
                let vals = this.getKey(value).filter($ => this.getFull($)?.[1]?.$const$ === true);
                if (vals.length > 0)
                    this.set(key, null, { $const$: true, $ref$: vals[0] });
                else
                    this.set(key, value, Object.assign(tags ?? {}, { $const$: true }));
                //
            }
            else
                this.set(key, value, Object.assign(tags ?? {}, { $const$: true }));
        }
        else
            this.set(key, value, Object.assign(tags ?? {}, { $const$: true }));
        //
        if (save)
            this.save();
    }
    get(key) {
        const data = this._Map.get(key);
        if (data?.[1]?.$ref$)
            return this.get(data[1].$ref$);
        else
            return data?.[0];
        //
    }
    getFull(key) {
        const data = this._Map.get(key);
        if (data?.[1]?.$ref$)
            return this.getFull(data[1].$ref$);
        else
            return data;
        //
    }
    has(key) {
        return this._Map.has(key);
    }
    hasValue(value) {
        for (const val of this._Map.values()) {
            if (__1.eds.equal(value, val[0]))
                return true;
        }
        return false;
    }
    getKey(value, single = false) {
        let result = [];
        for (const ent of this._Map.entries())
            if (__1.eds.equal(value, ent[1][0]))
                result.push(ent[0]);
        //
        //
        return single ? [result[0]] : result;
    }
    del(key) {
        this._Map.delete(key);
    }
    /**
     * Raw `Map`-object
     */
    get Map() {
        return this._Map;
    }
    /**
     * Raw `Map`-object in JSON format
     */
    get MapJSON() {
        if (this._Map.size == 0)
            return "{}";
        let entries = "";
        this._Map.forEach((v, k) => {
            entries += ',\n\t' + `"${k}": ${JSON.stringify(v)}`;
        });
        return '{' + entries.slice(1) + '\n}';
    }
    /**
     * Deletes all elements with `$weak$` tag
     * @returns number of deleted elements
     */
    clearWeakData() {
        return new Promise((resolve, reject) => {
            let i = 0;
            for (const [key, value] of this._Map.entries()) {
                if (value[1]?.$weak$) {
                    this._Map.delete(key);
                    i++;
                }
            }
            this.save();
            resolve(i);
        });
    }
}
exports.Database = Database;
exports.default = Database;
