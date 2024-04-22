import { Stop } from "../../database/types";
import { ApiError, MissingArgumentError, TypeMismatchError } from "../../errors/ApiErrors";
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
 * @throws Throws an error if query fails.
 */
export const searchStop: HandlerWithQueryType<{ queryString: string, queryType: SearchStopQueryType, companies?: string }> = async ({ query, requestTime }, res) => {

    const { queryString, queryType, exact, companies: companyString } = query;

    const companyList = companyString ? normaliseStringToArray(companyString)?.map(it => companies[it]).filter(Boolean) : companyArray;

    if (queryString && !queryType) {
        res.status(400).json(new MissingArgumentError("queryType is mandatory with queryString", queryType, typeNames))
        return;
    }

    async function doCoordinateSearch({ code, controllers }: Company) {
        const [lat, lon] = queryString.split(",");
        return controllers.stop.findByCoordinates(lat, lon).then(a => a.map(it => mapToApiStop(it, code)));
    }

    async function doPropertySearch({ controllers, code }: Company) {
        return controllers.stop.findByProperty(column, queryString, Boolean(exact)).then(a => a.map(it => mapToApiStop(it, code)));
    }

    const column = typeColumnMapping[queryType];
    if (!column) {
        res.status(400).json(new TypeMismatchError(`queryType must be of type: ${typeNames}. provided: ${queryType}`, "queryType", queryType, typeNames));
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
 * @throws Throws an error if query fails.
 */
export const getStop: HandlerWithParamsType<{ stopId: string }> = async ({ params, requestTime }, res) => {
    try {
        const promises = []
        for (const { controllers, code } of companyArray) {
            const promise = controllers.stop.getById(params.stopId).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(promise);
        }
        const entries = await Promise.all(promises)
        res.status(200).json(new QueryResponseType<Stop>(entries.flat(), params, requestTime));
    } catch (e) {
        const error = e as DbError;
        res.status(error.code ?? 500).json(new ApiError(error.message, 500))
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