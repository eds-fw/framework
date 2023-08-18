import type { ApplicationCommandData } from "discord.js";
import type { eds } from "..";
import runtime from "../runtime";

export function createSlashCommand(options: ApplicationCommandData)
{
    let slashCommandsManager = runtime.getProp<eds.SlashCommandsManager>("slashCommandsManager");
    slashCommandsManager.create(options);
}