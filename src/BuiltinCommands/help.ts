import { ActionRowData, ApplicationCommandType, ComponentType, EmbedData, MessageActionRowComponentData } from "discord.js";
import { eds, runtimeStorage } from "..";

const config = runtimeStorage.config;
const loader = runtimeStorage.loader;

eds.createSlashCommand({
    name: config.builtinCommandsSettings?.helpCommandName ?? "help",
    description: config.builtinCommandsSettings?.helpCommandDescription ?? "Show a list of all bot commands",
    nsfw: false,
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: null,
    dmPermission: true,
});

eds.createMenu({
    custom_id: "help $$ commandSelect",
    async onSelect(ctx)
    {
        const local_components = getMenu(getRoles(ctx));
        local_components[0].components[0].options[
            local_components[0]
            .components[0]
            .options
            .map(option => option.value)
            .indexOf(ctx.values[0])
        ].default = true;
        ctx.update({
            components: local_components,
            embeds: [getPage(ctx.values[0])]
        });
    }
}, {});

export = {
    async run(ctx) {
        const roles = getRoles(ctx);
        await ctx.reply({
            embeds: [{
                title: config.builtinCommandsSettings?.helpListAdditionalText
                    ? undefined
                    : (config.builtinCommandsSettings?.helpListTitleText ?? "All bot commands:"),
                color: config.colors?.info ?? config.colors?.default,
                footer: eds.getRandomFooterEmbed().data_api,
                description: (config.builtinCommandsSettings?.helpListAdditionalText ?? '')
                    + (config.builtinCommandsSettings?.helpListAdditionalText
                        ? "\n\n### " + (config.builtinCommandsSettings?.helpListTitleText ?? "All bot commands:") + '\n'
                        : undefined
                    )
                    + loader.commandHelp.getCommandList(roles),
                thumbnail: config.builtinCommandsSettings?.helpListThumbnail ? {
                    url: config.builtinCommandsSettings?.helpListThumbnail
                } : undefined
            }],
            components: getMenu(roles),
            ephemeral: config.builtinCommandsSettings?.helpEphemeral ?? true,
        });
    },
    info: {
        name: config.builtinCommandsSettings?.helpCommandName ?? "help",
        type: "slash",
        desc: config.builtinCommandsSettings?.helpCommandDescription ?? "Show a list of all bot commands",
        category: runtimeStorage.config.builtinCommandsSettings?.helpCommandCategory ?? "General",
    }
} satisfies eds.CommandFile<"slash">;



function getPage(page: string)
{
    return {
        title: config.builtinCommandsSettings?.helpPageTitleText ?? "Command help:",
        color: config.colors?.info ?? config.colors?.default,
        footer: eds.getRandomFooterEmbed().data_api,
        description: loader.commandHelp.pages.get(page),
        thumbnail: config.builtinCommandsSettings?.helpPageThumbnail ? {
            url: config.builtinCommandsSettings?.helpPageThumbnail
        } : undefined
    } satisfies EmbedData;
}

function getMenu(roles: string[])
{
    let options = loader.commandHelp.getCommandNames(roles).map(command => ({
        label: (loader.commandHelp.commandTypes.get(command) == "slash" ? '/' : loader.commandHelp.commandTypes.get(command) == "nonPrefixed" ? '' : config.prefix) + command,
        description: loader.commandHelp.descriptions.get(command)?.slice(0, 100),
        value: command,
        emoji: config.builtinCommandsSettings?.helpPageMenuEmoji,
        default: false as boolean
    }));
    if (options.length >= 25)
        options = options.slice(0, 25);
    const components = [{
        type: ComponentType.ActionRow,
        components: [{
            type: ComponentType.StringSelect,
            customId: "help $$ commandSelect",
            options
        }]
    }] satisfies ActionRowData<MessageActionRowComponentData>[];
    return components.filter((item, index) => components.indexOf(item) === index).slice(0, 25);
}

function getRoles(ctx: eds.InteractionContext | eds.SlashContext)
{
    return ctx.member?.roles
        ? Array.isArray(ctx.member?.roles)
            ? ctx.member?.roles
            : Array.from(ctx.member?.roles.cache.values()).map(role => role.id)
        : [];
}