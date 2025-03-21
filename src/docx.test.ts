import * as fs from 'node:fs';
import { parsePDF } from './pdf_parser.ts';
import { assertEquals } from '@std/assert/equals';
import { parseDOCX } from './docx_parser.ts';
import { createWorker } from 'tesseract.js';

Deno.test('Read text from docx kurwa', async () => {
  const worker = await createWorker('deu');
  const file = await fs.readFileSync('./src/text_img.docx');
  const stream = parseDOCX(file, worker);
  const response: string[] = [];

  for await (const text of stream) {
    response.push(text);
  }

  assertEquals(response, ['NORMAL TEXT', 'IMAGE TEXT\n']);
});

Deno.test('Read text from pdf kurwa', async () => {
  const file = await fs.readFileSync('./src/text_img.pdf');
  const res = await parsePDF(new Uint8Array(file));

  assertEquals(
    res.map((i) => (i as PromiseFulfilledResult<string>).value),
    ['NORMAL TEXT', 'IMAGE TEXT\n']
  );
});
