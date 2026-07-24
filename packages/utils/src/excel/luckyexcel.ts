/**
 * Excel 导入导出封装。
 * 导入：@ims-view/univer-import-excel（ExcelJS；.csv 文本解析）；空表再回退 SheetJS。
 * 导出：仅 @zwight/luckyexcel（浏览器 / Nest 同一套）。
 *
 * 支持 .xlsx / .csv。旧版 .xls / OLE 直接拒绝。
 */
import LuckyExcel from '@zwight/luckyexcel';
import {
  transformExcelToUniver as transformExcelToUniverOptimized,
  type TransformExcelToUniverOptions,
} from '@ims-view/univer-import-excel';
import { assertSupportedExcelSource } from './converter';
import {
  excelBufferToWorkbookDataBySheetJs,
  workbookHasCellValues,
} from './sheetjsConverter';
import type { ExcelBinary, ExcelImportResult, IWorkbookData } from './types';
import type { ExcelExportOptions } from './exportWorkerClient';

export type { TransformExcelToUniverOptions };
export type { ExcelExportOptions };
const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

type ExcelInput = File | Blob | Uint8Array | ArrayBuffer;

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
    throw new Error('当前环境不支持 File API');
  }
  const name = fileName.endsWith('.xlsx') ? fileName : `${fileName.replace(/\.xls$/i, '')}.xlsx`;
  return new File([bytes.slice()], name, { type: XLSX_MIME });
};

export const transformExcelToUniver = (
  input: ExcelInput,
  options?: TransformExcelToUniverOptions,
): Promise<Partial<IWorkbookData>> =>
  transformExcelToUniverOptimized(input, options).then((data) => {
    if (!data?.sheets) {
      throw new Error('Excel 解析结果为空');
    }
    return data as Partial<IWorkbookData>;
  });

const DEFAULT_FREEZE = { xSplit: 0, ySplit: 0, startRow: -1, startColumn: -1 };

/** LuckyExcel 导出对 snapshot 缺字段会崩（resources / freeze.xSplit 等），补齐默认值 */
const normalizeSnapshotForLuckyExcelExport = (
  snapshot: Partial<IWorkbookData>,
): Record<string, unknown> => {
  const sheetsIn = snapshot.sheets || {};
  const sheets: Record<string, Record<string, unknown>> = {};
  for (const [sheetId, sheet] of Object.entries(sheetsIn)) {
    const s = (sheet || {}) as Record<string, unknown>;
    const freeze = (s.freeze || {}) as Record<string, unknown>;
    sheets[sheetId] = {
      ...s,
      id: s.id ?? sheetId,
      name: s.name ?? sheetId,
      cellData: s.cellData ?? {},
      mergeData: s.mergeData ?? [],
      rowCount: s.rowCount ?? 100,
      columnCount: s.columnCount ?? 26,
      rowData: s.rowData ?? {},
      columnData: s.columnData ?? {},
      freeze: {
        xSplit: typeof freeze.xSplit === 'number' ? freeze.xSplit : DEFAULT_FREEZE.xSplit,
        ySplit: typeof freeze.ySplit === 'number' ? freeze.ySplit : DEFAULT_FREEZE.ySplit,
        startRow: typeof freeze.startRow === 'number' ? freeze.startRow : DEFAULT_FREEZE.startRow,
        startColumn:
          typeof freeze.startColumn === 'number' ? freeze.startColumn : DEFAULT_FREEZE.startColumn,
      },
    };
  }

  return {
    id: snapshot.id ?? 'workbook',
    name: snapshot.name ?? 'workbook',
    appVersion: snapshot.appVersion ?? '0.25.1',
    locale: snapshot.locale ?? 'zhCN',
    styles: snapshot.styles ?? {},
    resources: snapshot.resources ?? [],
    sheetOrder: snapshot.sheetOrder ?? Object.keys(sheets),
    sheets,
  };
};

