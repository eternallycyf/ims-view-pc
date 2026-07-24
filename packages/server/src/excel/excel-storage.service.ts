import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, readdir, stat, unlink, writeFile, readFile, access } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

/** 上传目录：默认系统临时目录下 ims-excel-uploads */
export const getExcelUploadDir = () =>
  process.env.IMS_EXCEL_UPLOAD_DIR || path.join(os.tmpdir(), 'ims-excel-uploads');

/** 静态访问前缀 */
export const EXCEL_STATIC_PREFIX = '/excel/static';

/** 文件保留时长，默认 1 小时 */
const getTtlMs = () => {
  const raw = Number(process.env.IMS_EXCEL_UPLOAD_TTL_MS || 60 * 60 * 1000);
  return Number.isFinite(raw) && raw > 0 ? raw : 60 * 60 * 1000;
};

/** 清理扫描间隔，默认 10 分钟 */
const getCleanupIntervalMs = () => {
  const raw = Number(process.env.IMS_EXCEL_UPLOAD_CLEANUP_MS || 10 * 60 * 1000);
  return Number.isFinite(raw) && raw > 0 ? raw : 10 * 60 * 1000;
};

/**
 * 还原上传文件名：
 * - multer/busboy 常把 UTF-8 中文按 latin1 读入，需转回
 * - 只去掉路径与非法文件名字符，尽量保留原名
 */
export const preserveUploadFileName = (raw?: string): string => {
  let name = (raw || '').trim() || 'workbook.xlsx';

  const looksMojibake =
    /[\u00c0-\u00ff]/.test(name) && !/[\u4e00-\u9fff]/.test(name);
  if (looksMojibake) {
    try {
      name = Buffer.from(name, 'latin1').toString('utf8');
    } catch {
      // keep
    }
  }

  name = path.basename(name.replace(/\\/g, '/'));
  name = name.replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '_').trim();
  name = name.replace(/^\.+/, '') || 'workbook.xlsx';

  if (/\.csv$/i.test(name)) return name;
  if (!/\.xlsx$/i.test(name)) {
    name = `${name.replace(/\.xls$/i, '') || 'workbook'}.xlsx`;
  }
  return name;
};

export type StoredExcelFile = {
  id: string;
  fileName: string;
  /** 相对路径，如 /excel/static/{id}.xlsx */
  path: string;
  size: number;
  expiresAt: number;
};

export type ExcelParseTaskStatus = 'pending' | 'done' | 'error';
export type ExcelParseMode = 'snapshot' | 'chunked';

export type ExcelParseTask = {
  id: string;
  status: ExcelParseTaskStatus;
  /** snapshot=整包 JSON；chunked=ExcelJS Worker 分块 */
  mode?: ExcelParseMode;
  fileName: string;
  /** 原始 xlsx 静态路径 */
  xlsxPath: string;
  /** snapshot JSON 静态路径（snapshot 模式 done 时有） */
  snapshotPath?: string;
  /** meta JSON 静态路径（chunked 模式 done 时有） */
  metaPath?: string;
  progress?: number;
  parsedBlocks?: number;
  totalBlocks?: number;
  truncated?: boolean;
  error?: string;
  startedAt: number;
  finishedAt?: number;
};

