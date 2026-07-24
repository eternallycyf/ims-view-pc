/** Minimal Univer workbook types for ExcelJS conversion */

export enum CellValueType {
  STRING = 1,
  NUMBER = 2,
  BOOLEAN = 3,
  FORCE_STRING = 4,
}

export type ICellData = {
  v?: string | number | boolean;
  t?: CellValueType;
  f?: string;
  si?: string;
  s?: string | Record<string, unknown>;
  p?: unknown;
  custom?: Record<string, unknown>;
};

export type IRange = {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
};

export type IWorksheetData = {
  id: string;
  name: string;
  cellData?: Record<number, Record<number, ICellData>>;
  mergeData?: IRange[];
  rowCount?: number;
  columnCount?: number;
  columnData?: Record<number, { w?: number; hd?: number }>;
  rowData?: Record<number, { h?: number; hd?: number }>;
  freeze?: {
    xSplit: number;
    ySplit: number;
    startRow: number;
    startColumn: number;
  };
  defaultColumnWidth?: number;
  defaultRowHeight?: number;
};

export type IWorkbookData = {
  id?: string;
  name?: string;
  appVersion?: string;
  locale?: string;
  styles?: Record<string, unknown>;
  sheetOrder?: string[];
  sheets?: Record<string, Partial<IWorksheetData>>;
  resources?: Array<{ name: string; data: string }>;
};

export type ExcelBinary = ArrayBuffer | Uint8Array | Buffer;
