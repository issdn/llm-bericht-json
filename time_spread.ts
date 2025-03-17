import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import weekday from 'dayjs/plugin/weekday.js';
import { DateRange, Entry } from './types.ts';
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

export function spreadEntriesAcrossWeeks(
  entries: Entry[],
  dateRanges: DateRange[]
): Required<Entry>[] {
  const datesAsDayjs = dateRanges.map(({ startDate, endDate }) => ({
    startDate: dayjs(startDate),
    endDate: dayjs(endDate),
  }));

  const sorted = datesAsDayjs.sort((a, b) =>
    a.startDate.diff(b.startDate, 'day')
  );

  const minWeek = sorted[0];

  const weeks = datesAsDayjs.reduce((prev, { startDate, endDate }) => {
    return prev + endDate.day(1).diff(startDate.day(1), 'week') + 1;
  }, 0);

  const entriesPerWeek = Math.floor(entries.length / weeks);

  const newEntries: Required<Entry>[] = [];

  let currWeekIndex = 0;
  let mondayOfWeek = dayjs(minWeek.startDate).day(1);

  for (let i = 0; i < weeks * entriesPerWeek; i += entriesPerWeek) {
    const { startDate, endDate } = sorted[currWeekIndex];
    if (
      !(
        mondayOfWeek.week() >= startDate.week() &&
        mondayOfWeek.week() <= endDate.week()
      )
    ) {
      currWeekIndex++;
      mondayOfWeek = sorted[currWeekIndex].startDate.day(1);
    }
    for (let j = 0; j < entriesPerWeek; j++) {
      newEntries.push(cloneObjectWithDate(entries, i + j, mondayOfWeek));
    }

    if (i + entriesPerWeek < weeks * entriesPerWeek)
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
