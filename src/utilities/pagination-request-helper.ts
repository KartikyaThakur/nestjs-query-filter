import { ExecutionContext } from "@nestjs/common";
import { PaginationQuery } from "../types/pagination-query";

export const getPaginationQuery: (context: ExecutionContext) => PaginationQuery = (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const skipValue = request.query.skip ? Number(request.query.skip) : 0;
    const limitValue = request.query.limit ? Number(request.query.limit) : 10;
    const sortValue = request.query.sort ? request.query.sort : '-_id';        
  
    return {
        skip: skipValue,
        limit: limitValue,
        sort: sortValue
    };
}