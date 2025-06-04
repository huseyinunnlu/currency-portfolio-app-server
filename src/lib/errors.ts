// Import error codes from the new file

type ErrorParams = {
    message: string;
    code: number;
};

// Define base application error
export class AppError extends Error {
    statusCode: number;
    code: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number, code: number) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true; // Indicates this is an expected operational error

        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific error types
export class BadRequestError extends AppError {
    constructor({ message, code = 400000 }: ErrorParams) {
        super(message, 400, code);
    }
}

export class UnauthorizedError extends AppError {
    constructor({ message, code = 401000 }: ErrorParams) {
        super(message, 401, code);
    }
}

export class ForbiddenError extends AppError {
    constructor({ message, code = 403000 }: ErrorParams) {
        super(message, 403, code);
    }
}

export class NotFoundError extends AppError {
    constructor({ message, code = 404000 }: ErrorParams) {
        super(message, 404, code);
    }
}

export class InternalServerError extends AppError {
    constructor({ message, code = 500000 }: ErrorParams) {
        super(message, 500, code);
    }
}

export class ConflictError extends AppError {
    constructor({ message, code = 409000 }: ErrorParams) {
        super(message, 409, code);
    }
}
