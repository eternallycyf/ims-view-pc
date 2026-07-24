/**
 * ExcelJS → Univer 分块导入（大文件快路径）。
 * 样式映射参考 @zwight/luckyexcel 基本字段，直出 Univer（跳过 LuckySheet 中间态）。
 */
import ExcelJS from 'exceljs';
import {
  collectWorkbookDrawingResources,
  collectWorksheetFreeze,
  type SheetFreeze,
} from './exceljsDrawings';
import { StyleInterner, excelStyleToUniver } from './exceljsStyle';
import { csvBytesToRows, isCsvFileName } from './csvParse';
import {
  CellValueType,
  type ExcelBinary,
  type ICellData,
  type IRange,
  type IWorkbookData,
  type IWorksheetData,
} from './types';

const ensureXlsxBytes = (input: Uint8Array, fileName?: string): Uint8Array => {
  // OLE Compound File magic（旧版 .xls）
  if (
    input.length >= 8 &&
    input[0] === 0xd0 &&
    input[1] === 0xcf &&
    input[2] === 0x11 &&
    input[3] === 0xe0
  ) {
    throw new Error('仅支持 .xlsx / .csv，不支持旧版 .xls');
  }
  if (fileName && /\.xls$/i.test(fileName) && !/\.xlsx$/i.test(fileName) && !/\.csv$/i.test(fileName)) {
    throw new Error('仅支持 .xlsx / .csv，不支持旧版 .xls');
  }
  return input;
};
/** 超过该体积走分块挂载（默认 512KB；Nest 大表勿走 LuckyExcel 主线程） */
export const CHUNKED_FILE_BYTES = 512 * 1024;

/** 估算行数超过该值走分块 */
export const CHUNKED_ROW_THRESHOLD = 50_000;

/** 每块行数（仅影响渐进挂载切片，不是总行上限） */
export const DEFAULT_BLOCK_ROW_SIZE = 5_000;

/** 全量导入行上限；0 表示不截断（默认不限制） */
export const DEFAULT_MAX_ROWS = 0;

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
  /** 冻结窗格（锁定行列） */
  freeze?: SheetFreeze;
  defaultColumnWidth?: number;
  defaultRowHeight?: number;
};

