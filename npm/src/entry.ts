import { getCompletions } from './completion.js';
import { mhtmExtractAlts } from './mhtm_extract_alts.js';
import * as fs from 'node:fs';
import { spreadEntriesAcrossWeeks } from './time_spread.js';
import { spinner } from './spinner.js';
import { DateRange, Entry, IncuriaError } from './types.js';
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

export type ExtractFunction = (input: string) => string;

async function writeEntriesToFile(entries: Entry[], output: string) {
  await fs.writeFileSync(output, `{"lessons": ${JSON.stringify(entries)}}`);
}

export function extractTextFromFile(
  text: string,
  filFormat: FileFormat | string
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

export async function createJSONFromText(
  input: string,
  output: string,
  dateRanges: DateRange[]
) {
  spinner.text = 'Datei wird verarbeitet.';
  const fileFormat = input.split('.').at(-1) ?? '';
  const extracted = await extractTextFromFile(input, fileFormat);
  const { entries, rejected, invalidJSONCompletions } = await getCompletions(
    extracted
  );
  spinner.text = 'Einträge werden zeitlich verteilt.';
  const spreaded = spreadEntriesAcrossWeeks(entries, dateRanges);
  spinner.text = 'Speichern...';
  await writeEntriesToFile(spreaded, output);
  if (invalidJSONCompletions.length > 0 || rejected.length > 0) {
    await fs.writeFileSync(
      output + '.log',
      `INVALID COMPLETIONS: ${invalidJSONCompletions}\n\nAPI REJECTIONS: ${rejected.join(
        '\n'
      )}`
    );
  }
}

export async function spreadByTimeOnly(
  input: string,
  output: string | null,
  dateRanges: DateRange[]
) {
  const text = await fs.readFileSync(input, 'utf-8');
  const entries = spreadEntriesAcrossWeeks(
    JSON.parse(text).lessons,
    dateRanges
  );
  await writeEntriesToFile(entries, output ?? input);
}
