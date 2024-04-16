import { DbController } from "../../database/DBcontroller";
import { Stop } from "../../database/types";
import { DbError } from "../../errors/DbErrors";
import { HandlerWithParamsType, HandlerWithQueryType } from "../handlerType";
import { QueryResponseType } from "../responseType";

enum SearchStopType {
    NAME = "name",
    COORDINATES = "coordinates",
}

const stopController = new DbController("flixbus")


const typeColumnMapping: { [key in SearchStopType]: keyof Stop } = {
    [SearchStopType.NAME]: "stop_name",
    [SearchStopType.COORDINATES]: "stop_lat"
}

const typeNames = Object.keys(typeColumnMapping).reduce((a, b) => a + ", " + b)

export const searchStop: HandlerWithQueryType<{ queryString: string, queryType: SearchStopType }> = async ({ query, requestTime }, res) => {
    const { queryString, queryType, limit, exact } = query;
    if (!queryString || !queryType) {
        res.status(400).json({ message: "queryString and queryType are obligatory" })
        return;
    }

    const column = typeColumnMapping[queryType];
    if (!column) {
        res.status(400).json({ message: "queryType must be of type: " + typeNames })
    }
    try {
        const data = await stopController.getEntries(column, queryString, "stops", { limit, exact });
        res.status(200).json(new QueryResponseType<Stop>(data, query, requestTime))
    } catch (e) {
        const error = e as DbError;
        res.status(error.code ?? 500).json({ message: e })
    }
}


export const getStop: HandlerWithParamsType<{ stopId: string }> = async ({ params, requestTime }, res) => {
    try {
        const data = await stopController.getOneById<Stop>("stop_id", params.stopId, "stops");
        res.status(200).json(new QueryResponseType<Stop>([data], params, requestTime));
    } catch (e) {
        const error = e as DbError;
        res.status(error.code ?? 500).json({ message: e })
    }

} 