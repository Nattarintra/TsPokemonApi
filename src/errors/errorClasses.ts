export class AppError extends Error {
    readonly type: "HTTP_ERROR" | "NETWORK_ERROR";
    readonly status?: number;

    constructor(type: "HTTP_ERROR" | "NETWORK_ERROR", message: string, status?: number) {
        super(message);
        this.type = type;
        this.status = status;
    }
}