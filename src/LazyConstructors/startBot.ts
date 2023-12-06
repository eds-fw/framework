import { type eds, runtimeStorage } from "..";

export async function startBot(): Promise<void>
{
    let runtime = runtimeStorage.getAll<{
        slashCommandsManager: eds.SlashCommandsManager,
        client: eds.Client,
        config: eds.ConfigExemplar
    }>("slashCommandsManager", "client", "config");
    
    runtime.client.init();
    runtime.client.once("ready", () => {
        runtime.slashCommandsManager.save();
    });
    runtime.client.once("ready", (client) => runtime.config.onReady?.(client))
}