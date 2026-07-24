/** Minimal Univer workbook snapshot types（对齐官方 cell-data：https://docs.univer.ai/guides/sheets/model/cell-data） */

export enum CellValueType {
  /** 字符串 */
  STRING = 1,
  /** 数字 */
  NUMBER = 2,
  /** 布尔（v 存 0/1） */
  BOOLEAN = 3,
  /** 强制文本（如文本格式 / 前导 0） */
  FORCE_STRING = 4,
}

export interface ICellData {
  /** 原始值 */
  v?: string | number | boolean;
  /** CellValueType：1 string / 2 number / 3 boolean / 4 force text */
  t?: CellValueType;
  /** 公式 */
  f?: string;
  /** 公式引用 id */
  si?: string;
  /** 样式 id 或内联 IStyleData */
  s?: string | Record<string, unknown>;
  /** 富文本 / Univer Docs */
  p?: unknown;
  /** 自定义扩展字段 */
  custom?: Record<string, unknown>;
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
  rowData?: Record<number, { h?: number; hd?: number }>;
  freeze?: {
    xSplit: number;
    ySplit: number;
    startRow: number;
    startColumn: number;
  };
  defaultColumnWidth?: number;
  defaultRowHeight?: number;
  tabColor?: string;
  hidden?: number;
  zoomRatio?: number;
  scrollTop?: number;
  scrollLeft?: number;
  rowHeader?: { width: number; hidden?: number };
  columnHeader?: { height: number; hidden?: number };
  showGridlines?: number;
  rightToLeft?: number;
}

export interface IWorkbookData {
  id?: string;
  name?: string;
  appVersion?: string;
  locale?: string;
  styles?: Record<string, unknown>;
  sheetOrder?: string[];
  sheets?: Record<string, Partial<IWorksheetData>>;
  /** LuckyExcel / Univer plugin resources（含 SHEET_DRAWING_PLUGIN 图片等） */
  resources?: Array<{ name: string; data: string }>;
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
