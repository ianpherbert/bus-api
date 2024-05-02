"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbMultipleError = exports.DbNotFoundError = exports.DbError = void 0;
/**
 * Custom error class for database-related errors.
 */
class DbError extends Error {
    /**
     * Constructs a new DbError instance.
     * @param message - The error message
     * @param code - The error code (default: 500)
     */
    constructor(message, code = 500) {
        super();
        this.message = message;
        this.code = code;
    }
}
exports.DbError = DbError;
/**
 * Custom error class for database not found errors.
 */
class DbNotFoundError extends DbError {
    /**
     * Constructs a new DbNotFoundError instance.
     * @param message - The error message
     * @param code - The error code
     */
    constructor(message, code) {
        super(message, code);
    }
}
exports.DbNotFoundError = DbNotFoundError;
/**
 * Custom error class for multiple database errors.
 */
class DbMultipleError extends DbError {
    /**
     * Constructs a new DbMultipleError instance.
     * @param message - The error message
     */
    constructor(message) {
        super(message, 500);
    }
}
exports.DbMultipleError = DbMultipleError;
