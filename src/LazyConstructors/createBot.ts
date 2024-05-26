import { eds, runtimeStorage } from "..";

export function createBot(config: eds.ConfigExemplar): eds.KnownRuntimeProperties
{
    runtimeStorage.set("config",                config);
    runtimeStorage.set("client",                new eds.Client(config));
    runtimeStorage.set("componentManager",      new eds.ComponentManager);
    runtimeStorage.set("slashCommandsManager",  new eds.SlashCommandsManager);
    runtimeStorage.set("loader",                new eds.Loader(config.commandsPath, false, config.doNotLoadFilesStartsWith, config.includeBuiltinCommands));
    runtimeStorage.set("contextFactory",        new eds.ContextFactory);
    runtimeStorage.set("handler",               new eds.Handler);
    return runtimeStorage.getAll<eds.KnownRuntimeProperties>("config", "client", "componentManager", "loader", "contextFactory", "handler", "slashCommandsManager");
}