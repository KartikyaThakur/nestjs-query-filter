import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FilterQuery } from '../types/filter-query';
import { ORMFilter } from '../types/orm-filter';
import { constructORMFilter, getFilterQueries } from '../utilities/filter-request-helper';


export const GenerateORMFilter: () => ParameterDecorator = createParamDecorator(
  (
    __: string,
    context: ExecutionContext,
  ): any => {
    const filterQueries: FilterQuery[] = getFilterQueries(context);

    // Construct the filter request
    const filterRequests: ORMFilter[] = [];
    filterQueries.forEach(filterQuery => {
        const filterRequest = constructORMFilter(filterQuery);
        if (filterRequest) {
            filterRequests.push(filterRequest);
        }
    });

    if(filterRequests.length > 0) {
      // For any filter request with the same field, we need to merge them into one
      filterRequests.forEach((filterRequest, index) => {
        const filterRequestKey = Object.keys(filterRequest)[0];
        const filterRequestWithSameField = filterRequests.find((filterRequestToCompare, indexToCompare) => {
          return indexToCompare !== index && filterRequestToCompare[filterRequestKey] !== undefined;
        });
        if(filterRequestWithSameField) {
          // Get value of the filter request with the same key
          const existingValue = filterRequest[filterRequestKey];
          const newValue = filterRequestWithSameField[filterRequestKey];

          // Merge the values
          filterRequest[filterRequestKey] = {...existingValue, ...newValue} as any;         

          filterRequests.splice(filterRequests.indexOf(filterRequestWithSameField), 1);
        }
      });    

      // Merge the filter requests into one
      const mergedFilterRequest = filterRequests.reduce((prev: any, curr) => {
        return { ...prev, ...curr };
      });
      return mergedFilterRequest;
    }

    return null;
  },
);