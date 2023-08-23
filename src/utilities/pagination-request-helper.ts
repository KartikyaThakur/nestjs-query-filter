import { ExecutionContext } from "@nestjs/common";
import { PaginationQuery } from "../types/pagination-query";

export const getPaginationQuery: (context: ExecutionContext) => PaginationQuery = (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const pageValue = request.query.page ? Number(request.query.page): 1;
    const limitValue = request.query.limit ? Number(request.query.limit) : 10;
    const sortValue = request.query.sort ? request.query.sort : '-_id';
  
    return new PaginationQuery(pageValue, limitValue, sortValue);
}