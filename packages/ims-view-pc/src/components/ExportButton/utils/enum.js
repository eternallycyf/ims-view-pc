import { defaultInsertTHCellStyle, defaultTdCellStyle, defaultTHCellStyle } from './excel-style';
export const STYLEMAP = {
  header: defaultTHCellStyle,
  main: defaultTdCellStyle,
  'insert-header': defaultInsertTHCellStyle,
  footer: defaultTHCellStyle,
};
export const TYPE2DATANAMEMAP = {
  header: 'headerData',
  main: 'mainData',
  footer: 'footerData',
  'insert-header': 'insertHeaderData',
};
