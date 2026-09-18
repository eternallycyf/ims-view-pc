/**
 * father/tsc 不会改写 `new URL('./xxx.worker.ts', import.meta.url)` 字符串。
 * 发布产物里 worker 已是 .js，消费方只能解析 .worker.js。
 * 源码仍保留 .ts，供 monorepo dumi 直接打 src。
 */
const fs = require('fs');
const path = require('path');

const pkgRoot = path.join(__dirname, '..');

for (const dir of ['es', 'lib']) {
  const file = path.join(pkgRoot, dir, 'components/ExcelEditor/utils/exchangeApi.js');
  if (!fs.existsSync(file)) continue;
  const next = fs
    .readFileSync(file, 'utf8')
    .replace(/\.\/excelParse\.worker\.ts/g, './excelParse.worker.js')
    .replace(/\.\/excelExport\.worker\.ts/g, './excelExport.worker.js');
  fs.writeFileSync(file, next);
  console.log(`[fix-worker-urls] ${path.relative(pkgRoot, file)}`);
}
