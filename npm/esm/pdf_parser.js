import * as pdf from 'pdfjs-dist/legacy/build/pdf.mjs';
import { IncuriaError } from './types.js';
import { IncuriaErrorType } from './types.js';
async function extractFromPage(page, { worker, getNewCanvas } = {
    worker: null,
    getNewCanvas: null,
}) {
    const ops = (await page.getOperatorList()).fnArray;
    const viewport = page.getViewport({ scale: 1 });
    const imageXObjects = ops.filter((op) => op === pdf.OPS.paintImageXObject);
    if (imageXObjects.length === 0 || worker === null) {
        return (await page.getTextContent()).items
            .map((c) => c.str)
            .join('/n');
    }
    if (getNewCanvas === null) {
        throw new IncuriaError(IncuriaErrorType.DEVELOPERS_FAULT, 'To use text from image extraction you have to pass getNewCanvas.');
    }
    const { canvas, context } = getNewCanvas(viewport.width, viewport.height);
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    const blob = await new Promise((resolve, reject) => canvas.toBlob((blob) => (blob === null ? reject() : resolve(blob))));
    const text = (await worker.recognize(blob)).data.text;
    return text;
}
export async function* parsePDF(data, imageExtractProp = {
    worker: null,
    getNewCanvas: null,
}) {
    const pdfDocument = await pdf.getDocument(data).promise;
    for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        yield extractFromPage(page, imageExtractProp);
    }
}
