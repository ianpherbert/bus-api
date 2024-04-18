/**
 * Represents the response type for database queries.
 * @typeparam T - The type of the queried data
 */
export class QueryResponseType<T> {
    count: number; // The number of items in the response
    delay_ms: number; // The delay in milliseconds for the query execution
    data: T[]; // The array of queried data
    query: Record<string, any>; // The query object used for the query
    constructor(data: (T | undefined)[], query: Record<string, any>, start?: number) {
        const items = data.filter(Boolean) as T[]; // Filter out undefined items
        this.count = items.length; // Set the count of valid items
        this.query = query; // Set the query object
        if (start) {
            this.delay_ms = Date.now() - start; // Calculate the delay if start time is provided
        } else {
            this.delay_ms = 0; // Set delay to 0 if start time is not provided
        }
        this.data = items; // Set the array of valid data
    }
}