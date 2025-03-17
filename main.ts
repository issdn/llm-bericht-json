// import { createWorker } from 'tesseract.js';
import { colors } from '@cliffy/ansi/colors';

// const dataBuffer = fs.readFileSync('./lessons/pgc/folien.pdf');
// const { text } = await pdf(dataBuffer);
// const altTexts = await mhtmExtractAlts('lessons\\pgc\\folien.mht');
// (async () => {
//   const worker = await createWorker('deu');
//   const ret = await worker.recognize('./lessons/pgc/folien.pdf');
//   console.log(ret.data.text);
//   await worker.terminate();
// })();

import { Command } from '@cliffy/command';
import { spinner } from './spinner.ts';
import { createJSONFromText } from './entry.ts';
import { spreadByTimeOnly } from './entry.ts';
import dayjs from 'dayjs';
import { DateRange } from './types.ts';

await new Command()
  .name('incuria')
  .version('1.0.0')
  .command('complete')
  .option(
    '-i, --input <input:string>',
    'Datei die aus der die JSON generiert werden soll',
    { required: true }
  )
  .option('-o, --output <output:string>', 'Wo JSON gespeichert werden soll.', {
    default: './output.json',
  })
  .action(async (options: { input: string; output: string }) => {
    const { input, output } = options;
    console.log(colors.italic.rgb24(input, 0x08415c));
    spinner.text = 'Datei wird geladen...';
    spinner.start();
    await createJSONFromText(input, output);
    spinner.stop();
  })
  .command('time')
  .option(
    '-i, --input <input:string>',
    'Datei die aus der die JSON generiert werden soll',
    { required: true }
  )
  .option('-o, --output', 'Wo JSON gespeichert werden soll.', {
    default: null,
  })
  .option('-d, --dates [dates...:string]', 'Daten ranges', { required: true })
  .action(
    async (options: {
      input: string;
      output: string | null;
      dates: string[];
    }) => {
      const { input, output, dates } = options;
      console.log(
        `${colors.italic.rgb24(input, 0xddd78d)} ⇒ ${colors.italic.rgb24(
          output ?? input,
          0x00a6fb
        )}`
      );
      spinner.text = 'Datei wird verarbeitet...';
      spinner.start();
      if (dates.length < 2 || dates.length % 2 != 0) {
        console.error(
          'Datumsbereiche sollten gerade sein. Im Format: startDate endDate startDate2 endDate2,...'
        );
      }
      const dateRanges = dates.reduce((prev, next, i) => {
        if (i % 2 === 0) {
          return [...prev, { startDate: dayjs(next) } as DateRange];
        } else {
          prev[prev.length - 1]['endDate'] = dayjs(next);
          return prev;
        }
      }, [] as DateRange[]);
      await spreadByTimeOnly(input, output, dateRanges);
      spinner.stop();
    }
  )
  .parse(Deno.args);
