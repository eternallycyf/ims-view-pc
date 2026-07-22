/**
 * @zwight/luckyexcel 封装（浏览器 / 支持 File API 的环境）。
 * 底层 zip 能力依赖 JSZip 生态：https://github.com/Stuk/jszip
 * （LuckyExcel 运行时使用 @progress/jszip-esm；本包同时声明 jszip 以保证共用依赖可用）
 *
 * 注意：旧版 .xls 不要走 LuckyExcel——SheetJS 转出的中间 xlsx 常被解析成空壳，
 * 与可用 excel demo 策略一致（xls → SheetJS 直转 Univer）。
 */
import LuckyExcel from '@zwight/luckyexcel';
import { isLegacyExcelSource, workbookDataToExcelBytes } from './converter';
import {
  excelBufferToWorkbookDataBySheetJs,
  workbookHasCellValues,
} from './sheetjsConverter';
import type { ExcelBinary, ExcelImportResult, IWorkbookData } from './types';

const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const toUint8Array = (input: ExcelBinary): Uint8Array => {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  return input as Uint8Array;
};

const createXlsxFile = (bytes: Uint8Array, fileName: string): File => {
  if (typeof File === 'undefined') {
    throw new Error('当前环境不支持 File API，无法使用 LuckyExcel');
  }
  const name = fileName.replace(/\.xls$/i, '.xlsx');
  const copy = bytes.slice();
  return new File([copy], name, { type: XLSX_MIME });
};

export const transformExcelToUniver = (file: File): Promise<Partial<IWorkbookData>> =>
  new Promise((resolve, reject) => {
    try {
      LuckyExcel.transformExcelToUniver(
        file,
        (exportJson) => {
          const data = exportJson as Partial<IWorkbookData>;
          if (!data?.sheets) {
            reject(new Error('LuckyExcel 解析结果为空'));
            return;
          }
          resolve(data);
        },
        (error: unknown) => {
          reject(error instanceof Error ? error : new Error(String(error)));
        },
      );
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });

export const transformUniverToExcelBuffer = (
  snapshot: Partial<IWorkbookData>,
  fileName: string,
): Promise<ArrayBuffer | Uint8Array | Buffer> =>
  new Promise((resolve, reject) => {
    try {
      LuckyExcel.transformUniverToExcel({
        snapshot: snapshot as Record<string, unknown>,
        fileName,
        getBuffer: true,
        success: (buffer: ArrayBuffer | Uint8Array | Buffer) => resolve(buffer),
        error: (error: Error) => reject(error),
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });

/**
 * 本地导入：
 * - .xls / OLE：直接 SheetJS → Univer（避开 LuckyExcel 空表问题）
 * - .xlsx：LuckyExcel 优先，失败 / 空表回退 SheetJS
 */
export const fileToImportResult = async (file: File): Promise<ExcelImportResult> => {
  const buffer = await file.arrayBuffer();
  const bytes = toUint8Array(buffer);

  if (isLegacyExcelSource(bytes, file.name)) {
    return {
      workbookData: excelBufferToWorkbookDataBySheetJs(bytes, file.name),
      images: [],
    };
  }

  const xlsxFile = createXlsxFile(bytes, file.name);

  try {
    const workbookData = await transformExcelToUniver(xlsxFile);
    if (workbookHasCellValues(workbookData)) {
      return { workbookData, images: [] };
    }
    // eslint-disable-next-line no-console
    console.warn('[@ims-view/utils/excel] LuckyExcel 返回空表，回退 SheetJS');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[@ims-view/utils/excel] LuckyExcel 失败，回退 SheetJS', error);
  }

  return {
    workbookData: excelBufferToWorkbookDataBySheetJs(bytes, file.name),
    images: [],
  };
};

/** 二进制入口 */
export const importExcelBinary = async (
  input: ExcelBinary,
  fileName = 'workbook.xlsx',
): Promise<ExcelImportResult> => {
  const bytes = toUint8Array(input);

  if (isLegacyExcelSource(bytes, fileName)) {
    return {
      workbookData: excelBufferToWorkbookDataBySheetJs(bytes, fileName),
      images: [],
    };
  }

  if (typeof File !== 'undefined') {
    try {
      return await fileToImportResult(createXlsxFile(bytes, fileName));
    } catch {
      // fall through
    }
  }

  return {
    workbookData: excelBufferToWorkbookDataBySheetJs(bytes, fileName),
    images: [],
  };
};

/** 导出：优先 LuckyExcel，失败回退 exceljs */
export const workbookDataToExcelBlob = async (
  data: Partial<IWorkbookData>,
  fileName = 'workbook.xlsx',
): Promise<Blob> => {
  const name = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;

  if (typeof Blob === 'undefined') {
    throw new Error('当前环境不支持 Blob，请使用 workbookDataToExcelBuffer');
  }

  try {
    const buffer = await transformUniverToExcelBuffer(data, name);
    return new Blob([buffer as BlobPart], { type: XLSX_MIME });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[@ims-view/utils/excel] LuckyExcel 导出失败，回退 exceljs', error);
    const excelBytes = await workbookDataToExcelBytes(data);
    // TS 5.x / DOM：Uint8Array<ArrayBufferLike> 与 BlobPart 不兼容，拷一份保证底层是 ArrayBuffer
    const blobPart = new Uint8Array(excelBytes);
    return new Blob([blobPart], { type: XLSX_MIME });
  }
};
