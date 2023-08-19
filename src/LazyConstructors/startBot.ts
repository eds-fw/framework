import { type eds, runtimeStorage } from "..";

export async function startBot()
{
    const { __createCommand } = await import("../BuiltinCommands/help");
    let runtime = runtimeStorage.get<{
        slashCommandsManager: eds.SlashCommandsManager,
        client: eds.Client
    }>("slashCommandsManager", "client");
    
    await __createCommand();
    runtime.client.init();
    runtime.client.addListener("ready", () => runtime.slashCommandsManager.save());
}