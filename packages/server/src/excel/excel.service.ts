import { BadRequestException, Injectable } from '@nestjs/common';
import {
  excelBufferToImportResult,
  workbookDataToExcelBuffer,
} from './excel.converter';
import type { ExcelImportResult } from './excel.converter';
import type { ExportExcelDto } from './types';

@Injectable()
export class ExcelService {
  async importFile(file?: Express.Multer.File): Promise<ExcelImportResult> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('请上传 Excel 文件（.xlsx / .xls）');
    }

    return excelBufferToImportResult(file.buffer, file.originalname);
  }

  async exportFile(body: ExportExcelDto): Promise<{ buffer: Buffer; fileName: string }> {
    if (!body?.data) {
      throw new BadRequestException('缺少工作簿数据 data');
    }

    const buffer = await workbookDataToExcelBuffer(body.data);
    const rawName = body.fileName?.trim() || body.data.name || 'workbook';
    const fileName = rawName.endsWith('.xlsx') ? rawName : `${rawName}.xlsx`;

    return { buffer, fileName };
  }
}
