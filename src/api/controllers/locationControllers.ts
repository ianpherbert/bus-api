import { LocationDBController } from "../../database/controllers/LocationController";
import { MissingArgumentError } from "../../errors/ApiErrors";
import { hasValues } from "../../utils.ts/objectUtils";
import { HandlerWithQueryType } from "../handlerType";
import { QueryResponseType } from "../responseType";

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