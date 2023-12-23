import { APIEmbedFooter, EmbedFooterData } from "discord.js";
import { eds } from "..";
import { runtimeStorage } from "../runtimeStorage";

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
            ? eds.arrRandom(config.footerText)
            : config.footerText,
        [type == "api" ? "icon_url" : "iconURL"]: Array.isArray(config.footerIcon)
        ? eds.arrRandom(config.footerIcon)
        : config.footerIcon
    };
}