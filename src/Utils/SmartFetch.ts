import { wait } from "@eds-fw/utils";
import type { APIGuildMember, APIInteractionGuildMember, CachedManager, Guild, GuildBasedChannel, GuildChannelManager, GuildManager, GuildMember, GuildMemberManager, Message, MessageManager, Role, RoleManager, Snowflake, User, UserManager } from "discord.js";
import { AnyContext } from "../Types/Context";
const LIMIT_FETCHES = 5;
const LIMIT_COOLDOWN = 250; //ms

const USER_FETCH_COOLDOWNS_MAP: number[] = [];
const MEMBER_FETCH_COOLDOWNS_MAP: number[] = [];
const CHANNEL_FETCH_COOLDOWNS_MAP: number[] = [];
const GUILD_FETCH_COOLDOWNS_MAP: number[] = [];
const ROLE_FETCH_COOLDOWNS_MAP: number[] = [];
const MESSAGE_FETCH_COOLDOWNS_MAP: number[] = [];

export type SmartFetchObj<T> = Partial<CachedManager<Snowflake, T, unknown>> & {
    fetch: (id: Snowflake) => Promise<T | null>;
};

export async function CoreSmartFetch<O extends {}, T extends SmartFetchObj<O>>
    (manager: T | undefined, id: Snowflake | undefined, cooldowns_map?: number[]): Promise<O | undefined>
{
    const cached = manager?.cache?.get(id ?? "");
    if (cached) return cached;
    return await limitedAction(async () => (await manager?.fetch(id ?? "").catch(() => undefined)),
        LIMIT_FETCHES, LIMIT_COOLDOWN, cooldowns_map ?? []) ?? undefined;
}

export function sfUser(mng_or_ctx: AnyContext | UserManager | undefined, id: Snowflake | undefined): Promise<User | undefined>
{
    if (_isCtx(mng_or_ctx))
        return CoreSmartFetch(mng_or_ctx.client.users, id, USER_FETCH_COOLDOWNS_MAP);
    else return CoreSmartFetch(mng_or_ctx, id);
}

export function sfMember(mng_or_ctx: AnyContext | GuildMemberManager | undefined, id: Snowflake | undefined): Promise<GuildMember | undefined>
{
    if (_isCtx(mng_or_ctx))
        return CoreSmartFetch(mng_or_ctx.guild?.members, id, MEMBER_FETCH_COOLDOWNS_MAP);
    else return CoreSmartFetch(mng_or_ctx, id);
}

export function sfChannel(mng_or_ctx: AnyContext | GuildChannelManager | undefined, id: Snowflake | undefined): Promise<GuildBasedChannel | undefined>
{
    if (_isCtx(mng_or_ctx))
        return CoreSmartFetch(mng_or_ctx.guild?.channels, id, CHANNEL_FETCH_COOLDOWNS_MAP);
    else return CoreSmartFetch(mng_or_ctx, id);
}

export function sfGuild(mng_or_ctx: AnyContext | GuildManager | undefined, id: Snowflake | undefined): Promise<Guild | undefined>
{
    if (_isCtx(mng_or_ctx))
        return CoreSmartFetch(mng_or_ctx.client.guilds, id, GUILD_FETCH_COOLDOWNS_MAP);
    else return CoreSmartFetch(mng_or_ctx, id);
}

export function sfRole(mng_or_ctx: AnyContext | RoleManager | undefined, id: Snowflake | undefined): Promise<Role | undefined>
{
    if (_isCtx(mng_or_ctx))
        return CoreSmartFetch(mng_or_ctx.guild?.roles, id, ROLE_FETCH_COOLDOWNS_MAP);
    else return CoreSmartFetch(mng_or_ctx, id);
}

export function sfMessage(mng_or_ctx: AnyContext | MessageManager | undefined, id: Snowflake | undefined): Promise<Message | undefined>
{
    if (_isCtx(mng_or_ctx))
        return CoreSmartFetch(mng_or_ctx.channel?.messages, id, MESSAGE_FETCH_COOLDOWNS_MAP);
    else return CoreSmartFetch(mng_or_ctx, id);
}



export function hasRole(member: GuildMember | APIGuildMember | APIInteractionGuildMember): (id: string) => boolean
{
    return Array.isArray(member.roles)
        ? member.roles.includes.bind(member.roles)
        : member.roles.cache.has.bind(member.roles.cache);
}

export async function limitedAction<T>(action: () => T, limit: number, cooldown: number, cooldowns_map: number[]): Promise<T>
{
    const cooldown_result = _checkCooldown(limit, cooldown, cooldowns_map);
    if (!cooldown_result)
        await wait(cooldown);
    if (cooldown_result === _CanClear)
        _clearOriginal(cooldowns_map);
    cooldowns_map.push(Date.now());
    return await action();
}
const _CanClear = Symbol("_CanClear");
function _checkCooldown(limit: number, cooldown: number, cooldowns_map: number[]): boolean | typeof _CanClear
{
    const now = Date.now();
    let seria = 0;
    if (cooldowns_map.length <= limit)
        return true;
    if (now - cooldowns_map.at(-1)! > cooldown)
        return _CanClear;
    for (let i = cooldowns_map.length - 1, previous = now; i >= 0; i--)
    {
        const current = cooldowns_map[i];
        if (current - previous < cooldown)
            seria++;
        previous = current;
    }
    return seria <= limit;
}
function _clearOriginal(arr: unknown[])
{
    while (arr.length > 0)
        arr.pop();
}



function _isCtx(sth: unknown): sth is AnyContext
{
    return (sth != null && typeof sth == "object" && "__contextType" in sth && "universal" in sth);
}
