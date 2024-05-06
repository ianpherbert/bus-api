import { LocationDBController } from "../../database/controllers/LocationController";
import { ApiError, MissingArgumentError } from "../../errors/ApiErrors";
import { DbNotFoundError } from "../../errors/DbErrors";
import { getStringForNow } from "../../utils.ts/dateUtils";
import { hasValues } from "../../utils.ts/objectUtils";
import { getCompanyFromCode } from "../companies";
import { HandlerWithQueryAndParamsType, HandlerWithQueryType } from "../handlerType";
import { QueryResponseType } from "../responseType";
import { groupDepartures, mapToApiStop } from "./routeControllers";

export const findLocation: HandlerWithQueryType<{ name?: string, id?: string, postalcode?: string }> = async ({ query, requestTime }, res) => {
    const { id, postalcode, name } = query;
    if (!hasValues({ id, postalcode, name })) {
        res.status(400).json(new MissingArgumentError("name, id, or postalcode are mandatory in query", query, { name: "string?", id: "string?", postalcode: "string?" }));
        return;
    }
    const controller = new LocationDBController();
    const entries = await controller.findByNamePostalCodeOrId(id, postalcode, name);
    res.status(200).json(new QueryResponseType(entries, query, requestTime))
}

export const findRoutesFromLocation: HandlerWithQueryAndParamsType<{ date?: string; }, { locationId: string; }> = async ({ params, query }, res) => {
    const startDate = query.date ?? getStringForNow();


    const locationController = new LocationDBController();
    let location;
    try {
        location = await locationController.findById(params.locationId)
    } catch (e) {
        const error = e as DbNotFoundError;
        res.status(error.code).json({ message: error.message })
        console.log(e)
        return;
    }
    const promises = [];
    for (const stop of location.stops) {
        const { code, controllers } = getCompanyFromCode(stop.company);
        try {
            const data = await controllers.route.getRoutesForStop(stop.stop_id, query.date).then(a => a.map(it => mapToApiStop(it, code)));
            promises.push(data);
        } catch (e) {
            res.status(400).json(new ApiError(e as string, 400));
            return;
        }
    }
    const data = await Promise.all(promises);
    const groups = groupDepartures(data, startDate);
    res.status(200).json(new QueryResponseType(Object.values(groups), { ...query, ...params }));
};