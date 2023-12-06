import type { ChatInputCommandInteraction, Message } from "discord.js";
import type { eds } from "../..";
import type { SupportedInteractions } from "../SupportedInteractions"

export type CommandContext<T extends boolean> =
    T extends true
    ? SlashCommandContext
    : TextCommandContext;
export type AnyContext = InteractionContext | SlashCommandContext | TextCommandContext;
export interface InteractionContext<T extends SupportedInteractions = SupportedInteractions> extends eds.EmbedTemplateMethods
{
    interaction: T;
    __contextType: "interaction";
}

export interface SlashCommandContext extends eds.EmbedTemplateMethods
{
    interaction: ChatInputCommandInteraction;
    __contextType: "slash";
}
export interface TextCommandContext extends eds.EmbedTemplateMethods
{
    message: Message;
    args: string[];
    __contextType: "text";
}