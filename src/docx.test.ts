import * as fs from 'node:fs';
import { parseDOCX } from './docx_parser.ts';
import { assertEquals } from '@std/assert/equals';

Deno.test('Read text from docx kurwa', async () => {
  const file = await fs.readFileSync('./src/text_img.docx');
  const res = await parseDOCX(file);

  assertEquals(
    res.map((i) => (i as PromiseFulfilledResult<string>).value),
    ['NORMAL TEXT', 'IMAGE TEXT\n']
  );
});
