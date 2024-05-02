"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeMismatchError = exports.MissingArgumentError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, errorCode) {
        super();
        this.message = message;
        this.errorCode = errorCode;
    }
}
exports.ApiError = ApiError;
class MissingArgumentError extends ApiError {
    constructor(message, providedArgument, methodArgument) {
        super(message, 400);
        this.providedArgument = providedArgument;
        this.methodArgument = methodArgument;
    }
}
exports.MissingArgumentError = MissingArgumentError;
class TypeMismatchError extends ApiError {
    constructor(message, key, providedType, valueType) {
        super(message, 400);
        this.key = key;
        this.providedType = providedType;
        this.valueType = valueType;
    }
}
exports.TypeMismatchError = TypeMismatchError;
