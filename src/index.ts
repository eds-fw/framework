export * as djs from "discord.js";
export * as eds from ".";

import { eds as __this } from ".";

export * from "./runtimeStorage";

export * from "./Classes/AutoCommandHelp";
export * from "./Classes/Client";
export * from "./Classes/ComponentManager";
export * from "./Classes/ContextFactory";
export * from "./Classes/Handler";
export * from "./Classes/Loader";
export * from "./Classes/SlashCommandsManager";

export * from "./LazyConstructors/createBot";
export * from "./LazyConstructors/createComponent";
export * from "./LazyConstructors/createDB";
export * from "./LazyConstructors/createSlashCommand";
export * from "./LazyConstructors/startBot";

export * from "./Types/Command";
export * from "./Types/Config";
export * from "./Types/SupportedInteractions";

export * from "./Utils/Dirlib";
export * from "./Utils/EmbedTemplates";
export * from "./Utils/RandomEmbedFooter";
export * from "./Utils/SmartFetch";

//other eds packages
export * from "@eds-fw/utils";
export * from "@eds-fw/timeparser";
export * from "@eds-fw/storage";

export default __this;