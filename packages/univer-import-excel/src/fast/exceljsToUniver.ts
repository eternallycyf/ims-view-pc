/**
 * 方案 4：ExcelJS → Univer 整本直出（跳过 LuckySheet）。
 * 大文件可通过 options.worker + createWorker 在 Web Worker 中分块解析。
 */
import {
  excelBufferToChunkedWorkbook,
  type ChunkedBlock,
} from './exceljsChunked';
import { assembleWorkbookFromChunks } from './assembleFromChunks';
import { runExcelParseInBrowserWorker } from './browserWorkerClient';
import {
  DEFAULT_PARSE_BLOCK_ROWS,
  resolveShouldUseWorker,
  type ExcelParseOptions,
} from './parseOptions';
import type { IWorkbookData } from './types';

export type ExcelJsToUniverOptions = ExcelParseOptions;

const yieldToMain = (): Promise<void> =>
  new Promise((resolve) => {
    if (typeof setTimeout === 'function') setTimeout(resolve, 0);
    else resolve();
  });

const toBinary = async (
  input: ArrayBuffer | Uint8Array | Blob | File,
): Promise<{ bytes: Uint8Array; buffer: ArrayBuffer; size: number }> => {
  if (input instanceof Uint8Array) {
    const copy = input.slice();
    return {
      bytes: copy,
      buffer: copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.byteLength),
      size: copy.byteLength,
    };
  }
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
    const copy = new Uint8Array(input.buffer, input.byteOffset, input.byteLength).slice();
    return {
      bytes: copy,
      buffer: copy.buffer,
      size: copy.byteLength,
    };
  }
  if (input instanceof ArrayBuffer) {
    const copy = new Uint8Array(input).slice();
    return { bytes: copy, buffer: copy.buffer, size: copy.byteLength };
  }
  const ab = await input.arrayBuffer();
  const copy = new Uint8Array(ab).slice();
  return { bytes: copy, buffer: copy.buffer, size: copy.byteLength };
};

const parseOnMainThread = async (
  bytes: Uint8Array,
  options: ExcelJsToUniverOptions,
): Promise<IWorkbookData> => {
  const fileName = options.fileName || 'workbook.xlsx';
  const includeStyles = options.includeStyles !== false;
  const blockRowSize = Math.max(100, options.blockRowSize || DEFAULT_PARSE_BLOCK_ROWS);
  const blocks: ChunkedBlock[] = [];

  options.onProgress?.(5);

  const { meta } = await excelBufferToChunkedWorkbook(bytes, {
    fileName,
    includeStyles,
    blockRowSize,
    maxRows: options.maxRows ?? 0,
    onProgress: (p) => {
      options.onChunkProgress?.(p);
      options.onProgress?.(Math.min(95, Math.max(5, p.percent)));
    },
    onBlock: async (block) => {
      blocks.push(block);
      await yieldToMain();
    },
  });

  const workbook = assembleWorkbookFromChunks(meta, blocks);
  options.onProgress?.(100);
  return workbook;
};

/**
 * xlsx → IWorkbookData（与服务端同一套 ExcelJS 转换）
 */
export const excelJsToUniver = async (
  input: ArrayBuffer | Uint8Array | Blob | File,
  options: ExcelJsToUniverOptions = {},
): Promise<IWorkbookData> => {
  const fileName =
    options.fileName ||
    (typeof File !== 'undefined' && input instanceof File ? input.name : 'workbook.xlsx');
  const { bytes, buffer, size } = await toBinary(input);
  const nextOptions: ExcelJsToUniverOptions = { ...options, fileName };

  const useWorker = resolveShouldUseWorker(size, nextOptions);
  if (useWorker && nextOptions.createWorker) {
    try {
      return await runExcelParseInBrowserWorker(buffer, {
        ...nextOptions,
        createWorker: nextOptions.createWorker,
      });
    } catch (error) {
      // Worker 失败时回退主线程，避免导入完全不可用
      // eslint-disable-next-line no-console
      console.warn('[@ims-view/univer-import-excel] Worker 解析失败，回退主线程', error);
    }
  }

  return parseOnMainThread(bytes, nextOptions);
};
