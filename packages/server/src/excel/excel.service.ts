import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import { Worker } from 'worker_threads';
import {
  DEFAULT_BLOCK_ROW_SIZE,
  DEFAULT_PARSE_TIMEOUT_MS,
  chunkedBlockFileName,
  chunkedMetaFileName,
  excelBufferToChunkedWorkbook,
  workbookDataToExcelBuffer,
} from './excel.converter';
import { ExcelStorageService } from './excel-storage.service';
import type { ExcelParseTask } from './excel-storage.service';
import type { ExportExcelDto } from './dto/export-excel.dto';

export type ExcelUploadResult = {
  /** 上传后异步解析：前端轮询 task */
  mode: 'async-snapshot';
  id: string;
  fileName: string;
  /** 原始 xlsx 静态路径 */
  path: string;
  url: string;
  /** 任务查询路径 */
  taskPath: string;
  taskUrl: string;
  size: number;
  expiresAt: number;
  /** 解析策略：固定 ExcelJS Worker 分块 */
  parseHint?: 'chunked';
};

export type ExcelTaskResult = ExcelParseTask & {
  snapshotUrl?: string;
  metaUrl?: string;
  xlsxUrl?: string;
};

const getParseTimeoutMs = () => {
  const raw = Number(process.env.IMS_EXCEL_PARSE_TIMEOUT_MS || DEFAULT_PARSE_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_PARSE_TIMEOUT_MS;
};

/** 内部分块行数（不暴露为环境变量；仅影响渐进挂载切片） */
const BLOCK_ROW_SIZE = DEFAULT_BLOCK_ROW_SIZE;

const resolveWorkerPath = (): string | null => {
  const candidates = [
    path.join(__dirname, 'excel-parse.worker.cjs'),
    path.join(process.cwd(), 'src/excel/excel-parse.worker.cjs'),
    path.join(process.cwd(), 'lib/excel/excel-parse.worker.cjs'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
};

const resolveExportWorkerPath = (): string | null => {
  const candidates = [
    path.join(__dirname, 'excel-export.worker.cjs'),
    path.join(process.cwd(), 'src/excel/excel-export.worker.cjs'),
    path.join(process.cwd(), 'lib/excel/excel-export.worker.cjs'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
};

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);

  constructor(@Inject(ExcelStorageService) private readonly storage: ExcelStorageService) {}

  /**
   * 上传落盘后立即返回；后台一律 ExcelJS Worker 分块（含样式，不堵 Nest）。
   */
  async uploadFile(
    file?: Express.Multer.File,
    publicBaseUrl?: string,
  ): Promise<ExcelUploadResult> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('请上传 Excel / CSV 文件（.xlsx / .csv）');
    }

    const name = file.originalname || 'workbook.xlsx';
    if (/\.xls$/i.test(name) && !/\.xlsx$/i.test(name) && !/\.csv$/i.test(name)) {
      throw new BadRequestException('仅支持 .xlsx / .csv，不支持旧版 .xls');
    }

    const sizeMb = (file.buffer.byteLength / (1024 * 1024)).toFixed(2);
    const started = Date.now();
    this.logger.log(`upload start name=${name} size=${sizeMb}MB`);

    const buffer = Buffer.from(file.buffer);
    const stored = await this.storage.saveXlsx(buffer, name);
    const base = (publicBaseUrl || '').replace(/\/$/, '');
    const url = base ? `${base}${stored.path}` : stored.path;
    const taskPath = `/excel/task/${stored.id}`;
    const taskUrl = base ? `${base}${taskPath}` : taskPath;

    this.storage.setTaskMode(stored.id, 'chunked');

    this.logger.log(
      `upload done id=${stored.id} cost=${Date.now() - started}ms size=${buffer.byteLength}B → chunked-exceljs-worker`,
    );

    setImmediate(() => {
      void this.parseChunkedExcelJs(stored.id, stored.fileName);
    });

    return {
      mode: 'async-snapshot',
      id: stored.id,
      fileName: stored.fileName,
      path: stored.path,
      url,
      taskPath,
      taskUrl,
      size: stored.size,
      expiresAt: stored.expiresAt,
      parseHint: 'chunked',
    };
  }

  getTask(id: string, publicBaseUrl?: string): ExcelTaskResult {
    const task = this.storage.getTask(id);
    if (!task) {
      throw new NotFoundException(`任务不存在或已过期: ${id}`);
    }
    const base = (publicBaseUrl || '').replace(/\/$/, '');
    return {
      ...task,
      xlsxUrl: base ? `${base}${task.xlsxPath}` : task.xlsxPath,
      snapshotUrl: task.snapshotPath
        ? base
          ? `${base}${task.snapshotPath}`
          : task.snapshotPath
        : undefined,
      metaUrl: task.metaPath
        ? base
          ? `${base}${task.metaPath}`
          : task.metaPath
        : undefined,
    };
  }

  /**
   * ExcelJS Worker 分块写盘。
   * Worker 不可用时回退同进程 excelBufferToChunkedWorkbook。
   */
  private async parseChunkedExcelJs(id: string, fileName: string) {
    const workerPath = resolveWorkerPath();
    if (!workerPath) {
      this.logger.warn(
        `excel-parse.worker.cjs 未找到，回退同进程 ExcelJS 分块 id=${id}`,
      );
      await this.parseChunkedExcelJsInProcess(id, fileName);
      return;
    }

    const started = Date.now();
    this.logger.log(
      `parse chunked(exceljs-worker) start id=${id} name=${fileName} worker=${workerPath} blockRows=${BLOCK_ROW_SIZE}`,
    );
    this.storage.updateTaskProgress(id, 5);

    const timeoutMs = getParseTimeoutMs();
    let settled = false;
    let lastLoggedPercent = -1;

    await new Promise<void>((resolve) => {
      const uploadDir = this.storage.getUploadDir();
      const worker = new Worker(workerPath, {
        workerData: {
          id,
          xlsxPath: this.storage.getXlsxFullPath(id),
          outDir: uploadDir,
          uploadDir,
          fileName,
          blockRowSize: BLOCK_ROW_SIZE,
          maxRows: 0,
          includeStyles: true,
        },
      });

      const finishError = (message: string, stack?: string) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.storage.markTaskError(id, message);
        this.logger.error(
          `parse chunked(exceljs-worker) failed id=${id} cost=${Date.now() - started}ms: ${message}`,
        );
        if (stack) this.logger.error(stack);
        try {
          void worker.terminate();
        } catch {
          // ignore
        }
        resolve();
      };

      const timer = setTimeout(() => {
        finishError(`解析超时（>${Math.round(timeoutMs / 1000)}s）`);
      }, timeoutMs);

      worker.on('message', (msg: {
        type?: string;
        percent?: number;
        parsedBlocks?: number;
        totalBlocks?: number;
        metaFile?: string;
        metaFileName?: string;
        truncated?: boolean;
        message?: string;
        error?: string;
        stack?: string;
        costMs?: number;
        phase?: string;
        loadMs?: number;
      }) => {
        if (!msg || settled) return;
        if (msg.type === 'log' && msg.message) {
          this.logger.log(`parse chunked(exceljs-worker) ${msg.message}`);
          return;
        }
        if (msg.type === 'progress') {
          const percent = msg.percent ?? 0;
          this.storage.updateTaskProgress(
            id,
            percent,
            msg.parsedBlocks,
            msg.totalBlocks,
          );
          // 每跨过约 10% 打一条，避免刷屏但仍看得见进度
          if (percent === 5 || percent === 20 || percent - lastLoggedPercent >= 10) {
            lastLoggedPercent = percent;
            this.logger.log(
              `parse chunked(exceljs-worker) progress id=${id} ${percent}% blocks=${msg.parsedBlocks ?? 0}/${msg.totalBlocks ?? 0} phase=${msg.phase || '-'}${msg.loadMs != null ? ` loadMs=${msg.loadMs}` : ''} elapsed=${Date.now() - started}ms`,
            );
          }
          return;
        }
        if (msg.type === 'error') {
          finishError(msg.message || msg.error || 'Worker 解析失败', msg.stack);
          return;
        }
        if (msg.type === 'done') {
          settled = true;
          clearTimeout(timer);
          const metaFileName = msg.metaFileName || msg.metaFile || chunkedMetaFileName(id);
          this.storage.markTaskChunkedDone(id, metaFileName, {
            parsedBlocks: msg.parsedBlocks ?? msg.totalBlocks,
            totalBlocks: msg.totalBlocks,
            truncated: msg.truncated,
          });
          this.logger.log(
            `parse chunked(exceljs-worker) done id=${id} cost=${Date.now() - started}ms workerCost=${msg.costMs ?? '-'}ms blocks=${msg.totalBlocks ?? '-'} truncated=${Boolean(msg.truncated)}`,
          );
          resolve();
        }
      });

      worker.on('error', (error) => {
        finishError(
          error instanceof Error ? error.message : String(error),
          error instanceof Error ? error.stack : undefined,
        );
      });

      worker.on('exit', (code) => {
        if (settled) return;
        // 等一轮事件循环，避免 done 消息尚未处理就误判
        setImmediate(() => {
          if (settled) return;
          finishError(`Worker 异常退出 code=${code}（未收到 done）`);
        });
      });
    });
  }

  /** Worker 不可用时的同进程回退 */
  private async parseChunkedExcelJsInProcess(id: string, fileName: string) {
    const started = Date.now();
    this.logger.log(`parse chunked(exceljs-inplace) start id=${id} name=${fileName}`);
    this.storage.updateTaskProgress(id, 5);

    const timeoutMs = getParseTimeoutMs();
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      this.storage.markTaskError(id, `解析超时（>${Math.round(timeoutMs / 1000)}s）`);
      this.logger.error(`parse chunked(exceljs-inplace) timeout id=${id}`);
    }, timeoutMs);

    try {
      const buffer = await readFile(this.storage.getXlsxFullPath(id));
      this.storage.updateTaskProgress(id, 15);
      const uploadDir = this.storage.getUploadDir();

      const { meta } = await excelBufferToChunkedWorkbook(buffer, {
        fileName,
        blockRowSize: BLOCK_ROW_SIZE,
        maxRows: 0,
        includeStyles: true,
        onProgress: (progress) => {
          if (settled) return;
          this.storage.updateTaskProgress(
            id,
            progress.percent,
            progress.parsedBlocks,
            progress.totalBlocks,
          );
        },
        onBlock: async (block) => {
          const name = chunkedBlockFileName(id, block.sheetIndex, block.blockIndex);
          await writeFile(path.join(uploadDir, name), JSON.stringify(block), 'utf8');
        },
      });

      if (settled) return;

      const metaFileName = chunkedMetaFileName(id);
      await writeFile(path.join(uploadDir, metaFileName), JSON.stringify(meta), 'utf8');
      const totalBlocks = meta.sheets.reduce((sum, sheet) => sum + sheet.blockCount, 0);
      settled = true;
      clearTimeout(timer);
      this.storage.markTaskChunkedDone(id, metaFileName, {
        parsedBlocks: totalBlocks,
        totalBlocks,
        truncated: meta.truncated,
      });
      this.logger.log(
        `parse chunked(exceljs-inplace) done id=${id} cost=${Date.now() - started}ms blocks=${totalBlocks} truncated=${Boolean(meta.truncated)}`,
      );
    } catch (error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const message = error instanceof Error ? error.message : String(error);
      this.storage.markTaskError(id, message);
      this.logger.error(
        `parse chunked(exceljs-inplace) failed id=${id} cost=${Date.now() - started}ms: ${message}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async exportFile(body: ExportExcelDto): Promise<{ buffer: Buffer; fileName: string }> {
    const data = body?.data;
    if (!data) {
      throw new BadRequestException('缺少工作簿数据 data');
    }

    const rawName = body.fileName?.trim() || data.name || 'workbook';
    const fileName = rawName.endsWith('.xlsx') ? rawName : `${rawName}.xlsx`;

    const workerPath = resolveExportWorkerPath();
    if (!workerPath) {
      this.logger.warn('excel-export.worker.cjs 未找到，回退同进程 LuckyExcel 导出');
      const buffer = await workbookDataToExcelBuffer(data, fileName);
      return { buffer, fileName };
    }

    const started = Date.now();
    const uploadDir = this.storage.getUploadDir();
    const exportId = `export-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
    const snapshotPath = path.join(uploadDir, `${exportId}.snapshot.json`);
    const outPath = path.join(uploadDir, `${exportId}.xlsx`);

    await writeFile(snapshotPath, JSON.stringify(data), 'utf8');
    this.logger.log(`export(luckyexcel-worker) start file=${fileName} worker=${workerPath}`);

    try {
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const worker = new Worker(workerPath, {
          workerData: { snapshotPath, outPath, fileName },
        });
        const timeoutMs = getParseTimeoutMs();
        let settled = false;

        const finish = (err?: Error, result?: Buffer) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          try {
            void worker.terminate();
          } catch {
            // ignore
          }
          if (err) reject(err);
          else if (result) resolve(result);
          else reject(new Error('导出 Worker 未返回结果'));
        };

        const timer = setTimeout(() => {
          finish(new Error(`导出超时（>${Math.round(timeoutMs / 1000)}s）`));
        }, timeoutMs);

        worker.on('message', (msg: {
          type?: string;
          message?: string;
          error?: string;
          stack?: string;
        }) => {
          if (!msg) return;
          if (msg.type === 'log' && msg.message) {
            this.logger.log(`export(luckyexcel-worker) ${msg.message}`);
            return;
          }
          if (msg.type === 'error') {
            finish(new Error(msg.message || msg.error || '导出 Worker 失败'));
            return;
          }
          if (msg.type === 'done') {
            readFile(outPath)
              .then((buf) => finish(undefined, buf))
              .catch((error) => finish(error instanceof Error ? error : new Error(String(error))));
          }
        });

        worker.on('error', (error) => finish(error));
        worker.on('exit', (code) => {
          if (settled) return;
          setImmediate(() => {
            if (settled) return;
            finish(new Error(`导出 Worker 异常退出 code=${code}`));
          });
        });
      });

      this.logger.log(
        `export(luckyexcel-worker) done file=${fileName} cost=${Date.now() - started}ms size=${buffer.byteLength}B`,
      );
      return { buffer, fileName };
    } finally {
      // 尽力清理临时文件
      try {
        const { unlink } = await import('fs/promises');
        await Promise.allSettled([unlink(snapshotPath), unlink(outPath)]);
      } catch {
        // ignore
      }
    }
  }
}
