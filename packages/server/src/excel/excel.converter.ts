/**
 * 导出 / 导入解析：直接引用 monorepo 源码 excel 模块。
 * xlsx 等为 CJS，tsx 下可能挂在 default 上，这里统一解一层。
 */
import * as ExcelNS from '../../../utils/src/excel';

const Excel: any = (ExcelNS as any).default ?? ExcelNS;

export type {
  ICellData,
  IRange,
  IWorkbookData,
  IWorksheetData,
  ChunkedBlock,
  ChunkedWorkbookMeta,
} from '../../../utils/src/excel';

export const CellValueType = Excel.CellValueType;
export const importExcelBinary = Excel.importExcelBinary;
export const workbookDataToExcelBuffer = Excel.workbookDataToExcelBuffer;
export const excelBufferToChunkedWorkbook = Excel.excelBufferToChunkedWorkbook;
export const splitWorkbookDataToChunks = Excel.splitWorkbookDataToChunks;
export const shouldUseChunkedImport = Excel.shouldUseChunkedImport;
export const skeletonWorkbookFromMeta = Excel.skeletonWorkbookFromMeta;
export const chunkedBlockFileName = Excel.chunkedBlockFileName;
export const chunkedMetaFileName = Excel.chunkedMetaFileName;
export const CHUNKED_FILE_BYTES = Excel.CHUNKED_FILE_BYTES;
export const CHUNKED_ROW_THRESHOLD = Excel.CHUNKED_ROW_THRESHOLD;
export const DEFAULT_BLOCK_ROW_SIZE = Excel.DEFAULT_BLOCK_ROW_SIZE;
export const DEFAULT_MAX_ROWS = Excel.DEFAULT_MAX_ROWS;
export const DEFAULT_PARSE_TIMEOUT_MS = Excel.DEFAULT_PARSE_TIMEOUT_MS;
