import { ApplicationCommandData } from "discord.js";
import equal from "fast-deep-equal";
import type { eds } from "..";
import runtime from "../runtime";
import { eds_errors } from "../errors";

/**
 * Creates a slash command when starting the bot.
 */
export class SlashCommandsManager
{
    private _commands: {[key: string]: ApplicationCommandData} & Object = {};
    private runtime;
    public constructor() {
        this.runtime = {
            client: runtime.getProp<eds.Client>("client")
        };
    };

    /**
     * Creates a slash command.
     * 
     * If the specified slash command already exists, the function is ignored.
     */
    public create(options: ApplicationCommandData)
    {
        if (equal(this._commands[options.name], options)) return;
        this._commands[options.name] = options;
    }

    /**
     * Saves slash commands data.
     * 
     * **Must be called after slash commands are created.**
     */
    public save()
    {
        if (!this.runtime.client.application)
            throw new Error(eds_errors.SlashCommandsManager.clientNotReady());
        this.runtime.client.application.commands.set(Object.values(this._commands));
    }
}