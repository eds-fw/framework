import { eds, runtimeStorage } from "..";

export function createDB<T extends eds.JSONSupportedValueTypes = eds.JSONSupportedValueTypes>(name: string, path: string, autosave?: boolean | number): void
{
    let databases = runtimeStorage.databases as Record<string, eds.Database>;
    if (databases === undefined)
    {
        runtimeStorage.setProp("databases", {});
        createDB<T>(name, path, autosave);
        return;
    }
    databases[name] = new eds.Database<T>(path, autosave);
    runtimeStorage.setProp("databases", databases);
}