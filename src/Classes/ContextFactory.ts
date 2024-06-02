import { ChatInputCommandInteraction, Message } from "discord.js";
import { type eds, runtimeStorage, templateEmbedReply } from "..";

/**
 * Creates a context from message/interaction
 */
export class ContextFactory
{
    private runtime;

    public constructor() {
        this.runtime = runtimeStorage.getAll<{
            config: eds.ConfigExemplar
        }>("config");
    }

    public createTextContext(message: Message): eds.CommandContext<"text">
    {
        const args = message.content.slice(this.runtime.config.prefix?.length ?? 0).trim().split(/\s+/g);
        const ctx: eds.CommandContext<"text"> = {
            message,
            args,
            universal: message,
            runtime: runtimeStorage,
            __contextType: "text",
            reply: (...params: Parameters<eds.EmbedTemplateMethods["reply"]>) => templateEmbedReply(ctx, ...params),
        };

        return ctx;
    }

    public createSlashContext(interaction: ChatInputCommandInteraction): eds.CommandContext<"slash">
    {
        const ctx: eds.CommandContext<"slash"> = {
            interaction,
            universal: interaction,
            runtime: runtimeStorage,
            __contextType: "slash",
            reply: (...params: Parameters<eds.EmbedTemplateMethods["reply"]>) => templateEmbedReply(ctx, ...params),
        };

        return ctx;
    }

    public createInteractionContext<T extends eds.SupportedInteractions = eds.SupportedInteractions>
        (interaction: T): eds.InteractionContext<T>
    {
        const ctx: eds.InteractionContext<T> = {
            interaction,
            universal: interaction,
            runtime: runtimeStorage,
            __contextType: "interaction",
            reply: (...params: Parameters<eds.EmbedTemplateMethods["reply"]>) => templateEmbedReply(ctx, ...params),
        };

        return ctx;
    }
}