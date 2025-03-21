import { parseDOCX } from './docx_parser.ts';
import { parsePDF } from './pdf_parser.ts';
import { IncuriaError, IncuriaErrorType } from './types.ts';

export enum FileFormat {
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
    case FileFormat.PDF:
      return parsePDF(text as Uint8Array);
    case FileFormat.DOCX:
    case FileFormat.PPTX:
      return parseDOCX(text as Uint8Array);
    default:
      throw new IncuriaError(
        IncuriaErrorType.FORMAT_NOT_SUPPORTED,
        'mht,docx,pdf,pptx,jpg,png'
      );
  }
}
