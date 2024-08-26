import type { MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import type { ContextType, InteractionContext, SlashContext, TextContext } from "./Context.d.ts";

export type CommandType = Exclude<ContextType, "interaction">;
export type CommandExecutor<T extends CommandType = CommandType> = (ctx: CommandContext<T>) => Promise<unknown>;

export interface CommandFile<T extends CommandType>
{
    /** Disables this command loading */
    pragmaSkip?: boolean;
    /** Command code */
    run: CommandExecutor<T>;
    /** Command info */
    info: CommandInfo<T>;
}

export interface CommandHelpInfo<T extends CommandType = CommandType>
{
    name:               string;
    type:               T;

    usage?:             string;
    usageDocs?:         string;
    desc?:              string;
    category?:          string;
    allowInDM?:         boolean;
    hidden?:            boolean;
    /** Do not add 'everyone' role ID @functional may affect command execution */
    allowedRoles?:      string[];
    /** @functional may affect command execution */
    noCheckAccess?:     boolean;
}

export interface CommandInfo<T extends CommandType> extends CommandHelpInfo<T>
{
    aliases?:       T extends "text" ? string[] : never;
    nonPrefixed?:   T extends "text" ? boolean  : never;
}

export type CommandContext<T extends CommandType> =
    T extends "text"                    ? TextContext
    : T extends "slash"                 ? SlashContext
    : T extends "message-context-menu"  ? InteractionContext<MessageContextMenuCommandInteraction>
    : T extends "user-context-menu"     ? InteractionContext<UserContextMenuCommandInteraction>
    : never;
