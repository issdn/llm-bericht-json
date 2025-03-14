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

import { parseFlags } from '@cliffy/flags';
import { spinner } from './spinner.ts';
import { createJSONFromText } from './entry.ts';

const { flags } = parseFlags(Deno.args, {
  flags: [
    {
      name: 'input',
      aliases: ['i'],
      type: 'string',
      required: true,
    },
    {
      name: 'output',
      aliases: ['o'],
      type: 'string',
      default: './output.json',
    },
  ],
});

const { input, output } = flags;
console.log(colors.italic.rgb24(input, 0x08415c));
spinner.text = 'Datei wird geladen...';
spinner.start();
await createJSONFromText(input, output);
spinner.stop();
