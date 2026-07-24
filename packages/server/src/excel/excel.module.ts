import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { ExcelStorageService } from './excel-storage.service';

@Module({
  controllers: [ExcelController],
  providers: [ExcelStorageService, ExcelService],
  exports: [ExcelService, ExcelStorageService],
})
export class ExcelModule {}
