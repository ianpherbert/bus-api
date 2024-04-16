export class QueryResponseType<T> {
    count: number;
    delay_ms: number;
    data: T[];
    query: Record<string, any>;
    constructor(data: T[], query: Record<string, any>, start?: number) {
        this.count = data.length;
        this.data = data;
        this.query = query;
        if (start) {
            this.delay_ms = Date.now() - start;
        } else {
            this.delay_ms = 0;
        }
    }
}