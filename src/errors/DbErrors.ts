type ErrorCode = 400 | 401 | 402 | 403 | 404 | 500 | 501;

export class DbError extends Error {
    code: ErrorCode;
    constructor(message: string, code: ErrorCode = 500) {
        super();
        this.message = message;
        this.code = code;
    }
}

export class DbNotFoundError extends DbError {
    constructor(message: string, code: ErrorCode) {
        super(message, code);

    }
}

export class DbMultipleError extends DbError {

    constructor(message: string) {
        super(message, 500);
    }
}