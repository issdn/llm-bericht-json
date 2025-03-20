import * as fs from 'node:fs';
import JSZip from 'jszip';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

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

  const result: string[] = [];
  const worker = await createWorker('deu');
  for (const image of images) {
    result.push((await worker.recognize(image.data)).data.text);
  }
  await worker.terminate();
}

export async function pdfImageExtract(pdfUrl: string) {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const numPages = pdf.numPages;

  const result: string[] = [];

  const worker = await createWorker('deu');
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const operatorList = await page.getOperatorList();

    for (let j = 0; j < operatorList.fnArray.length; j++) {
      if (operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
        const imgIndex = operatorList.argsArray[j][0];
        const img = await page.objs.get(imgIndex);
        result.push((await worker.recognize(img)).data.text);
      }
    }
  }
  await worker.terminate();

  return result;
}
