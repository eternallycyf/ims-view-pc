/**
 * exceljs 浏览器入口是 UMD（exceljs.min.js），Vite 直出时没有 ESM default。
 * 统一做兼容，避免 `import X from 'exceljs'` 报错。
 */
import * as ExcelJSNS from 'exceljs';
import type ExcelJSType from 'exceljs';

type ExcelJSModule = typeof ExcelJSType;

const pickExcelJS = (mod: unknown): ExcelJSModule | undefined => {
  if (!mod || typeof mod !== 'object') return undefined;
  const m = mod as Record<string, unknown>;
  if (typeof m.Workbook === 'function') return m as ExcelJSModule;
  const d = m.default as Record<string, unknown> | undefined;
  if (d && typeof d.Workbook === 'function') return d as ExcelJSModule;
  return undefined;
};

const fromGlobal = (): ExcelJSModule | undefined => {
  const g =
    (typeof globalThis !== 'undefined' && (globalThis as { ExcelJS?: ExcelJSModule }).ExcelJS) ||
    (typeof window !== 'undefined' && (window as { ExcelJS?: ExcelJSModule }).ExcelJS);
  return g && typeof g.Workbook === 'function' ? g : undefined;
};

export const ExcelJS: ExcelJSModule =
  pickExcelJS(ExcelJSNS) || fromGlobal() || (ExcelJSNS as unknown as ExcelJSModule);

export default ExcelJS;
