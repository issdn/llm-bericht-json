import { Entry } from './types.js';
export declare function getCompletions(text: string, system_prompt?: string): Promise<{
    entries: Entry[];
    rejected: string[];
    invalidJSONCompletions: string;
}>;
//# sourceMappingURL=completion.d.ts.map