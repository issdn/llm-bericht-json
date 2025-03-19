import { Dayjs } from 'dayjs';

export interface Entry {
  qualifikationen: string[];
  text: string;
  datum?: string;
}

export interface DateRange {
  startDate: string | Date | Dayjs;
  endDate: string | Date | Dayjs;
  hours?: number;
}

export class IncuriaError extends Error {}
