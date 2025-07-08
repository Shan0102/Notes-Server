function tryCatchWrapper<T extends any[], R>(
    fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
    return async function (...args: T): Promise<R> {
        try {
            return await fn(...args);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}]:Error occurred:`, error);
            if (error instanceof Error) {
                if (error.message.includes("too long")) {
                    throw new Error("Some of lines is too long");
                }
                throw new Error(error.message);
            }
            throw new Error("Database operation failed");
        }
    };
}

export { tryCatchWrapper };
