/**
 * @ims-view/server 库入口：可嵌入其它 Nest 应用。
 * 独立进程请用 CLI：`ims-view-server` / `pnpm start:server`
 */
export { AppModule } from './app.module';
export { ExcelController } from './excel/excel.controller';
export { ExcelModule } from './excel/excel.module';
export { ExcelService } from './excel/excel.service';
export {
  ExcelStorageService,
  EXCEL_STATIC_PREFIX,
  getExcelUploadDir,
} from './excel/excel-storage.service';
export type { ExportExcelDto, ExportExcelPlain } from './excel/types';
export { exportExcelSchema, excelTaskIdSchema } from './excel/types';
export type {
  ICellData,
  IRange,
  IWorkbookData,
  IWorksheetData,
} from './excel/types';
export { CellValueType } from './excel/types';
export {
  createZodBaseModel,
  isZodModel,
  ResponseEntity,
  StatusCode,
  ZodExceptionFilter,
  ZodValidationError,
  ZodValidationPipe,
} from './shared';
export { loadServerEnv, serverEnvSchema } from './config/env';
export type { ServerEnv } from './config/env';
