import { JSONSupportedValueTypes } from "../Types/JSONSupportedValueTypes";
/**
 * A simple JSON database. Built on a `Map`-object
 */
export declare class Database<V extends JSONSupportedValueTypes = JSONSupportedValueTypes> {
    private path;
    /**
     * Raw map-object
     */
    Map: Map<string, Database.Value<V>>;
    constructor(path: string, autosave?: boolean | number);
    save(): void;
    set(key: string, value: V, tags?: Database.TagsValues, save?: boolean): void;
    /**
     * Adds a constant value to the database **(VERY SLOW)**
     *
     * There is a mechanism of "references to keys"
     */
    set_const(key: string, value: V, tags?: Database.TagsValues, auto_ref?: boolean, save?: boolean): void;
    get(key: string): V | undefined;
    getFull(key: string): Database.Value<V> | undefined;
    has(key: string): boolean;
    hasValue(value: V): boolean;
    getKey(value: V, single?: boolean): string[];
    del(key: string): void;
    /**
     * Raw map-object in JSON format
     */
    get MapJSON(): string;
    /**
     * Deletes all elements with `$weak$` tag
     * @returns number of deleted elements
     */
    clearWeakData(): Promise<number>;
}
declare namespace Database {
    type Tags = '$weak$' | '$const$' | '$ref$';
    type TagsValues = {
        '$weak$'?: boolean;
        '$const$'?: boolean;
        '$ref$'?: string;
    };
    type Value<V> = [V, TagsValues | undefined];
}
export default Database;
