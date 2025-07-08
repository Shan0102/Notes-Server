function calcObjectMemory(object: unknown): number {
    const objectList = new Set<object>();
    const stack: unknown[] = [object];
    let bytes = 0;

    while (stack.length > 0) {
        const value = stack.pop();

        if (typeof value === "number") {
            bytes += 8;
        } else if (typeof value === "boolean") {
            bytes += 4;
        } else if (typeof value === "string") {
            bytes += value.length * 2;
        } else if (value instanceof Date) {
            bytes += 8;
        } else if (typeof value === "object" && value !== null) {
            if (objectList.has(value)) continue;
            objectList.add(value);

            const objValue = value as Record<string, unknown>;
            for (const key in objValue) {
                if (Object.prototype.hasOwnProperty.call(objValue, key)) {
                    bytes += key.length * 2;
                    stack.push(objValue[key]);
                }
            }
        }
    }

    return bytes;
}

export default calcObjectMemory;
