import type {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    ModalMessageModalSubmitInteraction,
    ModalSubmitInteraction,
    UserContextMenuCommandInteraction
} from "discord.js";

export type SupportedInteractions =
    | ChatInputCommandInteraction
    | ModalSubmitInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction

export type MessageComponentInteraction =
    | ButtonInteraction
    | AnySelectMenuInteraction
    | ModalMessageModalSubmitInteraction
    //| MessageContextMenuCommandInteraction
