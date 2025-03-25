export declare function parseDOCXData(data: Uint8Array, worker?: Tesseract.Worker | null): Promise<{
    withImages: boolean;
    textsOrRelIds: (string | [string])[];
    images: Map<string, Uint8Array>;
    imgRels: Map<string, string>;
}>;
export declare function parseDOCX({ images, imgRels, withImages, textsOrRelIds, }: Awaited<ReturnType<typeof parseDOCXData>>, worker?: Tesseract.Worker | null): AsyncGenerator<string, void, unknown>;
//# sourceMappingURL=docx_parser.d.ts.map