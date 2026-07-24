import type { FUniver, IWorkbookData } from '@univerjs/presets';
import type { ExcelImportResult } from './excelToWorkbookData';
import {
  downloadBlob,
  fileToImportResult,
  workbookDataToExcelBlob,
} from './excelToWorkbookData';
import {
  mountChunkedBlocks,
  skeletonWorkbookFromMeta,
  type ChunkedBlock,
  type ChunkedWorkbookMeta,
} from './mountChunkedWorkbook';

const trimSlash = (url: string) => url.replace(/\/$/, '');

/** 本地导入体积上限：超过需配置 exchangeEndpoint 走上传 */
export const LOCAL_IMPORT_MAX_BYTES = 5 * 1024 * 1024; // 5MB

/** 上传超时 */
export const SERVER_IMPORT_TIMEOUT_MS = 120 * 1000;

/** 服务端解析轮询总超时 */
export const SERVER_PARSE_POLL_TIMEOUT_MS = 5 * 60 * 1000;

/** 轮询间隔 */
export const SERVER_PARSE_POLL_INTERVAL_MS = 1000;

export type ImportProgressInfo = {
  stage: 'upload' | 'parse' | 'render';
  /** 0-100，parse/render 阶段有值 */
  percent?: number;
  message?: string;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
};

const parseUploadErrorMessage = (status: number, text: string) => {
  const raw = (text || '').trim();
  let message = raw;
  try {
    const json = JSON.parse(raw) as {
      message?: string | string[];
      error?: string;
      msg?: string;
      code?: number;
      data?: unknown;
    };
    if (typeof json?.msg === 'string' && json.msg) {
      message = json.msg;
    } else if (Array.isArray(json?.message)) {
      message = json.message.join('; ');
    } else if (typeof json?.message === 'string' && json.message) {
      message = json.message;
    } else if (json?.error) {
      message = String(json.error);
    }
  } catch {
    // keep raw
  }

  const lower = message.toLowerCase();
  if (
    status === 413 ||
    lower.includes('request entity too large') ||
    lower.includes('payload too large') ||
    lower.includes('file too large')
  ) {
    return `文件过大，上传失败（超过体积限制）。请调大服务端上传限制，或改用本地导入（≤${formatFileSize(LOCAL_IMPORT_MAX_BYTES)}）`;
  }

  return message || `服务端上传失败: ${status}`;
};

