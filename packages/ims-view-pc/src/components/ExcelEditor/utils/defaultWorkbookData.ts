import { LocaleType, type IWorkbookData } from '@univerjs/presets';

export const DEFAULT_WORKBOOK_DATA: Partial<IWorkbookData> = {
  id: 'demo-workbook',
  name: '示例工作簿',
  locale: LocaleType.ZH_CN,
  sheetOrder: ['sheet-1'],
  sheets: {
    'sheet-1': {
      id: 'sheet-1',
      name: 'Sheet1',
      cellData: {
        0: {
          0: { v: '姓名' },
          1: { v: '部门' },
          2: { v: '金额' },
        },
        1: {
          0: { v: '张三' },
          1: { v: '研发部' },
          2: { v: 12000 },
        },
        2: {
          0: { v: '李四' },
          1: { v: '产品部' },
          2: { v: 9800 },
        },
      },
      rowCount: 100,
      columnCount: 26,
    },
  },
};
