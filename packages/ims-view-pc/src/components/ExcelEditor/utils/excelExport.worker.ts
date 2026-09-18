/**
 * 浏览器 Excel 导出 Worker（供 ExcelEditor 本地导出）。
 * 源码：`new URL('./excelExport.worker.ts', import.meta.url)`；发布产物由 fix-worker-urls 改为 .js。
 */
import { installExcelExportWorker } from '@ims-view/utils';

installExcelExportWorker(self as unknown as {
  postMessage: (msg: unknown, transfer?: Transferable[]) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
});
