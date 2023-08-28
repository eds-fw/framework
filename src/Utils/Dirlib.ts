import { readdirSync } from "fs";
import { opendir } from "fs/promises";
import { sep } from "path";

async function _isDir(path: string)
{
    let output: boolean = true;
    let dir;

    try {
        dir = await opendir(path);
    }
    catch (err: any) {
        if (err?.errno === -4052) output = false;
    }
    dir?.close();

    return output;
}

async function _normalize(path: string)
{
    if (await _isDir(path))
    {
        if (path.endsWith(sep))
        {
            return path;
        } else return path + sep;
    } else return path;
}

async function _expand(tar: string, i: number, buffer: string[], result: boolean[])
{
    if (await _isDir(tar))
    {
        buffer.splice(i, 1);
        for (const elem of readdirSync(tar))
            buffer.push(await _normalize(tar) + elem);
        result.push(true);
    }
    else {
        result.push(false);
    }
    return result;
}

export async function expandDirs(path: string): Promise<string[]>
{
    let buffer: string[]    = [];
    let result: boolean[]   = [];
    await _expand(path, 0, buffer, result);

    while (result.includes(true))
    {
        result = [];
        let i = 0;
        for (const tar of buffer)
        {
            result = await _expand(tar, i, buffer, result);
            i++;
        }
    };

    return buffer;
}

export default expandDirs;