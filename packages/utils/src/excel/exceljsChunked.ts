/**
 * ExcelJS → Univer 分块导入（大文件快路径）。
 * 输出 meta + 按行块切分的稀疏 cellData，供服务端落盘 / 前端渐进 setValues。
 */
import ExcelJS from 'exceljs';
import { ensureXlsxBytes } from './converter';
import {
  CellValueType,
  type ExcelBinary,
  type ICellData,
  type IRange,
  type IWorkbookData,
  type IWorksheetData,
} from './types';

/** 超过该体积走分块挂载（默认 2MB） */
export const CHUNKED_FILE_BYTES = 2 * 1024 * 1024;

/** 估算行数超过该值走分块 */
export const CHUNKED_ROW_THRESHOLD = 50_000;

/** 每块行数（仅影响渐进挂载切片，不是总行上限） */
export const DEFAULT_BLOCK_ROW_SIZE = 5_000;

/** 全量导入行上限；0 表示不截断 */
export const DEFAULT_MAX_ROWS = 150_000;

/** 大文件解析超时默认（毫秒） */
export const DEFAULT_PARSE_TIMEOUT_MS = 10 * 60 * 1000;

export type ChunkedSheetMeta = {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
  blockCount: number;
  mergeData?: IRange[];
  /** 列宽 / 隐藏列（与 IWorksheetData 对齐，骨架 createWorkbook 时还原） */
  columnData?: Record<number, { w?: number; hd?: number }>;
  /** 行高 / 隐藏行 */
  rowData?: Record<number, { h?: number; hd?: number }>;
  defaultColumnWidth?: number;
  defaultRowHeight?: number;
};

export type ChunkedWorkbookMeta = {
  /** luckyexcel=与前端本地同一解析；exceljs=旧快路径（不推荐） */
  parseEngine: 'luckyexcel' | 'exceljs';
  fileName: string;
  name: string;
  sheetOrder: string[];
  sheets: ChunkedSheetMeta[];
  blockRowSize: number;
  truncated?: boolean;
  maxRows?: number;
  /** 与 LuckyExcel snapshot 对齐，保证样式 / 图片 */
  styles?: Record<string, unknown>;
  resources?: Array<{ name: string; data: string }>;
  appVersion?: string;
  locale?: string;
  workbookId?: string;
};

export type ChunkedBlock = {
  sheetId: string;
  sheetIndex: number;
  blockIndex: number;
  startRow: number;
  endRow: number;
  /** 稀疏矩阵，行/列均为 0-based；可直接交给 FRange.setValues */
  cellData: Record<number, Record<number, ICellData>>;
};

export type ChunkedProgress = {
  percent: number;
  parsedBlocks: number;
  totalBlocks: number;
  phase: 'load' | 'convert' | 'done';
};

export type ChunkedConvertOptions = {
  fileName?: string;
  blockRowSize?: number;
  maxRows?: number;
  onProgress?: (progress: ChunkedProgress) => void;
  /** 每产生一块立即回调（服务端可边写边落盘，避免堆里攒全量 blocks） */
  onBlock?: (block: ChunkedBlock) => void | Promise<void>;
};

const toUint8Array = (input: ExcelBinary): Uint8Array => {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  return input as Uint8Array;
};

