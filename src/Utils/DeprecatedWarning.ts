export function deprecatedWarning(name: string, type: "Function" | "Class" | "Method")
{
    console.log(`${type} \`${name}\` has been deprecated.`);
}