export type {
  ICellData,
  IRange,
  IWorkbookData,
  IWorksheetData,
} from '@ims-view/utils';
export { CellValueType } from '@ims-view/utils';

export interface ExportExcelDto {
  data: Partial<import('@ims-view/utils').IWorkbookData>;
  fileName?: string;
}
