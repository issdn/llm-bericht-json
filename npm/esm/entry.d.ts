import { DateRange } from './types.js';
export declare enum FileFormat {
    MHT = "mht",
    DOCX = "docx",
    PDF = "pdf",
    PPTX = "pptx",
    XLSX = "xlsx",
    ODT = "odt",
    ODP = "odp",
    ODS = "ods",
    JPG = "jpg",
    PNG = "png",
    DIRECTORY = "/"
}
export type ExtractFunction = (input: string) => string;
export declare function extractTextFromFile(text: string, filFormat: FileFormat | string): string | Promise<string>;
export declare function createJSONFromText(input: string, output: string, dateRanges: DateRange[]): Promise<void>;
export declare function spreadByTimeOnly(input: string, output: string | null, dateRanges: DateRange[]): Promise<void>;
//# sourceMappingURL=entry.d.ts.map