import { ActionRowData, ApplicationCommandType, ComponentType, EmbedData, MessageActionRowComponentData } from "discord.js";
import { eds, runtimeStorage } from "..";

const config = runtimeStorage.getProp<eds.ConfigExemplar>("config");
const loader = runtimeStorage.getProp<eds.Loader>("loader");
const slashCommandsManager = runtimeStorage.getProp<eds.SlashCommandsManager>("slashCommandsManager");

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
            .indexOf(ctx.interaction.values[0])
        ].default = true;
        ctx.interaction.update({
            components: local_components,
            embeds: [getPage(ctx.interaction.values[0])]
        });
    }
}, {});

export = {
    async __createCommand()
    {
        slashCommandsManager.create({
            name: config.builtinCommandsSettings?.helpCommandName ?? "help",
            description: config.builtinCommandsSettings?.helpCommandDescription ?? "Show a list of all bot commands",
            nsfw: false,
            type: ApplicationCommandType.ChatInput,
            defaultMemberPermissions: null,
            dmPermission: true,
        });
    },
    async run(ctx) {
        const roles = getRoles(ctx);
        const local_components = getMenu(roles);
        await ctx.interaction.reply({
            embeds: [{
                title: config.builtinCommandsSettings?.helpListTitleText ?? "All bot commands:",
                color: config.colors?.info ?? config.colors?.default,
                footer: eds.getRandomFooterEmbed().data_api,
                description: loader.commandHelp.getCommandList(roles)
            }],
            components: getMenu(roles),
            ephemeral: config.builtinCommandsSettings?.helpEphemeral ?? true,
        });
    },
    info: {
        name: config.builtinCommandsSettings?.helpCommandName ?? "help",
        slash: true,
        desc: config.builtinCommandsSettings?.helpCommandDescription ?? "Show a list of all bot commands",
        category: runtimeStorage.getProp<eds.ConfigExemplar>("config").builtinCommandsSettings?.helpCommandCategory ?? "General",
    }
} satisfies eds.CommandFile<true> & { __createCommand: () => Promise<void> };

function getPage(page: string)
{
    return {
        title: config.builtinCommandsSettings?.helpPageTitleText ?? "Command help:",
        color: config.colors?.info ?? config.colors?.default,
        footer: eds.getRandomFooterEmbed().data_api,
        description: loader.commandHelp.pages.get(page)
    } satisfies EmbedData;
}

function getMenu(roles: string[])
{
    return [{
        type: ComponentType.ActionRow,
        components: [{
            type: ComponentType.StringSelect,
            customId: "help $$ commandSelect",
            options: loader.commandHelp.getCommandNames(roles).map(command => ({
                label: command,
                description: loader.commandHelp.descriptions.get(command)?.slice(0, 100),
                value: command,
                emoji: config.builtinCommandsSettings?.helpPageMenuEmoji,
                default: false as boolean
            }))
        }]
    }] satisfies ActionRowData<MessageActionRowComponentData>[];
}

function getRoles(ctx: eds.InteractionContext | eds.SlashCommandContext)
{
    return ctx.interaction.member?.roles
        ? Array.isArray(ctx.interaction.member?.roles)
            ? ctx.interaction.member?.roles
            : ctx.interaction.member?.roles.cache.values()
                ? eds.arrayFromIterator(ctx.interaction.member?.roles.cache.values()).map(role => role.id)
                : []
                : [];
}