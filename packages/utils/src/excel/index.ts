export type {
  ExcelBinary,
  ExcelImportResult,
  ExcelSheetImage,
  ICellData,
  IRange,
  IWorkbookData,
  IWorksheetData,
} from './types';
export { CellValueType } from './types';

export {
  assertSupportedExcelSource,
  ensureXlsxBytes,
  excelBufferToImportResult,
  excelBufferToWorkbookData,
  isLegacyExcelSource,
  workbookDataToExcelBytes,
} from './converter';

export {
  excelBufferToWorkbookDataBySheetJs,
  readExcelWithSheetJs,
  workbookFromSheetJs,
  workbookHasCellValues,
} from './sheetjsConverter';

/** 大文件：ExcelJS Worker 分块挂载 */
export {
  CHUNKED_FILE_BYTES,
  CHUNKED_ROW_THRESHOLD,
  DEFAULT_BLOCK_ROW_SIZE,
  DEFAULT_MAX_ROWS,
  DEFAULT_PARSE_TIMEOUT_MS,
  chunkedBlockFileName,
  chunkedMetaFileName,
  excelBufferToChunkedWorkbook,
  resolveWorksheetRowCount,
  shouldUseChunkedImport,
  skeletonWorkbookFromMeta,
} from './exceljsChunked';
export type {
  ChunkedBlock,
  ChunkedConvertOptions,
  ChunkedProgress,
  ChunkedSheetMeta,
  ChunkedWorkbookMeta,
} from './exceljsChunked';
export {
  BorderStyleTypes,
  StyleInterner,
  argbToRgb,
  excelColorToRgb,
  excelStyleToUniver,
} from './exceljsStyle';
export type { UniverStyleData } from './exceljsStyle';
export {
  collectWorkbookDrawingResources,
  collectWorksheetFreeze,
  emuToPx,
} from './exceljsDrawings';
export type { SheetFreeze } from './exceljsDrawings';
export { splitWorkbookDataToChunks } from './workbookChunked';
export type { SplitWorkbookOptions } from './workbookChunked';

/** 导入 ExcelJS；导出仅 LuckyExcel */
export {
  fileToImportResult,
  importExcelBinary,
  transformExcelToUniver,
  transformUniverToExcelBuffer,
  workbookDataToExcelBlob,
  workbookDataToExcelBuffer,
  workbookHasDrawingResources,
} from './luckyexcel';
export type { ExcelExportOptions, ExcelExportWorkerMode } from './exportWorkerClient';
export {
  DEFAULT_EXPORT_WORKER_THRESHOLD_BYTES,
  estimateWorkbookSnapshotBytes,
  installExcelExportWorker,
  resolveShouldUseExportWorker,
  runExcelExportInBrowserWorker,
  workbookDataToExcelArrayBuffer,
} from './exportWorkerClient';
