import { eds, runtimeStorage } from "..";

export function createDB<T extends eds.JSONSupportedDataTypes = eds.JSONSupportedDataTypes>(name: string, path: string, autosave?: boolean | number)
{
    const databases = runtimeStorage.getProp<Record<string, eds.Database>>("databases");
    databases[name] = new eds.Database<T>(path, autosave);
    runtimeStorage.setProp("databases", databases);
}