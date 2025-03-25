import type { Worker } from 'tesseract.js';
type ImageExtractProp = {
    worker: Worker | null;
    getNewCanvas: ((width: number, height: number) => {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    }) | null;
};
export declare function parsePDF(data: Uint8Array, imageExtractProp?: ImageExtractProp): AsyncGenerator<string, void, unknown>;
export {};
//# sourceMappingURL=pdf_parser.d.ts.map