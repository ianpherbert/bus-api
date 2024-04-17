export class QueryResponseType<T> {
    count: number;
    delay_ms: number;
    data: T[];
    query: Record<string, any>;
    constructor(data: (T | undefined)[], query: Record<string, any>, start?: number) {
        const items = data.filter(Boolean) as T[];
        this.count = items.length;
        this.data = items
        this.query = query;
        if (start) {
            this.delay_ms = Date.now() - start;
        } else {
            this.delay_ms = 0;
        }
    }
}