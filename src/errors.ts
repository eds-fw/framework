export const Handler = {
    runCommandError:
        (err: unknown) => console.error(`EDS Handler: Failed to execute command:\n\t${err}`),
};

export const Loader = {
    loadFileError:
        (path: string, err: unknown) => new Error(`EDS Loader: Failed to load file '${path}':\n\t${err}`),
    templateLoadCommandError:
        (path: string, reason: string) => console.error(`| E "${path}" [${reason}]`),
    templateLoadCommandSkipped:
        (path: string) => console.log(`|   "${path}" [SKIPPED]`),
    templateLoadCommandSuccessText:
        (name: string) => console.log(`| > ${name}`),
    templateLoadCommandSuccessSlash:
        (name: string) => console.log(`| / ${name}`),
    templateLoadBuiultinCommand:
        (name: string) => console.log(`| / ${name} [BUILT-IN]`),
};

export const SlashCommandsManager = {
    clientNotReady:
        () => new Error(`EDS SlashCommandsManager: Client doesn't ready. Failed to save all slash commands`),
};

export const assertions = {
    defectiveRuntimeObject:
        (key: string | number | symbol) => new TypeError(`EDS Assertions: Property '${String(key)}' does not exist on the runtime object`),
    defectiveRuntimeObjectWithKeys:
        (keys: (string | number | symbol)[]) => new TypeError(`EDS Assertions: Keys '${keys}' does not exist on the runtime object`),
};
