import { Entry } from './types.js';
export declare function getCompletions(text: string, systemPrompt: string | undefined, apiKey: string, maxChunkSize?: number): Promise<{
    entries: Entry[];
    rejected: string[];
    invalidJSONCompletions: string;
}>;
//# sourceMappingURL=completion.d.ts.map