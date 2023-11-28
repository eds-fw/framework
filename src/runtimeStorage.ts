import deprecated from "deprecated-decorator";
import { assertions } from "./errors";
import { includesAll } from "@easy-ds-bot/utils";

class _RuntimeStorage
{
    [key: string]: any;
    
    /** @deprecated use `getAll()` */
    @deprecated("getAll")
    public get<T extends Record<string, any>>(...keys: (keyof T)[]): T
    {
        if (!includesAll(Object.keys(this), keys))
            throw new TypeError(assertions.defectiveRuntimeObjectWithKeys(keys));
        return this as Pick<this, "get" | "getProp" | "set" | "setProp"> & { [K in keyof T]: T[K] };
    }
    public getAll<T extends Record<string, any>>(...keys: (keyof T)[]): T
    {
        if (!includesAll(Object.keys(this), keys))
            throw new TypeError(assertions.defectiveRuntimeObjectWithKeys(keys));
        return this as Pick<this, "get" | "getProp" | "set" | "setProp"> & { [K in keyof T]: T[K] };
    }
    public getProp<V>(key: string): V
    {
        if (!(key in this))
            throw new TypeError(assertions.defectiveRuntimeObject(key));
        return this[key] as V;
    }
    /** @deprecated use `setAll()` */
    @deprecated("setAll")
    public set<T extends object>(values: T): T
    {
        Object.assign(this, values);
        return this as Pick<this, "get" | "getProp" | "set" | "setProp"> & T;
    }
    public setAll<T extends object>(values: T): T
    {
        Object.assign(this, values);
        return this as Pick<this, "get" | "getProp" | "set" | "setProp"> & T;
    }
    public setProp<K extends string, V>(key: K, value: V): { [X in K]: V }
    {
        this[key] = value as any;
        return this as Pick<this, "get" | "getProp" | "set" | "setProp"> & { [X in K]: V };
    }
}
export const runtimeStorage = new _RuntimeStorage();