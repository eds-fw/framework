import type { eds } from "..";
import runtimeStorage from "../runtime";

export function startBot()
{
    let runtime = runtimeStorage.get<{
        slashCommandsManager: eds.SlashCommandsManager,
        client: eds.Client
    }>();
    runtime.client.init();
    runtime.client.addListener("ready", () => runtime.slashCommandsManager.save());
}