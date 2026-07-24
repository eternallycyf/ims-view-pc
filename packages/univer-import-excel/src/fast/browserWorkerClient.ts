/**
 * 浏览器 Web Worker 协议 + 客户端。
 * Worker 脚本内调用 installExcelParseWorker()，主线程用 runExcelParseInBrowserWorker。
 */
import type { ChunkedBlock, ChunkedProgress, ChunkedWorkbookMeta } from './exceljsChunked';
import { excelBufferToChunkedWorkbook } from './exceljsChunked';
import { assembleWorkbookFromChunks } from './assembleFromChunks';
import type { ExcelParseOptions } from './parseOptions';
import { DEFAULT_PARSE_BLOCK_ROWS } from './parseOptions';
import type { IWorkbookData } from './types';

export type ExcelParseWorkerInMessage = {
  type: 'parse';
  buffer: ArrayBuffer;
  fileName: string;
  includeStyles: boolean;
  blockRowSize: number;
  maxRows: number;
};

export type ExcelParseWorkerOutMessage =
  | { type: 'progress'; progress: ChunkedProgress }
  | { type: 'done'; meta: ChunkedWorkbookMeta; blocks: ChunkedBlock[] }
  | { type: 'error'; error: string };

/** 在 Worker 全局安装消息处理（供 excelParse.worker.ts 调用） */
export const installExcelParseWorker = (scope: {
  postMessage: (msg: ExcelParseWorkerOutMessage) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
} = self as unknown as {
  postMessage: (msg: ExcelParseWorkerOutMessage) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
}) => {
  const post = (msg: ExcelParseWorkerOutMessage) => {
    scope.postMessage(msg);
  };

  scope.addEventListener('message', (event: MessageEvent<ExcelParseWorkerInMessage>) => {
    const data = event.data;
    if (!data || data.type !== 'parse') return;

    (async () => {
      const blocks: ChunkedBlock[] = [];
      const { meta } = await excelBufferToChunkedWorkbook(new Uint8Array(data.buffer), {
        fileName: data.fileName,
        includeStyles: data.includeStyles,
        blockRowSize: data.blockRowSize,
        maxRows: data.maxRows,
        onProgress: (progress) => post({ type: 'progress', progress }),
        onBlock: (block) => {
          blocks.push(block);
        },
      });
      post({ type: 'done', meta, blocks });
    })().catch((error) => {
      post({
        type: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
    });
  });
};

export const runExcelParseInBrowserWorker = (
  buffer: ArrayBuffer,
  options: ExcelParseOptions & { createWorker: () => Worker },
): Promise<IWorkbookData> =>
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

    worker.onmessage = (event: MessageEvent<ExcelParseWorkerOutMessage>) => {
      const msg = event.data;
      if (!msg) return;
      if (msg.type === 'progress') {
        options.onChunkProgress?.(msg.progress);
        options.onProgress?.(Math.min(95, Math.max(5, msg.progress.percent)));
        return;
      }
      if (msg.type === 'error') {
        cleanup();
        reject(new Error(msg.error));
        return;
      }
      if (msg.type === 'done') {
        try {
          const workbook = assembleWorkbookFromChunks(msg.meta, msg.blocks);
          options.onProgress?.(100);
          cleanup();
          resolve(workbook);
        } catch (error) {
          cleanup();
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      }
    };

    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message || 'Excel parse worker failed'));
    };

    const transferable = buffer.slice(0);
    const message: ExcelParseWorkerInMessage = {
      type: 'parse',
      buffer: transferable,
      fileName: options.fileName || 'workbook.xlsx',
      includeStyles: options.includeStyles !== false,
      blockRowSize: Math.max(100, options.blockRowSize || DEFAULT_PARSE_BLOCK_ROWS),
      maxRows: options.maxRows ?? 0,
    };
    worker.postMessage(message, [transferable]);
  });
