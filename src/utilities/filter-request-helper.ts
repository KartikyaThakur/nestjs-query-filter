import { ExecutionContext } from "@nestjs/common";
import { FilterQueryType } from "../enums/filter-query-type.enum";
import { Operators } from "../enums/operator.enum";
import { ArrayFilter } from "../types/array-filter";
import { ArrayFilterQuery, BooleanFilterQuery, DateFilterQuery, FilterQuery, NumberFilterQuery, StringFilterQuery } from "../types/filter-query";
import { ORMFilter } from "../types/orm-filter";

function isStringFilterQuery(filter: FilterQuery): filter is StringFilterQuery {
    return filter.type === FilterQueryType.string
    && [Operators.eq, Operators.ne, Operators.in, Operators.nin, Operators.regex].some(operator => operator == filter.operator);
}

function isNumberFilterQuery(filter: FilterQuery): filter is NumberFilterQuery {
    return filter.type === FilterQueryType.number
    && [Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte, Operators.in, Operators.nin].some(operator => operator == filter.operator);
}

function isBooleanFilterQuery(filter: FilterQuery): filter is BooleanFilterQuery {
    return filter.type === FilterQueryType.boolean
    && [Operators.eq, Operators.ne].some(operator => operator == filter.operator);
}

function isDateFilterQuery(filter: FilterQuery): filter is DateFilterQuery {
    return filter.type === FilterQueryType.date
    && [Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte, Operators.in, Operators.nin].some(operator => operator == filter.operator);
}

function isArrayFilterQuery(filter: FilterQuery): filter is ArrayFilterQuery {
    return filter.type === FilterQueryType.array
    && [Operators.eq].some(operator => operator == filter.operator);
}

function getFilterQueryType(filter: FilterQuery): FilterQueryType {
    if (isStringFilterQuery(filter)) {
        return FilterQueryType.string;
    } else if (isNumberFilterQuery(filter)) {
        return FilterQueryType.number;
    } else if (isBooleanFilterQuery(filter)) {
        return FilterQueryType.boolean;
    } else if (isDateFilterQuery(filter)) {
        return FilterQueryType.date;
    } else if (isArrayFilterQuery(filter)) {
        return FilterQueryType.array;
    }
}

export const getFilterQueries = (context: ExecutionContext): FilterQuery[] => {
    // Extract the HTTP request object
    const request = context.switchToHttp().getRequest();

    return Object.keys(request.query)
        // Filter only keys that start with "filter."
        .filter(key => key.startsWith("filter."))
        .flatMap(key => {
            // Extract the field name by removing "filter." prefix
            const field = key.slice(7);
            const queryValues = request.query[key];

            // Ensure the query values are processed as an array
            return (Array.isArray(queryValues) ? queryValues : [queryValues])
                .map(value => {
                    // Split the value into type, operator, and the rest of the value
                    const [type, operator, ...rest] = value.split('.');

                    // Validate that type, operator, and value exist
                    if (!type || !operator || rest.length === 0) return null;

                    return {
                        field,
                        type: FilterQueryType[type],  // Convert type to its enum
                        operator: Operators[operator], // Convert operator to its enum
                        value: rest.join('.'), // Join the remaining value parts
                    };
                })
                // Remove any null values from the resulting array
                .filter(Boolean) as FilterQuery[];
        });
};

export const constructORMFilter: (filter: FilterQuery) => ORMFilter = (filter: FilterQuery): ORMFilter => {
    const filterRequestType: FilterQueryType = getFilterQueryType(filter);

    if(filter.operator === Operators.in) {
        if(filter.type === FilterQueryType.string) {
            return { [filter.field]: { [filter.operator]: filter.value.split(',') } };
        } else if(filter.type === FilterQueryType.number) {
            return { [filter.field]: { [filter.operator]: filter.value.split(',').map(val => Number(val)) } };
        }
    }

    if(filter.operator === Operators.nin) {
        if(filter.type === FilterQueryType.string) {
            return { [filter.field]: { [filter.operator]: filter.value.split(',') } };
        } else if(filter.type === FilterQueryType.number) {
            return { [filter.field]: { [filter.operator]: filter.value.split(',').map(val => Number(val)) } };
        }
    }

    const value: string | number | boolean | Date = filterRequestType === FilterQueryType.date ? new Date(filter.value.toString()) :
        filterRequestType === FilterQueryType.number ? Number(filter.value) :
            filterRequestType === FilterQueryType.boolean ? filter.value.toLocaleLowerCase() === 'true' :
                filter.value;
    
    if(filter.operator === Operators.eq
        || filter.operator === Operators.ne
        || filter.operator === Operators.gt
        || filter.operator === Operators.gte
        || filter.operator === Operators.lt
        || filter.operator === Operators.lte
        ) {
        return { [filter.field]: { [filter.operator]: value } };
    } else if(filter.operator === Operators.regex) {
        const regExp = new RegExp(value.toString(), 'i');
        return { [filter.field]: { [filter.operator]: regExp } };
    }

    return null;
}

