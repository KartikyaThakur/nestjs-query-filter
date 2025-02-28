import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationQuery } from '../types/pagination-query';
import { getPaginationQuery } from '../utilities/pagination-request-helper';

export const PaginationOption: () => ParameterDecorator = createParamDecorator(
  (
    __: string,
    context: ExecutionContext,
  ): any => {
    const paginationQuery: PaginationQuery = getPaginationQuery(context);

    return paginationQuery;
  }
);