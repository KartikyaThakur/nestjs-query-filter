import { PaginatedResponse } from "./paginated-response";

export class PaginationQuery {
    page: number;
    skip: number;
    limit: number;
    sort: string;

    constructor(page: number, limit: number, sort: string) {
        this.page = page;
        this.skip = (page - 1) * limit;
        this.limit = limit;
        this.sort = sort;
    }

    [Symbol.iterator]() {
        return [{
            skip: this.skip,
            limit: this.limit,
            sort: this.sort
        }][Symbol.iterator]();
    }

    generatePaginatedResponse<T>(total: number, data: T[]): PaginatedResponse<T> {
        return {
            data: data,
            pagination: {
                total: total,
                count: data.length,
                page: this.skip / this.limit + 1,
                sort: this.sort
            }
        };
    }
};