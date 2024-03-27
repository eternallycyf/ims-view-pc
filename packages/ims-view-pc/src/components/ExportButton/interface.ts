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

interface RenderCellParams<DataType = AnyData> {
  data?: any;
  type?: any;
  row?: DataType;
  column?: IColumnsType<DataType> extends Array<infer T> ? T : never;
  rowIndex?: number;
  columnIndex?: number;
}

interface TreeConfig {
  treeNode?: boolean;
  treeField?: 'name';
  indentSize?: number;
}

export interface IExportButtonProps<DataType = AnyData, Params = RequestParams>
  extends IBaseExportButtonProps<DataType, Params> {
  handleProgressOnChange?: (progress: number) => any;
  renderCell?: (...args: RenderCellParams[]) => { rowspan?: number; colspan?: number } | undefined;
  treeConfig?: TreeConfig;
  sheetName?: string;

  //TODO
  setSheetStyle?: any;
  setInsertHeader?: any;
  setInsertFooter?: any;
  setImageStyle?: any;
  setWorkSheet?: any;
  setColumnStyle?: (...args: RenderCellParams[]) => React.CSSProperties;
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
  setRowStyle?: (...args: RenderCellParams[]) => React.CSSProperties;
  /**
   *
   * @example
   * ```tsx
   * setCellStyle={(data, type, row, rowIndex) => {
   *   if(type == 'main') return {style:{alignment:{vertical:'middle',horizontal:'left',wrapText:true}}}
   * }}
   * ```
   */
  setCellStyle?: (...args: RenderCellParams[]) => React.CSSProperties;
  setCellFormat?: (...args: RenderCellParams[]) => React.CSSProperties;

  isMultiple?: boolean;
  multipleConfig?: {
    columns?: IColumnsType<DataType>;
    data?: DataType[];
    sheetName?: string;
    [props: string]: any;
  }[];
}
