import {
    ChannelType,
    ChatInputCommandInteraction,
    InteractionType,
    Message
} from "discord.js";
import { eds, runtimeStorage } from "..";
import * as errors from "../errors";

const logTemplateText = (
    message: Message
) => `COMMAND '${message.content}'
    Author: (${message.author.id}) [${message.author.username}]
    Guild: (${message.guild?.id ?? "-"}) [${message.guild?.name ?? "DM"}] (own: ${message.guild?.ownerId ?? "-"})
    Channel: (${message.channel.id}) [${message.channel?.isTextBased() && !message.channel.isDMBased() ? message.channel?.name : "DM"}]`;

const logTemplateInteraction = (
    interaction: eds.SupportedInteractions
) => `INTERACT '${interaction.isChatInputCommand() ? interaction.commandName : interaction?.customId}'
    Author: (${interaction?.member?.user?.id}) [${interaction?.member?.user?.username}]
    Guild: (${interaction.guild?.id ?? "-"}) [${interaction.guild?.name ?? "DM"}] (own: ${interaction.guild?.ownerId ?? "-"})
    Channel: (${interaction.channel?.id}) [${interaction.channel?.isTextBased() && !interaction.channel.isDMBased() ? interaction.channel?.name : "DM"}]`;
//

interface _initMaps
{
    CallMap:        Map<string[], string>;
    AlwaysCallMap:  string[];
    HelpInfoMap:    Map<string[], eds.CommandHelpInfo>;
}

/**
 * Handles all messages and interactions. Automatically loads all commands. The heart of the bot and framework
 */
export class Handler
{
    private runtime;
    public constructor() {
        this.runtime = runtimeStorage.get<{
            config: eds.ConfigExemplar,
            logger: eds.Logger,
            loader: eds.Loader,
            client: eds.Client,
            contextFactory: eds.ContextFactory,
            componentManager: eds.ComponentManager
        }>("config", "logger", "loader", "client", "contextFactory");
        this.runtime.loader.loadBuiltin();
        this.runtime.loader.load();
        this._init({
            CallMap:        this.runtime.loader.getCallMap,
            AlwaysCallMap:  this.runtime.loader.getAlwaysCallMap,
            HelpInfoMap:    this.runtime.loader.getHelpInfoMap,
        });
    };

    private _init(maps: _initMaps): void
    {
        if (this.runtime.config.slashOnly !== true)
        this.runtime.client.on("messageCreate", async message => {

            if (message.channel.type === ChannelType.DM && this.runtime.config.guildOnly) return;
            if (message.author.bot && this.runtime.config.ignoreBots) return;
            let context = this.runtime.contextFactory.createTextContext(message);
            maps.AlwaysCallMap.forEach(path => require(path).run(context));
            if (this.runtime.config.prefix)
            {
                if (message.content.toLowerCase().startsWith(this.runtime.config.prefix))
                maps.CallMap.forEach(async (v, k) => {
                    if (this.runtime.config.prefix)
                    {
                        if (message.content.toLowerCase().startsWith(this.runtime.config.prefix))
                        if (k.includes(context.args[0]))
                        {
                            try {
                                let file: eds.CommandFile<false> = require(v);
                                file.run(context);
                                if (file.pragmaNoLog !== true)
                                    this.runtime.logger.log(logTemplateText(context.message), 'II');
                            } catch (err) {
                                return eds.reportError(errors.Handler.runCommandError(err), context);
                            }
                        }
                    }
                });
            }
        });

        this.runtime.client.on("interactionCreate", async interaction => {
            if (interaction.type === InteractionType.ApplicationCommand)
            {
                if (!(interaction instanceof ChatInputCommandInteraction))
                    return eds.reportError(errors.Handler.interactionTypeError(), null);
                let context = this.runtime.contextFactory.createSlashContext(interaction);
                this.runtime.loader.getSlashCallMap.forEach((v, k) => {
                    if (k === interaction.commandName)
                    {
                        let file: eds.CommandFile<true> = require(v);
                        file.run(context);
                        if (file.pragmaNoLog !== true)
                            this.runtime.logger.log(logTemplateInteraction(context.interaction), 'II');
                    }
                });
            }
            else if (interaction.type === InteractionType.MessageComponent)
            {
                if (interaction.isButton())
                {
                    this.runtime.componentManager.getButtonsMap.forEach(async (v, k) => {
                        if (k == interaction.customId)
                        {
                            await v.run(this.runtime.contextFactory.createInteractionContext(interaction), v.info);
                            if (v.info.noLog !== true)
                                this.runtime.logger.log(logTemplateInteraction(interaction), 'II');
                        }
                    });
                }
                else if (interaction.isAnySelectMenu())
                {
                    this.runtime.componentManager.getMenusMap.forEach(async (v, k) => {
                        if (k == interaction.customId)
                        {
                            if (interaction.isStringSelectMenu())
                            Object.keys(v.run).forEach(async val => {
                                if (interaction.values.includes(val))
                                {
                                    if (typeof v.run !== "object") return;
                                    await v.run[val](this.runtime.contextFactory.createInteractionContext(interaction), v.info);
                                    if (v.info.noLog !== true)
                                        this.runtime.logger.log(logTemplateInteraction(interaction), 'II');
                                }
                            });
                            else if (interaction.isUserSelectMenu())
                            {
                                if (typeof v.run !== "function") return;
                                await v.run(this.runtime.contextFactory.createInteractionContext(interaction), v.info);
                                if (v.info.noLog !== true)
                                    this.runtime.logger.log(logTemplateInteraction(interaction), 'II');
                            }
                        }
                    });
                }
            }
            else if (interaction.type === InteractionType.ModalSubmit)
            {
                this.runtime.componentManager.getModalsMap.forEach(async (v, k) => {
                    if (k == interaction.customId)
                    {
                        await v.run(this.runtime.contextFactory.createInteractionContext(interaction), interaction.fields, v.info);
                        if (v.info.noLog !== true)
                            this.runtime.logger.log(logTemplateInteraction(interaction), 'II');
                    }
                });
            }
        });
    }
}

export default Handler;