export type ChunkedWorkbookMeta = {
  /** exceljs=导入解析；luckyexcel=整包 snapshot 再切块挂载 */
  parseEngine: 'luckyexcel' | 'exceljs';
  fileName: string;
  name: string;
  sheetOrder: string[];
  sheets: ChunkedSheetMeta[];
  blockRowSize: number;
  truncated?: boolean;
  maxRows?: number;
  /** 与 Univer snapshot 对齐，保证样式 / 图片 */
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
  /** 默认 true：映射基本样式并写入 meta.styles */
  includeStyles?: boolean;
  /** 自定义 workbookId（服务端 Worker 用上传 id） */
  workbookId?: string;
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

const mapPlainValue = (value: ExcelJS.CellValue): ICellData | null => {
  if (value == null || value === '') return null;

  if (typeof value === 'object' && value !== null && 'formula' in value) {
    const formula = String((value as ExcelJS.CellFormulaValue).formula || '').replace(/^=/, '');
    const result = (value as ExcelJS.CellFormulaValue).result;
    return {
      f: `=${formula}`,
      v: result as string | number | boolean | undefined,
      t:
        typeof result === 'number'
          ? CellValueType.NUMBER
          : typeof result === 'boolean'
            ? CellValueType.BOOLEAN
            : CellValueType.STRING,
    };
  }
  if (typeof value === 'object' && value !== null && 'richText' in value) {
    const text = ((value as ExcelJS.CellRichTextValue).richText || [])
      .map((part) => part.text || '')
      .join('');
    if (!text) return null;
    return { v: text, t: CellValueType.STRING };
  }
  if (typeof value === 'object' && value !== null && 'text' in value && 'hyperlink' in value) {
    return {
      v: String((value as ExcelJS.CellHyperlinkValue).text || ''),
      t: CellValueType.STRING,
    };
  }
  if (typeof value === 'object' && value !== null && 'error' in value) {
    return { v: String((value as ExcelJS.CellErrorValue).error), t: CellValueType.STRING };
  }
  if (value instanceof Date) {
    return { v: value.toISOString(), t: CellValueType.STRING };
  }
  if (typeof value === 'number') {
    return { v: value, t: CellValueType.NUMBER };
  }
  if (typeof value === 'boolean') {
    return { v: value, t: CellValueType.BOOLEAN };
  }
  const text = String(value);
  if (!text) return null;
  return { v: text, t: CellValueType.STRING };
};

const cellFromExcelJs = (
  cell: ExcelJS.Cell,
  interner: StyleInterner | null,
): ICellData | null => {
  const mapped = mapPlainValue(cell.value);
  const styleId = interner ? interner.intern(excelStyleToUniver(cell)) : undefined;
  if (!mapped && !styleId) return null;
  if (!mapped) return { s: styleId };
  if (styleId) mapped.s = styleId;
  return mapped;
};

/**
 * 遍历行内已存在的单元格（含 ValueType.Null）。
 * 不用 eachCell({ includeEmpty: false })：它会跳过仅有边框/样式的空格，导致右侧竖线丢失。
 * 也不用 includeEmpty: true：会 getCell 填满稀疏洞，放大宽表内存。
 */
const eachExistingCell = (
  row: ExcelJS.Row,
  iteratee: (cell: ExcelJS.Cell, colNumber: number) => void,
): void => {
  const cells = (row as ExcelJS.Row & { _cells?: Array<ExcelJS.Cell | undefined> })._cells;
  if (!cells?.length) return;
  cells.forEach((cell, index) => {
    if (!cell) return;
    iteratee(cell, index + 1);
  });
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

/**
 * ExcelJS 的 rowCount / dimensions 在部分文件上会偏小（只到 dimension），
 * 导致只产出 1 个 block（例如刚好 5000 行）。用 eachRow 取最后有数据的行号。
 */
export const resolveWorksheetRowCount = (worksheet: ExcelJS.Worksheet): number => {
  let lastDataRow = 0;
  worksheet.eachRow({ includeEmpty: false }, (_row, rowNumber) => {
    if (rowNumber > lastDataRow) lastDataRow = rowNumber;
  });
  if (lastDataRow > 0) return lastDataRow;

  const dimBottom = Number(worksheet.dimensions?.bottom) || 0;
  const rowCount = Number(worksheet.rowCount) || 0;
  return Math.max(dimBottom, rowCount, 0);
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
      ...(sheet.freeze ? { freeze: sheet.freeze } : {}),
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

const mapCsvCell = (raw: string): ICellData | null => {
  if (raw == null || raw === '') return null;
  const trimmed = raw.trim();
  if (trimmed === '') return { v: raw, t: CellValueType.STRING };
  if (/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (Number.isFinite(num)) return { v: num, t: CellValueType.NUMBER };
  }
  if (/^(true|false)$/i.test(trimmed)) {
    return { v: /^true$/i.test(trimmed), t: CellValueType.BOOLEAN };
  }
  return { v: raw, t: CellValueType.STRING };
};

/** CSV → 与 ExcelJS 相同的分块协议（无样式 / 无图） */
export const csvBufferToChunkedWorkbook = async (
  input: ExcelBinary,
  options: ChunkedConvertOptions = {},
): Promise<{ meta: ChunkedWorkbookMeta; blocks: ChunkedBlock[] }> => {
  const fileName = options.fileName || 'workbook.csv';
  const blockRowSize = Math.max(100, options.blockRowSize || DEFAULT_BLOCK_ROW_SIZE);
  const requestedMaxRows = options.maxRows ?? DEFAULT_MAX_ROWS;
  const maxRows = requestedMaxRows === 0 ? Number.POSITIVE_INFINITY : requestedMaxRows;
  const workbookId = options.workbookId || `wb-chunked-${Date.now()}`;

  options.onProgress?.({ percent: 5, parsedBlocks: 0, totalBlocks: 0, phase: 'load' });
  const rows = csvBytesToRows(toUint8Array(input));
  options.onProgress?.({ percent: 20, parsedBlocks: 0, totalBlocks: 0, phase: 'convert' });

  const actualRowCount = rows.length;
  const cappedRows = Math.min(actualRowCount, maxRows);
  const truncated = actualRowCount > maxRows;
  let maxCol = 0;
  for (let r = 0; r < cappedRows; r += 1) {
    maxCol = Math.max(maxCol, rows[r]?.length || 0);
  }

  const sheetId = 'sheet-0';
  const blockCount = Math.max(1, Math.ceil(Math.max(cappedRows, 1) / blockRowSize));
  const collectBlocks = typeof options.onBlock !== 'function';
  const blocks: ChunkedBlock[] = [];
  let emittedBlocks = 0;

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
    const startRow = blockIndex * blockRowSize;
    const endRow = Math.min(cappedRows, startRow + blockRowSize) - 1;
    const cellData: Record<number, Record<number, ICellData>> = {};

    if (cappedRows > 0 && endRow >= startRow) {
      for (let r = startRow; r <= endRow; r += 1) {
        const line = rows[r] || [];
        for (let c = 0; c < line.length; c += 1) {
          const mapped = mapCsvCell(line[c]);
          if (!mapped) continue;
          if (!cellData[r]) cellData[r] = {};
          cellData[r][c] = mapped;
        }
      }
    }

    const block: ChunkedBlock = {
      sheetId,
      sheetIndex: 0,
      blockIndex,
      startRow: Math.max(0, startRow),
      endRow: Math.max(0, endRow),
      cellData,
    };
    if (collectBlocks) blocks.push(block);
    emittedBlocks += 1;
    await options.onBlock?.(block);

    const percent = Math.min(95, 20 + Math.round((emittedBlocks / blockCount) * 75));
    options.onProgress?.({
      percent,
      parsedBlocks: emittedBlocks,
      totalBlocks: blockCount,
      phase: 'convert',
    });
  }

  const meta: ChunkedWorkbookMeta = {
    parseEngine: 'exceljs',
    fileName,
    name: fileName.replace(/\.(xlsx|csv)$/i, '') || 'workbook',
    sheetOrder: [sheetId],
    sheets: [
      {
        id: sheetId,
        name: 'Sheet1',
        rowCount: Math.max(cappedRows, 1),
        columnCount: Math.max(maxCol, 1),
        blockCount,
      },
    ],
    blockRowSize,
    truncated: truncated || undefined,
    maxRows: requestedMaxRows === 0 ? 0 : Number.isFinite(maxRows) ? maxRows : 0,
    workbookId,
  };

  options.onProgress?.({
    percent: 100,
    parsedBlocks: emittedBlocks,
    totalBlocks: blockCount,
    phase: 'done',
  });

  return { meta, blocks };
};

/**
 * ExcelJS 全量 load 后按行块输出。
 * 大文件请在 Worker 中调用，避免堵死 Nest / 浏览器主线程。
 * `.csv` 走文本解析（无样式），再按同样块协议输出。
 */
export const excelBufferToChunkedWorkbook = async (
  input: ExcelBinary,
  options: ChunkedConvertOptions = {},
): Promise<{ meta: ChunkedWorkbookMeta; blocks: ChunkedBlock[] }> => {
  const fileName = options.fileName || 'workbook.xlsx';
  if (isCsvFileName(fileName)) {
    return csvBufferToChunkedWorkbook(input, options);
  }

  const blockRowSize = Math.max(100, options.blockRowSize || DEFAULT_BLOCK_ROW_SIZE);
  const requestedMaxRows = options.maxRows ?? DEFAULT_MAX_ROWS;
  const maxRows = requestedMaxRows === 0 ? Number.POSITIVE_INFINITY : requestedMaxRows;
  const includeStyles = options.includeStyles !== false;
  const styleInterner = includeStyles ? new StyleInterner() : null;
  const workbookId = options.workbookId || `wb-chunked-${Date.now()}`;

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
  /** 有 onBlock 时边写边丢，避免大文件堆里再攒一份 blocks */
  const collectBlocks = typeof options.onBlock !== 'function';
  const blocks: ChunkedBlock[] = [];
  let truncated = false;
  let emittedBlocks = 0;

  // 先扫一遍估算 totalBlocks，便于进度
  const sheetInfos = workbook.worksheets.map((worksheet, sheetIndex) => {
    const id = `sheet-${sheetIndex}`;
    const actualRowCount = resolveWorksheetRowCount(worksheet);
    const cappedRows = Math.min(actualRowCount, maxRows);
    if (actualRowCount > maxRows) truncated = true;
    const blockCount = Math.max(1, Math.ceil(Math.max(cappedRows, 1) / blockRowSize));
    return { worksheet, sheetIndex, id, sheetId: id, cappedRows, blockCount, actualRowCount };
  });

  const totalBlocks = sheetInfos.reduce((sum, info) => sum + info.blockCount, 0) || 1;

  for (const info of sheetInfos) {
    const { worksheet, sheetIndex, id, cappedRows, blockCount } = info;
    sheetOrder.push(id);

    let maxCol = 0;
    const columnData: Record<number, { w?: number; hd?: number }> = {};
    worksheet.columns?.forEach((col, idx) => {
      if (!col) return;
      if (col.width != null || col.values?.length) {
        maxCol = Math.max(maxCol, idx + 1);
      }
      // Excel 列宽为字符宽，与 SheetJS 一致按 ≈8px/字符转 Univer w
      if (col.width != null && Number.isFinite(col.width)) {
        columnData[idx] = { w: Math.round(Number(col.width) * 8) };
      }
      if (col.hidden) {
        columnData[idx] = { ...(columnData[idx] || {}), hd: 1 };
      }
    });

    // 行高在转 cell 时顺带收集，避免对大表先全量 getRow
    const rowData: Record<number, { h?: number; hd?: number }> = {};
    const mergeData = collectMerges(worksheet, cappedRows);

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
      const startRow = blockIndex * blockRowSize;
      const endRow = Math.min(cappedRows, startRow + blockRowSize) - 1;
      const cellData: Record<number, Record<number, ICellData>> = {};

      if (cappedRows > 0 && endRow >= startRow) {
        for (let excelRow = startRow + 1; excelRow <= endRow + 1; excelRow += 1) {
          const row = worksheet.getRow(excelRow);
          const height = row.height;
          if (height != null && Number.isFinite(height)) {
            rowData[excelRow - 1] = {
              ...(rowData[excelRow - 1] || {}),
              h: Math.round(Number(height) * (4 / 3)),
            };
          }
          if (row.hidden) {
            rowData[excelRow - 1] = { ...(rowData[excelRow - 1] || {}), hd: 1 };
          }
          if (includeStyles) {
            // 必须包含 ValueType.Null 但有样式的格子：Excel 常把竖线写在空单元格的 border 上，
            // eachCell({ includeEmpty: false }) 会跳过它们，导致右侧竖线丢失。
            let rowMaxCol = maxCol;
            eachExistingCell(row, (cell, colNumber) => {
              const mapped = cellFromExcelJs(cell, styleInterner);
              if (!mapped) return;
              const r = excelRow - 1;
              const c = colNumber - 1;
              if (!cellData[r]) cellData[r] = {};
              cellData[r][c] = mapped;
              rowMaxCol = Math.max(rowMaxCol, colNumber);
            });
            maxCol = rowMaxCol;
          } else {
            const values = row.values;
            if (!Array.isArray(values)) continue;
            for (let colNumber = 1; colNumber < values.length; colNumber += 1) {
              const mapped = mapPlainValue(values[colNumber]);
              if (!mapped) continue;
              const r = excelRow - 1;
              const c = colNumber - 1;
              if (!cellData[r]) cellData[r] = {};
              cellData[r][c] = mapped;
              maxCol = Math.max(maxCol, colNumber);
            }
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

      if (collectBlocks) blocks.push(block);
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

    const freeze = collectWorksheetFreeze(worksheet);
    sheetsMeta.push({
      id,
      name: worksheet.name || `Sheet${sheetIndex + 1}`,
      rowCount: Math.max(cappedRows, 1),
      columnCount: Math.max(maxCol, 1),
      blockCount,
      mergeData: mergeData.length ? mergeData : undefined,
      columnData: Object.keys(columnData).length ? columnData : undefined,
      rowData: Object.keys(rowData).length ? rowData : undefined,
      freeze,
    });
  }

  const resources = collectWorkbookDrawingResources(workbook, sheetInfos, workbookId);

  // 与 Lucky handleImage 一致：浮动图 to 超出当前行列时扩大 sheet 范围
  if (resources?.length) {
    try {
      const drawingPayload = JSON.parse(resources[0].data) as Record<
        string,
        { data?: Record<string, { sheetTransform?: { to?: { column?: number; row?: number } } }> }
      >;
      sheetsMeta.forEach((sheet) => {
        const drawings = drawingPayload[sheet.id]?.data;
        if (!drawings) return;
        Object.values(drawings).forEach((drawing) => {
          const to = drawing?.sheetTransform?.to;
          if (!to) return;
          const toCol = Number(to.column) || 0;
          const toRow = Number(to.row) || 0;
          if (toCol + 1 > sheet.columnCount) sheet.columnCount = toCol + 1;
          if (toRow + 1 > sheet.rowCount) sheet.rowCount = toRow + 1;
        });
      });
    } catch {
      // ignore
    }
  }

  const meta: ChunkedWorkbookMeta = {
    parseEngine: 'exceljs',
    fileName,
    name: fileName.replace(/\.(xlsx|csv)$/i, '') || 'workbook',
    sheetOrder,
    sheets: sheetsMeta,
    blockRowSize,
    truncated: truncated || undefined,
    maxRows: requestedMaxRows === 0 ? 0 : Number.isFinite(maxRows) ? maxRows : 0,
    styles:
      styleInterner && Object.keys(styleInterner.styles).length
        ? styleInterner.styles
        : undefined,
    resources,
    workbookId,
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
