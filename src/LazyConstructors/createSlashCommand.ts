import type { ApplicationCommandData } from "discord.js";
import { runtimeStorage } from "../index.js";

export function createSlashCommand(options: ApplicationCommandData): void
{
    const slashCommandsManager = runtimeStorage.slashCommandsManager;
    slashCommandsManager.create(options);
}