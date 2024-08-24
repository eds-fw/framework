import { type eds, runtimeStorage, Client, ComponentManager, ContextFactory, Handler, Loader, SlashCommandsManager } from "../index.js";

export function createBot(config: eds.ConfigExemplar): eds.KnownRuntimeProperties
{
    runtimeStorage.set("config",                config);
    runtimeStorage.set("client",                new Client(config));
    runtimeStorage.set("componentManager",      new ComponentManager);
    runtimeStorage.set("slashCommandsManager",  new SlashCommandsManager);
    runtimeStorage.set("loader",                new Loader(config.commandsPath, false, config.doNotLoadFilesStartsWith, config.includeBuiltinCommands));
    runtimeStorage.set("contextFactory",        new ContextFactory);
    runtimeStorage.set("handler",               new Handler);
    return runtimeStorage.getAll<eds.KnownRuntimeProperties>("config", "client", "componentManager", "loader", "contextFactory", "handler", "slashCommandsManager");
}
