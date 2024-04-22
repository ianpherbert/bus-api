import { companyArray } from "../companies";
import { Handler } from "../handlerType";
import { QueryResponseType } from "../responseType";

export const getCompanies: Handler = async ({ requestTime, query }, res, _next) => {
    const companies = companyArray.map(({ displayName, code, name }) => ({ displayName, code, name }));
    res.status(200).json(new QueryResponseType(companies, query, requestTime))
} 