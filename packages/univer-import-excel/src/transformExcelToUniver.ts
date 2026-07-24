/**
 * Excel → Univer 导入（ExcelJS 直出，本地与 Nest 共用）。
 */
import type { IWorkbookData } from '@univerjs/core';
import { excelJsToUniver, type ExcelJsToUniverOptions } from './fast/exceljsToUniver';

export type ExcelToUniverInput = File | Blob | Uint8Array | ArrayBuffer;

export type TransformExcelToUniverOptions = ExcelJsToUniverOptions;

export const transformExcelToUniver = async (
  input: ExcelToUniverInput,
  options: TransformExcelToUniverOptions = {},
): Promise<IWorkbookData> => {
  const fileName =
    options.fileName ||
    (typeof File !== 'undefined' && input instanceof File ? input.name : 'workbook.xlsx');

  const data = await excelJsToUniver(input, { ...options, fileName });
  if (!data?.sheets) {
    throw new Error('Excel 解析结果为空');
  }
  return data as IWorkbookData;
};

/** 回调风格兼容 */
export const transformExcelToUniverCallback = (
  input: ExcelToUniverInput,
  success?: (data: IWorkbookData) => void,
  error?: (err: Error) => void,
  options?: TransformExcelToUniverOptions,
): void => {
  transformExcelToUniver(input, options)
    .then((data) => success?.(data))
    .catch((err) => {
      const e = err instanceof Error ? err : new Error(String(err));
      if (error) error(e);
      else throw e;
    });
};
