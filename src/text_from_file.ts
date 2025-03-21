import { parseDOCX } from './docx_parser.ts';
import { mhtmExtractAlts } from './mhtm_extract_alts.ts';
import { parsePDF } from './pdf_parser.ts';
import { IncuriaError } from './types.ts';

export enum FileFormat {
  MHT = 'mht',
  DOCX = 'docx',
  PDF = 'pdf',
  PPTX = 'pptx',
  JPG = 'jpg',
  PNG = 'png',
  DIRECTORY = '/',
}

export function extractTextFromFile(
  text: string | Uint8Array,
  filFormat: FileFormat | string,
  withImages: boolean = true
) {
  switch (filFormat) {
    case FileFormat.MHT:
      return mhtmExtractAlts(text as string);
    case FileFormat.PDF:
      return parsePDF(text as Uint8Array);
    case FileFormat.DOCX:
    case FileFormat.PPTX:
      return parseDOCX(text as Uint8Array, withImages);
    default:
      throw new IncuriaError('Dieses Format ist nicht unterstützt.');
  }
}
