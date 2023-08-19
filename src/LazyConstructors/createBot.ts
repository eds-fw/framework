import { eds, runtimeStorage } from "..";

type KnownRuntimeProperties = {
    config:                 eds.ConfigExemplar,
    logger:                 eds.Logger,
    client:                 eds.Client,
    componentManager:       eds.ComponentManager,
    loader:                 eds.Loader,
    contextFactory:         eds.ContextFactory,
    handler:                eds.Handler,
    slashCommandsManager:   eds.SlashCommandsManager
};

export function createBot(config: eds.ConfigExemplar): KnownRuntimeProperties
{
    runtimeStorage.setProp("config",                 config);
    runtimeStorage.setProp("logger",                 new eds.Logger(config.logsPath, config.timeOffset));
    runtimeStorage.setProp("client",                 new eds.Client(config));
    runtimeStorage.setProp("componentManager",       new eds.ComponentManager);
    runtimeStorage.setProp("slashCommandsManager",   new eds.SlashCommandsManager);
    runtimeStorage.setProp("loader",                 new eds.Loader(config.commandsPath, false, config.doNotLoadFilesStartsWith, config.includeBuiltinCommands));
    runtimeStorage.setProp("contextFactory",         new eds.ContextFactory);
    runtimeStorage.setProp("handler",                new eds.Handler);
    return runtimeStorage.get<KnownRuntimeProperties>("config", "logger", "client", "componentManager", "loader", "contextFactory", "handler", "slashCommandsManager");
}