import type { BaseMessageOptions, ChatInputCommandInteraction, Message, User } from "discord.js";
import type { SupportedInteractions } from "./SupportedInteractions.d.ts";
import type { quickEmbed } from "../Utils/QuickEmbed.d.ts";

export type ContextType = "text" | "slash" | "interaction"// | "message-context-menu" | "user-context-menu";
export type TextContext = Message<boolean> & ContextOverrides & { args: string[]; commandName: string; contextType: "text" };
export type InteractionContext<Interaction extends SupportedInteractions = SupportedInteractions> = Interaction & ContextOverrides & { contextType: "interaction" };
export type SlashContext = Omit<InteractionContext<ChatInputCommandInteraction>, "contextType"> & { contextType: "slash" };
export type AnyContext = TextContext | InteractionContext | SlashContext;

interface ContextOverrides
{
    get user(): User;
    universalReply(message: string | (BaseMessageOptions & { maybeEphemeral?: boolean })): Promise<Message | undefined>;
    quickReply(maybeEphemeral: boolean, ...message: Parameters<typeof quickEmbed>): Promise<Message | undefined>;
}
