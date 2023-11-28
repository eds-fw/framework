export * as all from ".";
export * as eds from ".";
import { all as __this } from ".";

export * from "./runtimeStorage";

export * from "./Classes/AutoCommandHelp";
export * from "./Classes/Client";
export * from "./Classes/ComponentManager";
export * from "./Classes/ContextFactory";
export * from "./Classes/Database";
export * from "./Classes/Handler";
export * from "./Classes/Loader";
export * from "./Classes/Logger";
export * from "./Classes/SlashCommandsManager";

export * from "./LazyConstructors/createBot";
export * from "./LazyConstructors/createComponent";
export * from "./LazyConstructors/createDB";
export * from "./LazyConstructors/createSlashCommand";
export * from "./LazyConstructors/startBot";

export * from "./Types/Command/CommandContext";
export * from "./Types/Command/CommandFile";
export * from "./Types/Command/CommandHelpInfo";
export * from "./Types/Command/CommandInfo";
export * from "./Types/Config";
export * from "./Types/SupportedInteractions";

export * from "./Utils/Dirlib";
export * from "./Utils/EmbedTemplates";
export * from "./Utils/ErrorLogger";
export * from "./Utils/RandomEmbedFooter";

//other eds packages
export * from "@easy-ds-bot/utils";
export * from "@easy-ds-bot/timeparser";

export default __this;