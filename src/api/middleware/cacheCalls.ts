import { middleware as cache } from "apicache";
import { env } from "../../variables";
import { NextFunction, Request, Response } from "express";
import { Handler } from "../handlerType";

const cacheCalls: Handler = env === "local" ? (_: Request, _1: Response, next: NextFunction) => next() : cache("10 minutes")

export default cacheCalls;
