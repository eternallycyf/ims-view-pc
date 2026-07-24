/**
 * 浏览器 Excel 解析 Worker（供 ExcelEditor 本地大文件导入）。
 * umi/dumi 通过 `new Worker(new URL('./excelParse.worker.ts', import.meta.url))` 打包。
 */
import { installExcelParseWorker } from '@ims-view/univer-import-excel';

installExcelParseWorker(self as unknown as {
  postMessage: (msg: unknown) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
});
