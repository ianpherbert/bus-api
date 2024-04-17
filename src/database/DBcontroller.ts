import { Client } from "pg";
import { dbHost, dbName, dbPassword, dbPort, dbUser } from '../variables'


export const postgresClient = new Client({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
});

type DbOperand = "eq" | "neq" | "like";

export const functionalOperands: { [key in DbOperand]: string } = {
    eq: "=",
    neq: "!=",
    like: "ilike"
}

type DbArg<T> = [keyof T, any, DbOperand]

export class DbController {
    private client = postgresClient;
    private schema: string;
    constructor(schema: string) {
        this.schema = schema;
    }
    async query<T>(tableName: string, args: DbArg<T>[]) {
        const variableString = args.flatMap(([key, , operand], index) => `${String(key)} ${functionalOperands[operand]} $${index + 1}`).join(" AND ");
        const variables = args.map(([, variable, operand]) => operand === "like" ? `%${String(variable).toLowerCase()}%` : variable)
        const queryString = `SELECT * FROM ${this.schema}.${tableName} WHERE ${variableString}`;
        const { rows: data } = await this.client.query(queryString, variables)
        return data as T[];
    }
    async checkValue<T>(tableName: string, args: Omit<DbArg<T>, "operand">[]) {
        const variableString = args.flatMap(([key], index) => `${String(key)} = $${index + 1}`).join(" AND ");
        const variables = args.map(([, variable]) => variable)
        const queryString = `SELECT 1 FROM ${this.schema}.${tableName} WHERE ${variableString}`;
        const rowCount = await this.client.query(queryString, variables).then(it => it.rowCount)
        return Boolean(rowCount)
    }
    getTables(tables: string[]) {
        return tables.map(it => `${this.schema}.${it}`)
    }
    async customQuery<T>(queryString: string, variables?: any[]) {
        const { rows: data } = await this.client.query(queryString, variables)
        return data as T[];
    }
}