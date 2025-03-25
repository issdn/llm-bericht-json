import * as fs from 'node:fs';
import { parsePDF, parsePDFData } from './pdf_parser.ts';
import { assertEquals } from '@std/assert/equals';
import { parseDOCX, parseDOCXData } from './docx_parser.ts';
import { createWorker } from 'tesseract.js';
import { createCanvas } from 'canvas';

Deno.test('Read text from docx kurwa', async () => {
  const worker = await createWorker('eng');
  const file = await fs.readFileSync('./src/text_img.docx');
  const docxData = await parseDOCXData(file, worker);
  const stream = parseDOCX(docxData, worker);
  const response: string[] = [];

  for await (const text of stream) {
    response.push(text);
  }

  assertEquals(response, ['NORMAL TEXT', 'IMAGE TEXT\n']);
});

Deno.test('Read text from pdf kurwa', async () => {
  const worker = await createWorker('eng');
  const file = await fs.readFileSync('./src/text_img.pdf');
  const stream = parsePDF(await parsePDFData(new Uint8Array(file)), {
    worker,
    getNewCanvas: (width, height) => {
      const canvas = createCanvas(
        width,
        height
      ) as unknown as HTMLCanvasElement;
      canvas.toBlob = function (callback) {
        // deno-lint-ignore no-explicit-any
        callback((canvas as any).toBuffer());
      };
      return { canvas, context: canvas.getContext('2d')! };
    },
  });
  const response: string[] = [];

  for await (const text of stream) {
    response.push(text);
  }

  await worker.terminate();
  assertEquals(response, ['NORMAL TEXT', 'IMAGE TEXT\n']);
});
