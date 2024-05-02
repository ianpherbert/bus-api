"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryResponseType = void 0;
/**
 * Represents the response type for database queries.
 * @typeparam T - The type of the queried data
 */
class QueryResponseType {
    constructor(data, query, start) {
        const items = data.filter(Boolean); // Filter out undefined items
        this.count = items.length; // Set the count of valid items
        this.query = query; // Set the query object
        if (start) {
            this.delay_ms = Date.now() - start; // Calculate the delay if start time is provided
        }
        else {
            this.delay_ms = 0; // Set delay to 0 if start time is not provided
        }
        this.data = items; // Set the array of valid data
    }
}
exports.QueryResponseType = QueryResponseType;
