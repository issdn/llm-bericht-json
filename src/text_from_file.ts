import { mhtmExtractAlts } from './mhtm_extract_alts.ts';
import { IncuriaError } from './types.ts';
import * as of from 'officeparser';

export enum FileFormat {
  MHT = 'mht',
  DOCX = 'docx',
  PDF = 'pdf',
  PPTX = 'pptx',
  XLSX = 'xlsx',
  ODT = 'odt',
  ODP = 'odp',
  ODS = 'ods',
  JPG = 'jpg',
  PNG = 'png',
  DIRECTORY = '/',
}

export function extractTextFromFile(
  text: string,
  filFormat: FileFormat | string,
  imagesToText: boolean = false
) {
  switch (filFormat) {
    case FileFormat.MHT:
      return mhtmExtractAlts(text);
    case FileFormat.DOCX:
    case FileFormat.PDF:
    case FileFormat.PPTX:
    case FileFormat.XLSX:
    case FileFormat.ODT:
    case FileFormat.ODP:
    case FileFormat.ODS:
      return of.parseOfficeAsync(text);
    default:
      throw new IncuriaError('Dieses Format ist nicht unterstützt.');
  }
}