const argbToRgb = (argb?: string): string | undefined => {
  if (!argb || typeof argb !== 'string') return undefined;
  const hex = argb.replace(/^#/, '');
  if (hex.length === 8) return `#${hex.slice(2)}`;
  if (hex.length === 6) return `#${hex}`;
  return undefined;
};

const excelColorToRgb = (color?: Partial<ExcelJS.Color>): string | undefined => {
  if (!color) return undefined;
  if (color.argb) return argbToRgb(color.argb);
  return undefined;
};

const cellFromExcelJs = (cell: ExcelJS.Cell): ICellData | null => {
  const value = cell.value;
  if (value == null || value === '') return null;

  let mapped: ICellData | null = null;

  if (typeof value === 'object' && value !== null && 'formula' in value) {
    const formula = String((value as ExcelJS.CellFormulaValue).formula || '').replace(/^=/, '');
    const result = (value as ExcelJS.CellFormulaValue).result;
    mapped = {
      f: `=${formula}`,
      v: result as string | number | boolean | undefined,
      t:
        typeof result === 'number'
          ? CellValueType.NUMBER
          : typeof result === 'boolean'
            ? CellValueType.BOOLEAN
            : CellValueType.STRING,
    };
  } else if (typeof value === 'object' && value !== null && 'richText' in value) {
    const text = ((value as ExcelJS.CellRichTextValue).richText || [])
      .map((part) => part.text || '')
      .join('');
    if (!text) return null;
    mapped = { v: text, t: CellValueType.STRING };
  } else if (typeof value === 'object' && value !== null && 'text' in value && 'hyperlink' in value) {
    const text = String((value as ExcelJS.CellHyperlinkValue).text || '');
    mapped = { v: text, t: CellValueType.STRING };
  } else if (typeof value === 'object' && value !== null && 'error' in value) {
    mapped = { v: String((value as ExcelJS.CellErrorValue).error), t: CellValueType.STRING };
  } else if (value instanceof Date) {
    mapped = { v: value.toISOString(), t: CellValueType.STRING };
  } else if (typeof value === 'number') {
    mapped = { v: value, t: CellValueType.NUMBER };
  } else if (typeof value === 'boolean') {
    mapped = { v: value, t: CellValueType.BOOLEAN };
  } else {
    const text = String(value);
    if (!text) return null;
    mapped = { v: text, t: CellValueType.STRING };
  }

  if (!mapped) return null;

  const style: Record<string, unknown> = {};
  const font = cell.font;
  if (font) {
    if (font.bold) style.bl = 1;
    if (font.italic) style.it = 1;
    if (font.size) style.fs = font.size;
    if (font.name) style.ff = font.name;
    const fc = excelColorToRgb(font.color);
    if (fc) style.cl = { rgb: fc };
  }

  const fill = cell.fill;
  if (fill && fill.type === 'pattern' && fill.fgColor) {
    const bg = excelColorToRgb(fill.fgColor);
    if (bg) style.bg = { rgb: bg };
  }

  if (cell.alignment) {
    const ht =
      cell.alignment.horizontal === 'center'
        ? 2
        : cell.alignment.horizontal === 'right'
          ? 3
          : cell.alignment.horizontal === 'left'
            ? 1
            : undefined;
    const vt =
      cell.alignment.vertical === 'middle'
        ? 2
        : cell.alignment.vertical === 'top'
          ? 1
          : cell.alignment.vertical === 'bottom'
            ? 3
            : undefined;
    if (ht != null) style.ht = ht;
    if (vt != null) style.vt = vt;
  }

  if (Object.keys(style).length) {
    mapped.s = style;
  }

  return mapped;
};

export const shouldUseChunkedImport = (
  sizeBytes: number,
  options?: { bytesThreshold?: number; rowsThreshold?: number; estimatedRows?: number },
): boolean => {
  const bytesThreshold = options?.bytesThreshold ?? CHUNKED_FILE_BYTES;
  const rowsThreshold = options?.rowsThreshold ?? CHUNKED_ROW_THRESHOLD;
  if (sizeBytes > bytesThreshold) return true;
  if (options?.estimatedRows != null && options.estimatedRows > rowsThreshold) return true;
  return false;
};

/** 由 meta 生成空 cellData 的骨架 workbook，供 createWorkbook 先挂载（含 styles/resources/列宽行高） */
export const skeletonWorkbookFromMeta = (meta: ChunkedWorkbookMeta): Partial<IWorkbookData> => {
  const sheets: Record<string, Partial<IWorksheetData>> = {};
  meta.sheets.forEach((sheet) => {
    sheets[sheet.id] = {
      id: sheet.id,
      name: sheet.name,
      cellData: {},
      mergeData: sheet.mergeData || [],
      rowCount: Math.max(sheet.rowCount, 1),
      columnCount: Math.max(sheet.columnCount, 1),
      ...(sheet.columnData ? { columnData: sheet.columnData } : {}),
      ...(sheet.rowData ? { rowData: sheet.rowData } : {}),
      ...(sheet.defaultColumnWidth != null
        ? { defaultColumnWidth: sheet.defaultColumnWidth }
        : {}),
      ...(sheet.defaultRowHeight != null ? { defaultRowHeight: sheet.defaultRowHeight } : {}),
    };
  });

  return {
    id: meta.workbookId || `wb-chunked-${Date.now()}`,
    name: meta.name,
    appVersion: meta.appVersion || '0.25.1',
    locale: meta.locale || 'zhCN',
    sheetOrder: meta.sheetOrder,
    sheets,
    styles: meta.styles,
    resources: meta.resources,
  };
};

const collectMerges = (worksheet: ExcelJS.Worksheet, maxRowExclusive: number): IRange[] => {
  const merges: IRange[] = [];
  const raw = (worksheet as ExcelJS.Worksheet & { model?: { merges?: string[] } }).model?.merges;
  if (!Array.isArray(raw)) return merges;

  raw.forEach((ref) => {
    try {
      // ExcelJS merge refs like "A1:B2"
      const [start, end] = String(ref).split(':');
      if (!start) return;
      const startCell = worksheet.getCell(start);
      const endCell = worksheet.getCell(end || start);
      const top = Number(startCell.row) - 1;
      const left = Number(startCell.col) - 1;
      const bottom = Number(endCell.row) - 1;
      const right = Number(endCell.col) - 1;
      if (top >= maxRowExclusive) return;
      merges.push({
        startRow: top,
        startColumn: left,
        endRow: Math.min(bottom, maxRowExclusive - 1),
        endColumn: right,
      });
    } catch {
      // ignore invalid merge
    }
  });
  return merges;
};

/**
 * ExcelJS 全量 load 后按行块输出。
 * 大文件请在 Worker 中调用，避免堵死 Nest / 浏览器主线程。
 */
export const excelBufferToChunkedWorkbook = async (
  input: ExcelBinary,
  options: ChunkedConvertOptions = {},
): Promise<{ meta: ChunkedWorkbookMeta; blocks: ChunkedBlock[] }> => {
  const fileName = options.fileName || 'workbook.xlsx';
  const blockRowSize = Math.max(100, options.blockRowSize || DEFAULT_BLOCK_ROW_SIZE);
  const maxRows =
    options.maxRows === 0
      ? Number.POSITIVE_INFINITY
      : options.maxRows ?? DEFAULT_MAX_ROWS;

  const bytes = ensureXlsxBytes(toUint8Array(input), fileName);
  options.onProgress?.({ percent: 5, parsedBlocks: 0, totalBlocks: 0, phase: 'load' });

  const workbook = new ExcelJS.Workbook();
  // exceljs 在 Node 接受 Buffer；浏览器用 Uint8Array
  const loadInput =
    typeof Buffer !== 'undefined' ? Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength) : bytes;
  await workbook.xlsx.load(loadInput as never);

  options.onProgress?.({ percent: 20, parsedBlocks: 0, totalBlocks: 0, phase: 'convert' });

  const sheetsMeta: ChunkedSheetMeta[] = [];
  const sheetOrder: string[] = [];
  const blocks: ChunkedBlock[] = [];
  let truncated = false;
  let emittedBlocks = 0;

  // 先扫一遍估算 totalBlocks，便于进度
  const sheetInfos = workbook.worksheets.map((worksheet, sheetIndex) => {
    const id = `sheet-${sheetIndex}`;
    const actualRowCount = worksheet.rowCount || 0;
    const cappedRows = Math.min(actualRowCount, maxRows);
    if (actualRowCount > maxRows) truncated = true;
    const blockCount = Math.max(1, Math.ceil(Math.max(cappedRows, 1) / blockRowSize));
    return { worksheet, sheetIndex, id, cappedRows, blockCount, actualRowCount };
  });

  const totalBlocks = sheetInfos.reduce((sum, info) => sum + info.blockCount, 0) || 1;

  for (const info of sheetInfos) {
    const { worksheet, sheetIndex, id, cappedRows, blockCount } = info;
    sheetOrder.push(id);

    let maxCol = 0;
    const columnData: Record<number, { w?: number }> = {};
    worksheet.columns?.forEach((col, idx) => {
      if (!col) return;
      if (col.width != null || col.values?.length) {
        maxCol = Math.max(maxCol, idx + 1);
      }
      // Excel 列宽为字符宽，与 SheetJS 一致按 ≈8px/字符转 Univer w
      if (col.width != null && Number.isFinite(col.width)) {
        columnData[idx] = { w: Math.round(Number(col.width) * 8) };
      }
    });

    const rowData: Record<number, { h?: number }> = {};
    if (cappedRows > 0) {
      for (let excelRow = 1; excelRow <= cappedRows; excelRow += 1) {
        const height = worksheet.getRow(excelRow).height;
        if (height != null && Number.isFinite(height)) {
          // ExcelJS 行高为 point，Univer 用 px；约 4/3
          rowData[excelRow - 1] = { h: Math.round(Number(height) * (4 / 3)) };
        }
      }
    }

    const mergeData = collectMerges(worksheet, cappedRows);

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
      const startRow = blockIndex * blockRowSize;
      const endRow = Math.min(cappedRows, startRow + blockRowSize) - 1;
      const cellData: Record<number, Record<number, ICellData>> = {};

      if (cappedRows > 0 && endRow >= startRow) {
        for (let excelRow = startRow + 1; excelRow <= endRow + 1; excelRow += 1) {
          const row = worksheet.getRow(excelRow);
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const mapped = cellFromExcelJs(cell);
            if (!mapped) return;
            const r = excelRow - 1;
            const c = colNumber - 1;
            if (!cellData[r]) cellData[r] = {};
            cellData[r][c] = mapped;
          });
        }
        for (const rowCells of Object.values(cellData)) {
          for (const key of Object.keys(rowCells || {})) {
            const col = Number(key);
            if (Number.isFinite(col)) maxCol = Math.max(maxCol, col + 1);
          }
        }
      }

      const block: ChunkedBlock = {
        sheetId: id,
        sheetIndex,
        blockIndex,
        startRow: Math.max(0, startRow),
        endRow: Math.max(0, endRow),
        cellData,
      };

      blocks.push(block);
      emittedBlocks += 1;
      await options.onBlock?.(block);

      const percent = Math.min(
        95,
        20 + Math.round((emittedBlocks / totalBlocks) * 75),
      );
      options.onProgress?.({
        percent,
        parsedBlocks: emittedBlocks,
        totalBlocks,
        phase: 'convert',
      });
    }

    sheetsMeta.push({
      id,
      name: worksheet.name || `Sheet${sheetIndex + 1}`,
      rowCount: Math.max(cappedRows, 1),
      columnCount: Math.max(maxCol, 1),
      blockCount,
      mergeData: mergeData.length ? mergeData : undefined,
      columnData: Object.keys(columnData).length ? columnData : undefined,
      rowData: Object.keys(rowData).length ? rowData : undefined,
    });
  }

  const meta: ChunkedWorkbookMeta = {
    parseEngine: 'exceljs',
    fileName,
    name: fileName.replace(/\.xlsx$/i, '') || 'workbook',
    sheetOrder,
    sheets: sheetsMeta,
    blockRowSize,
    truncated: truncated || undefined,
    maxRows: Number.isFinite(maxRows) ? maxRows : undefined,
  };

  options.onProgress?.({
    percent: 100,
    parsedBlocks: emittedBlocks,
    totalBlocks,
    phase: 'done',
  });

  return { meta, blocks };
};

/** 块文件名：{id}.block.{sheetIndex}.{blockIndex}.json */
export const chunkedBlockFileName = (
  id: string,
  sheetIndex: number,
  blockIndex: number,
): string => `${id}.block.${sheetIndex}.${blockIndex}.json`;

export const chunkedMetaFileName = (id: string): string => `${id}.meta.json`;
