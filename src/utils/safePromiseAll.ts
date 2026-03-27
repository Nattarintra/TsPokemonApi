type SafePromiseOptions = {
    stopOnError?: boolean;
};
export const safePromiseAll = async <T>(
    promises: Promise<T>[],
    options?: SafePromiseOptions
): Promise<{
    success: T[];
    failed: number;
    errors: unknown[];
}> => {
    const settled = await Promise.allSettled(promises);

    const success: T[] = [];
    const errors: unknown[] = [];

    for (const result of settled) {
        if (result.status === "fulfilled") {
            success.push(result.value);
        } else {
            errors.push(result.reason);

            if (options?.stopOnError) {
                break;
            }
        }
    }

    return {
        success,
        failed: errors.length,
        errors,
    };
};