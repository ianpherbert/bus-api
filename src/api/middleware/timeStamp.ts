import { HandlerType } from "../handlerType";

const includeTimestamp: HandlerType = (req, _, next) => {
    req.requestTime = Date.now();
    next();
}

export default includeTimestamp;