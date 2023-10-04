import type {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalMessageModalSubmitInteraction,
    ModalSubmitInteraction
} from "discord.js";

export type SupportedInteractions =
    | ChatInputCommandInteraction
    | ButtonInteraction
    | AnySelectMenuInteraction
    | ModalSubmitInteraction
    | ModalMessageModalSubmitInteraction
//