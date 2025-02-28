import { SortDirection } from "../enums/sort-direction.enum";
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

    getAggregateQuery(): any[] {
        const sortDirection = this.sort.startsWith('-') ? -1 : 1;
        const sortField = this.sort.replace(/[-+]/g, '');

        return [
            { $skip: this.skip },
            { $limit: this.limit },
            { $sort: { [sortField]: sortDirection } }
        ];
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

    getPaginatedSortedArray<T>(data: T[]): T[] {
        if (data.length === 0) {
            return data;
        } else {
            return this.paginateArray(data);
        }
    }

    private paginateArray<T>(data: T[]): T[] {
        let sort = this.sort.trim();

        let sortDirection = SortDirection.ASC;
        if (sort[0] === '+' || sort[0] === '-') {
            sortDirection = sort[0] === '-' ? SortDirection.DESC : SortDirection.ASC;
            sort = sort.slice(1);
        }

        const sortFieldType = typeof data[0][sort];
        if (sortFieldType !== 'string' && sortFieldType !== 'number') {
            console.error('Invalid sort field, must be a string or number type. Returning unsorted data.');
            return data.slice(this.skip, this.skip + this.limit);
        }

        const compareFunction = sortFieldType === 'number'
            ? this.numberSortFunction(sortDirection, sort)
            : this.stringSortFunction(sortDirection, sort);

        data.sort(compareFunction);

        return data.slice(this.skip, this.skip + this.limit);
    }

    private numberSortFunction(sortDirection: SortDirection, sort: string) {
        return (a, b) => sortDirection === SortDirection.ASC ? a[sort] - b[sort] : b[sort] - a[sort];
    }

    private stringSortFunction(sortDirection: SortDirection, sort: string) {
        return (a, b) => sortDirection === SortDirection.ASC ? a[sort].localeCompare(b[sort]) : b[sort].localeCompare(a[sort]);
    }

};