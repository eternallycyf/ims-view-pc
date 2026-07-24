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
  workbookDataToExcelBuffer,
  workbookDataToExcelBytes,
} from './converter';

export {
  excelBufferToWorkbookDataBySheetJs,
  readExcelWithSheetJs,
  workbookFromSheetJs,
  workbookHasCellValues,
} from './sheetjsConverter';

/** 大文件：分块挂载（解析优先 LuckyExcel，再切块） */
export {
  CHUNKED_FILE_BYTES,
  CHUNKED_ROW_THRESHOLD,
  DEFAULT_BLOCK_ROW_SIZE,
  DEFAULT_MAX_ROWS,
  DEFAULT_PARSE_TIMEOUT_MS,
  chunkedBlockFileName,
  chunkedMetaFileName,
  excelBufferToChunkedWorkbook,
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
export { splitWorkbookDataToChunks } from './workbookChunked';
export type { SplitWorkbookOptions } from './workbookChunked';

/** 仅 .xlsx：LuckyExcel 优先 */
export {
  fileToImportResult,
  importExcelBinary,
  transformExcelToUniver,
  transformUniverToExcelBuffer,
  workbookDataToExcelBlob,
  workbookHasDrawingResources,
} from './luckyexcel';
