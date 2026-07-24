import type { IWorkbookData } from '@univerjs/presets';
import {
  fileToImportResult,
  importExcelBinary,
  workbookDataToExcelBlob,
  type ExcelImportResult as SharedExcelImportResult,
  type ExcelSheetImage as SharedExcelSheetImage,
} from '@ims-view/utils';

export type ExcelSheetImage = SharedExcelSheetImage;
export type ExcelImportResult = SharedExcelImportResult;

export { fileToImportResult, workbookDataToExcelBlob };

/** 二进制 → 共用 utils（LuckyExcel 优先） */
export const excelBufferToImportResult = async (
  buffer: ArrayBuffer,
  fileName = 'workbook.xlsx',
): Promise<ExcelImportResult> => importExcelBinary(buffer, fileName);

export const excelBufferToWorkbookData = async (
  buffer: ArrayBuffer,
  fileName?: string,
): Promise<Partial<IWorkbookData>> => {
  const result = await excelBufferToImportResult(buffer, fileName);
  return result.workbookData as Partial<IWorkbookData>;
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  if (!blob) {
    throw new Error('导出结果为空');
  }
  const name = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
};

export const loadWorkbookDataFromUrl = async (src: string): Promise<Partial<IWorkbookData>> => {
  const result = await loadImportResultFromUrl(src);
  return result.workbookData as Partial<IWorkbookData>;
};

export const loadImportResultFromUrl = async (src: string): Promise<ExcelImportResult> => {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Excel 文件加载失败: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  if (!buffer || buffer.byteLength === 0) {
    throw new Error('Excel 文件内容为空');
  }
  const fileName = src.split('?')[0].split('/').pop() || 'workbook.xlsx';
  return excelBufferToImportResult(buffer, fileName);
};
