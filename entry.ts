import { getCompletions } from './completion.ts';
import { mhtmExtractAlts } from './mhtm_extract_alts.ts';
import * as fs from 'node:fs';
import { spreadEntriesAcrossWeeks } from './time_spread.ts';
import { spinner } from './spinner.ts';
import { DateRange, Entry } from './types.ts';

export type ExtractFunction = (input: string) => string;

const fnByFormat = {
  mht: mhtmExtractAlts,
} as const;

async function writeEntriesToFile(entries: Entry[], output: string) {
  await fs.writeFileSync(output, `{"lessons": ${JSON.stringify(entries)}}`);
}

export async function createJSONFromText(input: string, output: string) {
  const fileFormat = (input.split('.').at(-1) ?? '') as keyof typeof fnByFormat;
  const fn = fnByFormat[fileFormat];
  if (fn === undefined) {
    console.error('Dieses Format ist nicht unterstützt.');
  } else {
    const text = await fs.readFileSync(input, 'utf-8');
    const extracted = await fn(text);
    const { entries, rejected, invalidJSONCompletions } = await getCompletions(
      extracted
    );
    spinner.text = 'Einträge werden zeitlich verteilt.';
    const spreaded = spreadEntriesAcrossWeeks(entries, [
      {
        startDate: '2025-3-3',
        endDate: '2025-3-24',
      },
    ]);
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
