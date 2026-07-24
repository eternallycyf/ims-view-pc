/**
 * 浏览器 Excel 导出 Worker（供 ExcelEditor 本地导出）。
 * umi/dumi 通过 `new Worker(new URL('./excelExport.worker.ts', import.meta.url))` 打包。
 */
import { installExcelExportWorker } from '@ims-view/utils';

installExcelExportWorker(self as unknown as {
  postMessage: (msg: unknown, transfer?: Transferable[]) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
});
