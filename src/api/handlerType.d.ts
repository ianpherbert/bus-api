import { Request, Response, NextFunction } from "express";

/**
 * Represents a request with an optional timestamp.
 * @property [requestTime] - The timestamp when the request was received.
 */
type TimestampedRequest = Request & { requestTime?: number };

/**
 * Represents a generic handler type for Express routes.
 * @callback HandlerType
 * @param req - The HTTP request object enhanced with a possible timestamp.
 * @param res - The HTTP response object.
 * @param next - The callback to trigger the next middleware.
 */
export type HandlerType = (req: TimestampedRequest, res: Response, next: NextFunction) => void;

/**
 * Represents a handler that expects URL parameters.
 * @template T The type of the expected parameters.
 * @callback HandlerWithParamsType
 * @param {Omit<TimestampedRequest, "params"> & { params: T }} req - The HTTP request object containing the specified parameters.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The middleware next function.
 */
export type HandlerWithParamsType<T extends {}> = (req: Omit<TimestampedRequest, "params"> & { params: T }, res: Response, next: NextFunction) => void;

/**
 * Represents a handler that expects query parameters.
 * @template T The type of the expected query parameters.
 * @callback HandlerWithQueryType
 * @param {Omit<TimestampedRequest, "query"> & { query: T & { exact?: string }}} req - The HTTP request object containing the specified query parameters, optionally exact.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The middleware next function.
 */
export type HandlerWithQueryType<T extends {}> = (req: Omit<TimestampedRequest, "query"> & { query: T & { exact?: string } }, res: Response, next: NextFunction) => void;

/**
 * Represents a handler that expects both URL and query parameters.
 * @template T The type of the expected query parameters.
 * @template P The type of the expected URL parameters.
 * @callback HandlerWithQueryAndParamsType
 * @param {Omit<TimestampedRequest, "query" | "params"> & { query: T & { exact?: string }, params: P }} req - The HTTP request object containing the specified query and URL parameters.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The middleware next function.
 */
export type HandlerWithQueryAndParamsType<T extends {}, P extends {}> = (req: Omit<TimestampedRequest, "query" | "params"> & { query: T & { exact?: string }, params: P }, res: Response, next: NextFunction) => void;
