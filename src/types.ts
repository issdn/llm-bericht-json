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

export enum IncuriaErrorType {
  INVALID_FILE,
  FORMAT_NOT_SUPPORTED,
}

export class IncuriaError extends Error {
  public type: IncuriaErrorType;

  constructor(type: IncuriaErrorType) {
    super();
    this.type = type;
  }
}
