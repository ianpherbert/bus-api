import { Request, Response, NextFunction } from "express";

type TimestampedRequest = Request & { requestTime?: number };

export type HandlerType = (req: TimestampedRequest, res: Response, next: NextFunction) => void;

export type HandlerWithParamsType<T extends {}> = (req: Omit<TimestampedRequest, "params"> & { params: T }, res: Response, next: NextFunction) => void;

export type HandlerWithQueryType<T extends {}> = (req: Omit<TimestampedRequest, "query"> & { query: T & { limit?: string; exact?: string } }, res: Response, next: NextFunction) => void;

export type HandlerWithQueryAndParamsType<T extends {}, P extends {}> = (req: Omit<TimestampedRequest, "query" | "params"> & { query: T & { limit?: string; exact?: string }, params: P }, res: Response, next: NextFunction) => void;