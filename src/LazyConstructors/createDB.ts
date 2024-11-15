import { runtimeStorage, type eds, Storage } from "../index.js";

/**
 * @deprecated
 */
export function createDB<T extends eds.JSONSupported = eds.JSONSupported>(name: string, path: string, autosave?: boolean | number): void
{
    const databases = runtimeStorage.databases as Record<string, eds.Storage>;
    if (databases === undefined)
    {
        runtimeStorage.setProp("databases", {});
        createDB<T>(name, path, autosave);
        return;
    }
    databases[name] = new Storage<T>(path, autosave);
    runtimeStorage.setProp("databases", databases);
}