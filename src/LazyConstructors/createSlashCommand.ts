import type { ApplicationCommandData } from "discord.js";
import { type eds, runtimeStorage } from "..";

export function createSlashCommand(options: ApplicationCommandData)
{
    let slashCommandsManager = runtimeStorage.getProp<eds.SlashCommandsManager>("slashCommandsManager");
    slashCommandsManager.create(options);
}