import * as ExcelJSNS from 'exceljs';

const pick = (mod) => {
  if (!mod || typeof mod !== 'object') return undefined;
  if (typeof mod.Workbook === 'function') return mod;
  if (mod.default && typeof mod.default.Workbook === 'function') return mod.default;
  return undefined;
};

const fromGlobal = () => {
  const g =
    (typeof globalThis !== 'undefined' && globalThis.ExcelJS) ||
    (typeof window !== 'undefined' && window.ExcelJS);
  return g && typeof g.Workbook === 'function' ? g : undefined;
};

const Exceljs = pick(ExcelJSNS) || fromGlobal() || ExcelJSNS;

export default Exceljs;
export { Exceljs as ExcelJS };
