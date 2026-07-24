import type { FUniver, ICellData, IWorkbookData } from '@univerjs/presets';

export type ChunkedSheetMeta = {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
  blockCount: number;
  mergeData?: Array<{
    startRow: number;
    startColumn: number;
    endRow: number;
    endColumn: number;
  }>;
  /** 列宽 / 隐藏列（与 LuckyExcel snapshot 对齐） */
  columnData?: Record<number, { w?: number; hd?: number }>;
  /** 行高 / 隐藏行 */
  rowData?: Record<number, { h?: number; hd?: number }>;
  defaultColumnWidth?: number;
  defaultRowHeight?: number;
};

export type ChunkedWorkbookMeta = {
  parseEngine: 'luckyexcel' | 'exceljs';
  fileName: string;
  name: string;
  sheetOrder: string[];
  sheets: ChunkedSheetMeta[];
  blockRowSize: number;
  truncated?: boolean;
  maxRows?: number;
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
  cellData: Record<number, Record<number, ICellData>>;
};

/** 骨架含 styles/resources/列宽行高，与 LuckyExcel snapshot 对齐，避免丢图丢布局 */
export const skeletonWorkbookFromMeta = (meta: ChunkedWorkbookMeta): Partial<IWorkbookData> => {
  const sheets: NonNullable<IWorkbookData['sheets']> = {};

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

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * 骨架 createWorkbook 后，按块 setValues 渐进挂载。
 * getRange(row, col, numRows, numColumns) —— 后两个是数量不是 end 下标。
 */
export const mountChunkedBlocks = async (
  univerAPI: FUniver,
  meta: ChunkedWorkbookMeta,
  fetchBlock: (sheetIndex: number, blockIndex: number) => Promise<ChunkedBlock>,
  onProgress?: (percent: number) => void,
) => {
  const workbook = univerAPI.getActiveWorkbook?.();
  if (!workbook) {
    throw new Error('渐进挂载失败：无活动工作簿');
  }

  const totalBlocks = Math.max(
    1,
    meta.sheets.reduce((sum, sheet) => sum + sheet.blockCount, 0),
  );
  let done = 0;

  for (let sheetIndex = 0; sheetIndex < meta.sheets.length; sheetIndex += 1) {
    const sheetMeta = meta.sheets[sheetIndex];
    const sheet =
      workbook.getSheetBySheetId?.(sheetMeta.id) ||
      workbook.getSheetByName?.(sheetMeta.name) ||
      null;

    if (!sheet) {
      done += sheetMeta.blockCount;
      onProgress?.(Math.min(99, Math.round((done / totalBlocks) * 100)));
      continue;
    }

    for (let blockIndex = 0; blockIndex < sheetMeta.blockCount; blockIndex += 1) {
      const block = await fetchBlock(sheetIndex, blockIndex);
      const cellData = block.cellData || {};
      const rowKeys = Object.keys(cellData)
        .map(Number)
        .filter((n) => Number.isFinite(n));

      if (rowKeys.length) {
        const startRow = Math.min(...rowKeys);
        const endRow = Math.max(...rowKeys);
        let startCol = Number.POSITIVE_INFINITY;
        let endCol = 0;
        rowKeys.forEach((r) => {
          Object.keys(cellData[r] || {}).forEach((c) => {
            const col = Number(c);
            startCol = Math.min(startCol, col);
            endCol = Math.max(endCol, col);
          });
        });

        if (Number.isFinite(startCol)) {
          const relative: Record<number, Record<number, ICellData>> = {};
          rowKeys.forEach((r) => {
            const row = cellData[r];
            if (!row) return;
            Object.keys(row).forEach((c) => {
              const col = Number(c);
              const cell = row[col];
              if (!cell) return;
              const rr = r - startRow;
              const cc = col - startCol;
              if (!relative[rr]) relative[rr] = {};
              relative[rr][cc] = cell;
            });
          });

          const numRows = endRow - startRow + 1;
          const numCols = endCol - startCol + 1;
          const range = sheet.getRange?.(startRow, startCol, numRows, numCols);
          range?.setValues?.(relative);
        }
      }

      done += 1;
      onProgress?.(Math.min(99, Math.round((done / totalBlocks) * 100)));
      await sleep(0);
    }
  }

  onProgress?.(100);
};
