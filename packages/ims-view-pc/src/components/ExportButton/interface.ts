import { AnyData, IColumnsType, RequestData } from 'ims-view-pc';

type Request<DataType = AnyData, Params = RequestParams> = (
  params: Params,
) => Promise<Partial<RequestData<DataType>>>;

type RequestParams<Params = AnyData> = Params & {
  page: 1;
  limit: -1;
};

export interface IBaseExportButtonProps<DataType = AnyData, Params = RequestParams> {
  params?: Params;
  request?: Request<DataType, Params>;
  dataSource?: DataType[];
  columns?: IColumnsType<DataType>;
  fileName?: string;
}

// Excel Style Types
export type ExcelAlignment = {
  vertical?: 'top' | 'middle' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  wrapText?: boolean;
};

export type ExcelFill = {
  type?: 'pattern';
  pattern?: 'solid' | 'darkVertical' | 'darkHorizontal' | 'darkGrid';
  fgColor?: { argb: string };
};

export type ExcelBorder = {
  top?: { style: 'thin' | 'medium' | 'thick'; color: { argb: string } };
  left?: { style: 'thin' | 'medium' | 'thick'; color: { argb: string } };
  bottom?: { style: 'thin' | 'medium' | 'thick'; color: { argb: string } };
  right?: { style: 'thin' | 'medium' | 'thick'; color: { argb: string } };
};

export type ExcelFont = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: { argb: string };
  size?: number;
  name?: string;
};

export type ExcelCellStyle = {
  alignment?: ExcelAlignment;
  fill?: ExcelFill;
  border?: ExcelBorder;
  font?: ExcelFont;
  numFmt?: string;
};

export type ExcelRowStyle = {
  height?: number;
  font?: ExcelFont;
};

export type ExcelColumnStyle = {
  width?: number;
};

export type ExcelCellFormat = {
  formula?: string;
  result?: any;
  date1904?: boolean;
};

export type ExcelImageConfig = {
  width?: number;
  height?: number;
};

export type ExcelCellData = {
  text?: string | string[];
  format?: ExcelCellFormat;
  style?: ExcelCellStyle;
  image?: ExcelImageConfig;
};

// Cell and Table Types
export type CellPosition = {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  isNeedMerge?: boolean;
};

export type Cell = CellPosition & {
  text?: string | string[];
  format?: ExcelCellFormat;
  style?: ExcelCellStyle;
  isImage?: boolean;
  image?: ExcelImageConfig;
};

export type TableData = {
  cells: Cell[];
  columnStyle: ExcelColumnStyle[];
  rowStyle: ExcelRowStyle[];
  rowLength: number;
};

export type TableType = 'header' | 'main' | 'footer' | 'insert-header';

// Map Table Types
export type MapTableHooks = {
  beforeMapCreateColumn?: () => void;
  mapCreateColumned?: () => void;
  beforeMapCreateData?: () => void;
  mapCreateDataed?: () => void;
  mounted?: () => void;
};

export type MapCreateColumnParams = {
  columnLen: number;
};

export type MapCreateDataParams<DataType = AnyData> = {
  data?: any;
  row?: DataType;
  rowIndex: number;
  column?: any;
  columnIndex: number;
};

export type MapCreateDataResult = {
  key: string;
  value: any;
  excel?: ExcelCellData;
};

export type SpanMethodParams<DataType = AnyData> = {
  row: DataType;
  column: any;
  rowIndex: number;
  columnIndex: number;
};

export type SpanMethodResult = {
  rowspan: number;
  colspan: number;
};

export type MapTableOptions<DataType = AnyData> = {
  data?: any;
  hooks?: MapTableHooks;
  field?: string;
  startCol?: number;
  mapCreateColumn?: (params: MapCreateColumnParams) => any[];
  mapCreateData?: (params: MapCreateDataParams<DataType>) => MapCreateDataResult | undefined;
  spanMethod?: (params: SpanMethodParams<DataType>) => SpanMethodResult;
};

export type TableResult = {
  columns: any[];
  data: any[];
  mergeCells: Cell[];
  excel: {
    columnStyle: ExcelColumnStyle[];
    rowStyle: ExcelRowStyle[];
  };
};

// Exporter Types
export type SheetOptions = {
  properties?: any;
  views?: any[];
  pageSetup?: any;
};

export type SheetCallbackParams = {
  worksheet: any;
  sheetIndex: number;
};

export type TableConfig = {
  sheetName?: string;
  options?: SheetOptions;
  headerData?: TableData;
  mainData?: TableData;
  footerData?: TableData;
  insertHeaderData?: TableData;
  sheetCallback?: (params: SheetCallbackParams) => void;
};

export type ExporterOptions = {
  tables: TableConfig[];
  progress?: (percentage: number) => void;
  keepAlive?: boolean;
};

interface RenderCellParams<DataType = AnyData> {
  data?: any;
  type?: TableType;
  row?: DataType;
  column?: IColumnsType<DataType> extends Array<infer T> ? T : never;
  rowIndex?: number;
  columnIndex?: number;
}

interface TreeConfig {
  treeNode?: boolean;
  treeField?: string;
  indentSize?: number;
}

export interface IExportButtonProps<DataType = AnyData, Params = RequestParams>
  extends IBaseExportButtonProps<DataType, Params> {
  handleProgressOnChange?: (progress: number) => any;
  renderCell?: (...args: RenderCellParams[]) => { rowspan?: number; colspan?: number } | undefined;
  treeConfig?: TreeConfig;
  sheetName?: string;

  setSheetStyle?: (params: SheetCallbackParams) => void;
  setInsertHeader?: (params: MapCreateDataParams<DataType>) => MapCreateDataResult | undefined;
  setInsertFooter?: (params: MapCreateDataParams<DataType>) => MapCreateDataResult | undefined;
  setImageStyle?: (params: RenderCellParams<DataType>) => ExcelImageConfig;
  setWorkSheet?: (params: SheetCallbackParams) => void;
  setColumnStyle?: (params: RenderCellParams<DataType>) => ExcelColumnStyle;
  /**
   *
   * @example
   * ```tsx
   * setRowStyle={(data, type, row, rowIndex) => {
   *   if(type == 'header') return { font: {bold:true},height:44 }
   *   if(type == 'main') return { height:30 }
   * }}
   * ```
   */
  setRowStyle?: (params: RenderCellParams<DataType>) => ExcelRowStyle;
  /**
   *
   * @example
   * ```tsx
   * setCellStyle={(data, type, row, rowIndex) => {
   *   if(type == 'main') return {style:{alignment:{vertical:'middle',horizontal:'left',wrapText:true}}}
   * }}
   * ```
   */
  setCellStyle?: (params: RenderCellParams<DataType>) => ExcelCellStyle;
  setCellFormat?: (params: RenderCellParams<DataType>) => ExcelCellFormat;

  isMultiple?: boolean;
  multipleConfig?: {
    columns?: IColumnsType<DataType>;
    data?: DataType[];
    sheetName?: string;
    [props: string]: any;
  }[];
}
