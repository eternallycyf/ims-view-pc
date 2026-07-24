/**
 * Nest 导出 Worker（纯 CJS）：LuckyExcel Univer→xlsx（与浏览器同一套），不堵 HTTP 主线程。
 * workerData: { snapshotPath, outPath, fileName }
 */
const { parentPort, workerData } = require('worker_threads');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const { createRequire } = require('module');

const requireFromHere = createRequire(__filename);

const resolveUtilsExcel = () => {
  const candidates = [
    () => requireFromHere.resolve('@ims-view/utils'),
    () =>
      requireFromHere.resolve('@ims-view/utils', {
        paths: [
          path.resolve(__dirname, '../../..'),
          path.resolve(__dirname, '../../../../node_modules'),
        ],
      }),
  ];
  for (const tryResolve of candidates) {
    try {
      const id = tryResolve();
      // eslint-disable-next-line import/no-dynamic-require
      return require(id);
    } catch {
      // continue
    }
  }
  throw new Error('无法解析 @ims-view/utils，请先构建 packages/utils');
};

const post = (msg) => parentPort && parentPort.postMessage(msg);
const log = (message) => post({ type: 'log', message });

(async () => {
  const started = Date.now();
  const { snapshotPath, outPath, fileName } = workerData || {};
  if (!snapshotPath || !outPath) {
    throw new Error('workerData 缺少 snapshotPath / outPath');
  }

  log(`export worker start file=${fileName || path.basename(outPath)} engine=luckyexcel`);
  const raw = await readFile(snapshotPath, 'utf8');
  const snapshot = JSON.parse(raw);
  const utils = resolveUtilsExcel();
  const workbookDataToExcelBuffer = utils.workbookDataToExcelBuffer;
  if (typeof workbookDataToExcelBuffer !== 'function') {
    throw new Error('@ims-view/utils 未导出 workbookDataToExcelBuffer');
  }

  const buffer = await workbookDataToExcelBuffer(snapshot, fileName || path.basename(outPath));
  await writeFile(outPath, buffer);
  const costMs = Date.now() - started;
  log(
    `export worker done cost=${costMs}ms size=${(buffer.byteLength / 1024).toFixed(1)}KB`,
  );
  post({
    type: 'done',
    costMs,
    size: buffer.byteLength,
    outPath,
  });
})().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  post({ type: 'error', message, error: message, stack });
});
