"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbController = exports.functionalOperands = exports.postgresClient = void 0;
const pg_1 = require("pg");
const variables_1 = require("../variables");
/**
 * A PostgreSQL client instance configured with connection parameters.
 */
exports.postgresClient = new pg_1.Client({
    host: variables_1.dbHost,
    port: variables_1.dbPort,
    database: variables_1.dbName,
    user: variables_1.dbUser,
    password: variables_1.dbPassword,
});
/**
 * Mapping of database operands to their corresponding SQL operators.
 */
exports.functionalOperands = {
    eq: "=", // Equal to operator
    neq: "!=", // Not equal to operator
    like: "ilike" // Case-insensitive pattern matching operator
};
/**
 * A controller for interacting with the PostgreSQL database.
 */
class DbController {
    constructor(schema) {
        this.client = exports.postgresClient;
        this.schema = schema;
    }
    /**
     * Executes a SELECT query on the database.
     * @typeparam T - The type of the object being queried
     * @param tableName - The name of the table to query
     * @param args - An array of arguments for the query
     * @returns A promise that resolves to an array of queried data
     */
    query(tableName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const variableString = args.flatMap(([key, , operand], index) => `${String(key)} ${exports.functionalOperands[operand]} $${index + 1}`).join(" AND ");
            const variables = args.map(([, variable, operand]) => operand === "like" ? `%${String(variable).toLowerCase()}%` : variable);
            const queryString = `SELECT * FROM ${this.schema}.${tableName} WHERE ${variableString}`;
            const { rows: data } = yield this.client.query(queryString, variables);
            return data;
        });
    }
    /**
    * Checks if a value exists in the database.
    * @typeparam T - The type of the object being queried
    * @param tableName - The name of the table to query
    * @param args - An array of arguments for the query
    * @returns A boolean indicating whether the value exists
    */
    checkValue(tableName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const variableString = args.flatMap(([key], index) => `${String(key)} = $${index + 1}`).join(" AND ");
            const variables = args.map(([, variable]) => variable);
            const queryString = `SELECT 1 FROM ${this.schema}.${tableName} WHERE ${variableString}`;
            const rowCount = yield this.client.query(queryString, variables).then(it => it.rowCount);
            return Boolean(rowCount);
        });
    }
    /**
    * Formats an array of table names with the schema prefix.
    * @param tables - An array of table names
    * @returns An array of table names prefixed with the schema
    */
    getTableNames(tables) {
        return tables.map(it => `${this.schema}.${it}`);
    }
    /**
    * Executes a custom SQL query on the database.
    * @typeparam T - The type of the object being queried
    * @param queryString - The SQL query string
    * @param variables - Optional variables for parameterized queries
    * @returns A promise that resolves to an array of queried data
    */
    customQuery(queryString, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows: data } = yield this.client.query(queryString, variables);
            return data;
        });
    }
}
exports.DbController = DbController;
