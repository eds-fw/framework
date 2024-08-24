import {
    APIEmbed,
    BaseMessageOptions,
    JSONEncodable
} from "discord.js";
import { getRandomFooterEmbed, runtimeStorage } from "../index.js";

export function quickEmbed(
    title?: string,
    description?: string,
    type: string = "default",
    components?: BaseMessageOptions["components"],
    customEmbed?: JSONEncodable<APIEmbed> | APIEmbed
): BaseMessageOptions
{
    const config = runtimeStorage.config;
    return {
        embeds: [{
            author: title ? { name: title } : undefined,
            description: description,
            color: type ? config.colors?.[type] : undefined,
            footer: getRandomFooterEmbed().data_api,
            ...customEmbed ?? {}
        }],
        components,
    };
}
