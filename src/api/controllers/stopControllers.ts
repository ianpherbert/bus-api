import { Stop } from "../../database/types";
import { DbError } from "../../errors/DbErrors";
import { dbToApi } from "../../utils.ts/mappingUtils";
import { normaliseStringToArray } from "../../utils.ts/stringUtils";
import { Company, companies, companyArray } from "../companies";
import { HandlerWithParamsType, HandlerWithQueryType } from "../handlerType";
import { QueryResponseType } from "../responseType";
import { ApiStop } from "../types";

/**
 * Enum for search stop query types.
 */
enum SearchStopQueryType {
    NAME = "name",
    COORDINATES = "coordinates",
}

/**
 * Mapping from query type to database column.
 */
const typeColumnMapping: { [key in SearchStopQueryType]: keyof Stop } = {
    [SearchStopQueryType.NAME]: "stop_name",
    [SearchStopQueryType.COORDINATES]: "stop_lat"
}

const typeNames = Object.keys(typeColumnMapping).reduce((a, b) => a + ", " + b);
/**
 * Searches for stops based on a query.
 * @param context - The query context including the query, query type, and optional company filter.
 * @param res - The response object to send back HTTP responses.
 * @throws Throws an error if query fails.
 */
export const searchStop: HandlerWithQueryType<{ queryString: string, queryType: SearchStopQueryType, companies?: string }> = async ({ query, requestTime }, res) => {

    const { queryString, queryType, exact, companies: companyString } = query;

    const companyList = companyString ? normaliseStringToArray(companyString)?.map(it => companies[it]).filter(Boolean) : companyArray;

    if (queryString && !queryType) {
        res.status(400).json({ message: "queryType is mandatory with queryString" })
        return;
    }

    async function doCoordinateSearch({ controller, code }: Company) {
        const [lat, lon] = queryString.split(",");
        return controller.query<Stop>("stops", [["stop_lat", lat, "eq"], ["stop_lon", lon, "eq"]]).then(a => a.map(it => mapToApiStop(it, code)));
    }

    async function doPropertySearch({ controller, code }: Company) {
        return controller.query<Stop>("stops", [[column, queryString, exact ? "eq" : "like"]]).then(a => a.map(it => mapToApiStop(it, code)));
    }

    const column = typeColumnMapping[queryType];
    if (!column) {
        res.status(400).json({ message: `queryType must be of type: ${typeNames}. provided: ${queryType}` });
        return;
    }

    const promises = []
    for (const company of companyList) {
        try {
            const promise = queryType === SearchStopQueryType.COORDINATES ? doCoordinateSearch(company) : doPropertySearch(company)
            promises.push(promise);

        } catch (e) {
            const error = e as DbError;
            res.status(error.code ?? 500).json({ message: e })
        }
    }
    const entries = await Promise.all(promises)
    res.status(200).json(new QueryResponseType<ApiStop>(entries.flat(), query, requestTime));
}

/**
 * Retrieves a stop by ID.
 * @param params - The handler parameters including the stop ID.
 * @param res - The response object to send back HTTP responses.
 * @throws Throws an error if query fails.
 */
export const getStop: HandlerWithParamsType<{ stopId: string }> = async ({ params, requestTime }, res) => {
    try {
        const promises = []
        for (const { controller, code } of companyArray) {
            const promise = controller.query<Stop>("stops", [["stop_id", params.stopId, "like"]]).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(promise);
        }
        const entries = await Promise.all(promises)
        res.status(200).json(new QueryResponseType<Stop>(entries.flat(), params, requestTime));
    } catch (e) {
        const error = e as DbError;
        res.status(error.code ?? 500).json({ message: e })
    }
}

/**
 * Maps a database Stop object to an API Stop object.
 * @param stop - The stop object from the database.
 * @param companyCode - The code of the company to attribute the stop to.
 * @returns The API model of the stop.
 */
function mapToApiStop(stop: Stop, companyCode: string) {
    return dbToApi<Stop, ApiStop>(stop, [{ key: "companyCode", value: companyCode }])
}