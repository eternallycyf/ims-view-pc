/**
 * @zwight/luckyexcel 封装。
 * 底层 zip 能力依赖 JSZip 生态：https://github.com/Stuk/jszip
 *
 * 仅支持 .xlsx：LuckyExcel 优先，失败 / 空表回退 SheetJS。
 * 旧版 .xls / OLE 直接拒绝。
 */
import LuckyExcel from '@zwight/luckyexcel';
import { assertSupportedExcelSource, workbookDataToExcelBytes } from './converter';
import {
  excelBufferToWorkbookDataBySheetJs,
  workbookHasCellValues,
} from './sheetjsConverter';
import type { ExcelBinary, ExcelImportResult, IWorkbookData } from './types';

const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

type LuckyExcelInput = File | Blob | Uint8Array | ArrayBuffer;

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
  const name = fileName.endsWith('.xlsx') ? fileName : `${fileName.replace(/\.xls$/i, '')}.xlsx`;
  return new File([bytes.slice()], name, { type: XLSX_MIME });
};

export const transformExcelToUniver = (
  input: LuckyExcelInput,
): Promise<Partial<IWorkbookData>> =>
  new Promise((resolve, reject) => {
    try {
      LuckyExcel.transformExcelToUniver(
        input as File,
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
        success: (buffer?) => {
          if (buffer == null) {
            reject(new Error('LuckyExcel 导出结果为空'));
            return;
          }
          resolve(buffer);
        },
        error: (error: Error) => reject(error),
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });

const tryLuckyExcel = async (
  input: LuckyExcelInput,
): Promise<Partial<IWorkbookData> | null> => {
  try {
    return await transformExcelToUniver(input);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[@ims-view/utils/excel] LuckyExcel 失败', error);
    return null;
  }
};

/** workbook.resources 里是否已有浮动图（LuckyExcel SHEET_DRAWING_PLUGIN） */
export const workbookHasDrawingResources = (workbookData?: Partial<IWorkbookData> | null) => {
  try {
    const drawing = (workbookData?.resources || []).find(
      (item) => item?.name === 'SHEET_DRAWING_PLUGIN',
    );
    if (!drawing?.data) return false;
    const parsed =
      typeof drawing.data === 'string' ? JSON.parse(drawing.data) : drawing.data;
    return Object.values(parsed || {}).some((sheetVal) => {
      const data = (sheetVal as { data?: Record<string, unknown> })?.data;
      return Boolean(data && typeof data === 'object' && Object.keys(data).length > 0);
    });
  } catch {
    return false;
  }
};

/** 二进制入口（仅 .xlsx）：统一 LuckyExcel，空表再回退 SheetJS */
export const importExcelBinary = async (
  input: ExcelBinary,
  fileName = 'workbook.xlsx',
): Promise<ExcelImportResult> => {
  const bytes = toUint8Array(input);
  assertSupportedExcelSource(bytes, fileName);

  let workbookData = await tryLuckyExcel(bytes);

  // 少数浏览器环境 Uint8Array 异常时再试 File
  if (
    (!workbookData || !workbookHasCellValues(workbookData)) &&
    typeof window !== 'undefined' &&
    typeof File !== 'undefined'
  ) {
    try {
      workbookData = await transformExcelToUniver(createXlsxFile(bytes, fileName));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[@ims-view/utils/excel] LuckyExcel(File) 失败', error);
      workbookData = null;
    }
  }

  if (workbookData && workbookHasCellValues(workbookData)) {
    return { workbookData, images: [] };
  }

  // eslint-disable-next-line no-console
  console.warn('[@ims-view/utils/excel] LuckyExcel 返回空表，回退 SheetJS');
  return {
    workbookData: excelBufferToWorkbookDataBySheetJs(bytes, fileName),
    images: [],
  };
};

/** 本地 File 导入 */
export const fileToImportResult = async (file: File): Promise<ExcelImportResult> => {
  const buffer = await file.arrayBuffer();
  return importExcelBinary(buffer, file.name);
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
    return new Blob([new Uint8Array(excelBytes)], { type: XLSX_MIME });
  }
};
