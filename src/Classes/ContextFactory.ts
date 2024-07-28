import { BaseMessageOptions, ChatInputCommandInteraction, Message } from "discord.js";
import { SupportedInteractions, eds, quickEmbed } from "..";
import { runtimeStorage } from "../runtimeStorage";

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

    public createTextContext(message: Message): eds.TextContext
    {
        const args = message.content.slice(this.runtime.config.prefix?.length ?? 0).trim().split(/\s+/g);
        const ctx: eds.TextContext = Object.assign(message, {
            args: args.slice(1),
            commandName: args[0],
            contextType: "text" as const,
            user: message.author,
            universalReply: (...data: Parameters<eds.AnyContext["universalReply"]>) => _universalReplyImpl(message, ...data),
            quickReply: (...data: Parameters<eds.AnyContext["quickReply"]>) => _quickReplyImpl(message, ...data)
        });
        return ctx;
    }

    public createSlashContext(interaction: ChatInputCommandInteraction): eds.SlashContext
    {
        const ctx: eds.SlashContext = Object.assign(interaction, {
            contextType: "slash" as const,
            universalReply: (...data: Parameters<eds.AnyContext["universalReply"]>) => _universalReplyImpl(interaction, ...data),
            quickReply: (...data: Parameters<eds.AnyContext["quickReply"]>) => _quickReplyImpl(interaction, ...data)
        });
        return ctx;
    }

    public createInteractionContext
        <T extends eds.SupportedInteractions = eds.SupportedInteractions>
        (interaction: T): eds.InteractionContext<T>
    {
        const ctx: eds.InteractionContext<T> = Object.assign(interaction, {
            contextType: "interaction" as const,
            user: interaction.user,
            universalReply: (...data: Parameters<eds.AnyContext["universalReply"]>) => _universalReplyImpl(interaction, ...data),
            quickReply: (...data: Parameters<eds.AnyContext["quickReply"]>) => _quickReplyImpl(interaction, ...data)
        });
        return ctx;
    }
}

function _universalReplyImpl(
    target: Message | SupportedInteractions,
    message: string | (BaseMessageOptions & { maybeEphemeral?: boolean })
): Promise<Message | undefined> {
    const bakedMessage = (typeof message == "string") ? { content: message } : message;
    if ("token" in target)
        return target.reply({ ...bakedMessage, ephemeral: bakedMessage.maybeEphemeral, fetchReply: true }).catch(err => void console.error(err));
    else return target.reply({ ...bakedMessage }).catch(err => void console.error(err));
}

function _quickReplyImpl(
    target: Message | SupportedInteractions,
    maybeEphemeral: boolean,
    ...message: Parameters<typeof quickEmbed>
) {
    return _universalReplyImpl(target, { ...eds.quickEmbed(...message), maybeEphemeral });
}
