import { Handler } from "../handlerType";

const includeTimestamp: Handler = (req, _, next) => {
    req.requestTime = Date.now();
    next();
}

export default includeTimestamp;