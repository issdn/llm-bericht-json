import * as fs from 'node:fs';
import { parsePDF } from './pdf_parser.ts';
import { assertEquals } from '@std/assert/equals';
import { parseDOCX } from './docx_parser.ts';

Deno.test('Read text from docx kurwa', async () => {
  const file = await fs.readFileSync('./src/text_img.docx');
  const res = await parseDOCX(file);

  assertEquals(
    res.map((i) => (i as PromiseFulfilledResult<string>).value),
    ['NORMAL TEXT', 'IMAGE TEXT\n']
  );
});

Deno.test('Read text from pdf kurwa', async () => {
  const file = await fs.readFileSync('./src/text_img.pdf');
  const res = await parsePDF(new Uint8Array(file));

  assertEquals(
    res.map((i) => (i as PromiseFulfilledResult<string>).value),
    ['NORMAL TEXT', 'IMAGE TEXT\n']
  );
});
