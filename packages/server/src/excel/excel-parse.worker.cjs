/**
 * Worker 入口（纯 CJS）：ExcelJS 分块写盘，不依赖 tsx。
 * 由 excel.service 用 worker_threads 拉起。
 */
const { parentPort, workerData } = require('worker_threads');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const { createRequire } = require('module');

const requireFromHere = createRequire(__filename);

const resolveExcelJS = () => {
  const candidates = [
    () => requireFromHere.resolve('exceljs'),
    () =>
      requireFromHere.resolve('exceljs', {
        paths: [path.resolve(__dirname, '../../../utils')],
      }),
    () =>
      requireFromHere.resolve('exceljs', {
        paths: [path.resolve(__dirname, '../../../../node_modules')],
      }),
  ];
  for (const tryResolve of candidates) {
    try {
      // eslint-disable-next-line import/no-dynamic-require
      return require(tryResolve());
    } catch {
      // continue
    }
  }
  throw new Error('无法解析 exceljs，请确认 monorepo 依赖已安装');
};

const ExcelJS = resolveExcelJS();

const CellValueType = {
  STRING: 1,
  NUMBER: 2,
  BOOLEAN: 3,
};

const argbToRgb = (argb) => {
  if (!argb || typeof argb !== 'string') return undefined;
  const hex = argb.replace(/^#/, '');
  if (hex.length === 8) return `#${hex.slice(2)}`;
  if (hex.length === 6) return `#${hex}`;
  return undefined;
};

const excelColorToRgb = (color) => {
  if (!color) return undefined;
  if (color.argb) return argbToRgb(color.argb);
  return undefined;
};

const cellFromExcelJs = (cell) => {
  const value = cell.value;
  if (value == null || value === '') return null;

  let mapped = null;

  if (typeof value === 'object' && value !== null && 'formula' in value) {
    const formula = String(value.formula || '').replace(/^=/, '');
    const result = value.result;
    mapped = {
      f: `=${formula}`,
      v: result,
      t:
        typeof result === 'number'
          ? CellValueType.NUMBER
          : typeof result === 'boolean'
            ? CellValueType.BOOLEAN
            : CellValueType.STRING,
    };
  } else if (typeof value === 'object' && value !== null && 'richText' in value) {
    const text = (value.richText || []).map((part) => part.text || '').join('');
    if (!text) return null;
    mapped = { v: text, t: CellValueType.STRING };
  } else if (typeof value === 'object' && value !== null && 'text' in value && 'hyperlink' in value) {
    mapped = { v: String(value.text || ''), t: CellValueType.STRING };
  } else if (typeof value === 'object' && value !== null && 'error' in value) {
    mapped = { v: String(value.error), t: CellValueType.STRING };
  } else if (value instanceof Date) {
    mapped = { v: value.toISOString(), t: CellValueType.STRING };
  } else if (typeof value === 'number') {
    mapped = { v: value, t: CellValueType.NUMBER };
  } else if (typeof value === 'boolean') {
    mapped = { v: value, t: CellValueType.BOOLEAN };
  } else {
    const text = String(value);
    if (!text) return null;
    mapped = { v: text, t: CellValueType.STRING };
  }

  const style = {};
  const font = cell.font;
  if (font) {
    if (font.bold) style.bl = 1;
    if (font.italic) style.it = 1;
    if (font.size) style.fs = font.size;
    if (font.name) style.ff = font.name;
    const fc = excelColorToRgb(font.color);
    if (fc) style.cl = { rgb: fc };
  }
  const fill = cell.fill;
  if (fill && fill.type === 'pattern' && fill.fgColor) {
    const bg = excelColorToRgb(fill.fgColor);
    if (bg) style.bg = { rgb: bg };
  }
  if (Object.keys(style).length) mapped.s = style;
  return mapped;
};

const collectMerges = (worksheet, maxRowExclusive) => {
  const merges = [];
  const raw = worksheet.model && worksheet.model.merges;
  if (!Array.isArray(raw)) return merges;
  raw.forEach((ref) => {
    try {
      const [start, end] = String(ref).split(':');
      if (!start) return;
      const startCell = worksheet.getCell(start);
      const endCell = worksheet.getCell(end || start);
      const top = Number(startCell.row) - 1;
      const left = Number(startCell.col) - 1;
      const bottom = Number(endCell.row) - 1;
      const right = Number(endCell.col) - 1;
      if (top >= maxRowExclusive) return;
      merges.push({
        startRow: top,
        startColumn: left,
        endRow: Math.min(bottom, maxRowExclusive - 1),
        endColumn: right,
      });
    } catch {
      // ignore
    }
  });
  return merges;
};

const post = (msg) => {
  if (parentPort) parentPort.postMessage(msg);
};

const main = async () => {
  const data = workerData || {};
  const {
    id,
    xlsxPath,
    uploadDir,
    fileName = 'workbook.xlsx',
    blockRowSize = 2000,
    maxRows = 100000,
  } = data;

  if (!id || !xlsxPath || !uploadDir) {
    throw new Error('workerData 缺少 id / xlsxPath / uploadDir');
  }

  const effectiveMaxRows = maxRows === 0 ? Number.POSITIVE_INFINITY : maxRows;
  const buffer = await readFile(xlsxPath);

  post({ type: 'progress', percent: 5, parsedBlocks: 0, totalBlocks: 0 });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  post({ type: 'progress', percent: 20, parsedBlocks: 0, totalBlocks: 0 });

  const sheetsMeta = [];
  const sheetOrder = [];
  let truncated = false;
  let emittedBlocks = 0;

  const sheetInfos = workbook.worksheets.map((worksheet, sheetIndex) => {
    const sheetId = `sheet-${sheetIndex}`;
    const actualRowCount = worksheet.rowCount || 0;
    const cappedRows = Math.min(actualRowCount, effectiveMaxRows);
    if (actualRowCount > effectiveMaxRows) truncated = true;
    const blockCount = Math.max(1, Math.ceil(Math.max(cappedRows, 1) / blockRowSize));
    return { worksheet, sheetIndex, sheetId, cappedRows, blockCount };
  });

  const totalBlocks = sheetInfos.reduce((sum, info) => sum + info.blockCount, 0) || 1;

  for (const info of sheetInfos) {
    const { worksheet, sheetIndex, sheetId, cappedRows, blockCount } = info;
    sheetOrder.push(sheetId);

    let maxCol = 0;
    const mergeData = collectMerges(worksheet, cappedRows);

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
      const startRow = blockIndex * blockRowSize;
      const endRow = Math.min(cappedRows, startRow + blockRowSize) - 1;
      const cellData = {};

      if (cappedRows > 0 && endRow >= startRow) {
        for (let excelRow = startRow + 1; excelRow <= endRow + 1; excelRow += 1) {
          const row = worksheet.getRow(excelRow);
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const mapped = cellFromExcelJs(cell);
            if (!mapped) return;
            const r = excelRow - 1;
            const c = colNumber - 1;
            if (!cellData[r]) cellData[r] = {};
            cellData[r][c] = mapped;
            maxCol = Math.max(maxCol, colNumber);
          });
        }
      }

      const blockName = `${id}.block.${sheetIndex}.${blockIndex}.json`;
      await writeFile(
        path.join(uploadDir, blockName),
        JSON.stringify({
          sheetId,
          sheetIndex,
          blockIndex,
          startRow: Math.max(0, startRow),
          endRow: Math.max(0, endRow),
          cellData,
        }),
        'utf8',
      );

      emittedBlocks += 1;
      const percent = Math.min(95, 20 + Math.round((emittedBlocks / totalBlocks) * 75));
      post({
        type: 'progress',
        percent,
        parsedBlocks: emittedBlocks,
        totalBlocks,
      });
    }

    sheetsMeta.push({
      id: sheetId,
      name: worksheet.name || `Sheet${sheetIndex + 1}`,
      rowCount: Math.max(cappedRows, 1),
      columnCount: Math.max(maxCol, 1),
      blockCount,
      mergeData: mergeData.length ? mergeData : undefined,
    });
  }

  const meta = {
    parseEngine: 'exceljs',
    fileName,
    name: String(fileName).replace(/\.xlsx$/i, '') || 'workbook',
    sheetOrder,
    sheets: sheetsMeta,
    blockRowSize,
    truncated: truncated || undefined,
    maxRows: Number.isFinite(effectiveMaxRows) ? effectiveMaxRows : undefined,
  };

  const metaFileName = `${id}.meta.json`;
  await writeFile(path.join(uploadDir, metaFileName), JSON.stringify(meta), 'utf8');

  post({
    type: 'done',
    metaPath: metaFileName,
    metaFileName,
    parsedBlocks: emittedBlocks,
    totalBlocks,
    truncated: meta.truncated,
  });
};

main().catch((error) => {
  post({
    type: 'error',
    message: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
