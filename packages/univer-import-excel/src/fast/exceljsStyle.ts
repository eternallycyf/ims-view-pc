/**
 * ExcelJS → Univer 基本样式映射（参考 @zwight/luckyexcel / CasualOffice）。
 * 不依赖 @univerjs/core 运行时，数字枚举与 Univer BorderStyleTypes 对齐。
 */
import type ExcelJS from 'exceljs';

/** 与 @univerjs/core BorderStyleTypes 数值一致 */
export const BorderStyleTypes = {
  NONE: 0,
  THIN: 1,
  HAIR: 2,
  DOTTED: 3,
  DASHED: 4,
  DASH_DOT: 5,
  DASH_DOT_DOT: 6,
  DOUBLE: 7,
  MEDIUM: 8,
  MEDIUM_DASHED: 9,
  MEDIUM_DASH_DOT: 10,
  MEDIUM_DASH_DOT_DOT: 11,
  SLANT_DASH_DOT: 12,
  THICK: 13,
} as const;

/** Office 主题色常见回退（theme 0–9），无 argb 时尽量给色 */
const THEME_RGB: Record<number, string> = {
  0: '#ffffff',
  1: '#000000',
  2: '#e7e6e6',
  3: '#44546a',
  4: '#5b9bd5',
  5: '#ed7d31',
  6: '#a5a5a5',
  7: '#ffc000',
  8: '#4472c4',
  9: '#70ad47',
};

const EXCEL_BORDER_TO_UNIVER: Record<string, number> = {
  thin: BorderStyleTypes.THIN,
  hair: BorderStyleTypes.HAIR,
  dotted: BorderStyleTypes.DOTTED,
  dashed: BorderStyleTypes.DASHED,
  dashDot: BorderStyleTypes.DASH_DOT,
  dashDotDot: BorderStyleTypes.DASH_DOT_DOT,
  double: BorderStyleTypes.DOUBLE,
  medium: BorderStyleTypes.MEDIUM,
  mediumDashed: BorderStyleTypes.MEDIUM_DASHED,
  mediumDashDot: BorderStyleTypes.MEDIUM_DASH_DOT,
  mediumDashDotDot: BorderStyleTypes.MEDIUM_DASH_DOT_DOT,
  slantDashDot: BorderStyleTypes.SLANT_DASH_DOT,
  thick: BorderStyleTypes.THICK,
};

export type UniverStyleData = Record<string, unknown>;

