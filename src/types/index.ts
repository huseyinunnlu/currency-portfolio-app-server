export interface CurrencyKeysWithSocketIdTypes {
    id: string;
    socketIds: string[];
}

export interface ApiSuccessResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    errorCode: number;
}
