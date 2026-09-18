/**
 * 浏览器 Excel 解析 Worker（供 ExcelEditor 本地大文件导入）。
 * 源码：`new URL('./excelParse.worker.ts', import.meta.url)`；发布产物由 fix-worker-urls 改为 .js。
 */
import { installExcelParseWorker } from '@ims-view/univer-import-excel';

installExcelParseWorker(self as unknown as {
  postMessage: (msg: unknown) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
});
