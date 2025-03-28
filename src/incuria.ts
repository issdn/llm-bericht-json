// import { createWorker } from 'tesseract.js';
import { colors } from '@cliffy/ansi/colors';
import * as fs from 'node:fs';

import { Command } from '@cliffy/command';
import { spinner } from './spinner.ts';
import { createJSONFromText } from './entry.ts';
import { spreadByTimeOnly } from './entry.ts';
import dayjs from 'dayjs';
import { DateRange, IncuriaError } from './types.ts';
import { officeImageExtract } from './text_from_image.ts';
import { extractTextFromFile } from './text_from_file.ts';

function preprocessDates(dates: string[]) {
  if (dates.length < 2 || dates.length % 2 != 0) {
    throw new IncuriaError(
      'Datumsbereiche sollten gerade sein. Im Format: startDate endDate startDate2 endDate2,...'
    );
  }
  return dates.reduce((prev, next, i) => {
    if (i % 2 === 0) {
      return [...prev, { startDate: dayjs(next) } as DateRange];
    } else {
      prev[prev.length - 1]['endDate'] = dayjs(next);
      return prev;
    }
  }, [] as DateRange[]);
}

await new Command()
  .name('incuria')
  .version('1.0.0')
  .command('image')
  .option(
    '-i, --input <input:string>',
    'Datei die aus der der Text extrahiert werden soll.',
    { required: true }
  )
  .option('-o, --output <output:string>', 'Wo Datei gespeichert werden soll.', {
    default: './output.txt',
  })
  .action(async (options: { input: string; output: string }) => {
    await officeImageExtract(options.input);
  })
  .command('extract')
  .option(
    '-i, --input <input:string>',
    'Datei die aus der der Text extrahiert werden soll.',
    { required: true }
  )
  .option('-o, --output <output:string>', 'Wo Datei gespeichert werden soll.', {
    default: './output.txt',
  })
  .action(async (options: { input: string; output: string }) => {
    const text = await extractTextFromFile(
      options.input,
      options.input.split('.').at(-1) ?? ''
    );
    await fs.writeFileSync(options.output, text);
  })
  .command('complete')
  .option(
    '-i, --input <input:string>',
    'Datei die aus der die JSON generiert werden soll',
    { required: true }
  )
  .option('-o, --output <output:string>', 'Wo JSON gespeichert werden soll.', {
    default: './output.json',
  })
  .option('-d, --dates [dates...:string]', 'Daten ranges', { required: true })
  .action(async (options) => {
    const { input, output, dates } = options;
    console.log(colors.italic.rgb24(input, 0x08415c));
    spinner.text = 'Datei wird geladen...';
    spinner.start();
    await createJSONFromText(input, output, preprocessDates(dates as string[]));
    spinner.stop();
  })
  .command('time')
  .option(
    '-i, --input <input:string>',
    'Datei die aus der die JSON generiert werden soll',
    { required: true }
  )
  .option('-o, --output <input:string>', 'Wo JSON gespeichert werden soll.', {
    default: null,
  })
  .option('-d, --dates [dates...:string]', 'Daten ranges', { required: true })
  .action(async (options) => {
    const { input, output, dates } = options;
    console.log(
      `${colors.italic.rgb24(input, 0xddd78d)} ⇒ ${colors.italic.rgb24(
        output ?? input,
        0x00a6fb
      )}`
    );
    spinner.text = 'Datei wird verarbeitet...';
    spinner.start();
    await spreadByTimeOnly(input, output, preprocessDates(dates as string[]));
    spinner.stop();
  })
  .parse(Deno.args);
