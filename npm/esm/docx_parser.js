import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
export async function* parseDOCX(data, worker = null) {
    const zip = new JSZip();
    const docx = await zip.loadAsync(data);
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
    });
    const textsOrRelIds = [];
    const withImages = worker !== null;
    const fileData = await docx.files['word/document.xml'].async('string');
    const xml = parser.parse(fileData);
    findAllWT(xml, textsOrRelIds, withImages);
    const { images, imgRels } = withImages
        ? await mapImagesToRels(docx, parser)
        : { images: new Map(), imgRels: new Map() };
    try {
        for (const textOrId of textsOrRelIds) {
            if (Array.isArray(textOrId)) {
                const fileData = images.get(imgRels.get(textOrId[0]));
                if (withImages) {
                    const result = await worker.recognize(fileData);
                    yield result.data.text;
                }
            }
            else {
                yield textOrId;
            }
        }
    }
    finally {
        if (withImages)
            await worker.terminate();
    }
}
function findAllWT(obj, results = [], withImages) {
    if (typeof obj === 'object') {
        for (const key in obj) {
            if (key === 'w:t') {
                const text = obj[key];
                if (text.length > 3)
                    results.push(text);
            }
            else if (key === 'a:blip' && withImages) {
                results.push([obj[key]['@_r:embed']]);
            }
            else {
                findAllWT(obj[key], results, withImages);
            }
        }
    }
    return results;
}
async function mapImagesToRels(docx, parser) {
    const images = new Map();
    const imgRels = new Map();
    const mediaFiles = Object.keys(docx.files).filter((fileName) => fileName.startsWith('word/media/'));
    const relsFiles = Object.keys(docx.files).filter((fileName) => fileName.startsWith('word/_rels/document.xml.rels'));
    await Promise.all(mediaFiles.map(async (fileName) => {
        const fileData = await docx.files[fileName].async('uint8array');
        images.set(fileName.replace('word/', ''), fileData);
    }));
    await Promise.all(relsFiles.map(async (fileName) => {
        const fileData = await docx.files[fileName].async('string');
        const xml = parser.parse(fileData);
        for (const rel of xml.Relationships.Relationship) {
            if (rel['@_Target'].startsWith('media/image')) {
                imgRels.set(rel['@_Id'], rel['@_Target']);
            }
        }
    }));
    return { images, imgRels };
}
