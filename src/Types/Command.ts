import type { ChatInputCommandInteraction, Message, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import type { eds, runtimeStorage } from "..";
import type { SupportedInteractions } from "./SupportedInteractions"

export type ContextType = "text" | "slash" | "interaction"// | "message-context-menu" | "user-context-menu";
export type CommandType = Exclude<ContextType, "interaction">;

export interface InteractionContext
    <InteractionType extends SupportedInteractions = SupportedInteractions, CtxType extends ContextType = "interaction"> extends _BaseContext
{
    interaction: InteractionType;
    __contextType: CtxType;
}
export interface TextCommandContext extends _BaseContext
{
    message: Message;
    args: string[];
    __contextType: "text";
}
export type CommandContext<T extends CommandType> =
    T extends "text"                    ? TextCommandContext
    : T extends "slash"                 ? SlashCommandContext
    : T extends "message-context-menu"  ? InteractionContext<MessageContextMenuCommandInteraction>
    : T extends "user-context-menu"     ? InteractionContext<UserContextMenuCommandInteraction>
    : never;
export type SlashCommandContext = InteractionContext<ChatInputCommandInteraction, "slash">;
export type AnyContext = InteractionContext | SlashCommandContext | TextCommandContext;





export interface CommandFile<T extends CommandType>
{
    /** Disables this command loading */
    pragmaSkip?: boolean;
    /** Disables this command logging */
    pragmaNoLog?: boolean;
    /** Command code */
    run: (ctx: CommandContext<T>) => any;
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




interface _BaseContext extends eds.EmbedTemplateMethods
{
    universal: SupportedInteractions | Message;
    runtime: typeof runtimeStorage;
}
