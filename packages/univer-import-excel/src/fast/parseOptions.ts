/**
 * 本地 / 服务端共用的 Excel 解析配置。
 * Worker 分块对两端都是同一套选项；Node 用 worker_threads，浏览器用 Web Worker。
 */
import {
  CHUNKED_FILE_BYTES,
  DEFAULT_BLOCK_ROW_SIZE,
  DEFAULT_MAX_ROWS,
  type ChunkedProgress,
} from './exceljsChunked';

/** 超过该体积默认走 Worker（与 CHUNKED_FILE_BYTES 对齐） */
export const DEFAULT_WORKER_THRESHOLD_BYTES = CHUNKED_FILE_BYTES;

/** 浏览器 / 服务端默认每块行数 */
export const DEFAULT_PARSE_BLOCK_ROWS = DEFAULT_BLOCK_ROW_SIZE;

export type ExcelParseWorkerMode = 'off' | 'auto' | 'on';

export type ExcelParseOptions = {
  fileName?: string;
  /** 默认 true */
  includeStyles?: boolean;
  /** 分块行数，默认 5000（渐进挂载切片，非总行上限） */
  blockRowSize?: number;
  /** 0 = 不截断 */
  maxRows?: number;
  /**
   * Worker 模式：
   * - off：主线程分块 + yield
   * - auto：超过 workerThresholdBytes 用 Worker（需 createWorker）
   * - on：强制 Worker
   */
  worker?: ExcelParseWorkerMode;
  /** auto 阈值，默认 512KB */
  workerThresholdBytes?: number;
  /**
   * 浏览器侧创建 Worker 工厂。
   * 例：`() => new Worker(new URL('./excelParse.worker.ts', import.meta.url))`
   */
  createWorker?: () => Worker;
  onProgress?: (percent: number) => void;
  /** 细粒度进度（分块阶段） */
  onChunkProgress?: (progress: ChunkedProgress) => void;
};

export const resolveShouldUseWorker = (
  sizeBytes: number,
  options: Pick<ExcelParseOptions, 'worker' | 'workerThresholdBytes' | 'createWorker'> = {},
): boolean => {
  const mode = options.worker || 'auto';
  if (mode === 'off') return false;
  if (mode === 'on') return Boolean(options.createWorker) || typeof Worker !== 'undefined';
  const threshold = options.workerThresholdBytes ?? DEFAULT_WORKER_THRESHOLD_BYTES;
  if (sizeBytes <= threshold) return false;
  return typeof options.createWorker === 'function';
};

export { DEFAULT_MAX_ROWS, CHUNKED_FILE_BYTES };
