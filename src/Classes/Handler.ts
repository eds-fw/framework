import {
    ChannelType,
    ChatInputCommandInteraction,
    InteractionType
} from "discord.js";
import { AnyContext, eds, runtimeStorage } from "..";
import * as errors from "../errors";

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
        if (this.runtime.config.slashOnly !== true)
        this.runtime.client.on("messageCreate", async message => {

            if (message.channel.type === ChannelType.DM && this.runtime.config.guildOnly) return;
            if (message.author.bot && this.runtime.config.ignoreBots) return;
            const context = this.runtime.contextFactory.createTextContext(message);
            maps.AlwaysCallMap.forEach(path => require(path).default?.run(context) || require(path).run(context));
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
                                const file: eds.CommandFile<false> = require(v).default || require(v);
                                if (file.info.noCheckAccess !== true && !this._checkAccess(context, file.info.allowedRoles)) return this.runtime.config.noAccess?.(context);

                                file.run(context)?.catch(console.log);
                                if (file.pragmaNoLog !== true)
                                    this.runtime.config.logTextCommand?.(context);
                            } catch (err) {
                                return console.error(errors.Handler.runCommandError(err));
                            }
                        }
                    }
                });
            }
        });

        this.runtime.client.on("interactionCreate", async interaction => {
            if (interaction.type === InteractionType.ApplicationCommand)
            {
                if (!(interaction instanceof ChatInputCommandInteraction)) return;
                const context = this.runtime.contextFactory.createSlashContext(interaction);
                this.runtime.loader.getSlashCallMap.forEach((v, k) => {
                    if (k === interaction.commandName)
                    {
                        const file: eds.CommandFile<true> = require(v).default || require(v);
                        if (file.info.noCheckAccess !== true && !this._checkAccess(context, file.info.allowedRoles)) return this.runtime.config.noAccess?.(context);

                        file.run(context)?.catch(console.log);
                        if (file.pragmaNoLog !== true)
                            this.runtime.config.logSlashCommand?.(context);
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
                            const context = this.runtime.contextFactory.createInteractionContext(interaction);
                            if (v.info.noCheckAccess !== true && !this._checkAccess(context, v.info.allowedRoles)) return this.runtime.config.noAccess?.(context);
                            
                            v.run(context, v.info)?.catch(console.log);

                            if (v.info.noLog !== true)
                                this.runtime.config.logInteraction?.(context);
                        }
                    });
                }
                else if (interaction.isAnySelectMenu())
                {
                    this.runtime.componentManager.getMenusMap.forEach(async (v, k) => {
                        if (k == interaction.customId)
                        {
                            v.info.onSelect?.(this.runtime.contextFactory.createInteractionContext(interaction), v.info);
                            if (interaction.isStringSelectMenu())
                            Object.keys(v.run).forEach(async val => {
                                if (interaction.values.includes(val))
                                {
                                    if (typeof v.run !== "object") return;
                                    const context = this.runtime.contextFactory.createInteractionContext(interaction);
                                    if (v.info.noCheckAccess !== true && !this._checkAccess(context, v.info.allowedRoles)) return this.runtime.config.noAccess?.(context);

                                    v.run[val](context, v.info)?.catch(console.log);
                                    if (v.info.noLog !== true)
                                        this.runtime.config.logInteraction?.(context);
                                }
                            });
                            else if (interaction.isUserSelectMenu())
                            {
                                if (typeof v.run !== "function") return;
                                if (!v.info.userSelect) return;
                                else v.run = v.run as eds.ComponentManager.MenuUserCode;

                                const context = this.runtime.contextFactory.createInteractionContext(interaction);
                                if (v.info.noCheckAccess !== true && !this._checkAccess(context, v.info.allowedRoles)) return this.runtime.config.noAccess?.(context);

                                if (v.info.userSelect)
                                    v.run(context, v.info)?.catch(console.log);
                                if (v.info.noLog !== true)
                                    this.runtime.config.logInteraction?.(context);
                            }
                            else if (interaction.isChannelSelectMenu())
                            {
                                if (typeof v.run !== "function") return;
                                if (!v.info.channelSelect) return;
                                else v.run = v.run as eds.ComponentManager.MenuChannelCode;

                                const context = this.runtime.contextFactory.createInteractionContext(interaction);
                                if (v.info.noCheckAccess !== true && !this._checkAccess(context, v.info.allowedRoles)) return this.runtime.config.noAccess?.(context);

                                if (v.info.channelSelect)
                                    v.run(context, v.info)?.catch(console.log);
                                if (v.info.noLog !== true)
                                    this.runtime.config.logInteraction?.(context);
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
                        const context = this.runtime.contextFactory.createInteractionContext(interaction);
                        if (v.info.noCheckAccess !== true && !this._checkAccess(context, v.info.allowedRoles)) return this.runtime.config.noAccess?.(context);

                        v.run(context, interaction.fields, v.info);
                        if (v.info.noLog !== true)
                            this.runtime.config.logInteraction?.(context);
                    }
                });
            }
        });
    }

    private _checkAccess(ctx: AnyContext, roles: string[] | undefined)
    {
        if (!roles || roles.length == 0) return true;

        let has;
        if (ctx.__contextType === "text")
            has = ctx.message.member?.roles.cache.has.bind(ctx.message.member?.roles.cache);
        else if (Array.isArray(ctx.interaction.member?.roles))
            has = ctx.interaction.member?.roles.includes.bind(ctx.interaction.member?.roles);
        else
            has = ctx.interaction.member?.roles.cache.has.bind(ctx.interaction.member?.roles.cache);
        if (!has) throw new Error("checkThisAccess: не удалось забиндить метод has");

        let result = false;
        for (const role of roles)
            if (has(role)) result = true;
        return result;
    }
}

export default Handler;