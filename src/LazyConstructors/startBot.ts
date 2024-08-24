import { type eds, runtimeStorage } from "../index.js";

export async function startBot(): Promise<void>
{
    const runtime = runtimeStorage.getAll<{
        slashCommandsManager: eds.SlashCommandsManager,
        client: eds.Client,
        config: eds.ConfigExemplar
    }>("slashCommandsManager", "client", "config");
    
    runtime.client.init();
    runtime.client.once("ready", () => {
        runtime.slashCommandsManager.save();
    });
}