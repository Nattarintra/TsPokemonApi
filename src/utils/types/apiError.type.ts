
export type ApiError =
    | {
        type: "HTTP_ERROR";
        status: number;
        statusText: string;
        message: string;
    }
    | {
        type: "NETWORK_ERROR";
        message: string;
    }
    | {
        type: "PARTIAL_ERROR";
        message: string;
        failed: number;
    };

export type PartialError = {
    type: "PARTIAL_ERROR";
    message: string;
    failed: number;
};