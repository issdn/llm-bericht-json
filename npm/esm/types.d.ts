import { Dayjs } from 'dayjs';
export interface Entry {
    qualifikationen: string[];
    text: string;
    datum?: string;
}
export interface DateRange {
    startDate: string | Date | Dayjs;
    endDate: string | Date | Dayjs;
    hours?: number;
}
export declare enum IncuriaErrorType {
    INVALID_FILE = 0,
    FORMAT_NOT_SUPPORTED = 1,
    DEVELOPERS_FAULT = 2
}
export declare class IncuriaError extends Error {
    type: IncuriaErrorType;
    constructor(type: IncuriaErrorType, message: string);
}
//# sourceMappingURL=types.d.ts.map