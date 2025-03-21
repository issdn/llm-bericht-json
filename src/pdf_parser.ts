import { createCanvas } from 'canvas';
import * as pdf from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createWorker } from 'tesseract.js';

async function extractFromPage(page: pdf.PDFPageProxy) {
  const ops = (await page.getOperatorList()).fnArray;
  const viewport = page.getViewport({ scale: 1 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  const imageXObjects = ops.filter((op) => op === pdf.OPS.paintImageXObject);

  if (imageXObjects.length === 0) {
    return (await page.getTextContent()).items.map((c) => c);
  }

  await page.render({ canvasContext: context, viewport: viewport }).promise;

  const worker = await createWorker('deu');
  const text = (await worker.recognize(canvas.toBuffer())).data.text;
  await worker.terminate();
  return text;
}

export async function parsePDF(data: Uint8Array) {
  const pdfDocument = await pdf.getDocument(data).promise;

  const pages: pdf.PDFPageProxy[] = [];

  for (let i = 1; i <= pdfDocument.numPages; i++) {
    pages.push(await pdfDocument.getPage(i));
  }

  return await Promise.allSettled(pages.map((p) => extractFromPage(p)));
}
