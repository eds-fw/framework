import * as __this from "./errors.js";

export const Handler = {
    runCommandError:
        (err: unknown) => `Handler: Failed to execute command:\n\t${err}`,
    interactionTypeError:
        () => `Handler: Assertion failed. 'interaction.type === ApplicationCommand' but the 'interaction' object does not match 'ChatInputCommandInteraction' class`,
};

export const Loader = {
    loadFileError:
        (path: string, err: unknown) => `Loader: Failed to load file '${path}':\n\t${err}`,
    wrongFileStructure:
        (path: string) => `Loader: Failed to find exported 'Command' class in file ${path}`,
    templateLoadCommandError:
        (path: string, reason: string) => `| E "${path}" [${reason}]`,
    templateLoadCommandSkipped:
        (path: string) => `|   "${path}" [SKIPPED]`,
    templateLoadCommandSuccessText:
        (name: string) => `| > ${name}`,
    templateLoadCommandSuccessSlash:
        (name: string) => `| / ${name}`,
    templateLoadBuiultinCommand:
        (name: string) => `| / ${name} [BUILT-IN]`,
};

export const SlashCommandsManager = {
    createCommandError:
        () => `SlashCommandsManager: Failed to create slash command`,
    deleteCommandError:
        (id: string, err: unknown) => `SlashCommandsManager: Failed to delete slash command with id '${id}':\n\t${err}`,
    clientNotReady:
        () => `SlashCommandsManager: Client doesn't ready. Failed to save all slash commands`,
};

export const assertions = {
    defectiveRuntimeObject:
        (key: string | number | symbol) => `Assertions: Property '${String(key)}' does not exist on the runtime object`,
    defectiveRuntimeObjectWithKeys:
        (keys: (string | number | symbol)[]) => `Assertions: Keys '${keys}' does not exist on the runtime object`,
};

export const eds_errors = __this;