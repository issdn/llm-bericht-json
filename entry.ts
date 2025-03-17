import { getCompletions } from './completion.ts';
import { mhtmExtractAlts } from './mhtm_extract_alts.ts';
import * as fs from 'node:fs';
import { spreadEntriesAcrossWeeks } from './time_spread.ts';
import { spinner } from './spinner.ts';
import { DateRange, Entry, IncuriaError } from './types.ts';
import * as of from 'officeparser';

export type ExtractFunction = (input: string) => string;

async function writeEntriesToFile(entries: Entry[], output: string) {
  await fs.writeFileSync(output, `{"lessons": ${JSON.stringify(entries)}}`);
}

export async function extractTextFromFile(input: string) {
  const fileFormat = input.split('.').at(-1) ?? '';
  switch (fileFormat) {
    case 'mht':
      return mhtmExtractAlts(await fs.readFileSync(input, 'utf-8'));
    case 'docx':
    case 'pdf':
    case 'pptx':
    case 'xlsx':
    case 'odt':
    case 'odp':
    case 'ods':
      return of.parseOfficeAsync(input);
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
  const extracted = await extractTextFromFile(input);
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
