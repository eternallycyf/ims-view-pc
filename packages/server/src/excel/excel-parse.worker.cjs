/**
 * Worker 入口（纯 CJS）：调用 @ims-view/univer-import-excel 公共转换，本文件只负责读盘/写盘/进度上报。
 * 与本地导入同一套 ExcelJS→Univer 映射（excelBufferToChunkedWorkbook）。
 */
const { parentPort, workerData } = require('worker_threads');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const { createRequire } = require('module');

const requireFromHere = createRequire(__filename);

const resolveImportExcel = () => {
  const candidates = [
    // monorepo 源码旁的构建产物（最稳）
    () => path.resolve(__dirname, '../../../univer-import-excel/lib/index.js'),
    () => requireFromHere.resolve('@ims-view/univer-import-excel'),
    () =>
      requireFromHere.resolve('@ims-view/univer-import-excel', {
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
  throw new Error('无法解析 @ims-view/univer-import-excel，请先在 packages/univer-import-excel 执行 pnpm build');
};

const {
  excelBufferToChunkedWorkbook,
  chunkedBlockFileName,
  chunkedMetaFileName,
} = resolveImportExcel();

const post = (msg) => parentPort && parentPort.postMessage(msg);
const log = (message) => post({ type: 'log', message });

(async () => {
  const started = Date.now();
  const {
    id,
    xlsxPath,
    outDir: outDirRaw,
    uploadDir,
    fileName,
    blockRowSize = 5000,
    maxRows = 0,
    includeStyles = true,
  } = workerData || {};
  const outDir = outDirRaw || uploadDir;

  if (!id || !xlsxPath || !outDir) {
    throw new Error('workerData 缺少 id / xlsxPath / outDir(uploadDir)');
  }

  log(`worker start id=${id} file=${fileName || path.basename(xlsxPath)}`);
  const buffer = await readFile(xlsxPath);
  log(`read xlsx ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB cost=${Date.now() - started}ms`);

  let emittedBlocks = 0;

  const { meta } = await excelBufferToChunkedWorkbook(buffer, {
    fileName: fileName || path.basename(xlsxPath),
    blockRowSize,
    maxRows,
    includeStyles,
    workbookId: `wb-chunked-${id}`,
    onProgress: (progress) => {
      post({
        type: 'progress',
        percent: progress.percent,
        parsedBlocks: progress.parsedBlocks,
        totalBlocks: progress.totalBlocks,
        phase: progress.phase,
      });
    },
    onBlock: async (block) => {
      const name = chunkedBlockFileName(id, block.sheetIndex, block.blockIndex);
      await writeFile(path.join(outDir, name), JSON.stringify(block), 'utf8');
      emittedBlocks += 1;
    },
  });

  // onBlock 已写盘时 blocks 可能为空数组
  const metaName = chunkedMetaFileName(id);
  const metaPath = path.join(outDir, metaName);
  await writeFile(metaPath, JSON.stringify(meta), 'utf8');

  const costMs = Date.now() - started;
  log(
    `done id=${id} cost=${costMs}ms blocks=${emittedBlocks} styles=${Object.keys(meta.styles || {}).length} truncated=${Boolean(meta.truncated)}`,
  );
  post({
    type: 'done',
    costMs,
    parsedBlocks: emittedBlocks,
    totalBlocks: emittedBlocks,
    truncated: Boolean(meta.truncated),
    metaFile: metaName,
    metaFileName: metaName,
  });
})().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  post({ type: 'error', message, error: message, stack });
});
