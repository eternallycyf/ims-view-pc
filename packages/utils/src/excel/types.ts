/** Minimal Univer workbook snapshot types（无 @univerjs 运行时依赖，Node / 浏览器共用） */

export enum CellValueType {
  STRING = 1,
  NUMBER = 2,
  BOOLEAN = 3,
}

export interface ICellData {
  v?: string | number | boolean;
  t?: CellValueType;
  f?: string;
}

export interface IRange {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
}

export interface IWorksheetData {
  id: string;
  name: string;
  cellData?: Record<number, Record<number, ICellData>>;
  mergeData?: IRange[];
  rowCount?: number;
  columnCount?: number;
  columnData?: Record<number, { w?: number; hd?: number }>;
}

export interface IWorkbookData {
  id?: string;
  name?: string;
  appVersion?: string;
  locale?: string;
  styles?: Record<string, unknown>;
  sheetOrder?: string[];
  sheets?: Record<string, Partial<IWorksheetData>>;
}

export type ExcelSheetImage = {
  sheetId: string;
  dataUrl: string;
  col: number;
  row: number;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
};

export type ExcelImportResult = {
  workbookData: Partial<IWorkbookData>;
  images: ExcelSheetImage[];
};

export type ExcelBinary = ArrayBuffer | Uint8Array;
