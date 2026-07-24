import {
  transformExcelToUniver,
  transformExcelToUniverCallback,
  type ExcelToUniverInput,
  type TransformExcelToUniverOptions,
} from './transformExcelToUniver';
import { excelJsToUniver } from './fast/exceljsToUniver';
import { assembleWorkbookFromChunks } from './fast/assembleFromChunks';
import {
  installExcelParseWorker,
  runExcelParseInBrowserWorker,
} from './fast/browserWorkerClient';
import {
  DEFAULT_PARSE_BLOCK_ROWS,
  DEFAULT_WORKER_THRESHOLD_BYTES,
  resolveShouldUseWorker,
} from './fast/parseOptions';
export type { ExcelParseOptions, ExcelParseWorkerMode } from './fast/parseOptions';
export {
  CHUNKED_FILE_BYTES,
  CHUNKED_ROW_THRESHOLD,
  DEFAULT_BLOCK_ROW_SIZE,
  DEFAULT_MAX_ROWS,
  DEFAULT_PARSE_TIMEOUT_MS,
  chunkedBlockFileName,
  chunkedMetaFileName,
  csvBufferToChunkedWorkbook,
  excelBufferToChunkedWorkbook,
  resolveWorksheetRowCount,
  shouldUseChunkedImport,
  skeletonWorkbookFromMeta,
} from './fast/exceljsChunked';
export type {
  ChunkedBlock,
  ChunkedConvertOptions,
  ChunkedProgress,
  ChunkedSheetMeta,
  ChunkedWorkbookMeta,
} from './fast/exceljsChunked';
export { decodeCsvBytes, isCsvFileName, parseCsvText } from './fast/csvParse';
export {
  BorderStyleTypes,
  StyleInterner,
  argbToRgb,
  excelColorToRgb,
  excelStyleToUniver,
} from './fast/exceljsStyle';
export type { UniverStyleData } from './fast/exceljsStyle';
export {
  collectWorkbookDrawingResources,
  collectWorksheetFreeze,
  emuToPx,
} from './fast/exceljsDrawings';
export type { SheetFreeze } from './fast/exceljsDrawings';

export type { ExcelToUniverInput, TransformExcelToUniverOptions };
export type { IWorkbookData, ICellData, IRange } from './fast/types';
export {
  transformExcelToUniver,
  transformExcelToUniverCallback,
  excelJsToUniver,
  assembleWorkbookFromChunks,
  installExcelParseWorker,
  runExcelParseInBrowserWorker,
  DEFAULT_PARSE_BLOCK_ROWS,
  DEFAULT_WORKER_THRESHOLD_BYTES,
  resolveShouldUseWorker,
};

export default {
  transformExcelToUniver,
  transformExcelToUniverCallback,
  excelJsToUniver,
};
