import type {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction
} from "discord.js";

export type SupportedInteractions =
    | ChatInputCommandInteraction
    | ButtonInteraction
    | AnySelectMenuInteraction
    | ModalSubmitInteraction
//