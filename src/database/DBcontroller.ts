import { Client } from "pg";
import { dbHost, dbName, dbPassword, dbPort, dbUser } from '../variables'

/**
 * A PostgreSQL client instance configured with connection parameters.
 */
export const postgresClient = new Client({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
});

/**
 * Represents valid operands for database queries.
 */
type DbOperand = "eq" | "neq" | "like";

/**
 * Mapping of database operands to their corresponding SQL operators.
 */
export const functionalOperands: { [key in DbOperand]: string } = {
    eq: "=", // Equal to operator
    neq: "!=", // Not equal to operator
    like: "ilike" // Case-insensitive pattern matching operator
}

/**
 * Represents an argument for a database query.
 * @typeparam T - The type of the object being queried
 */
type DbArg<T> = [keyof T, any, DbOperand]

/**
 * A controller for interacting with the PostgreSQL database.
 */
export class DbController {
    private client = postgresClient;
    private schema: string;
    constructor(schema: string) {
        this.schema = schema;
    }
    /**
     * Executes a SELECT query on the database.
     * @typeparam T - The type of the object being queried
     * @param tableName - The name of the table to query
     * @param args - An array of arguments for the query
     * @returns A promise that resolves to an array of queried data
     */
    async query<T>(tableName: string, args: DbArg<T>[]) {
        const variableString = args.flatMap(([key, , operand], index) => `${String(key)} ${functionalOperands[operand]} $${index + 1}`).join(" AND ");
        const variables = args.map(([, variable, operand]) => operand === "like" ? `%${String(variable).toLowerCase()}%` : variable)
        const queryString = `SELECT * FROM ${this.schema}.${tableName} WHERE ${variableString}`;
        const { rows: data } = await this.client.query(queryString, variables)
        return data as T[];
    }
    /**
    * Checks if a value exists in the database.
    * @typeparam T - The type of the object being queried
    * @param tableName - The name of the table to query
    * @param args - An array of arguments for the query
    * @returns A boolean indicating whether the value exists
    */
    async checkValue<T>(tableName: string, args: Omit<DbArg<T>, "operand">[]) {
        const variableString = args.flatMap(([key], index) => `${String(key)} = $${index + 1}`).join(" AND ");
        const variables = args.map(([, variable]) => variable)
        const queryString = `SELECT 1 FROM ${this.schema}.${tableName} WHERE ${variableString}`;
        const rowCount = await this.client.query(queryString, variables).then(it => it.rowCount)
        return Boolean(rowCount)
    }
    /**
    * Formats an array of table names with the schema prefix.
    * @param tables - An array of table names
    * @returns An array of table names prefixed with the schema
    */
    getTableNames(tables: string[]) {
        return tables.map(it => `${this.schema}.${it}`)
    }
    /**
    * Executes a custom SQL query on the database.
    * @typeparam T - The type of the object being queried
    * @param queryString - The SQL query string
    * @param variables - Optional variables for parameterized queries
    * @returns A promise that resolves to an array of queried data
    */
    async customQuery<T>(queryString: string, variables?: any[]) {
        const { rows: data } = await this.client.query(queryString, variables)
        return data as T[];
    }
}