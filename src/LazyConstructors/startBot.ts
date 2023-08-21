import { type eds, runtimeStorage } from "..";

export async function startBot()
{
    const { __createCommand } = await import("../BuiltinCommands/help");
    let runtime = runtimeStorage.get<{
        slashCommandsManager: eds.SlashCommandsManager,
        client: eds.Client,
        config: eds.ConfigExemplar
    }>("slashCommandsManager", "client", "config");
    
    await __createCommand();
    runtime.client.init();
    runtime.client.addListener("ready", () => runtime.slashCommandsManager.save());
    runtime.client.onReady((client) => runtime.config.onReady?.(client))
}