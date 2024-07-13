import type { APIGuildMember, APIInteractionGuildMember, APIUser, GuildMember, PartialGuildMember, PartialUser, User } from "discord.js";

export function getAvatar(user: 
    | User | GuildMember | PartialUser | PartialGuildMember | APIUser | APIGuildMember | APIInteractionGuildMember
    | undefined | null
): string {
    //@ts-expect-error
    return `https://cdn.discordapp.com/avatars/${user?.id ?? user?.user?.id}/${user?.avatar ?? user?.user?.avatar}.png`;
}
