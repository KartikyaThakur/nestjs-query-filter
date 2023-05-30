import { FilterQueryType } from "../enums/filter-query-type.enum";
import { Operators } from "../enums/operator.enum";

export type FilterQuery = StringFilterQuery | NumberFilterQuery | BooleanFilterQuery | DateFilterQuery | ArrayFilterQuery;

export type StringFilterQuery = {
    field: string;
    operator: Operators.eq | Operators.ne | Operators.gt | Operators.gte | Operators.lt | Operators.lte | Operators.in | Operators.nin | Operators.regex;
    value: string;
    type: FilterQueryType.string;
};

export type NumberFilterQuery = {
    field: string;
    operator: Operators.eq | Operators.ne | Operators.gt | Operators.gte | Operators.lt | Operators.lte | Operators.in | Operators.nin;
    value: string;
    type: FilterQueryType.number;
};

export type BooleanFilterQuery = {
    field: string;
    operator: Operators.eq | Operators.ne;
    value: string;
    type: FilterQueryType.boolean;
};

export type DateFilterQuery = {
    field: string;
    operator: Operators.eq | Operators.ne | Operators.gt | Operators.gte | Operators.lt | Operators.lte | Operators.in | Operators.nin;
    value: string;
    type: FilterQueryType.date;
};

export type ArrayFilterQuery = {
    field: string;
    operator: Operators.eq;
    value: string;
    type: FilterQueryType.array;
};