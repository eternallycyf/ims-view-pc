import type { FUniver, IWorkbookData } from '@univerjs/presets';
import type { ExcelImportResult, ExcelSheetImage } from './excelToWorkbookData';
import {
  downloadBlob,
  fileToImportResult,
  workbookDataToExcelBlob,
} from './excelToWorkbookData';

const trimSlash = (url: string) => url.replace(/\/$/, '');

export const isExchangeServerAvailable = async (endpoint: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${trimSlash(endpoint)}/excel/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
};

/** 本地：@ims-view/utils（LuckyExcel + JSZip，失败回退 SheetJS） */
const importLocal = async (file: File): Promise<ExcelImportResult> => fileToImportResult(file);

const exportLocal = async (data: Partial<IWorkbookData>, fileName: string): Promise<void> => {
  const blob = await workbookDataToExcelBlob(data, fileName);
  downloadBlob(blob, fileName);
};

const importFromServer = async (endpoint: string, file: File): Promise<ExcelImportResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${trimSlash(endpoint)}/excel/import`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `服务端导入失败: ${response.status}`);
  }

  const json = await response.json();
  // 兼容旧接口（只返回 workbook）与新接口（含 images）
  if (json?.workbookData) {
    return {
      workbookData: json.workbookData,
      images: (json.images || []) as ExcelSheetImage[],
    };
  }

  return {
    workbookData: json,
    images: [],
  };
};

const exportToServer = async (
  endpoint: string,
  data: Partial<IWorkbookData>,
  fileName: string,
): Promise<void> => {
  const response = await fetch(`${trimSlash(endpoint)}/excel/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, fileName }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `服务端导出失败: ${response.status}`);
  }

  const blob = await response.blob();
  downloadBlob(blob, fileName);
};

export type ExchangeResultMeta = {
  via: 'local' | 'server';
};

/**
 * 导入：未传 endpoint 走浏览器本地；显式传入 exchangeEndpoint 则走 Nest 服务端（不做大小自动切换）
 */
export const importWorkbook = async (
  file: File,
  options: { endpoint?: string } = {},
): Promise<{ result: ExcelImportResult; meta: ExchangeResultMeta }> => {
  const endpoint = options.endpoint?.trim();
  if (!endpoint) {
    const result = await importLocal(file);
    return { result, meta: { via: 'local' } };
  }

  const result = await importFromServer(endpoint, file);
  return { result, meta: { via: 'server' } };
};

/**
 * 导出：未传 endpoint 走浏览器本地；显式传入 exchangeEndpoint 则走 Nest 服务端
 */
export const exportWorkbook = async (
  data: Partial<IWorkbookData>,
  fileName = 'workbook.xlsx',
  options: { endpoint?: string } = {},
): Promise<ExchangeResultMeta> => {
  const endpoint = options.endpoint?.trim();
  if (!endpoint) {
    await exportLocal(data, fileName);
    return { via: 'local' };
  }

  await exportToServer(endpoint, data, fileName);
  return { via: 'server' };
};

/** 将导入的图片插入到 Univer sheet（需 drawing preset） */
export const applyImportedImages = async (
  univerAPI: FUniver,
  images: ExcelSheetImage[],
) => {
  if (!images.length) return;

  const workbook = univerAPI.getActiveWorkbook();
  if (!workbook) return;

  const sheets = workbook.getSheets?.() || [];

  for (const image of images) {
    try {
      const sheet =
        sheets.find((item: any) => item.getSheetId?.() === image.sheetId) ||
        workbook.getActiveSheet();

      if (!sheet?.newOverGridImage) {
        if (sheet?.insertImage) {
          await sheet.insertImage(
            image.dataUrl,
            image.col,
            image.row,
            image.offsetX || 0,
            image.offsetY || 0,
          );
        }
        continue;
      }

      const built = await sheet
        .newOverGridImage()
        .setSource(image.dataUrl, univerAPI.Enum.ImageSourceType.BASE64)
        .setColumn(image.col)
        .setRow(image.row)
        .setWidth(image.width || 160)
        .setHeight(image.height || 120)
        .buildAsync();

      sheet.insertImages([built]);
    } catch {
      // ignore single image failure
    }
  }
};
