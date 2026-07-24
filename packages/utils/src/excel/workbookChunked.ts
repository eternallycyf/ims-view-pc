/**
 * 将已有 IWorkbookData（LuckyExcel / SheetJS 等解析结果）按行切块。
 * 大文件只优化落盘与渐进挂载，不改解析引擎。
 */
import {
  DEFAULT_BLOCK_ROW_SIZE,
  DEFAULT_MAX_ROWS,
  type ChunkedBlock,
  type ChunkedProgress,
  type ChunkedSheetMeta,
  type ChunkedWorkbookMeta,
} from './exceljsChunked';
import type { ICellData, IRange, IWorkbookData, IWorksheetData } from './types';

export type SplitWorkbookOptions = {
  fileName?: string;
  blockRowSize?: number;
  /** 0 = 不截断 */
  maxRows?: number;
  onProgress?: (progress: ChunkedProgress) => void;
  onBlock?: (block: ChunkedBlock) => void | Promise<void>;
};

const sheetMaxRow = (cellData?: Record<number, Record<number, ICellData>>) => {
  if (!cellData) return 0;
  let max = -1;
  Object.keys(cellData).forEach((key) => {
    const row = Number(key);
    if (Number.isFinite(row)) max = Math.max(max, row);
  });
  return max + 1;
};

const sheetMaxCol = (cellData?: Record<number, Record<number, ICellData>>) => {
  if (!cellData) return 0;
  let max = -1;
  Object.values(cellData).forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      const col = Number(key);
      if (Number.isFinite(col)) max = Math.max(max, col);
    });
  });
  return max + 1;
};

const clipMerges = (merges: IRange[] | undefined, maxRowExclusive: number): IRange[] | undefined => {
  if (!merges?.length) return undefined;
  const next = merges
    .filter((m) => m.startRow < maxRowExclusive)
    .map((m) => ({
      ...m,
      endRow: Math.min(m.endRow, maxRowExclusive - 1),
    }));
  return next.length ? next : undefined;
};

/** 截断后只保留仍可见行的行高，避免骨架带着无效 rowData */
const clipRowData = (
  rowData: Record<number, { h?: number; hd?: number }> | undefined,
  maxRowExclusive: number,
): Record<number, { h?: number; hd?: number }> | undefined => {
  if (!rowData) return undefined;
  const next: Record<number, { h?: number; hd?: number }> = {};
  Object.keys(rowData).forEach((key) => {
    const row = Number(key);
    if (!Number.isFinite(row) || row < 0 || row >= maxRowExclusive) return;
    next[row] = rowData[row];
  });
  return Object.keys(next).length ? next : undefined;
};

const sliceCellData = (
  cellData: Record<number, Record<number, ICellData>> | undefined,
  startRow: number,
  endRow: number,
): Record<number, Record<number, ICellData>> => {
  const out: Record<number, Record<number, ICellData>> = {};
  if (!cellData) return out;
  for (let r = startRow; r <= endRow; r += 1) {
    const row = cellData[r];
    if (!row) continue;
    out[r] = row;
  }
  return out;
};

/**
 * LuckyExcel（或其它引擎）产出的 workbook → meta + blocks。
 * 保留 styles / resources（含图片）/ merge / 单元格原样字段。
 */
export const splitWorkbookDataToChunks = async (
  workbookData: Partial<IWorkbookData>,
  options: SplitWorkbookOptions = {},
): Promise<{ meta: ChunkedWorkbookMeta; blocks: ChunkedBlock[] }> => {
  const fileName = options.fileName || workbookData.name || 'workbook.xlsx';
  const blockRowSize = Math.max(100, options.blockRowSize || DEFAULT_BLOCK_ROW_SIZE);
  const requestedMaxRows = options.maxRows ?? DEFAULT_MAX_ROWS;
  const maxRows = requestedMaxRows === 0 ? Number.POSITIVE_INFINITY : requestedMaxRows;

  options.onProgress?.({ percent: 35, parsedBlocks: 0, totalBlocks: 0, phase: 'convert' });

  const sheetOrder =
    workbookData.sheetOrder?.length
      ? [...workbookData.sheetOrder]
      : Object.keys(workbookData.sheets || {});

  const sheetsMeta: ChunkedSheetMeta[] = [];
  const blocks: ChunkedBlock[] = [];
  let truncated = false;
  let emittedBlocks = 0;

  const planned = sheetOrder.map((sheetId, sheetIndex) => {
    const sheet = (workbookData.sheets?.[sheetId] || {}) as Partial<IWorksheetData>;
    const dataRows = Math.max(sheetMaxRow(sheet.cellData), sheet.rowCount || 0);
    const cappedRows = Math.min(dataRows, maxRows);
    if (dataRows > maxRows) truncated = true;
    const blockCount = Math.max(1, Math.ceil(Math.max(cappedRows, 1) / blockRowSize));
    return { sheetId, sheetIndex, sheet, cappedRows, blockCount };
  });

  const totalBlocks = planned.reduce((sum, item) => sum + item.blockCount, 0) || 1;

  for (const item of planned) {
    const { sheetId, sheetIndex, sheet, cappedRows, blockCount } = item;
    const columnCount = Math.max(
      sheetMaxCol(sheet.cellData),
      sheet.columnCount || 0,
      1,
    );

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
      const startRow = blockIndex * blockRowSize;
      const endRow = Math.min(cappedRows, startRow + blockRowSize) - 1;
      const cellData =
        cappedRows > 0 && endRow >= startRow
          ? sliceCellData(sheet.cellData, startRow, endRow)
          : {};

      const block: ChunkedBlock = {
        sheetId,
        sheetIndex,
        blockIndex,
        startRow: Math.max(0, startRow),
        endRow: Math.max(0, endRow),
        cellData,
      };
      blocks.push(block);
      emittedBlocks += 1;
      await options.onBlock?.(block);

      options.onProgress?.({
        percent: Math.min(95, 35 + Math.round((emittedBlocks / totalBlocks) * 60)),
        parsedBlocks: emittedBlocks,
        totalBlocks,
        phase: 'convert',
      });
    }

    sheetsMeta.push({
      id: sheetId,
      name: sheet.name || `Sheet${sheetIndex + 1}`,
      rowCount: Math.max(cappedRows, 1),
      columnCount,
      blockCount,
      mergeData: clipMerges(sheet.mergeData, cappedRows),
      columnData: sheet.columnData,
      rowData: clipRowData(sheet.rowData, cappedRows),
      freeze: sheet.freeze,
      defaultColumnWidth: sheet.defaultColumnWidth,
      defaultRowHeight: sheet.defaultRowHeight,
    });
  }

  const meta: ChunkedWorkbookMeta = {
    parseEngine: 'luckyexcel',
    fileName,
    name: workbookData.name || fileName.replace(/\.xlsx$/i, '') || 'workbook',
    sheetOrder,
    sheets: sheetsMeta,
    blockRowSize,
    truncated: truncated || undefined,
    maxRows: requestedMaxRows === 0 ? 0 : Number.isFinite(maxRows) ? maxRows : 0,
    styles: workbookData.styles,
    resources: workbookData.resources,
    appVersion: workbookData.appVersion,
    locale: workbookData.locale,
    workbookId: workbookData.id,
  };

  options.onProgress?.({
    percent: 100,
    parsedBlocks: emittedBlocks,
    totalBlocks,
    phase: 'done',
  });

  return { meta, blocks };
};
