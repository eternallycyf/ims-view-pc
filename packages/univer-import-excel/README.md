# @ims-view/univer-import-excel

Excel / CSV → Univer 公共导入（本地与 Nest 共用同一套内核：`.xlsx` 用 ExcelJS，`.csv` 用文本解析）。导出请用 `@ims-view/utils` 的 LuckyExcel API。

## 用法

```ts
import { transformExcelToUniver } from '@ims-view/univer-import-excel';

await transformExcelToUniver(file, {
  worker: 'auto', // off | auto | on
  workerThresholdBytes: 512 * 1024,
  blockRowSize: 5000,
  includeStyles: true,
  createWorker: () =>
    new Worker(new URL('./excelParse.worker.ts', import.meta.url), { type: 'module' }),
  onProgress: (percent) => console.log(percent),
});
```

Worker 脚本内：

```ts
import { installExcelParseWorker } from '@ims-view/univer-import-excel';
installExcelParseWorker(self);
```

| API | 场景 |
|-----|------|
| `transformExcelToUniver` / `excelJsToUniver` | 浏览器：可 Web Worker |
| `excelBufferToChunkedWorkbook` | Nest `worker_threads` / 同进程分块 |
