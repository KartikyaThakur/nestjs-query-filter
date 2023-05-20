export type ORMFilter = {
    [key: string]: {[key: string]: string | number | boolean | Date | RegExp};
} | {
    [key: string]: {[key: string]: string[] | number[] | boolean[] | Date[] | RegExp[]};
} | {
    [key: string]: {[key: string]: string | number | boolean | Date | string[] | number[] | boolean[] | Date[] | RegExp[] }[];
};