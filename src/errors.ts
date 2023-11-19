import { UserResolvable } from "discord.js";
import * as __this from "./errors";

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
        (path: string) => `| S "${path}" [SKIPPED]`,
    templateLoadCommandSuccessText:
        (name: string) => `| > ${name}`,
    templateLoadCommandSuccessSlash:
        (name: string) => `| / ${name}`,
    templateLoadBuiultinCommand:
        (name: string) => `| / ${name} [BUILT-IN]`,
};

export const Utils = {
    replyMessageError:
        (err: unknown) => `Utils/EmbedTemplates: Reply() APIError:\n\t${err}`,
    sendMessageError:
        (err: unknown) => `Utils/EmbedTemplates: Send() APIError:\n\t${err}`,
    editMessageError:
        (err: unknown) => `Utils/EmbedTemplates: Edit() APIError:\n\t${err}`,
    updateMessageError:
        (err: unknown) => `Utils/EmbedTemplates: Update() APIError:\n\t${err}`,
    fetchUserError:
        (user: UserResolvable, err: unknown) => `Utils/Fetch: Failed to fetch user '${user}':\n\t${err}`,
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

export const Database = {
    invalidPath:
        (path: string, err: unknown) => `Database: File '${path}' not found:\n\t${err}`,
};

export const Logger = {
    counterReportError:
        (err: unknown) => `Logger: Failed to append counter report to log file:\n\t${err}`,
    appendMessageError:
        (err: unknown) => `Logger: Failed to append message to log file:\n\t${err}`,
}

export const eds_errors = __this;