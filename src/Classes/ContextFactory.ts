import { ChatInputCommandInteraction, Message } from "discord.js";
import { eds, runtimeStorage } from "..";

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
    };

    public createTextContext(message: Message): eds.CommandContext<false>
    {
        let args = message.content.slice(this.runtime.config.prefix?.length ?? 0).trim().split(/\s+/g);
        const ctx = {
            message,
            args,
            universal: message,
            runtime: eds.runtimeStorage,
            __contextType: "text",
            reply: (...params: Parameters<eds.EmbedTemplateMethods["reply"]>) => eds.templateEmbedReply(ctx, ...params),
        } as eds.CommandContext<false>;

        return ctx;
    };

    public createSlashContext(interaction: ChatInputCommandInteraction): eds.CommandContext<true>
    {
        const ctx = {
            interaction,
            universal: interaction,
            runtime: eds.runtimeStorage,
            __contextType: "slash",
            reply: (...params: Parameters<eds.EmbedTemplateMethods["reply"]>) => eds.templateEmbedReply(ctx, ...params),
        } as eds.CommandContext<true>;

        return ctx;
    };

    public createInteractionContext<T extends eds.SupportedInteractions = eds.SupportedInteractions>(interaction: T): eds.InteractionContext<T>
    {
        const ctx = {
            interaction,
            universal: interaction,
            runtime: eds.runtimeStorage,
            __contextType: "interaction",
            reply: (...params: Parameters<eds.EmbedTemplateMethods["reply"]>) => eds.templateEmbedReply(ctx, ...params),
        } as eds.InteractionContext<T>;

        return ctx;
    };
}