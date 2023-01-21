import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ArrayFilter } from '../types/array-filter';
import { FilterQuery } from '../types/filter-query';
import { constructArrayFilter, getFilterQueries } from '../utilities/filter-request-helper';


export const GenerateArrayFilter: () => ParameterDecorator = createParamDecorator(
  (
    __: string,
    context: ExecutionContext,
  ): any => {
    const filterQueries: FilterQuery[] = getFilterQueries(context);
    if(filterQueries.length === 0) {
      return (__) => {return true};
    }

    // Construct the filter request
    const filterRequests: ArrayFilter[] = [];
    filterQueries.forEach(filterQuery => {
        const filterRequest = constructArrayFilter(filterQuery);
        if (filterRequest !== null) {
            filterRequests.push(filterRequest);
        }
    });

    if(filterRequests.length > 0) {
      // Merge the filter requests into one
      const mergedFilterRequest = filterRequests.reduce((prev: any, curr) => {
        return (arrayItem) => prev(arrayItem) && curr(arrayItem);
      });
      return mergedFilterRequest;
    } else {
      return (__) => {return true};
    }
  }
);