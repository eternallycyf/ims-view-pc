import type { ICommonSearchType } from 'ims-view-pc';
import { Options } from './constant';
import type { RestParams, SearchesValues } from './interface';

export const formList: ICommonSearchType<SearchesValues, RestParams> = [
  {
    name: 'time',
    label: 'time',
    type: 'time',
  },
  {
    name: 'date',
    label: 'date',
    type: 'date',
  },
  {
    name: 'month',
    label: 'month',
    type: 'month',
  },
  {
    name: 'quarter',
    label: 'quarter',
    type: 'quarter',
  },
  {
    name: 'year',
    label: 'year',
    type: 'year',
  },
  {
    name: 'startTime,endTime',
    label: 'timeRange',
    type: 'timeRange',
  },
  {
    name: 'startDate,endDate',
    label: 'dateRange',
    type: 'dateRange',
  },
  {
    name: 'startWeek,endWeek',
    label: 'weekRange',
    type: 'weekRange',
  },
  {
    name: 'startMonth,endMonth',
    label: 'monthRange',
    type: 'monthRange',
  },
  {
    name: 'startQuerater,endQuerater',
    label: 'quarterRange',
    type: 'quarterRange',
  },
  {
    name: 'startYear,endYear',
    label: 'yearRange',
    type: 'yearRange',
  },

  {
    name: 'input',
    label: 'input',
    type: 'input',
    initialValue: 'input',
    customParams: '2',
  },
  {
    name: 'radio',
    label: 'radio',
    type: 'radio',
    dict: Options,
    controlProps: {
      buttonStyle: 'solid',
    },
    initialValue: 1,
  },
];
