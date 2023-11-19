import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { eds, runtimeStorage } from "..";

const config = runtimeStorage.getProp<eds.ConfigExemplar>("config");
const loader = runtimeStorage.getProp<eds.Loader>("loader");
const slashCommandsManager = runtimeStorage.getProp<eds.SlashCommandsManager>("slashCommandsManager");

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
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "command",
                description: config.builtinCommandsSettings?.helpCommandArgumentDescription ?? "Command name",
                required: false,
                choices: (await eds.arrayFromIterator<string>(loader.commandHelp.pages.keys())).map(elem => ({ name: elem, value: elem }))
            }]
        })
    },
    async run(ctx) {
        await ctx.interaction.deferReply({ ephemeral: true });

        async function showList()
        {
            await ctx.interaction.followUp({
                embeds: [{
                    title: config.builtinCommandsSettings?.helpListTitleText ?? "All bot commands:",
                    color: config.colors?.info ?? config.colors?.default,
                    footer: eds.getRandomFooterEmbed().data_api,
                    description: loader.commandHelp.commandList
                }]
            });
        }

        async function showPage(page: string)
        {
            await ctx.interaction.followUp({
                embeds: [{
                    title: config.builtinCommandsSettings?.helpPageTitleText ?? "Command help:",
                    color: config.colors?.info ?? config.colors?.default,
                    footer: eds.getRandomFooterEmbed().data_api,
                    description: loader.commandHelp.pages.get(page)
                }]
            });
        }

        if (ctx.interaction.options.getString("command") !== null
        && loader.commandHelp.pages.has(ctx.interaction.options.getString("command") as NonNullable<ReturnType<typeof ctx.interaction.options.getString>>))
            await showPage(ctx.interaction.options.getString("command") as NonNullable<ReturnType<typeof ctx.interaction.options.getString>>);
        else
            await showList();
        //
    },
    info: {
        name: config.builtinCommandsSettings?.helpCommandName ?? "help",
        slash: true,

        usage: "[command]",
        desc: config.builtinCommandsSettings?.helpCommandDescription ?? "Show a list of all bot commands",
        category: runtimeStorage.getProp<eds.ConfigExemplar>("config").builtinCommandsSettings?.helpCommandCategory ?? "General",
    }
} satisfies eds.CommandFile<true> & { __createCommand: () => Promise<void> };