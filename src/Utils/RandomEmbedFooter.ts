import { APIEmbedFooter, EmbedFooterData } from "discord.js";
import { arrRandom } from "../index.js";
import { runtimeStorage } from "../runtimeStorage.js";

export function getRandomFooterEmbed()
{
    return {
        get data_api()
        {
            return _getRandomFooterEmbed("api") as APIEmbedFooter;
        },
        get data_djs()
        {
            return _getRandomFooterEmbed("djs") as EmbedFooterData;
        }
    };
}

function _getRandomFooterEmbed(type: "api" | "djs")
{
    const config = runtimeStorage.config;
    return {
        text: Array.isArray(config.footerText)
            ? arrRandom(config.footerText)
            : config.footerText,
        [type == "api" ? "icon_url" : "iconURL"]: Array.isArray(config.footerIcon)
        ? arrRandom(config.footerIcon)
        : config.footerIcon
    };
}