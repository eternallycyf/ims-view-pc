import * as ExcelNS from '../../../utils/src/excel';

const Excel: any = (ExcelNS as any).default ?? ExcelNS;

export type {
  ICellData,
  IRange,
  IWorkbookData,
  IWorksheetData,
} from '../../../utils/src/excel';

export const CellValueType = Excel.CellValueType;

export type { ExportExcelDto, ExportExcelPlain } from './dto/export-excel.dto';
export { exportExcelSchema } from './dto/export-excel.dto';
export type { ExcelTaskIdDto, ExcelTaskIdPlain } from './dto/excel-task-id.dto';
export { excelTaskIdSchema } from './dto/excel-task-id.dto';
