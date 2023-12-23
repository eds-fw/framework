import type { ChatInputCommandInteraction, Message } from "discord.js";
import type { eds } from "../..";
import type { SupportedInteractions } from "../SupportedInteractions"

interface BaseContext extends eds.EmbedTemplateMethods
{
    universal: SupportedInteractions | Message;
    runtime: typeof eds.runtimeStorage;
}
export interface InteractionContext<T extends SupportedInteractions = SupportedInteractions> extends BaseContext
{
    interaction: T;
    __contextType: "interaction";
}

export interface SlashCommandContext extends BaseContext
{
    interaction: ChatInputCommandInteraction;
    __contextType: "slash";
}
export interface TextCommandContext extends BaseContext
{
    message: Message;
    args: string[];
    __contextType: "text";
}
export type CommandContext<T extends boolean> =
    T extends true
    ? SlashCommandContext
    : TextCommandContext;
export type AnyContext = InteractionContext | SlashCommandContext | TextCommandContext;