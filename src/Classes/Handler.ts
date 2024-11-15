import {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChannelType,
    ChatInputCommandInteraction,
    Interaction,
    InteractionType,
    Message,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction
} from "discord.js";
import { eds, runtimeStorage } from "../index.js";
import * as errors from "../errors.js";

interface _initMaps
{
    CallMap:        Map<string, eds.CommandExecutor>;
    AlwaysCallMap:  eds.CommandExecutor[];
    HelpInfoMap:    Map<string, eds.CommandHelpInfo>;
}

/**
 * Handles all messages and interactions. Automatically loads all commands. The heart of the bot and framework
 */
export class Handler
{
    private runtime;

    public constructor() {
        this.runtime = runtimeStorage.getAll<{
            config: eds.ConfigExemplar,
            loader: eds.Loader,
            client: eds.Client,
            contextFactory: eds.ContextFactory,
            componentManager: eds.ComponentManager
        }>("config", "loader", "client", "contextFactory");
        this.runtime.loader.loadBuiltin();
        this.runtime.loader.load().then(() => {
            this._init({
                CallMap:        this.runtime.loader.getCallMap,
                AlwaysCallMap:  this.runtime.loader.getAlwaysCallMap,
                HelpInfoMap:    this.runtime.loader.getHelpInfoMap,
            });
        })
    }

    private _init(maps: _initMaps): void
    {
        if (!this.runtime.config.slashOnly)
        this.runtime.client.on("messageCreate", async message => {
            if (message.channel.type == ChannelType.DM && this.runtime.config.guildOnly) return;
            if (message.author.bot && this.runtime.config.ignoreBots) return;
            this._handleMessage(message, maps);
        });

        this.runtime.client.on("interactionCreate", async interaction => {
            if (interaction.type == InteractionType.ApplicationCommand)
                this._handleInteractionCommand(interaction, maps);
            else if (interaction.type == InteractionType.MessageComponent)
            {
                if (interaction.isButton())
                    this._handleInteractionButton(interaction);
                else if (interaction.isAnySelectMenu())
                    this._handleInteractionMenu(interaction);
            }
            else if (interaction.type == InteractionType.ModalSubmit)
                this._handleInteractionModal(interaction);
        });
    }

    private _checkAccess(ctx: eds.AnyContext, roles: string[] | undefined)
    {
        if (!roles || roles.length == 0) return true;
        if (!ctx.member) return false;

        let result = false;
        for (const role of roles)
            if (eds.hasRole(ctx.member)(role))
                result = true;
        return result;
    }

    private _handleMessage(message: Message, maps: _initMaps)
    {
        const context = this.runtime.contextFactory.createTextContext(message);
        maps.AlwaysCallMap.forEach(executor => executor(context).catch(console.error));
        if (this.runtime.config.prefix)
        {
            if (message.content.toLowerCase().startsWith(this.runtime.config.prefix))
            maps.CallMap.forEach(async (executor, cmdName) => {
                if (this.runtime.config.prefix)
                {
                    const cmdInfo = maps.HelpInfoMap.get(cmdName);
                    if (!cmdInfo) return;
                    if (message.content.toLowerCase().startsWith(this.runtime.config.prefix))
                    if (cmdName == context.commandName)
                    {
                        try {
                            if (!cmdInfo.noCheckAccess && !this._checkAccess(context, cmdInfo.allowedRoles))
                                return this.runtime.config.noAccess?.(context);

                            executor(context)?.catch(console.error);

                            if (!cmdInfo.noLog)
                                this.runtime.config.logTextCommand?.(context);
                        } catch (err) {
                            return errors.Handler.runCommandError(err);
                        }
                    }
                }
            });
        }
    }

    private _handleInteractionCommand(interaction: Interaction, maps: _initMaps)
    {
        if (!(interaction instanceof ChatInputCommandInteraction)) return;
        const context = this.runtime.contextFactory.createSlashContext(interaction);
        this.runtime.loader.getSlashCallMap.forEach((executor, cmdName) => {
            if (cmdName == interaction.commandName)
            {
                const cmdInfo = maps.HelpInfoMap.get(cmdName);
                if (!cmdInfo) return;
                if (!cmdInfo.noCheckAccess && !this._checkAccess(context, cmdInfo.allowedRoles))
                    return this.runtime.config.noAccess?.(context);

                executor(context)?.catch(console.error);

                if (!cmdInfo.noLog)
                    this.runtime.config.logSlashCommand?.(context);
            }
        });
    }

    private _handleInteractionButton(interaction: ButtonInteraction)
    {
        this.runtime.componentManager.getButtonsMap.forEach(async (btnData, btnName) => {
            if (btnName == interaction.customId)
            {
                const btnInfo = btnData.info;
                const executor = btnData.run;
                const context = this.runtime.contextFactory.createInteractionContext(interaction);
                if (!btnInfo.noCheckAccess && !this._checkAccess(context, btnInfo.allowedRoles))
                    return this.runtime.config.noAccess?.(context);
                
                executor(context, btnInfo)?.catch(console.error);

                if (!btnInfo.noLog)
                    this.runtime.config.logInteraction?.(context);
            }
        });
    }

    private _handleInteractionMenu(interaction: AnySelectMenuInteraction)
    {
        this.runtime.componentManager.getMenusMap.forEach(async (menuData, menuName) => {
            const menuInfo = menuData.info;
            const executor = menuData.run;
            if (menuName != interaction.customId) return;
            const context = this.runtime.contextFactory.createInteractionContext(interaction);
            menuInfo.onSelect?.(context, menuInfo);

            if (interaction.isStringSelectMenu())
                return void Object.keys(executor).forEach(async val => {
                    if (interaction.values.includes(val))
                    {
                        if (typeof executor != "object") return;
                        if (!menuInfo.noCheckAccess && !this._checkAccess(context, menuInfo.allowedRoles))
                            return this.runtime.config.noAccess?.(context);
                        executor[val](context as eds.InteractionContext<StringSelectMenuInteraction>, menuInfo)
                            ?.catch(console.error);
                        if (!menuInfo.noLog)
                            this.runtime.config.logInteraction?.(context);
                    }
                });
            if (interaction.isUserSelectMenu() && menuInfo.type != "user") return;
            if (interaction.isChannelSelectMenu() && menuInfo.type != "channel") return;
            if (interaction.isMentionableSelectMenu() && menuInfo.type != "mentionable") return;
            if (interaction.isRoleSelectMenu() && menuInfo.type != "role") return;
            
            if (typeof executor != "function") return;
            if (!menuInfo.noCheckAccess && !this._checkAccess(context, menuInfo.allowedRoles))
                return this.runtime.config.noAccess?.(context);

            executor(context as any, menuInfo)?.catch(console.error);
            if (!menuInfo.noLog)
                this.runtime.config.logInteraction?.(context);
        });
    }

    private _handleInteractionModal(interaction: ModalSubmitInteraction)
    {
        this.runtime.componentManager.getModalsMap.forEach(async (modalData, modalName) => {
            const modalInfo = modalData.info;
            const executor = modalData.run;
            if (modalName == interaction.customId)
            {
                const context = this.runtime.contextFactory.createInteractionContext(interaction);
                if (!modalInfo.noCheckAccess && !this._checkAccess(context, modalInfo.allowedRoles))
                    return this.runtime.config.noAccess?.(context);

                executor(context, interaction.fields, modalInfo);
                if (!modalInfo.noLog)
                    this.runtime.config.logInteraction?.(context);
            }
        });
    }

    private _handleMessageContextMenu(interaction: MessageContextMenuCommandInteraction)
    {
        //Future
    }
}

export default Handler;