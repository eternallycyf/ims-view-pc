/**
 * 兼容层：实现已抽到 `@ims-view/utils` 的 excel 模块，供 Nest 与前端共用。
 */
export type {
  ExcelImportResult,
  ExcelSheetImage,
  ICellData,
  IRange,
  IWorkbookData,
  IWorksheetData,
} from '@ims-view/utils';
export {
  CellValueType,
  ensureXlsxBytes,
  excelBufferToImportResult,
  excelBufferToWorkbookData,
  workbookDataToExcelBuffer,
  workbookDataToExcelBytes,
} from '@ims-view/utils';
