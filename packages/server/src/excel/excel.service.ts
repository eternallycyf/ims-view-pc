import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import {
  CHUNKED_FILE_BYTES,
  DEFAULT_BLOCK_ROW_SIZE,
  DEFAULT_MAX_ROWS,
  DEFAULT_PARSE_TIMEOUT_MS,
  chunkedBlockFileName,
  chunkedMetaFileName,
  importExcelBinary,
  shouldUseChunkedImport,
  splitWorkbookDataToChunks,
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
  /** 预计解析策略（实际上传后异步确定） */
  parseHint?: 'snapshot' | 'chunked';
};

export type ExcelTaskResult = ExcelParseTask & {
  snapshotUrl?: string;
  metaUrl?: string;
  xlsxUrl?: string;
};

const getChunkBytesThreshold = () => {
  const raw = Number(process.env.IMS_EXCEL_CHUNK_BYTES || CHUNKED_FILE_BYTES);
  return Number.isFinite(raw) && raw > 0 ? raw : CHUNKED_FILE_BYTES;
};

const getBlockRowSize = () => {
  const raw = Number(process.env.IMS_EXCEL_BLOCK_ROWS || DEFAULT_BLOCK_ROW_SIZE);
  return Number.isFinite(raw) && raw >= 100 ? raw : DEFAULT_BLOCK_ROW_SIZE;
};

const getMaxRows = () => {
  const raw = Number(process.env.IMS_EXCEL_MAX_ROWS ?? DEFAULT_MAX_ROWS);
  if (!Number.isFinite(raw) || raw < 0) return DEFAULT_MAX_ROWS;
  return raw;
};

const getParseTimeoutMs = () => {
  const raw = Number(process.env.IMS_EXCEL_PARSE_TIMEOUT_MS || DEFAULT_PARSE_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_PARSE_TIMEOUT_MS;
};

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);

  constructor(@Inject(ExcelStorageService) private readonly storage: ExcelStorageService) {}

  /**
   * 上传落盘后立即返回；后台解析统一 LuckyExcel（与前端本地一致）：
   * - 小文件：写 snapshot.json
   * - 大文件：LuckyExcel 解析后按行切块落盘，前端渐进挂载
   */
  async uploadFile(
    file?: Express.Multer.File,
    publicBaseUrl?: string,
  ): Promise<ExcelUploadResult> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('请上传 Excel 文件（.xlsx）');
    }

    const name = file.originalname || 'workbook.xlsx';
    if (/\.xls$/i.test(name) && !/\.xlsx$/i.test(name)) {
      throw new BadRequestException('仅支持 .xlsx，不支持旧版 .xls');
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

    const useChunked = shouldUseChunkedImport(buffer.byteLength, {
      bytesThreshold: getChunkBytesThreshold(),
    });
    this.storage.setTaskMode(stored.id, useChunked ? 'chunked' : 'snapshot');

    this.logger.log(
      `upload done id=${stored.id} cost=${Date.now() - started}ms → parse async (${useChunked ? 'chunked-luckyexcel' : 'snapshot'})`,
    );

    setImmediate(() => {
      if (useChunked) {
        void this.parseChunkedLuckyExcel(stored.id, stored.fileName);
      } else {
        void this.parseToSnapshot(stored.id, buffer, stored.fileName);
      }
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
      parseHint: useChunked ? 'chunked' : 'snapshot',
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

  private async parseToSnapshot(id: string, buffer: Buffer, fileName: string) {
    const started = Date.now();
    this.logger.log(`parse snapshot start id=${id} name=${fileName}`);
    this.storage.updateTaskProgress(id, 10);
    const timeoutMs = getParseTimeoutMs();
    const timer = setTimeout(() => {
      this.storage.markTaskError(id, `解析超时（>${Math.round(timeoutMs / 1000)}s）`);
      this.logger.error(`parse snapshot timeout id=${id}`);
    }, timeoutMs);

    try {
      const result = await importExcelBinary(buffer, fileName);
      const task = this.storage.getTask(id);
      if (task?.status === 'error') return;
      const snapshotPath = await this.storage.saveSnapshot(id, result.workbookData);
      this.logger.log(
        `parse snapshot done id=${id} cost=${Date.now() - started}ms snapshot=${snapshotPath}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.storage.markTaskError(id, message);
      this.logger.error(
        `parse snapshot failed id=${id} cost=${Date.now() - started}ms: ${message}`,
        error instanceof Error ? error.stack : undefined,
      );
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 大文件：LuckyExcel 解析（与前端本地同一套）→ 按行切块落盘，前端渐进挂载。
   */
  private async parseChunkedLuckyExcel(id: string, fileName: string) {
    const started = Date.now();
    this.logger.log(`parse chunked(luckyexcel) start id=${id} name=${fileName}`);
    this.storage.updateTaskProgress(id, 5);

    const timeoutMs = getParseTimeoutMs();
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      this.storage.markTaskError(id, `解析超时（>${Math.round(timeoutMs / 1000)}s）`);
      this.logger.error(`parse chunked timeout id=${id}`);
    }, timeoutMs);

    try {
      const buffer = await readFile(this.storage.getXlsxFullPath(id));
      this.storage.updateTaskProgress(id, 15);

      const result = await importExcelBinary(buffer, fileName);
      if (settled) return;
      this.storage.updateTaskProgress(id, 35);

      const uploadDir = this.storage.getUploadDir();
      const { meta } = await splitWorkbookDataToChunks(result.workbookData, {
        fileName,
        blockRowSize: getBlockRowSize(),
        maxRows: getMaxRows(),
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
        `parse chunked(luckyexcel) done id=${id} cost=${Date.now() - started}ms blocks=${totalBlocks} truncated=${Boolean(meta.truncated)}`,
      );
    } catch (error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const message = error instanceof Error ? error.message : String(error);
      this.storage.markTaskError(id, message);
      this.logger.error(
        `parse chunked(luckyexcel) failed id=${id} cost=${Date.now() - started}ms: ${message}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async exportFile(body: ExportExcelDto): Promise<{ buffer: Buffer; fileName: string }> {
    const data = body?.data;
    if (!data) {
      throw new BadRequestException('缺少工作簿数据 data');
    }

    const buffer = await workbookDataToExcelBuffer(data);
    const rawName = body.fileName?.trim() || data.name || 'workbook';
    const fileName = rawName.endsWith('.xlsx') ? rawName : `${rawName}.xlsx`;

    return { buffer, fileName };
  }
}
