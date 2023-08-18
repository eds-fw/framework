import { eds } from "..";
import runtime from "../runtime";

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
    runtime.setProp("config",                 config);
    runtime.setProp("logger",                 new eds.Logger(config.logsPath, config.timeOffset));
    runtime.setProp("componentManager",       new eds.ComponentManager);
    runtime.setProp("loader",                 new eds.Loader(config.commandsPath, false));
    runtime.setProp("client",                 new eds.Client(config));
    runtime.setProp("contextFactory",         new eds.ContextFactory);
    runtime.setProp("slashCommandsManager",   new eds.SlashCommandsManager);
    runtime.setProp("handler",                new eds.Handler);
    return runtime.get<KnownRuntimeProperties>("config", "logger", "client", "componentManager", "loader", "contextFactory", "handler", "slashCommandsManager");
}