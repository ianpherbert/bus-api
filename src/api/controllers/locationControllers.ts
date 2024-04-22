import { LocationDBController } from "../../database/LocationController";
import { hasValues } from "../../utils.ts/objectUtils";
import { HandlerWithQueryType } from "../handlerType";
import { QueryResponseType } from "../responseType";

export const findLocation: HandlerWithQueryType<{ name?: string, id?: string, postalcode?: string }> = async ({ query, requestTime }, res) => {
    if (!hasValues(query)) {
        res.status(400).json({ message: "name, id, or postalcode are mandatory in query" });
        return;
    }
    const { id, postalcode, name } = query;
    const controller = new LocationDBController();
    const entries = await controller.findByNamePostalCodeOrId(id, postalcode, name);
    res.status(200).json(new QueryResponseType(entries, query, requestTime))
}