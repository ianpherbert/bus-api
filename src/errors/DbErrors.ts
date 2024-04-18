/**
 * Represents common error codes for database operations.
 */
type ErrorCode = 400 | 401 | 402 | 403 | 404 | 500 | 501;

/**
 * Custom error class for database-related errors.
 */
export class DbError extends Error {
    code: ErrorCode; // The error code associated with the error
    /**
     * Constructs a new DbError instance.
     * @param message - The error message
     * @param code - The error code (default: 500)
     */
    constructor(message: string, code: ErrorCode = 500) {
        super();
        this.message = message;
        this.code = code;
    }
}

/**
 * Custom error class for database not found errors.
 */
export class DbNotFoundError extends DbError {
    /**
     * Constructs a new DbNotFoundError instance.
     * @param message - The error message
     * @param code - The error code
     */
    constructor(message: string, code: ErrorCode) {
        super(message, code);
    }
}

/**
 * Custom error class for multiple database errors.
 */
export class DbMultipleError extends DbError {
    /**
     * Constructs a new DbMultipleError instance.
     * @param message - The error message
     */
    constructor(message: string) {
        super(message, 500);
    }
}