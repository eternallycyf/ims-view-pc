/**
 * 浏览器 / Node 共用：Univer → xlsx（仅 LuckyExcel，无 exceljs 回退）。
 * Worker 内调用；主线程只负责下载 Blob。
 */
import type { IWorkbookData } from './types';
import { transformUniverToExcelBuffer } from './luckyexcel';

export type ExcelExportWorkerMode = 'off' | 'auto' | 'on';

/** snapshot JSON 超过该体积默认进 Worker */
export const DEFAULT_EXPORT_WORKER_THRESHOLD_BYTES = 512 * 1024;

export type ExcelExportOptions = {
  fileName?: string;
  worker?: ExcelExportWorkerMode;
  workerThresholdBytes?: number;
  createWorker?: () => Worker;
};

export type ExcelExportWorkerInMessage = {
  type: 'export';
  snapshot: Partial<IWorkbookData>;
  fileName: string;
};

export type ExcelExportWorkerOutMessage =
  | { type: 'done'; buffer: ArrayBuffer }
  | { type: 'error'; error: string };

export const estimateWorkbookSnapshotBytes = (data: Partial<IWorkbookData>): number => {
  try {
    return JSON.stringify(data).length;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
};

export const resolveShouldUseExportWorker = (
  sizeBytes: number,
  options: Pick<ExcelExportOptions, 'worker' | 'workerThresholdBytes' | 'createWorker'> = {},
): boolean => {
  const mode = options.worker || 'auto';
  if (mode === 'off') return false;
  if (!options.createWorker) return false;
  if (mode === 'on') return true;
  const threshold = options.workerThresholdBytes ?? DEFAULT_EXPORT_WORKER_THRESHOLD_BYTES;
  return sizeBytes > threshold;
};

/** 仅 LuckyExcel；返回可 transfer 的 ArrayBuffer */
export const workbookDataToExcelArrayBuffer = async (
  data: Partial<IWorkbookData>,
  fileName = 'workbook.xlsx',
): Promise<ArrayBuffer> => {
  const name = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  const buffer = await transformUniverToExcelBuffer(data, name);
  if (buffer instanceof ArrayBuffer) return buffer;

  const view =
    typeof Buffer !== 'undefined' && Buffer.isBuffer(buffer)
      ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
      : buffer instanceof Uint8Array
        ? buffer
        : null;
  if (!view) {
    throw new Error('LuckyExcel 导出结果类型未知');
  }
  // 拷贝一份独立 ArrayBuffer，避免 SharedArrayBuffer / 底层池化 buffer 类型问题
  const copy = new Uint8Array(view.byteLength);
  copy.set(view);
  return copy.buffer;
};

/** 在 Worker 全局安装消息处理（供 excelExport.worker.ts 调用） */
export const installExcelExportWorker = (scope: {
  postMessage: (msg: ExcelExportWorkerOutMessage, transfer?: Transferable[]) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
} = self as unknown as {
  postMessage: (msg: ExcelExportWorkerOutMessage, transfer?: Transferable[]) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
}) => {
  scope.addEventListener('message', (event: MessageEvent<ExcelExportWorkerInMessage>) => {
    const data = event.data;
    if (!data || data.type !== 'export') return;

    (async () => {
      const buffer = await workbookDataToExcelArrayBuffer(data.snapshot, data.fileName);
      const transferable = buffer.slice(0);
      scope.postMessage({ type: 'done', buffer: transferable }, [transferable]);
    })().catch((error) => {
      scope.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
    });
  });
};

export const runExcelExportInBrowserWorker = (
  snapshot: Partial<IWorkbookData>,
  options: ExcelExportOptions & { createWorker: () => Worker },
): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    let worker: Worker;
    try {
      worker = options.createWorker();
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
      return;
    }

    const cleanup = () => {
      try {
        worker.terminate();
      } catch {
        // ignore
      }
    };

    worker.onmessage = (event: MessageEvent<ExcelExportWorkerOutMessage>) => {
      const msg = event.data;
      if (!msg) return;
      if (msg.type === 'error') {
        cleanup();
        reject(new Error(msg.error));
        return;
      }
      if (msg.type === 'done') {
        cleanup();
        resolve(msg.buffer);
      }
    };

    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message || 'Excel export worker failed'));
    };

    const message: ExcelExportWorkerInMessage = {
      type: 'export',
      snapshot,
      fileName: options.fileName || 'workbook.xlsx',
    };
    worker.postMessage(message);
  });
