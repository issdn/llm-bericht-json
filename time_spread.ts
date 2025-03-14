import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import weekday from 'dayjs/plugin/weekday.js';
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

export interface Entry {
  qualifikationen: string[];
  text: string;
  datum?: string;
}

interface DateRange {
  startDate: string | Date;
  endDate: string | Date;
}

/**
 * Spreads JSON entries evenly across weeks between start and end dates
 * @param entries Array of entries to distribute
 * @param dateRange Object containing startDate and endDate
 * @returns Array of entries with added datum field
 */
export function spreadEntriesAcrossWeeks(
  entries: Entry[],
  dateRange: DateRange
): Required<Entry>[] {
  const { startDate, endDate } = dateRange;

  let mondayOfWeek = dayjs(startDate).weekday(1);

  const weeks = dayjs(endDate).weekday(1).diff(mondayOfWeek, 'week') + 1;

  const entriesPerWeek = Math.floor(entries.length / weeks);

  const newEntries: Required<Entry>[] = [];

  for (let i = 0; i < weeks * entriesPerWeek; i += entriesPerWeek) {
    for (let j = 0; j < entriesPerWeek; j++) {
      newEntries.push(cloneObjectWithDate(entries, i + j, mondayOfWeek));
    }
    mondayOfWeek = mondayOfWeek.add(7, 'day');
  }

  if (entries.length % weeks != 0) {
    newEntries.push(
      cloneObjectWithDate(entries, entries.length - 1, mondayOfWeek)
    );
  }

  return newEntries;
}

function cloneObjectWithDate(
  entries: Entry[],
  i: number,
  date: dayjs.Dayjs
): Required<Entry> {
  return { ...entries[i], datum: date.clone().format('YYYY-MM-DD') };
}
