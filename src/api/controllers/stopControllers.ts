import { Stop } from "../../database/types";
import { DbError } from "../../errors/DbErrors";
import { DbToApi } from "../../utils.ts/mappingUtils";
import { normaliseStringToArray } from "../../utils.ts/stringUtils";
import { Company, companies, companyArray } from "../companies";
import { HandlerWithParamsType, HandlerWithQueryType } from "../handlerType";
import { QueryResponseType } from "../responseType";
import { ApiStop } from "../types";

enum SearchStopQueryType {
    NAME = "name",
    COORDINATES = "coordinates",
}

const typeColumnMapping: { [key in SearchStopQueryType]: keyof Stop } = {
    [SearchStopQueryType.NAME]: "stop_name",
    [SearchStopQueryType.COORDINATES]: "stop_lat"
}

const typeNames = Object.keys(typeColumnMapping).reduce((a, b) => a + ", " + b);
export const searchStop: HandlerWithQueryType<{ queryString: string, queryType: SearchStopQueryType, companies?: string }> = async ({ query, requestTime }, res) => {
    const { queryString, queryType, limit, exact, companies: companyString } = query;

    const companyList = companyString ? normaliseStringToArray(companyString).map(it => companies[it]) : companyArray;

    if (!queryString || !queryType) {
        res.status(400).json({ message: "queryString and queryType are obligatory" })
        return;
    }

    async function doCoordinateSearch({ controller, code }: Company) {
        const [lat, lon] = queryString.split(",");
        return controller.findMultiProperty<Stop>({ stop_lat: lat, stop_lon: lon }, "stops").then(it => it.map(a => mapToApiStop(a, code)));
    }

    async function doPropertySearch({ controller, code }: Company) {
        return controller.findSingleProperty(column, queryString, "stops", { limit, exact }).then(it => it.map(a => mapToApiStop(a, code)));
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

export const getStop: HandlerWithParamsType<{ stopId: string }> = async ({ params, requestTime }, res) => {
    try {
        const promises = []
        for (const { controller, code } of companyArray) {
            const promise = controller.getOneById<Stop>("stop_id", params.stopId, "stops").then(it => it && mapToApiStop(it, code));
            promises.push(promise);
        }
        const entries = await Promise.all(promises)
        res.status(200).json(new QueryResponseType<Stop>(entries, params, requestTime));
    } catch (e) {
        const error = e as DbError;
        res.status(error.code ?? 500).json({ message: e })
    }
}

function mapToApiStop(stop: Stop, companyCode: string) {
    return DbToApi<Stop, ApiStop>(stop, [{ key: "companyCode", value: companyCode }])
}