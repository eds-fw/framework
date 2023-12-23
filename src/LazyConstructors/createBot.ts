import { eds, runtimeStorage } from "..";

export function createBot(config: eds.ConfigExemplar): eds.KnownRuntimeProperties
{
    runtimeStorage.setProp("config",                config);
    runtimeStorage.setProp("client",                new eds.Client(config));
    runtimeStorage.setProp("componentManager",      new eds.ComponentManager);
    runtimeStorage.setProp("slashCommandsManager",  new eds.SlashCommandsManager);
    runtimeStorage.setProp("loader",                new eds.Loader(config.commandsPath, false, config.doNotLoadFilesStartsWith, config.includeBuiltinCommands));
    runtimeStorage.setProp("contextFactory",        new eds.ContextFactory);
    runtimeStorage.setProp("handler",               new eds.Handler);
    return runtimeStorage.getAll<eds.KnownRuntimeProperties>("config", "client", "componentManager", "loader", "contextFactory", "handler", "slashCommandsManager");
}