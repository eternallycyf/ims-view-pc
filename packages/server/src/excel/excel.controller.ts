import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { ResponseEntity, ZodValidationPipe } from '../shared';
import { ExcelTaskIdDto } from './dto/excel-task-id.dto';
import { ExportExcelDto } from './dto/export-excel.dto';
import { ExcelService } from './excel.service';

const uploadInterceptor = FileInterceptor('file', {
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const publicBaseUrl = (req: Request) => {
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol;
  const host = req.get('host');
  return host ? `${proto}://${host}` : undefined;
};

@Controller('excel')
@UsePipes(ZodValidationPipe)
export class ExcelController {
  constructor(@Inject(ExcelService) private readonly excelService: ExcelService) {}

  @Get('health')
  health() {
    return ResponseEntity.ofSuccess({
      ok: true,
      service: 'excel-exchange',
      importMode: 'async-chunked',
    });
  }

  /** 上传 .xlsx / .csv：立即返回；后台 ExcelJS Worker 分块解析 */
  @Post('upload')
  @UseInterceptors(uploadInterceptor)
  async uploadExcel(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const data = await this.excelService.uploadFile(file, publicBaseUrl(req));
    return ResponseEntity.ofSuccess(data);
  }

  /** 轮询解析任务状态 */
  @Get('task/:id')
  getTask(@Param() params: ExcelTaskIdDto, @Req() req: Request) {
    const data = this.excelService.getTask(params.id, publicBaseUrl(req));
    return ResponseEntity.ofSuccess(data);
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
