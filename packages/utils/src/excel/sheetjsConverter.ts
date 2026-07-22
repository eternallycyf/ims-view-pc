import * as XLSX from 'xlsx';
import {
  CellValueType,
  type ExcelBinary,
  type ICellData,
  type IWorkbookData,
  type IWorksheetData,
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

const hasUsefulSheetJsData = (wb: XLSX.WorkBook): boolean => {
  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name];
    if (!sheet) continue;
    for (const key of Object.keys(sheet)) {
      if (key.startsWith('!')) continue;
      const cell = sheet[key] as XLSX.CellObject;
      if (cell && (cell.v != null || cell.w != null || cell.f)) return true;
    }
  }
  return false;
};

/** SheetJS 读取（对齐 excel demo 的兜底策略） */
export const readExcelWithSheetJs = (input: ExcelBinary): XLSX.WorkBook => {
  const bytes = toUint8Array(input);
  const base = {
    type: 'array' as const,
    cellDates: true,
    cellNF: true,
    cellText: true,
  };

  try {
    const wb = XLSX.read(bytes, base);
    if (hasUsefulSheetJsData(wb)) return wb;
  } catch {
    // continue
  }

  return XLSX.read(bytes, { ...base, raw: false });
};

const cellFromSheetJs = (cell: XLSX.CellObject | undefined): ICellData | null => {
  if (!cell || (cell.v == null && cell.w == null && !cell.f)) return null;

  // 优先展示文本（与 excel demo / aaa.html 一致，优先用 w）
  const display = cell.w != null ? String(cell.w) : null;
  let value: string | number | boolean = cell.v as string | number | boolean;
  let type = CellValueType.STRING;

  if (cell.t === 'n' || typeof cell.v === 'number') {
    type = CellValueType.NUMBER;
    value = typeof cell.v === 'number' ? cell.v : Number(cell.v);
  } else if (cell.t === 'b' || typeof cell.v === 'boolean') {
    type = CellValueType.BOOLEAN;
    value = Boolean(cell.v);
  } else if (cell.v instanceof Date) {
    type = CellValueType.STRING;
    value = display || cell.v.toLocaleString();
  } else {
    type = CellValueType.STRING;
    value = display || String(cell.v ?? '');
  }

  if (cell.f) {
    const formula = String(cell.f).startsWith('=') ? String(cell.f) : `=${cell.f}`;
    return { f: formula, v: value, t: type };
  }

  if (value === '' && display == null) return null;
  return { v: value, t: type };
};

/** SheetJS → Univer IWorkbookData（与 excel demo 一致，可正确渲染单元格） */
export const workbookFromSheetJs = (
  wb: XLSX.WorkBook,
  fileName = 'workbook.xlsx',
): Partial<IWorkbookData> => {
  const sheets: Record<string, Partial<IWorksheetData>> = {};
  const sheetOrder: string[] = [];

  wb.SheetNames.forEach((name, index) => {
    const id = `sheet-${index}`;
    const sheet = wb.Sheets[name] || {};
    const cellData: Record<number, Record<number, ICellData>> = {};
    let maxRow = 0;
    let maxCol = 0;

    if (sheet['!ref']) {
      const range = XLSX.utils.decode_range(sheet['!ref']);
      for (let r = range.s.r; r <= range.e.r; r += 1) {
        for (let c = range.s.c; c <= range.e.c; c += 1) {
          const addr = XLSX.utils.encode_cell({ r, c });
          const mapped = cellFromSheetJs(sheet[addr] as XLSX.CellObject | undefined);
          if (!mapped) continue;
          if (!cellData[r]) cellData[r] = {};
          cellData[r][c] = mapped;
          maxRow = Math.max(maxRow, r);
          maxCol = Math.max(maxCol, c);
        }
      }
    }

    const merges = (sheet['!merges'] || []).map((m) => ({
      startRow: m.s.r,
      startColumn: m.s.c,
      endRow: m.e.r,
      endColumn: m.e.c,
    }));

    // 合并区只保留左上角内容
    for (const m of merges) {
      const master = cellData[m.startRow]?.[m.startColumn];
      for (let r = m.startRow; r <= m.endRow; r += 1) {
        if (!cellData[r]) continue;
        for (let c = m.startColumn; c <= m.endColumn; c += 1) {
          if (r === m.startRow && c === m.startColumn) continue;
          delete cellData[r][c];
        }
      }
      if (master) {
        if (!cellData[m.startRow]) cellData[m.startRow] = {};
        cellData[m.startRow][m.startColumn] = master;
      }
    }

    const columnData: Record<number, { w?: number }> = {};
    if (sheet['!cols']) {
      sheet['!cols'].forEach((col, i) => {
        if (!col) return;
        if (col.wpx) columnData[i] = { w: col.wpx };
        else if (col.width) columnData[i] = { w: Math.round(col.width * 8) };
      });
    }

    sheetOrder.push(id);
    sheets[id] = {
      id,
      name: name || `Sheet${index + 1}`,
      rowCount: Math.max(maxRow + 50, 100),
      columnCount: Math.max(maxCol + 10, 26),
      cellData,
      columnData,
      mergeData: merges,
    };
  });

  if (!sheetOrder.length) {
    sheetOrder.push('sheet-0');
    sheets['sheet-0'] = {
      id: 'sheet-0',
      name: 'Sheet1',
      rowCount: 100,
      columnCount: 26,
      cellData: {},
      mergeData: [],
    };
  }

  return {
    id: `wb-${Date.now()}`,
    name: fileName,
    appVersion: '0.25.1',
    locale: 'zhCN',
    styles: {},
    sheetOrder,
    sheets,
  };
};

export const workbookHasCellValues = (data: Partial<IWorkbookData>): boolean => {
  const sheets = data.sheets || {};
  for (const sheet of Object.values(sheets)) {
    const cellData = sheet?.cellData || {};
    for (const row of Object.values(cellData)) {
      if (!row) continue;
      for (const cell of Object.values(row)) {
        if (cell && (cell.v != null || cell.f)) return true;
      }
    }
  }
  return false;
};

/** 二进制 → SheetJS → Univer（单元格主路径） */
export const excelBufferToWorkbookDataBySheetJs = (
  input: ExcelBinary,
  fileName = 'workbook.xlsx',
): Partial<IWorkbookData> => {
  const wb = readExcelWithSheetJs(input);
  return workbookFromSheetJs(wb, fileName);
};
