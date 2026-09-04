import type { IWorkbookData } from '@univerjs/core';
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

/** 二进制 → 共用 utils（ExcelJS 导入） */
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

/** 远程文件名：优先 Content-Disposition，再路径扩展名，最后按 MIME 兜底 */
function resolveRemoteExcelFileName(src: string, response: Response): string {
  const disposition = response.headers.get('content-disposition') || '';
  const fromHeader = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)?.[1];
  if (fromHeader) return decodeURIComponent(fromHeader.replace(/"/g, '').trim());

  const pathName = decodeURIComponent(src.split('?')[0].split('/').pop() || '');
  if (/\.(xlsx|xls|csv)$/i.test(pathName)) return pathName;

  const contentType = response.headers.get('content-type') || '';
  let mimeType = contentType;
  try {
    mimeType = new URL(src, window.location.href).searchParams.get('m') || contentType;
  } catch {
    // 非法 URL 时退回响应头判断
  }
  if (/text\/csv|application\/csv/i.test(mimeType)) return 'workbook.csv';

  return pathName || 'workbook.xlsx';
}

export const loadImportResultFromUrl = async (src: string): Promise<ExcelImportResult> => {
  let response: Response;
  try {
    response = await fetch(src);
  } catch {
    throw new Error('无法拉取远程 Excel（网络不可达，或浏览器 CORS 拦截了跨域请求）');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const text = await response.text();
      const json = JSON.parse(text) as { msg?: string; message?: string | string[]; user_message?: string };
      if (typeof json?.msg === 'string' && json.msg) detail = json.msg;
      else if (typeof json?.user_message === 'string' && json.user_message) detail = json.user_message;
      else if (typeof json?.message === 'string' && json.message) detail = json.message;
      else if (Array.isArray(json?.message)) detail = json.message.join('; ');
      else if (text) detail = text.slice(0, 200);
    } catch {
      // keep empty
    }
    throw new Error(detail || `远程 Excel 加载失败: HTTP ${response.status}（请确认文件可公开访问）`);
  }

  const buffer = await response.arrayBuffer();
  if (!buffer || buffer.byteLength === 0) {
    throw new Error('Excel 文件内容为空');
  }
  // fetch-url 代理带 query，文件名优先从 Content-Disposition / 路径
  const fileName = resolveRemoteExcelFileName(src, response);
  return excelBufferToImportResult(buffer, fileName || 'workbook.xlsx');
};
