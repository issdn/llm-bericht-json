import type { Worker } from 'tesseract.js';
type ImageExtractProp = {
    worker: Worker | null;
    getNewCanvas: ((width: number, height: number) => {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    }) | null;
};
export declare function parsePDFData(data: Uint8Array): Promise<import("pdfjs-dist/types/src/display/api.js").PDFDocumentProxy>;
export declare function parsePDF(data: Awaited<ReturnType<typeof parsePDFData>>, imageExtractProp?: ImageExtractProp): AsyncGenerator<string, void, unknown>;
export {};
//# sourceMappingURL=pdf_parser.d.ts.map