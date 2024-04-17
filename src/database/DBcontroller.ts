import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "../variables";
import { DbError, DbMultipleError, DbNotFoundError } from "../errors/DbErrors";

type QueryOptions = {
    exact?: boolean | string;
    limit?: number | string;
}


function translateOptions({ exact, limit }: QueryOptions) {
    return {
        exact: exact ? String(exact).toLowerCase() === "true" : false,
        limit: Number.isNaN(limit) ? 50 : Number(limit),
    }
}

export class DbController {
    client: SupabaseClient<any, string, any>;
    constructor(dbName: string) {
        this.client = createClient(supabaseUrl, supabaseKey, { db: { schema: dbName } })
    }
    getOneById = async <T>(column: keyof T, value: unknown, tableName: string) => {
        const columnName = String(column);
        const { data, error } = await this.client.from(tableName).select().eq(columnName, value);
        if (error) throw new DbError(error.message);
        if (data.length > 1) throw new DbMultipleError(`${data.length} Entries found`);
        if (!Boolean(data.length)) return undefined;
        return data[0] as T;
    }
    findSingleProperty = async <T>(column: keyof T, value: unknown, tableName: string, options: QueryOptions = {}) => {
        const columnName = String(column);
        const { exact, limit } = translateOptions(options);
        const query = this.client.from(tableName)
        const { data, error } = await (async () => {
            if (exact) {
                return await query.select()
                    .eq(columnName, value)
                    .limit(limit);
            }

            return await query.select()
                .ilike(columnName, `%${String(value).toLowerCase()}%`)
                .limit(limit);
        })()
        if (error) throw new DbError(error.message);
        return data || [] as T[];
    }
    findMultiProperty = async <T>(match: Partial<{ [key in keyof T]: unknown }>, tableName: string, options: QueryOptions = {}) => {
        const { data } = await this.client.from(tableName).select().match(match)
        return data || [] as T[];
    }
}