export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        count: number;
        page: number;
        sort: string;
    };
};