import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { ExcelService } from './excel.service';
import type { ExportExcelDto } from './types';

// excel import export
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('health')
  health() {
    return { ok: true, service: 'excel-exchange' };
  }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.excelService.importFile(file);
  }

  @Post('export')
  async exportExcel(@Body() body: ExportExcelDto, @Res() res: Response) {
    const { buffer, fileName } = await this.excelService.exportFile(body);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    );
    res.send(buffer);
  }
}
