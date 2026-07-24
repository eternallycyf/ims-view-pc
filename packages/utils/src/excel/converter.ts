import ExcelJS from 'exceljs';
import {
  type ExcelBinary,
  type ExcelImportResult,
  type IWorkbookData,
} from './types';

const toUint8Array = (input: ExcelBinary): Uint8Array => {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  return input as Uint8Array;
};

const isLegacyXlsName = (fileName?: string) =>
  Boolean(
    fileName &&
      /\.xls$/i.test(fileName) &&
      !/\.xlsx$/i.test(fileName) &&
      !/\.csv$/i.test(fileName),
  );

const isOleCompoundBuffer = (bytes: Uint8Array) =>
  bytes.length >= 4 &&
  bytes[0] === 0xd0 &&
  bytes[1] === 0xcf &&
  bytes[2] === 0x11 &&
  bytes[3] === 0xe0;

const isZipBuffer = (bytes: Uint8Array) =>
  bytes.length >= 2 && bytes[0] === 0x50 && bytes[1] === 0x4b;

const needsXlsToXlsx = (bytes: Uint8Array, fileName?: string) => {
  if (isOleCompoundBuffer(bytes)) return true;
  if (isLegacyXlsName(fileName) && !isZipBuffer(bytes)) return true;
  return false;
};

/** 仅接受 .xlsx / .csv；旧版 .xls / OLE 直接拒绝（不再做转换） */
export const ensureXlsxBytes = (input: ExcelBinary, fileName?: string): Uint8Array => {
  const bytes = toUint8Array(input);
  if (needsXlsToXlsx(bytes, fileName)) {
    throw new Error('仅支持 .xlsx / .csv，不支持旧版 .xls');
  }
  return bytes;
};

/** 是否为旧版 .xls / OLE 复合文档 */
export const isLegacyExcelSource = (input: ExcelBinary, fileName?: string) =>
  needsXlsToXlsx(toUint8Array(input), fileName);

export const assertSupportedExcelSource = (input: ExcelBinary, fileName?: string) => {
  if (isLegacyExcelSource(input, fileName)) {
    throw new Error('仅支持 .xlsx / .csv，不支持旧版 .xls');
  }
};

export const excelBufferToImportResult = async (
  input: ExcelBinary,
  fileName = 'workbook.xlsx',
): Promise<ExcelImportResult> => {
  // 与前端 / Nest 统一：ExcelJS 导入
  const { importExcelBinary } = await import('./luckyexcel');
  return importExcelBinary(input, fileName);
};

export const excelBufferToWorkbookData = async (
  input: ExcelBinary,
  fileName?: string,
): Promise<Partial<IWorkbookData>> => {
  const result = await excelBufferToImportResult(input, fileName);
  return result.workbookData;
};

/** ExcelJS 写出（低保真，仅值/公式/合并；正式导出请用 LuckyExcel） */
export const workbookDataToExcelBytes = async (
  data: Partial<IWorkbookData>,
): Promise<Uint8Array> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = data.name || 'Workbook';

  const sheetOrder = data.sheetOrder?.length
    ? data.sheetOrder
    : Object.keys(data.sheets || {});

  if (!sheetOrder.length) {
    workbook.addWorksheet('Sheet1');
  }

  sheetOrder.forEach((sheetId) => {
    const sheet = data.sheets?.[sheetId];
    const worksheet = workbook.addWorksheet(sheet?.name || sheetId || 'Sheet1');
    const cellData = sheet?.cellData || {};

    Object.keys(cellData).forEach((rowKey) => {
      const rowIndex = Number(rowKey);
      const row = cellData[rowIndex] || {};

      Object.keys(row).forEach((colKey) => {
        const colIndex = Number(colKey);
        const cell = row[colIndex];
        if (!cell) return;

        const excelCell = worksheet.getCell(rowIndex + 1, colIndex + 1);

        if (cell.f) {
          excelCell.value = {
            formula: cell.f.replace(/^=/, ''),
            result: cell.v as string | number | boolean | undefined,
          };
          return;
        }

        if (cell.v != null) {
          excelCell.value = cell.v as ExcelJS.CellValue;
        }
      });
    });

    (sheet?.mergeData || []).forEach((range) => {
      try {
        worksheet.mergeCells(
          range.startRow + 1,
          range.startColumn + 1,
          range.endRow + 1,
          range.endColumn + 1,
        );
      } catch {
        // ignore invalid merge
      }
    });
  });

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return toUint8Array(arrayBuffer as ArrayBuffer);
};
