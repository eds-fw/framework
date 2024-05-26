export function deprecatedWarning(name: string, type: "Function" | "Class" | "Method")
{
    console.warn(`${type} \`${name}\` has been deprecated.`);
}