@Injectable()
export class ExcelStorageService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ExcelStorageService.name);
  private readonly uploadDir = getExcelUploadDir();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private readonly tasks = new Map<string, ExcelParseTask>();

  async onModuleInit() {
    await mkdir(this.uploadDir, { recursive: true });
    this.logger.log(`upload dir=${this.uploadDir} ttl=${getTtlMs()}ms`);
    await this.cleanupExpired().catch((error) => {
      this.logger.warn(`initial cleanup failed: ${error instanceof Error ? error.message : error}`);
    });
    this.cleanupTimer = setInterval(() => {
      void this.cleanupExpired();
    }, getCleanupIntervalMs());
    this.cleanupTimer.unref?.();
  }

  onModuleDestroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  getUploadDir() {
    return this.uploadDir;
  }

  getTask(id: string): ExcelParseTask | undefined {
    return this.tasks.get(id);
  }

  getXlsxFullPath(id: string) {
    const task = this.tasks.get(id);
    if (task?.xlsxPath) {
      return path.join(this.uploadDir, path.basename(task.xlsxPath));
    }
    return path.join(this.uploadDir, `${id}.xlsx`);
  }

  /** 保存上传原文件（.xlsx / .csv），并登记 pending 解析任务 */
  async saveXlsx(buffer: Buffer, originalName: string): Promise<StoredExcelFile> {
    await mkdir(this.uploadDir, { recursive: true });

    const id = randomUUID().replace(/-/g, '');
    const fileName = preserveUploadFileName(originalName);
    const ext = /\.csv$/i.test(fileName) ? 'csv' : 'xlsx';
    const storedName = `${id}.${ext}`;
    const fullPath = path.join(this.uploadDir, storedName);
    await writeFile(fullPath, buffer);

    const ttl = getTtlMs();
    const expiresAt = Date.now() + ttl;
    const xlsxPath = `${EXCEL_STATIC_PREFIX}/${storedName}`;

    this.tasks.set(id, {
      id,
      status: 'pending',
      fileName,
      xlsxPath,
      progress: 0,
      startedAt: Date.now(),
    });

    this.logger.log(
      `stored id=${id} name=${fileName} size=${(buffer.byteLength / 1024).toFixed(1)}KB expiresIn=${Math.round(ttl / 1000)}s`,
    );

    return {
      id,
      fileName,
      path: xlsxPath,
      size: buffer.byteLength,
      expiresAt,
    };
  }

  setTaskMode(id: string, mode: ExcelParseMode) {
    const task = this.tasks.get(id);
    if (task) {
      task.mode = mode;
      this.tasks.set(id, task);
    }
  }

  updateTaskProgress(
    id: string,
    progress: number,
    parsedBlocks?: number,
    totalBlocks?: number,
  ) {
    const task = this.tasks.get(id);
    if (!task || task.status !== 'pending') return;
    task.progress = Math.max(0, Math.min(100, progress));
    if (parsedBlocks != null) task.parsedBlocks = parsedBlocks;
    if (totalBlocks != null) task.totalBlocks = totalBlocks;
    this.tasks.set(id, task);
  }

  /** 写入解析结果（IWorkbookData JSON） */
  async saveSnapshot(id: string, workbookData: unknown): Promise<string> {
    const snapshotName = `${id}.snapshot.json`;
    const fullPath = path.join(this.uploadDir, snapshotName);
    await writeFile(fullPath, JSON.stringify(workbookData), 'utf8');
    const snapshotPath = `${EXCEL_STATIC_PREFIX}/${snapshotName}`;

    const task = this.tasks.get(id);
    if (task) {
      task.status = 'done';
      task.mode = 'snapshot';
      task.snapshotPath = snapshotPath;
      task.progress = 100;
      task.finishedAt = Date.now();
      this.tasks.set(id, task);
    }
    return snapshotPath;
  }

  /** chunked 完成：登记 meta 静态路径 */
  markTaskChunkedDone(
    id: string,
    metaFileName: string,
    extras?: { parsedBlocks?: number; totalBlocks?: number; truncated?: boolean },
  ): string {
    const metaPath = `${EXCEL_STATIC_PREFIX}/${metaFileName}`;
    const task = this.tasks.get(id);
    if (task) {
      task.status = 'done';
      task.mode = 'chunked';
      task.metaPath = metaPath;
      task.progress = 100;
      task.parsedBlocks = extras?.parsedBlocks;
      task.totalBlocks = extras?.totalBlocks;
      task.truncated = extras?.truncated;
      task.finishedAt = Date.now();
      this.tasks.set(id, task);
    }
    return metaPath;
  }

  markTaskError(id: string, error: string) {
    const task = this.tasks.get(id);
    if (task) {
      task.status = 'error';
      task.error = error;
      task.finishedAt = Date.now();
      this.tasks.set(id, task);
    }
  }

  async readSnapshot(id: string): Promise<unknown | null> {
    const fullPath = path.join(this.uploadDir, `${id}.snapshot.json`);
    try {
      await access(fullPath);
      const raw = await readFile(fullPath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private isManagedFile(name: string): boolean {
    return (
      name.endsWith('.xlsx') ||
      name.endsWith('.csv') ||
      name.endsWith('.snapshot.json') ||
      name.endsWith('.meta.json') ||
      /\.block\.\d+\.\d+\.json$/i.test(name)
    );
  }

  private idFromFileName(name: string): string {
    return name
      .replace(/\.xlsx$/i, '')
      .replace(/\.csv$/i, '')
      .replace(/\.snapshot\.json$/i, '')
      .replace(/\.meta\.json$/i, '')
      .replace(/\.block\.\d+\.\d+\.json$/i, '');
  }

  /** 删除超过 TTL 的上传文件（xlsx/csv + snapshot + meta + blocks） */
  async cleanupExpired(): Promise<number> {
    const ttl = getTtlMs();
    const now = Date.now();
    let removed = 0;

    let entries: string[];
    try {
      entries = await readdir(this.uploadDir);
    } catch {
      return 0;
    }

    await Promise.all(
      entries.map(async (name) => {
        if (!this.isManagedFile(name)) return;
        const fullPath = path.join(this.uploadDir, name);
        try {
          const info = await stat(fullPath);
          if (now - info.mtimeMs > ttl) {
            await unlink(fullPath);
            removed += 1;
            this.tasks.delete(this.idFromFileName(name));
          }
        } catch {
          // ignore
        }
      }),
    );

    if (removed > 0) {
      this.logger.log(`cleanup removed ${removed} expired file(s)`);
    }
    return removed;
  }
}
