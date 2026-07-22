import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import {
  excelBufferToWorkbookDataBySheetJs,
  workbookHasCellValues,
} from './sheetjsConverter';
import {
  CellValueType,
  type ExcelBinary,
  type ExcelImportResult,
  type ExcelSheetImage,
  type ICellData,
  type IRange,
  type IWorkbookData,
} from './types';

const createEmptyWorkbookData = (name = 'Workbook'): Partial<IWorkbookData> => ({
  name,
  locale: 'zhCN',
  styles: {},
  sheetOrder: [],
  sheets: {},
});

const toUint8Array = (input: ExcelBinary): Uint8Array => {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  return input as Uint8Array;
};

const toArrayBuffer = (input: ExcelBinary): ArrayBuffer => {
  const bytes = toUint8Array(input);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

const isLegacyXlsName = (fileName?: string) =>
  Boolean(fileName && /\.xls$/i.test(fileName) && !/\.xlsx$/i.test(fileName));

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

/** 将 .xls 先转成 .xlsx bytes，再交给 exceljs（Node / 浏览器共用） */
export const ensureXlsxBytes = (input: ExcelBinary, fileName?: string): Uint8Array => {
  const bytes = toUint8Array(input);
  if (!needsXlsToXlsx(bytes, fileName)) {
    return bytes;
  }

  const workbook = XLSX.read(bytes, { type: 'array', cellDates: true });
  const raw = XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx',
  });

  if (raw == null) {
    throw new Error('xls 转 xlsx 失败：SheetJS 未返回有效数据');
  }

  if (raw instanceof Uint8Array) return raw;
  if (raw instanceof ArrayBuffer) return new Uint8Array(raw);
  return new Uint8Array(raw as ArrayLike<number>);
};

/** 是否为旧版 .xls / OLE 复合文档（LuckyExcel 处理这类文件易出空表） */
export const isLegacyExcelSource = (input: ExcelBinary, fileName?: string) =>
  needsXlsToXlsx(toUint8Array(input), fileName);

const colLettersToIndex = (letters: string) => {
  let index = 0;
  const upper = letters.toUpperCase();
  for (let i = 0; i < upper.length; i += 1) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
};

const decodeA1Range = (range: string): IRange | null => {
  const matched = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i.exec(range.replace(/\$/g, ''));
  if (!matched) return null;
  return {
    startRow: Number(matched[2]) - 1,
    startColumn: colLettersToIndex(matched[1]),
    endRow: Number(matched[4]) - 1,
    endColumn: colLettersToIndex(matched[3]),
  };
};

const getCellData = (cell: ExcelJS.Cell): ICellData | null => {
  const { value } = cell;

  if (value == null || value === '') {
    return null;
  }

  if (typeof value === 'object' && value !== null) {
    if ('formula' in value) {
      const formulaValue = value as ExcelJS.CellFormulaValue;
      return {
        f: formulaValue.formula,
        v: (formulaValue.result as string | number | boolean | undefined) ?? '',
      };
    }

    if ('richText' in value) {
      const richText = (value as ExcelJS.CellRichTextValue).richText
        .map((item) => item.text)
        .join('');
      return richText ? { v: richText, t: CellValueType.STRING } : null;
    }

    if ('text' in value) {
      const text = (value as ExcelJS.CellHyperlinkValue).text;
      return text ? { v: text, t: CellValueType.STRING } : null;
    }
  }

  if (value instanceof Date) {
    return { v: value.getTime(), t: CellValueType.NUMBER };
  }

  if (typeof value === 'number') {
    return { v: value, t: CellValueType.NUMBER };
  }

  if (typeof value === 'boolean') {
    return { v: value, t: CellValueType.BOOLEAN };
  }

  return { v: String(value), t: CellValueType.STRING };
};

const getMergeData = (worksheet: ExcelJS.Worksheet): IRange[] => {
  const merges = (worksheet as any)._merges as
    | Record<string, { model: { top: number; left: number; bottom: number; right: number } }>
    | undefined;

  if (merges && Object.keys(merges).length) {
    return Object.values(merges).map((item) => ({
      startRow: item.model.top - 1,
      startColumn: item.model.left - 1,
      endRow: item.model.bottom - 1,
      endColumn: item.model.right - 1,
    }));
  }

  const modelMerges = (worksheet.model as { merges?: string[] } | undefined)?.merges || [];
  return modelMerges.map(decodeA1Range).filter(Boolean) as IRange[];
};

const bytesToBase64 = (bytes: Uint8Array) => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const bufferToDataUrl = (buffer: ExcelBinary, extension: string) => {
  const bytes = toUint8Array(buffer);
  const mime =
    extension === 'png' ? 'image/png' : extension === 'gif' ? 'image/gif' : 'image/jpeg';
  return `data:${mime};base64,${bytesToBase64(bytes)}`;
};