export const argbToRgb = (argb?: string): string | undefined => {
  if (!argb || typeof argb !== 'string') return undefined;
  const hex = argb.replace(/^#/, '');
  if (hex.length === 8) return `#${hex.slice(2).toLowerCase()}`;
  if (hex.length === 6) return `#${hex.toLowerCase()}`;
  return undefined;
};

export const excelColorToRgb = (color?: Partial<ExcelJS.Color> | null): string | undefined => {
  if (!color) return undefined;
  if (color.argb) return argbToRgb(color.argb);
  const themeColor = color as Partial<ExcelJS.Color> & { theme?: number; tint?: number; indexed?: number };
  if (typeof themeColor.theme === 'number' && Number.isFinite(themeColor.theme)) {
    const base = THEME_RGB[themeColor.theme];
    if (!base) return undefined;
    // tint 简化：正变亮负变暗（近似）
    const tint = typeof themeColor.tint === 'number' ? themeColor.tint : 0;
    if (!tint) return base;
    return applyTint(base, tint);
  }
  if (typeof themeColor.indexed === 'number') {
    const indexed = themeColor.indexed;
    if (indexed === 0 || indexed === 64) return '#000000';
    if (indexed === 1 || indexed === 65) return '#ffffff';
  }
  return undefined;
};

const applyTint = (hex: string, tint: number): string => {
  const raw = hex.replace(/^#/, '');
  if (raw.length !== 6) return hex;
  const channel = (i: number) => {
    let v = parseInt(raw.slice(i, i + 2), 16);
    if (tint < 0) v = Math.round(v * (1 + tint));
    else v = Math.round(v + (255 - v) * tint);
    return Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');
  };
  return `#${channel(0)}${channel(2)}${channel(4)}`;
};

const mapBorderSide = (
  side?: Partial<ExcelJS.Border>,
): { s: number; cl?: { rgb: string } } | undefined => {
  if (!side?.style) return undefined;
  const s = EXCEL_BORDER_TO_UNIVER[side.style] ?? BorderStyleTypes.THIN;
  const rgb = excelColorToRgb(side.color);
  return rgb ? { s, cl: { rgb } } : { s };
};

/**
 * ExcelJS Cell → Univer IStyleData（对照 LuckyExcel 基本样式字段）
 */
export const excelStyleToUniver = (cell: ExcelJS.Cell): UniverStyleData | undefined => {
  const style: UniverStyleData = {};

  const font = cell.font;
  if (font) {
    if (font.name) style.ff = font.name;
    if (font.size != null) style.fs = font.size;
    if (font.bold) style.bl = 1;
    if (font.italic) style.it = 1;
    if (font.underline) style.ul = { s: 1 };
    if (font.strike) style.st = { s: 1 };
    const fc = excelColorToRgb(font.color);
    if (fc) style.cl = { rgb: fc };
  }

  const fill = cell.fill;
  if (fill && fill.type === 'pattern') {
    const bg = excelColorToRgb(fill.fgColor) || excelColorToRgb(fill.bgColor);
    if (bg) style.bg = { rgb: bg };
  }

  if (cell.alignment) {
    const h = cell.alignment.horizontal;
    const v = cell.alignment.vertical;
    if (h === 'left') style.ht = 1;
    else if (h === 'center' || h === 'centerContinuous') style.ht = 2;
    else if (h === 'right') style.ht = 3;
    else if (h === 'justify' || h === 'distributed') style.ht = 4;

    if (v === 'top') style.vt = 1;
    else if (v === 'middle') style.vt = 2;
    else if (v === 'bottom') style.vt = 3;

    if (cell.alignment.wrapText) style.tb = 3; // WRAP
    if (typeof cell.alignment.indent === 'number' && cell.alignment.indent > 0) {
      // LuckyExcel / Univer：pd.l 近似 indent*10px
      style.pd = { l: 2 + cell.alignment.indent * 10 };
    }
  }

  const numFmt = cell.numFmt;
  if (numFmt && numFmt !== 'General') {
    style.n = { pattern: numFmt };
  }

  const border = cell.border;
  if (border) {
    const bd: Record<string, unknown> = {};
    const t = mapBorderSide(border.top);
    const b = mapBorderSide(border.bottom);
    const l = mapBorderSide(border.left);
    const r = mapBorderSide(border.right);
    if (t) bd.t = t;
    if (b) bd.b = b;
    if (l) bd.l = l;
    if (r) bd.r = r;
    if (Object.keys(bd).length) style.bd = bd;
  }

  // Excel 默认 locked=true；ExcelJS 仅在非默认时写入。Luckysheet 约定 lo:1 锁定 / 0 未锁定
  const protection = cell.protection as { locked?: boolean; hidden?: boolean } | undefined;
  if (protection) {
    if (protection.locked === false) style.lo = 0;
    else if (protection.locked === true) style.lo = 1;
  }

  return Object.keys(style).length ? style : undefined;
};

/** 样式表 intern：单元格 s 存 id，与 LuckyExcel snapshot 形态一致 */
export class StyleInterner {
  readonly styles: Record<string, UniverStyleData> = {};
  private readonly byKey = new Map<string, string>();
  private counter = 0;

  intern(style?: UniverStyleData): string | undefined {
    if (!style || !Object.keys(style).length) return undefined;
    const key = JSON.stringify(style);
    const existing = this.byKey.get(key);
    if (existing) return existing;
    const id = `s${this.counter++}`;
    this.byKey.set(key, id);
    this.styles[id] = style;
    return id;
  }
}
