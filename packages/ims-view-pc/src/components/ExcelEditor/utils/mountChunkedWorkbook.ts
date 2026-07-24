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
  /** 冻结窗格（锁定行列） */
  freeze?: {
    xSplit: number;
    ySplit: number;
    startRow: number;
    startColumn: number;
  };
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

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const mergeCellData = (
  target: Record<number, Record<number, ICellData>>,
  source: Record<number, Record<number, ICellData>>,
) => {
  Object.keys(source || {}).forEach((rowKey) => {
    const r = Number(rowKey);
    if (!Number.isFinite(r)) return;
    const row = source[r];
    if (!row) return;
    if (!target[r]) target[r] = {};
    Object.keys(row).forEach((colKey) => {
      const c = Number(colKey);
      if (!Number.isFinite(c)) return;
      const cell = row[c];
      if (cell) target[r][c] = cell;
    });
  });
};

/**
 * 拉取全部分块并合并进骨架，返回可一次性 createWorkbook 的完整数据。
 * 不用逐块 setValues：Facade 对大表后续分块容易只留下第一块（≈5000 行）有数。
 */
export const assembleChunkedWorkbook = async (
  meta: ChunkedWorkbookMeta,
  fetchBlock: (sheetIndex: number, blockIndex: number) => Promise<ChunkedBlock>,
  onProgress?: (percent: number) => void,
): Promise<Partial<IWorkbookData>> => {
  const workbook = skeletonWorkbookFromMeta(meta);
  const sheets = workbook.sheets || {};
  const totalBlocks = Math.max(
    1,
    meta.sheets.reduce((sum, sheet) => sum + sheet.blockCount, 0),
  );
  let done = 0;

  for (let sheetIndex = 0; sheetIndex < meta.sheets.length; sheetIndex += 1) {
    const sheetMeta = meta.sheets[sheetIndex];
    const sheet = sheets[sheetMeta.id];
    if (!sheet) {
      done += sheetMeta.blockCount;
      onProgress?.(Math.min(99, Math.round((done / totalBlocks) * 100)));
      continue;
    }

    const cellData: Record<number, Record<number, ICellData>> = {
      ...(sheet.cellData || {}),
    };

    for (let blockIndex = 0; blockIndex < sheetMeta.blockCount; blockIndex += 1) {
      const block = await fetchBlock(sheetIndex, blockIndex);
      mergeCellData(cellData, block.cellData || {});
      done += 1;
      onProgress?.(Math.min(99, Math.round((done / totalBlocks) * 100)));
      // 让出主线程，避免合并大 JSON 时页面完全卡死
      if (done % 2 === 0) await sleep(0);
    }

    sheet.cellData = cellData;
    // 按实际合并结果再抬一次行数，防止 meta.rowCount 偏小导致表尾空白
    let maxRow = sheet.rowCount || 1;
    Object.keys(cellData).forEach((key) => {
      const r = Number(key);
      if (Number.isFinite(r)) maxRow = Math.max(maxRow, r + 1);
    });
    sheet.rowCount = Math.max(maxRow, sheetMeta.rowCount || 1, 1);
  }

  onProgress?.(100);
  return workbook;
};

/**
 * @deprecated 保留给调试；正式路径请用 assembleChunkedWorkbook + createWorkbook
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
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => a - b);

      if (rowKeys.length) {
        const startRow = rowKeys[0];
        const endRow = rowKeys[rowKeys.length - 1];
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
          const numRows = endRow - startRow + 1;
          const numCols = endCol - startCol + 1;
          // 用二维数组，避免 sparse object 在部分 Facade 版本上丢行
          const matrix: Array<Array<ICellData | null>> = Array.from({ length: numRows }, () =>
            Array.from({ length: numCols }, () => null),
          );
          rowKeys.forEach((r) => {
            const row = cellData[r];
            if (!row) return;
            Object.keys(row).forEach((c) => {
              const col = Number(c);
              const cell = row[col];
              if (!cell) return;
              matrix[r - startRow][col - startCol] = cell;
            });
          });

          const range =
            sheet.getRange?.({
              startRow,
              startColumn: startCol,
              endRow,
              endColumn: endCol,
            }) || sheet.getRange?.(startRow, startCol, numRows, numCols);

          if (!range?.setValues) {
            throw new Error(
              `挂载分块失败：sheet=${sheetMeta.name} block=${blockIndex} 无 setValues`,
            );
          }
          range.setValues(matrix);
        }
      }

      done += 1;
      onProgress?.(Math.min(99, Math.round((done / totalBlocks) * 100)));
      await sleep(0);
    }
  }

  onProgress?.(100);
};
