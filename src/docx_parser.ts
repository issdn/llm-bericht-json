import JSZip from 'jszip';
import { createWorker } from 'tesseract.js';
import { XMLParser } from 'fast-xml-parser';

export async function parseDOCX(data: Uint8Array) {
  const zip = new JSZip();
  const docx = await zip.loadAsync(data);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  const images: Map<string, Uint8Array> = new Map();
  const imgRels: Map<string, string> = new Map();

  for (const fileName of Object.keys(docx.files)) {
    if (fileName.startsWith('word/media/')) {
      const fileData = await docx.files[fileName].async('uint8array');
      images.set(fileName.replace('word/', ''), fileData);
    } else if (fileName.startsWith('word/_rels/document.xml.rels')) {
      const fileData = await docx.files[fileName].async('string');
      const xml = parser.parse(fileData);

      for (const rel of xml.Relationships.Relationship) {
        if (rel['@_Target'].startsWith('media/image')) {
          imgRels.set(rel['@_Id'], rel['@_Target']);
        }
      }
    }
  }

  const textsOrRelIds: (string | [string])[] = [];
  const worker = await createWorker('deu');
  for (const fileName of Object.keys(docx.files)) {
    if (fileName.startsWith('word/document.xml')) {
      const fileData = await docx.files[fileName].async('string');
      const xml = parser.parse(fileData);
      findAllWT(xml, textsOrRelIds);
    }
  }
  const texts = await Promise.allSettled(
    textsOrRelIds.map(async (textOrId) => {
      if (Array.isArray(textOrId)) {
        const fileData = images.get(imgRels.get(textOrId[0])!);
        return (await worker.recognize(fileData)).data.text;
      }
      return textOrId;
    })
  );
  await worker.terminate();

  return texts;
}

const findAllWT = (
  obj: Record<string, unknown>,
  results: (string | [string])[] = []
) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (key === 'w:t') {
        const text = obj[key] as string;
        if (text.length > 3) results.push(text);
      } else if (key === 'a:blip') {
        results.push([(obj[key] as Record<string, string>)['@_r:embed']]);
      } else {
        findAllWT(obj[key] as Record<string, unknown>, results);
      }
    }
  }
  return results;
};
