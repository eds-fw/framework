import {
    ActionRowData,
    APIActionRowComponent,
    APIEmbed,
    APIMessageActionRowComponent,
    Embed,
    EmbedData,
    InteractionReplyOptions,
    InteractionResponse,
    JSONEncodable,
    Message,
    MessageActionRowComponentData,
    MessageCreateOptions,
} from "discord.js";
import { eds, runtimeStorage } from "..";
import * as errors from "../errors";

let previous: Message | undefined;
let previousInteraction: InteractionResponse | Message;

export async function templateEmbedReply(
    ctx: eds.CommandContext<boolean> | eds.InteractionContext,
    ephemeral: boolean,
    title?: string,
    description?: string,
    type: string = "default",
    components?: APIActionRowComponent<APIMessageActionRowComponent>[],
    custom_embed?: JSONEncodable<APIEmbed> | APIEmbed
): Promise<void> {
    if ((!description || description === "") && (!title || title === "")) return;
    const config = runtimeStorage.getProp<eds.ConfigExemplar>("config");

    let prevRef, method;

    if (ctx.__contextType === "text")
    {
        method = ctx.message.reply.bind(ctx.message);
        if (!method) return;
        prevRef = previous;
    }
    else {
        if (ctx.interaction.deferred)
            method = ctx.interaction.followUp.bind(ctx.interaction);
        else
            method = ctx.interaction.reply.bind(ctx.interaction);
        if (!method) return;
        prevRef = previousInteraction;
    }

    prevRef = await method({
        embeds: [Object.assign({}, {
            author: title ? { name: title } : undefined,
            description: description,
            color: type ? config.colors?.[type] : undefined,
            footer: eds.getRandomFooterEmbed().data_api
        }, custom_embed ?? {})],
        components,
        ephemeral
    }).catch((err) => console.error(err)) ?? prevRef;
}
/**
 * Edits previous message
 * 
 * `undefined` = without changes,
 * `null` = remove
 * @deprecated
 */
export async function templateEmbedEditReply(
    ctx: eds.CommandContext<boolean> | eds.InteractionContext,
    ephemeral: boolean,
    title?: string | undefined | null,
    description?: string | undefined | null,
    type: string | undefined | null = "default",
    components?: APIActionRowComponent<APIMessageActionRowComponent>[] | undefined | null,
    custom_embed?: JSONEncodable<APIEmbed> | APIEmbed
): Promise<void> {
console.log(`Function \`ctx.editReply()\` has been deprecated.`);
    if ((!description || description === "") && (!title || title === "")) return;
    const config = runtimeStorage.getProp<eds.ConfigExemplar>("config");
    
    let prevRef, method;

    if (ctx.__contextType === "text")
    {
        method = ctx.message.reply.bind(ctx.message);
        prevRef = previous;
    }
    else {
        if (!ctx.interaction.deferred)
        {
            let error;
            await ctx.interaction.deferReply({ ephemeral }).catch(err => error = err);
            if (error) return eds.reportError(errors.Utils.replyMessageError(error), ctx);
        }
        method = ctx.interaction.reply.bind(ctx.interaction);
        prevRef = previousInteraction;
    }

    let embed: APIEmbed | Embed = {
        footer: eds.getRandomFooterEmbed().data_api
    };

    let _components: APIActionRowComponent<APIMessageActionRowComponent>[] | ActionRowData<MessageActionRowComponentData>[] | undefined = [];

    if (prevRef && "embeds" in prevRef)
    {
        if (typeof title === "string")
        embed.author = { name: title };
        else if (title === undefined)
            embed.author = prevRef.embeds[0].author ?? undefined;
        if (typeof description === "string")
            embed.description = description;
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
        embeds: [Object.assign({}, embed, custom_embed ?? {})],
        components: _components
    }).catch((err) => console.error(err)) ?? prevRef;
}

export interface EmbedTemplateMethods
{
    reply(
        ephemeral: boolean,
        title?: string,
        description?: string,
        type?: string,
        components?: APIActionRowComponent<APIMessageActionRowComponent>[],
        custom_embed?: JSONEncodable<APIEmbed> | APIEmbed
    ): Promise<void>;

    editReply(
        ephemeral: boolean,
        title: string | null | undefined,
        description: string | null | undefined,
        type: string | null | undefined,
        components: APIActionRowComponent<APIMessageActionRowComponent>[] | null | undefined,
        custom_embed?: JSONEncodable<APIEmbed> | APIEmbed
    ): Promise<void>;
}