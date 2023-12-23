import {
    APIActionRowComponent,
    APIEmbed,
    APIMessageActionRowComponent, InteractionResponse,
    JSONEncodable,
    Message
} from "discord.js";
import { eds, runtimeStorage } from "..";

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
    const config = runtimeStorage.config;

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
}