import { SelectMenuComponentOptionData } from "discord.js";

export function optionsWithDefaultValue(options: SelectMenuComponentOptionData[], defaultVal: string | null): SelectMenuComponentOptionData[]
{
    if (defaultVal === null) return options;
    let defaultIndex = options.map(it => it.value).indexOf(defaultVal);
    if (defaultIndex == -1) return options;
    const newOptions = [...options];
    const newDefault = {...newOptions[defaultIndex]};
    newDefault.default = true;
    newOptions[defaultIndex] = newDefault;
    return newOptions;
}
