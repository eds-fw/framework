/**
 * Simple `Map`-like data storage
 */
export class Store extends Map
{
    public constructor()
    {
        super();
    }

    /**
     * Adds the specified data to the value of the specified key
     * ```ts
     * //db: { "key1": {prop1: "val1"} }
     * db.append("key1", {prop2: "val2"}); //assign object
     * //db: { "key1": {prop1:"val1",prop2:"val2"} }
     * ```
     * This works with objects, arrays, numbers and strings. Otherwise, simply sets the specified value without adding
     */
    public append(key: string, value: any): void
    {
        if (Array.isArray(value))
            this.set(key, (this.get(key) as any[]).concat(value));
        else if (typeof value === "object")
            Object.assign(this.get(key), value);
        else if (typeof value === "number" || typeof value === "string")
            this.set(key, this.get(key) + value);
        else this.set(key, value);
    }
}