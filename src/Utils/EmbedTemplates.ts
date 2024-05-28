import {
    APIActionRowComponent,
    APIEmbed,
    APIMessageActionRowComponent, BaseMessageOptions, InteractionResponse,
    JSONEncodable,
    Message
} from "discord.js";
import { type eds, runtimeStorage, getRandomFooterEmbed } from "..";

export async function templateEmbedReply(
    ctx: eds.AnyContext,
    ephemeral: boolean,
    title?: string,
    description?: string,
    type: string = "default",
    components?: BaseMessageOptions["components"],
    custom_embed?: JSONEncodable<APIEmbed> | APIEmbed
): Promise<Message | InteractionResponse | undefined>
{
    if ((!description || description === "") && (!title || title === "")) return;
    const config = runtimeStorage.config;

    let method;

    if (ctx.__contextType === "text")
    {
        method = ctx.message.reply.bind(ctx.message);
        if (!method) return;
    }
    else {
        if (ctx.interaction.deferred)
            method = ctx.interaction.followUp.bind(ctx.interaction);
        else
            method = ctx.interaction.reply.bind(ctx.interaction);
        if (!method) return;
    }

    const result = await method({
        embeds: [{
            author: title ? { name: title } : undefined,
            description: description,
            color: type ? config.colors?.[type] : undefined,
            footer: getRandomFooterEmbed().data_api,
            ...custom_embed ?? {}
        }],
        components,
        ephemeral,
    }).catch(console.error);
    if (!result) return;
    return result;
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
    ): Promise<Message | InteractionResponse | undefined>;
}