const getSheetImages = (
  workbook: ExcelJS.Workbook,
  worksheet: ExcelJS.Worksheet,
  sheetId: string,
): ExcelSheetImage[] => {
  const images: ExcelSheetImage[] = [];

  try {
    const sheetImages = worksheet.getImages?.() || [];
    sheetImages.forEach((item) => {
      try {
        const image = workbook.getImage(Number(item.imageId));
        if (!image) return;

        let buffer: ExcelBinary | undefined = image.buffer as ExcelBinary | undefined;
        if (!buffer && image.base64) {
          const pure = String(image.base64).replace(/^data:[^;]+;base64,/, '');
          buffer =
            typeof Buffer !== 'undefined'
              ? Buffer.from(pure, 'base64')
              : Uint8Array.from(atob(pure), (c) => c.charCodeAt(0));
        }
        if (!buffer) return;

        const tl = item.range?.tl as
          | {
              nativeCol?: number;
              nativeRow?: number;
              col?: number;
              row?: number;
              nativeColOff?: number;
              nativeRowOff?: number;
            }
          | undefined;
        const br = item.range?.br as
          | { nativeCol?: number; nativeRow?: number; col?: number; row?: number }
          | undefined;
        const col = Math.max(0, Math.floor(tl?.nativeCol ?? tl?.col ?? 0));
        const row = Math.max(0, Math.floor(tl?.nativeRow ?? tl?.row ?? 0));
        const width =
          br && tl
            ? Math.max(40, ((br.nativeCol ?? br.col ?? 0) - (tl.nativeCol ?? tl.col ?? 0)) * 64)
            : 160;
        const height =
          br && tl
            ? Math.max(40, ((br.nativeRow ?? br.row ?? 0) - (tl.nativeRow ?? tl.row ?? 0)) * 20)
            : 120;

        images.push({
          sheetId,
          dataUrl: bufferToDataUrl(buffer, image.extension || 'png'),
          col,
          row,
          width,
          height,
          offsetX: tl?.nativeColOff || 0,
          offsetY: tl?.nativeRowOff || 0,
        });
      } catch {
        // skip broken image
      }
    });
  } catch {
    // getImages may throw on some files
  }

  return images;
};

export const excelBufferToImportResult = async (
  input: ExcelBinary,
  fileName = 'workbook.xlsx',
): Promise<ExcelImportResult> => {
  const xlsxBytes = ensureXlsxBytes(input, fileName);

  // 主路径：SheetJS → Univer（与可用 excel demo 一致，单元格可渲染）
  const workbookData = excelBufferToWorkbookDataBySheetJs(xlsxBytes, fileName);

  // 辅路径：exceljs 抽图（失败不影响单元格）
  let images: ExcelSheetImage[] = [];
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(toArrayBuffer(xlsxBytes) as never);
    const sheetOrder = workbookData.sheetOrder || [];
    let sheetIndex = 0;
    workbook.eachSheet((worksheet) => {
      const sheetId = sheetOrder[sheetIndex] || `sheet-${sheetIndex}`;
      images.push(...getSheetImages(workbook, worksheet, sheetId));
      sheetIndex += 1;
    });
  } catch {
    images = [];
  }

  if (!workbookHasCellValues(workbookData)) {
    // 极端兜底：再走一遍 exceljs 单元格（少数文件 SheetJS 读空）
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(toArrayBuffer(xlsxBytes) as never);
      const snapshot = createEmptyWorkbookData(fileName);
      const sheetOrder: string[] = [];
      const sheets: IWorkbookData['sheets'] = {};

      let index = 0;
      workbook.eachSheet((worksheet) => {
        const sheetId = `sheet-${index}`;
        sheetOrder.push(sheetId);
        const cellData: Record<number, Record<number, ICellData>> = {};
        let maxRow = 0;
        let maxCol = 0;

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          const rowIndex = rowNumber - 1;
          maxRow = Math.max(maxRow, rowIndex);
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const colIndex = colNumber - 1;
            maxCol = Math.max(maxCol, colIndex);
            const cellValue = getCellData(cell);
            if (cellValue) {
              if (!cellData[rowIndex]) cellData[rowIndex] = {};
              cellData[rowIndex][colIndex] = cellValue;
            }
          });
        });

        const mergeData = getMergeData(worksheet);
        sheets[sheetId] = {
          id: sheetId,
          name: worksheet.name,
          cellData,
          mergeData,
          rowCount: Math.max(maxRow + 50, 100),
          columnCount: Math.max(maxCol + 10, 26),
        };
        index += 1;
      });

      return {
        workbookData: {
          ...snapshot,
          id: `wb-${Date.now()}`,
          appVersion: '0.25.1',
          name: fileName,
          sheetOrder,
          sheets,
        },
        images,
      };
    } catch {
      // keep sheetjs result
    }
  }

  return { workbookData, images };
};

export const excelBufferToWorkbookData = async (
  input: ExcelBinary,
  fileName?: string,
): Promise<Partial<IWorkbookData>> => {
  const result = await excelBufferToImportResult(input, fileName);
  return result.workbookData;
};

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

/** Node 侧便捷方法：返回 Buffer */
export const workbookDataToExcelBuffer = async (
  data: Partial<IWorkbookData>,
): Promise<Buffer> => {
  const bytes = await workbookDataToExcelBytes(data);
  if (typeof Buffer === 'undefined') {
    throw new Error('workbookDataToExcelBuffer 仅可在 Node.js 环境使用');
  }
  return Buffer.from(bytes);
};
