import { getCompletions } from './completion.js';
import { mhtmExtractAlts } from './mhtm_extract_alts.js';
import * as fs from 'node:fs';
import { spreadEntriesAcrossWeeks } from './time_spread.js';
import { spinner } from './spinner.js';
import { IncuriaError } from './types.js';
import * as of from 'officeparser';
export var FileFormat;
(function (FileFormat) {
    FileFormat["MHT"] = "mht";
    FileFormat["DOCX"] = "docx";
    FileFormat["PDF"] = "pdf";
    FileFormat["PPTX"] = "pptx";
    FileFormat["XLSX"] = "xlsx";
    FileFormat["ODT"] = "odt";
    FileFormat["ODP"] = "odp";
    FileFormat["ODS"] = "ods";
    FileFormat["JPG"] = "jpg";
    FileFormat["PNG"] = "png";
    FileFormat["DIRECTORY"] = "/";
})(FileFormat || (FileFormat = {}));
async function writeEntriesToFile(entries, output) {
    await fs.writeFileSync(output, `{"lessons": ${JSON.stringify(entries)}}`);
}
export function extractTextFromFile(text, filFormat) {
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
export async function createJSONFromText(input, output, dateRanges) {
    spinner.text = 'Datei wird verarbeitet.';
    const fileFormat = input.split('.').at(-1) ?? '';
    const extracted = await extractTextFromFile(input, fileFormat);
    const { entries, rejected, invalidJSONCompletions } = await getCompletions(extracted);
    spinner.text = 'Einträge werden zeitlich verteilt.';
    const spreaded = spreadEntriesAcrossWeeks(entries, dateRanges);
    spinner.text = 'Speichern...';
    await writeEntriesToFile(spreaded, output);
    if (invalidJSONCompletions.length > 0 || rejected.length > 0) {
        await fs.writeFileSync(output + '.log', `INVALID COMPLETIONS: ${invalidJSONCompletions}\n\nAPI REJECTIONS: ${rejected.join('\n')}`);
    }
}
export async function spreadByTimeOnly(input, output, dateRanges) {
    const text = await fs.readFileSync(input, 'utf-8');
    const entries = spreadEntriesAcrossWeeks(JSON.parse(text).lessons, dateRanges);
    await writeEntriesToFile(entries, output ?? input);
}