export const constructArrayFilter: (filter: FilterQuery) => ArrayFilter = (filter: FilterQuery): ArrayFilter => {
    const filterRequestType: FilterQueryType = getFilterQueryType(filter);
    if (!filterRequestType) {
        return null;
    }

    if(filter.type === FilterQueryType.array) {
        if(filter.operator === Operators.eq) {
            return (arrayItem) => arrayItem[filter.field].includes(filter.value);
        }
        return null;
    }

    if(filter.operator === Operators.in) {
        if(filter.type === FilterQueryType.string) {
            if((filter.field as string).indexOf('.') > 0) {
                return (arrayItem) =>
                {
                    let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                    return nestedObjectValue && filter.value.split(',').some(val => val === nestedObjectValue);
                }
            }
            return (arrayItem) => filter.value.split(',').some(val => val === arrayItem[filter.field]);
        } else if(filter.type === FilterQueryType.number) {
            if((filter.field as string).indexOf('.') > 0) {
                return (arrayItem) =>
                {
                    let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                    return nestedObjectValue && filter.value.split(',').map(val => Number(val)).some(val => val === nestedObjectValue);
                }
            }
            return (arrayItem) => filter.value.split(',').map(val => Number(val)).some(val => val === arrayItem[filter.field]);
        }
    }

    if(filter.operator === Operators.nin) {
        if(filter.type === FilterQueryType.string) {
            if((filter.field as string).indexOf('.') > 0) {
                return (arrayItem) =>
                {
                    let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                    return nestedObjectValue && filter.value.split(',').every(val => val !== nestedObjectValue);
                }
            }
            return (arrayItem) => filter.value.split(',').every(val => val !== arrayItem[filter.field]);
        } else if(filter.type === FilterQueryType.number) {
            if((filter.field as string).indexOf('.') > 0) {
                return (arrayItem) =>
                {
                    let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                    return nestedObjectValue && filter.value.split(',').map(val => Number(val)).every(val => val !== nestedObjectValue);
                }
            }
            return (arrayItem) => filter.value.split(',').map(val => Number(val)).every(val => val !== arrayItem[filter.field]);
        }
    }

    const value: string | number | boolean | Date = filterRequestType === FilterQueryType.date ? new Date(filter.value.toString()) :
        filterRequestType === FilterQueryType.number ? Number(filter.value) :
            filterRequestType === FilterQueryType.boolean ? filter.value.toLocaleLowerCase() === 'true' :
                filter.value;
    
    // filter.operator === Operators.eq
    if(filter.operator === Operators.eq) {
        if(filter.type === FilterQueryType.date) {
            if((filter.field as string).indexOf('.') > 0) {
                return (arrayItem) =>
                {
                    let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                    return (value as Date).getTime() === nestedObjectValue?.getTime();
                }
            }
            return (arrayItem) => (value as Date).getTime() === arrayItem[filter.field]?.getTime();
        }
        
        if((filter.field as string).indexOf('.') > 0) {
            return (arrayItem) =>
            {
                let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                return nestedObjectValue && value === nestedObjectValue;
            }
        }
        
        return (arrayItem) => value === arrayItem[filter.field];
    }

    // filter.operator === Operators.ne
    if(filter.operator === Operators.ne) {
        if(filter.type === FilterQueryType.date) {
            if((filter.field as string).indexOf('.') > 0) {
                return (arrayItem) =>
                {
                    let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                    return nestedObjectValue && (value as Date).getTime() !== nestedObjectValue?.getTime();
                }
            }
            return (arrayItem) => (value as Date).getTime() !== arrayItem[filter.field]?.getTime();
        }

        if((filter.field as string).indexOf('.') > 0) {
            return (arrayItem) =>
            {
                let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                return nestedObjectValue && value !== nestedObjectValue;
            }
        }
        return (arrayItem) => value !== arrayItem[filter.field];
    }

    // filter.operator === Operators.gt
    if(filter.operator === Operators.gt) {
        if((filter.field as string).indexOf('.') > 0) {
            return (arrayItem) =>
            {
                let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                return nestedObjectValue && nestedObjectValue > value;
            }
        }
        return (arrayItem) => arrayItem[filter.field] > value;
    }

    // filter.operator === Operators.gte
    if(filter.operator === Operators.gte) {
        if((filter.field as string).indexOf('.') > 0) {
            return (arrayItem) =>
            {
                let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                return nestedObjectValue && nestedObjectValue >= value;
            }
        }
        return (arrayItem) => arrayItem[filter.field] >= value;
    }

    // filter.operator === Operators.lt
    if(filter.operator === Operators.lt) {
        if((filter.field as string).indexOf('.') > 0) {
            return (arrayItem) =>
            {
                let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                return nestedObjectValue && nestedObjectValue < value;
            }
        }
        return (arrayItem) => arrayItem[filter.field] < value;
    }

    // filter.operator === Operators.lte
    if(filter.operator === Operators.lte) {
        if((filter.field as string).indexOf('.') > 0) {
            return (arrayItem) =>
            {
                let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                return nestedObjectValue && nestedObjectValue <= value;
            }
        }
        return (arrayItem) => arrayItem[filter.field] <= value;
    }

    // filter.operator === Operators.regex
    if(filter.operator === Operators.regex) {
        if((filter.field as string).indexOf('.') > 0) {
            return (arrayItem) =>
            {
                let nestedObjectValue = getNestedObjectValue(filter, arrayItem);
                return new RegExp(value as string).test(nestedObjectValue);
            }
        }
        return (arrayItem) => new RegExp(value as string, 'i').test(arrayItem[filter.field]);
    }
}

function getNestedObjectValue(filter: StringFilterQuery | NumberFilterQuery | BooleanFilterQuery | DateFilterQuery | ArrayFilterQuery, arrayItem: any) {
    const fieldNames = (filter.field as string).split('.');
    let nestedObject = arrayItem;
    for (let i = 0; i < fieldNames.length; i++) {
        if (!nestedObject[fieldNames[i]]) {
            return null;
        }
        nestedObject = nestedObject[fieldNames[i]];
    }
    return nestedObject;
}
