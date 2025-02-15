import type { IColumnsType } from 'ims-view-pc';
import { Record } from './interface';

export const columns: IColumnsType<Record> = [
  {
    title: '索引',
    dataIndex: 'index',
    width: 50,
  },
  {
    title: '姓名',
    dataIndex: 'email',
    sorter: true,
    width: 50,
    ellipsisType: 'line',
    rows: 2,
    ellipsis: true,
  },
  {
    title: '年龄',
    dataIndex: 'gender',
    key: 'age',
    sorter: true,
    width: 50,
    ellipsis: true,
  },
  {
    title: '住址',
    dataIndex: 'email',
    key: 'email',
    width: 50,
  },
];
