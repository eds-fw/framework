import { assertions } from "./errors";
import { includesAll } from "./Utils/Util";

export const runtimeStorage = new class
{
    [key: string]: any;
    public get<T extends Record<string, any>>(...keys: (keyof T)[])
    {
        if (!includesAll(Object.keys(this), keys))
            throw new TypeError(assertions.defectiveRuntimeObjectWithKeys(keys));
        return this as Pick<this, "get" | "getProp" | "set"> & { [K in keyof T]: T[K] };
    }
    public getProp<R>(key: string)
    {
        if (!(key in this))
            throw new TypeError(assertions.defectiveRuntimeObject(key));
        return this[key] as R;
    }
    public set<T extends object>(values: T)
    {
        for (const [key, value] of Object.entries(values))
            this[key] = value;
        return this as Pick<this, "get" | "getProp" | "set"> & T;
    }
    public setProp<K extends string, V>(key: K, value: V)
    {
        this[key] = value as any;
        return this as Pick<this, "get" | "getProp" | "set"> & { [X in K]: V };
    }
}