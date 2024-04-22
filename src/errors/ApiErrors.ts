/**
 * Represents common error codes for database operations.
 */
type ErrorCode = 400 | 401 | 402 | 403 | 404 | 500 | 501;

export class ApiError extends Error {
    message: string;
    errorCode: ErrorCode;
    constructor(message: string, errorCode: ErrorCode) {
        super();
        this.message = message;
        this.errorCode = errorCode;
    }
}

export class MissingArgumentError<T> extends ApiError {
    providedArgument: T;
    methodArgument: T;
    constructor(message: string, providedArgument: T, methodArgument: T) {
        super(message, 400);
        this.providedArgument = providedArgument;
        this.methodArgument = methodArgument;
    }
}

export class TypeMismatchError<T> extends ApiError {
    key: keyof T;
    providedType: string;
    valueType: string;
    constructor(message: string, key: keyof T, providedType: string, valueType: string) {
        super(message, 400);
        this.key = key;
        this.providedType = providedType;
        this.valueType = valueType;
    }
}