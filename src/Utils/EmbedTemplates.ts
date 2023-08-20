import {
    ActionRowData,
    APIActionRowComponent,
    APIEmbed,
    APIMessageActionRowComponent,
    Embed,
    InteractionResponse,
    Message,
    MessageActionRowComponentData,
} from "discord.js";
import { eds, runtimeStorage } from "..";
import * as errors from "../errors";

let previous: Message | {} = {};
let previousInteraction: InteractionResponse | Message | {} = {};;

export async function templateEmbedReply(
    ctx: eds.CommandContext<boolean> | eds.InteractionContext,
    ephemeral: boolean,
    title?: string,
    content?: string,
    type: string = "default",
    components?: APIActionRowComponent<APIMessageActionRowComponent>[]
) {
    if ((!content || content === "") && (!title || title === "")) return;
    let config = runtimeStorage.getProp<eds.ConfigExemplar>("config");

    let prevRef: typeof previous = {}, method;

    if (ctx.__contextType === "text")
    {
        method = ctx.message.reply.bind(ctx.message);
        if (!method) return;
        prevRef = previous;
    }
    else {
        if (!ctx.interaction.deferred)
            await ctx.interaction.deferReply({ ephemeral });
        method = ctx.interaction.followUp.bind(ctx.interaction);
        if (!method) return;
        prevRef = previousInteraction;
    }

    prevRef = await method({
        embeds: [{
            author: title ? { name: title } : undefined,
            description: content,
            color: type ? config.colors?.[type] : undefined,
            footer: config.footerText ? {
                text: config.footerText,
                icon_url: config.footerIcon
            } : undefined
        }],
        components
    }).catch((err) => eds.reportError(errors.Utils.replyMessageError(err), ctx)) ?? prevRef;
}
/**
 * Edits previous message
 * 
 * `undefined` = without changes,
 * `null` = remove
 */
export async function templateEmbedEditReply(
    ctx: eds.CommandContext<boolean> | eds.InteractionContext,
    ephemeral: boolean,
    title?: string | undefined | null,
    content?: string | undefined | null,
    type: string | undefined | null = "default",
    components?: APIActionRowComponent<APIMessageActionRowComponent>[] | undefined | null
) {
    if ((!content || content === "") && (!title || title === "")) return;
    let config = runtimeStorage.getProp<eds.ConfigExemplar>("config");
    
    let prevRef: typeof previous = {}, method;

    if (ctx.__contextType === "text")
    {
        method = ctx.message.reply.bind(ctx.message);
        prevRef = previous;
    }
    else {
        if (!ctx.interaction.deferred)
            await ctx.interaction.deferReply({ ephemeral });
        method = ctx.interaction.reply.bind(ctx.interaction);
        prevRef = previousInteraction;
    }

    let embed: APIEmbed | Embed = {
        footer: config.footerText ? {
            text: config.footerText,
            icon_url: config.footerIcon
        } : undefined
    };

    let _components: APIActionRowComponent<APIMessageActionRowComponent>[] | ActionRowData<MessageActionRowComponentData>[] | undefined = [];

    if ("embeds" in prevRef)
    {
        if (typeof title === "string")
        embed.author = { name: title };
        else if (title === undefined)
            embed.author = prevRef.embeds[0].author ?? undefined;
        if (typeof content === "string")
            embed.description = content;
        else if (title === undefined)
            embed.description = prevRef.embeds[0].description ?? undefined;

        if (type)
            embed.color = config.colors?.[type] ? config.colors?.[type] : prevRef.embeds[0].color ?? undefined;

        if (components === null)
            _components = [];
        else if (title === undefined)
            _components = prevRef.components ?? undefined;
        else
            _components = components;
    }

    prevRef = await method({
        embeds: [embed],
        components: _components
    }).catch((err) => eds.reportError(errors.Utils.replyMessageError(err), ctx)) ?? prevRef;
}
export interface EmbedTemplateMethods
{
    reply(
        ephemeral: boolean,
        title?: string,
        content?: string,
        type?: string,
        components?: APIActionRowComponent<APIMessageActionRowComponent>[]
    ): Promise<void>;

    editReply(
        ephemeral: boolean,
        title: string | null | undefined,
        content: string | null | undefined,
        type: string | null | undefined,
        components: APIActionRowComponent<APIMessageActionRowComponent>[] | null | undefined
    ): Promise<void>;
}