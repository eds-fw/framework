import { includesAll } from "@eds-fw/utils";
import { eds } from ".";
import { assertions } from "./errors";

class _RuntimeStorage
{
    [key: string]: any;
    
    public getAll<T extends Record<string, any>>(...keys: (keyof T)[]): T
    {
        if (!includesAll(Object.keys(this), keys))
            throw new TypeError(assertions.defectiveRuntimeObjectWithKeys(keys));
        return this as Pick<this, "get" | "getProp" | "set" | "setProp"> & { [K in keyof T]: T[K] };
    }
    public get<V>(key: string): V
    {
        if (!(key in this))
            throw new TypeError(assertions.defectiveRuntimeObject(key));
        return this[key] as V;
    }
    public setAll<T extends object>(values: T): T
    {
        Object.assign(this, values);
        return this as Pick<this, "get" | "set"> & T;
    }
    public set<K extends string, V>(key: K, value: V): { [X in K]: V }
    {
        this[key] = value as any;
        return this as Pick<this, "get" | "set"> & { [X in K]: V };
    }
}
export const runtimeStorage: _RuntimeStorage & KnownRuntimeProperties = new _RuntimeStorage() as _RuntimeStorage & KnownRuntimeProperties;

export type KnownRuntimeProperties = {
    config:                 eds.ConfigExemplar;
    client:                 eds.Client;
    componentManager:       eds.ComponentManager;
    loader:                 eds.Loader;
    contextFactory:         eds.ContextFactory;
    handler:                eds.Handler;
    slashCommandsManager:   eds.SlashCommandsManager;
};