const assertXlsxFile = (file: File) => {
  if (/\.xls$/i.test(file?.name || '') && !/\.xlsx$/i.test(file?.name || '')) {
    throw new Error('仅支持 .xlsx，不支持旧版 .xls');
  }
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const yieldToUI = () => sleep(0);

const absUrl = (endpoint: string, pathOrUrl?: string) => {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${trimSlash(endpoint)}${path}`;
};

/** 兼容 ResponseEntity：{ code, data, msg }；也兼容旧版裸 JSON */
const unwrapResponseEntity = <T>(json: unknown): T => {
  if (!json || typeof json !== 'object') {
    return json as T;
  }
  const body = json as { code?: number; data?: T; msg?: string; message?: string };
  if (!('code' in body) || !('data' in body)) {
    return json as T;
  }
  if (body.code !== 0 && body.code !== undefined) {
    throw new Error(body.msg || body.message || `服务端返回失败 code=${body.code}`);
  }
  return body.data as T;
};

/** 本地解析：统一 LuckyExcel（小文件） */
const importLocal = async (file: File): Promise<ExcelImportResult> => fileToImportResult(file);

type UploadResponse = {
  mode?: string;
  id?: string;
  fileName?: string;
  path?: string;
  url?: string;
  taskPath?: string;
  taskUrl?: string;
  parseHint?: 'snapshot' | 'chunked';
};

type TaskResponse = {
  id: string;
  status: 'pending' | 'done' | 'error';
  mode?: 'snapshot' | 'chunked';
  fileName?: string;
  snapshotPath?: string;
  snapshotUrl?: string;
  metaPath?: string;
  metaUrl?: string;
  progress?: number;
  parsedBlocks?: number;
  totalBlocks?: number;
  truncated?: boolean;
  error?: string;
};

export type ServerImportPayload =
  | {
      kind: 'snapshot';
      result: ExcelImportResult;
      truncated?: boolean;
    }
  | {
      kind: 'chunked';
      meta: ChunkedWorkbookMeta;
      skeleton: Partial<IWorkbookData>;
      fetchBlock: (sheetIndex: number, blockIndex: number) => Promise<ChunkedBlock>;
      truncated?: boolean;
    };

/**
 * 上传 → 轮询服务端解析 → snapshot 整包 或 chunked meta/blocks
 */
const uploadThenLoadServerResult = async (
  endpoint: string,
  file: File,
  onProgress?: (info: ImportProgressInfo) => void,
): Promise<ServerImportPayload> => {
  onProgress?.({ stage: 'upload', percent: 0, message: '上传中...' });
  await yieldToUI();

  const formData = new FormData();
  formData.append('file', file);

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SERVER_IMPORT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${trimSlash(endpoint)}/excel/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        `服务端上传超时（>${Math.round(SERVER_IMPORT_TIMEOUT_MS / 1000)}s）。请检查 Nest 服务或网络`,
      );
    }
    throw error instanceof Error ? error : new Error(String(error));
  } finally {
    window.clearTimeout(timer);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(parseUploadErrorMessage(response.status, text));
  }

  let uploaded: UploadResponse;
  try {
    uploaded = unwrapResponseEntity<UploadResponse>(await response.json());
  } catch (error) {
    if (error instanceof Error && error.message.includes('服务端返回失败')) {
      throw error;
    }
    throw new Error('服务端上传返回非 JSON 数据');
  }

  if (!uploaded?.id) {
    throw new Error('服务端上传未返回任务 id');
  }

  onProgress?.({ stage: 'parse', percent: 0, message: '服务端解析中...' });
  await yieldToUI();

  const taskUrl =
    uploaded.taskUrl ||
    `${trimSlash(endpoint)}${uploaded.taskPath || `/excel/task/${uploaded.id}`}`;

  const deadline = Date.now() + SERVER_PARSE_POLL_TIMEOUT_MS;
  let task: TaskResponse | null = null;

  while (Date.now() < deadline) {
    const taskRes = await fetch(taskUrl);
    if (!taskRes.ok) {
      const text = await taskRes.text().catch(() => '');
      throw new Error(text || `查询解析任务失败: ${taskRes.status}`);
    }
    task = unwrapResponseEntity<TaskResponse>(await taskRes.json());

    if (task.status === 'done') break;
    if (task.status === 'error') {
      throw new Error(task.error || '服务端解析失败');
    }

    const percent = typeof task.progress === 'number' ? task.progress : undefined;
    const blocksTip =
      task.totalBlocks != null
        ? ` ${task.parsedBlocks ?? 0}/${task.totalBlocks}`
        : '';
    onProgress?.({
      stage: 'parse',
      percent,
      message:
        percent != null
          ? `服务端解析中 ${percent}%${blocksTip}`
          : '服务端解析中...',
    });
    await sleep(SERVER_PARSE_POLL_INTERVAL_MS);
  }

  if (!task || task.status !== 'done') {
    throw new Error(
      `服务端解析超时（>${Math.round(SERVER_PARSE_POLL_TIMEOUT_MS / 1000)}s）。文件可能过大，请缩小后重试`,
    );
  }

  // chunked 模式
  if (task.mode === 'chunked' || task.metaUrl || task.metaPath) {
    const metaUrl = absUrl(endpoint, task.metaUrl || task.metaPath);
    if (!metaUrl) {
      throw new Error('服务端分块解析完成但未返回 meta 地址');
    }

    onProgress?.({ stage: 'render', percent: 0, message: '准备渲染...' });
    await yieldToUI();

    const metaRes = await fetch(metaUrl);
    if (!metaRes.ok) {
      throw new Error(`拉取 meta 失败: ${metaRes.status}`);
    }
    const meta = (await metaRes.json()) as ChunkedWorkbookMeta;
    if (!meta?.sheets?.length) {
      throw new Error('meta 数据无效');
    }

    const staticBase = metaUrl.replace(/\/[^/]+$/, '');
    const fetchBlock = async (sheetIndex: number, blockIndex: number) => {
      const blockUrl = `${staticBase}/${uploaded.id}.block.${sheetIndex}.${blockIndex}.json`;
      const res = await fetch(blockUrl);
      if (!res.ok) {
        throw new Error(`拉取分块失败 ${sheetIndex}.${blockIndex}: ${res.status}`);
      }
      return (await res.json()) as ChunkedBlock;
    };

    return {
      kind: 'chunked',
      meta,
      skeleton: skeletonWorkbookFromMeta(meta),
      fetchBlock,
      truncated: task.truncated || meta.truncated,
    };
  }

  // snapshot 模式
  const snapshotUrl = absUrl(endpoint, task.snapshotUrl || task.snapshotPath);
  if (!snapshotUrl) {
    throw new Error('服务端解析完成但未返回 snapshot 地址');
  }

  onProgress?.({ stage: 'render', percent: 0, message: '渲染中...' });
  await yieldToUI();

  const snapRes = await fetch(snapshotUrl);
  if (!snapRes.ok) {
    throw new Error(`拉取 snapshot 失败: ${snapRes.status}`);
  }

  const workbookData = (await snapRes.json()) as Partial<IWorkbookData>;
  if (!workbookData?.sheets) {
    throw new Error('snapshot 数据无效');
  }

  return {
    kind: 'snapshot',
    result: { workbookData, images: [] },
    truncated: task.truncated,
  };
};

export type ExchangeResultMeta = {
  via: 'local' | 'server' | 'server-chunked';
  truncated?: boolean;
};

/**
 * 导入：
 * - 未配置 endpoint：浏览器本地 LuckyExcel（≤5MB）
 * - 配置了 endpoint：上传后服务端异步解析（小文件 snapshot / 大文件 chunked）
 */
export const importWorkbook = async (
  file: File,
  options: {
    endpoint?: string;
    onProgress?: (info: ImportProgressInfo) => void;
  } = {},
): Promise<{ payload: ServerImportPayload; meta: ExchangeResultMeta }> => {
  assertXlsxFile(file);

  const endpoint = options.endpoint?.trim();
  const fileSize = file?.size ?? 0;

  if (!endpoint) {
    if (fileSize > LOCAL_IMPORT_MAX_BYTES) {
      throw new Error(
        `文件过大（${formatFileSize(fileSize)}），本地导入仅支持 ≤${formatFileSize(
          LOCAL_IMPORT_MAX_BYTES,
        )}；请配置 exchangeEndpoint 使用服务端导入`,
      );
    }
    options.onProgress?.({ stage: 'parse', message: '本地解析中...' });
    await yieldToUI();
    const result = await importLocal(file);
    return {
      payload: { kind: 'snapshot', result },
      meta: { via: 'local' },
    };
  }

  const payload = await uploadThenLoadServerResult(endpoint, file, options.onProgress);
  return {
    payload,
    meta: {
      via: payload.kind === 'chunked' ? 'server-chunked' : 'server',
      truncated: payload.truncated,
    },
  };
};

/** 将服务端导入结果挂到已有 Univer 实例（chunked 时走渐进 setValues） */
export const applyServerImportPayload = async (
  univerAPI: FUniver,
  payload: ServerImportPayload,
  replaceWorkbook: (result: ExcelImportResult) => Promise<void>,
  onProgress?: (info: ImportProgressInfo) => void,
) => {
  if (payload.kind === 'snapshot') {
    onProgress?.({ stage: 'render', percent: 100, message: '渲染中...' });
    await replaceWorkbook(payload.result);
    return payload.result.workbookData;
  }

  onProgress?.({ stage: 'render', percent: 0, message: '渲染中 0%' });
  await replaceWorkbook({ workbookData: payload.skeleton, images: [] });
  await mountChunkedBlocks(univerAPI, payload.meta, payload.fetchBlock, (percent) => {
    onProgress?.({
      stage: 'render',
      percent,
      message: `渲染中 ${percent}%`,
    });
  });

  return payload.skeleton;
};

/** 导出：始终浏览器本地生成 xlsx */
export const exportWorkbook = async (
  data: Partial<IWorkbookData>,
  fileName = 'workbook.xlsx',
): Promise<ExchangeResultMeta> => {
  if (!data || typeof data !== 'object') {
    throw new Error('导出数据为空');
  }

  const blob = await workbookDataToExcelBlob(data, fileName);
  downloadBlob(blob, fileName);
  return { via: 'local' };
};
