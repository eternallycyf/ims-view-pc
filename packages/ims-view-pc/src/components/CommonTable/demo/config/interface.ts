import type dayjs from 'dayjs';
import type { ACTIVE_TYPE, Options } from './constant';

export interface Record {
  email: string;
  registered: string;
  address: string;
  age: string;
  gender: string;
  phone: string;
  index: string;
}

export interface ExtraSearchParams {
  groupValue: (typeof ACTIVE_TYPE)[number]['value'];
}

export interface SearchesValues {
  cascader: string[];
  mentions: string;
  input: string;
  radio: (typeof Options)[number]['value'];
  editor: string;
  custom: any;
  update: AudioNode;
  updateInput: string;
  time: dayjs.Dayjs;
  date: dayjs.Dayjs;
  week: dayjs.Dayjs;
  month: dayjs.Dayjs;
  quarter: dayjs.Dayjs;
  year: dayjs.Dayjs;
  ['startTime,endTime']: dayjs.Dayjs[];
  ['startDate,endDate']: dayjs.Dayjs[];
  ['startWeek,endWeek']: dayjs.Dayjs[];
  ['startMonth,endMonth']: dayjs.Dayjs[];
  ['startQuerater,endQuerater']: dayjs.Dayjs[];
  ['startYear,endYear']: dayjs.Dayjs[];
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  startWeek: dayjs.Dayjs;
  endWeek: dayjs.Dayjs;
  startMonth: dayjs.Dayjs;
  endMonth: dayjs.Dayjs;
  startQuerater: dayjs.Dayjs;
  endQuerater: dayjs.Dayjs;
  startYear: dayjs.Dayjs;
  endYear: dayjs.Dayjs;
}

export type RestParams = {
  customParams?: '2';
};
