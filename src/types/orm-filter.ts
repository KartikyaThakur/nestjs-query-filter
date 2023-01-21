export type ORMFilter = {
    [key: string]: {[key: string]: string | number | boolean | Date};
} | {
    [key: string]: {[key: string]: string[] | number[] | boolean[] | Date[]};
} | {
    [key: string]: {[key: string]: string | number | boolean | Date | string[] | number[] | boolean[] | Date[]}[];
};