export const transformUniverToExcelBuffer = (
  snapshot: Partial<IWorkbookData>,
  fileName: string,
): Promise<ArrayBuffer | Uint8Array | Buffer> =>
  new Promise((resolve, reject) => {
    try {
      LuckyExcel.transformUniverToExcel({
        snapshot: normalizeSnapshotForLuckyExcelExport(snapshot),
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

const tryImportExcelJs = async (
  input: ExcelInput,
  options?: TransformExcelToUniverOptions,
): Promise<Partial<IWorkbookData> | null> => {
  try {
    return await transformExcelToUniver(input, options);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[@ims-view/utils/excel] ExcelJS 导入失败', error);
    return null;
  }
};

/** workbook.resources 里是否已有浮动图（SHEET_DRAWING_PLUGIN） */
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

/** 二进制入口（.xlsx / .csv）：ExcelJS 或 CSV 直出，空表再回退 SheetJS */
export const importExcelBinary = async (
  input: ExcelBinary,
  fileName = 'workbook.xlsx',
  options?: TransformExcelToUniverOptions,
): Promise<ExcelImportResult> => {
  const bytes = toUint8Array(input);
  assertSupportedExcelSource(bytes, fileName);

  const parseOptions: TransformExcelToUniverOptions = { ...options, fileName };
  let workbookData = await tryImportExcelJs(bytes, parseOptions);

  if (
    (!workbookData || !workbookHasCellValues(workbookData)) &&
    !/\.csv$/i.test(fileName) &&
    typeof window !== 'undefined' &&
    typeof File !== 'undefined'
  ) {
    try {
      workbookData = await transformExcelToUniver(createXlsxFile(bytes, fileName), parseOptions);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[@ims-view/utils/excel] ExcelJS(File) 失败', error);
      workbookData = null;
    }
  }

  if (workbookData && workbookHasCellValues(workbookData)) {
    return { workbookData, images: [] };
  }

  // eslint-disable-next-line no-console
  console.warn('[@ims-view/utils/excel] ExcelJS 返回空表，回退 SheetJS');
  return {
    workbookData: excelBufferToWorkbookDataBySheetJs(bytes, fileName),
    images: [],
  };
};

/** 本地 File 导入 */
export const fileToImportResult = async (
  file: File,
  options?: TransformExcelToUniverOptions,
): Promise<ExcelImportResult> => {
  const buffer = await file.arrayBuffer();
  return importExcelBinary(buffer, file.name, options);
};

/** Node：LuckyExcel 导出为 Buffer（与浏览器同一套） */
export const workbookDataToExcelBuffer = async (
  data: Partial<IWorkbookData>,
  fileName = 'workbook.xlsx',
): Promise<Buffer> => {
  if (typeof Buffer === 'undefined') {
    throw new Error('workbookDataToExcelBuffer 仅可在 Node.js 环境使用');
  }
  const name = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  const { workbookDataToExcelArrayBuffer } = await import('./exportWorkerClient');
  const ab = await workbookDataToExcelArrayBuffer(data, name);
  return Buffer.from(ab);
};

/** 导出：仅 LuckyExcel；可选 Web Worker（不堵 UI） */
export const workbookDataToExcelBlob = async (
  data: Partial<IWorkbookData>,
  fileName = 'workbook.xlsx',
  options?: ExcelExportOptions,
): Promise<Blob> => {
  const name = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;

  if (typeof Blob === 'undefined') {
    throw new Error('当前环境不支持 Blob，请使用 workbookDataToExcelBuffer');
  }

  const {
    estimateWorkbookSnapshotBytes,
    resolveShouldUseExportWorker,
    workbookDataToExcelArrayBuffer,
    runExcelExportInBrowserWorker,
  } = await import('./exportWorkerClient');

  const sizeBytes = estimateWorkbookSnapshotBytes(data);
  if (resolveShouldUseExportWorker(sizeBytes, options || {})) {
    const buffer = await runExcelExportInBrowserWorker(data, {
      ...options,
      fileName: name,
      createWorker: options!.createWorker!,
    });
    return new Blob([buffer], { type: XLSX_MIME });
  }

  const buffer = await workbookDataToExcelArrayBuffer(data, name);
  return new Blob([buffer], { type: XLSX_MIME });
};
