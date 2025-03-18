import * as fs from 'node:fs';
import JSZip from 'jszip';
import { createWorker } from 'tesseract.js';

export async function officeImageExtract(filepath: string) {
  const zip = new JSZip();
  const fileData = await fs.readFileSync(filepath);
  const docx = await zip.loadAsync(fileData);

  const images: { name: string; data: ArrayBuffer }[] = [];

  for (const fileName of Object.keys(docx.files)) {
    if (fileName.startsWith('word/media/')) {
      const fileData = await docx.files[fileName].async('arraybuffer');
      images.push({
        name: fileName.replace('word/media/', ''),
        data: fileData,
      });
    }
  }

  const worker = await createWorker('deu');
  for (const image of images) {
    const ret = await worker.recognize(image.data);
    console.log(ret.data.text);
  }
  await worker.terminate();
}
