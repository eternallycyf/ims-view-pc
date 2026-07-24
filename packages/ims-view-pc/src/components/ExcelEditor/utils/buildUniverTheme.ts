import { greenTheme, type Theme } from '@univerjs/presets';
import type { GlobalToken } from 'antd';
import type { CSSProperties } from 'react';

const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)));

const parseHex = (input: string): [number, number, number] | null => {
  const hex = input.replace('#', '').trim();
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    return [
      Number.parseInt(hex[0] + hex[0], 16),
      Number.parseInt(hex[1] + hex[1], 16),
      Number.parseInt(hex[2] + hex[2], 16),
    ];
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    ];
  }
  return null;
};

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;

/** 线性混合两个颜色，t=0 取 a，t=1 取 b */
const mix = (a: string, b: string, t: number) => {
  const left = parseHex(a);
  const right = parseHex(b);
  if (!left || !right) return a;
  return toHex(
    left[0] + (right[0] - left[0]) * t,
    left[1] + (right[1] - left[1]) * t,
    left[2] + (right[2] - left[2]) * t,
  );
};

/** Microsoft Excel / SpreadJS 经典强调色 */
export const OFFICE_EXCEL_GREEN = '#217346';

export type ProjectThemeColors = {
  colorPrimary: string;
  colorPrimaryHover?: string;
  colorPrimaryActive?: string;
  colorPrimaryBg?: string;
};

/** 从主色生成 Univer primary 色阶 */
export const buildPrimaryScale = (colors: ProjectThemeColors): Theme['primary'] => {
  const primary = colors.colorPrimary;
  const hover = colors.colorPrimaryHover || mix(primary, '#FFFFFF', 0.18);
  const active = colors.colorPrimaryActive || mix(primary, '#000000', 0.16);
  const bg = colors.colorPrimaryBg || mix(primary, '#FFFFFF', 0.92);

  return {
    50: bg,
    100: mix(primary, '#FFFFFF', 0.85),
    200: mix(primary, '#FFFFFF', 0.7),
    300: mix(primary, '#FFFFFF', 0.5),
    400: hover,
    500: mix(primary, '#FFFFFF', 0.08),
    600: primary,
    700: active,
    800: mix(primary, '#000000', 0.28),
    900: mix(primary, '#000000', 0.4),
  };
};

/**
 * Excel / SpreadJS 风格主题：
 * - 默认 Office 绿（不跟 antd 蓝走，避免表格像后台管理系统）
 * - 灰阶贴近 Excel 浅灰 Ribbon / 表头
 */
export const buildUniverTheme = (colors?: ProjectThemeColors): Theme => {
  const primary = colors?.colorPrimary || OFFICE_EXCEL_GREEN;
  return {
    ...greenTheme,
    primary: buildPrimaryScale({
      colorPrimary: primary,
      colorPrimaryHover: colors?.colorPrimaryHover,
      colorPrimaryActive: colors?.colorPrimaryActive,
      colorPrimaryBg: colors?.colorPrimaryBg || mix(primary, '#FFFFFF', 0.94),
    }),
    // 更接近 Office 的中性灰（表头 / 分隔线）
    gray: {
      ...greenTheme.gray,
      50: '#FAFAFA',
      100: '#F3F3F3',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  };
};

/** ExcelEditor 默认用 Office 绿；仅当显式传入品牌色时覆盖 */
export const pickExcelEditorThemeColors = (
  token?: Partial<GlobalToken>,
  options?: { followBrand?: boolean },
): ProjectThemeColors => {
  if (options?.followBrand) {
    return {
      colorPrimary: token?.colorPrimary || OFFICE_EXCEL_GREEN,
      colorPrimaryHover: token?.colorPrimaryHover,
      colorPrimaryActive: token?.colorPrimaryActive,
      colorPrimaryBg: token?.colorPrimaryBg,
    };
  }
  return {
    colorPrimary: OFFICE_EXCEL_GREEN,
    colorPrimaryHover: mix(OFFICE_EXCEL_GREEN, '#FFFFFF', 0.16),
    colorPrimaryActive: mix(OFFICE_EXCEL_GREEN, '#000000', 0.12),
    colorPrimaryBg: mix(OFFICE_EXCEL_GREEN, '#FFFFFF', 0.94),
  };
};

/** @deprecated 请用 pickExcelEditorThemeColors；保留以免旧引用报错 */
export const pickThemeColorsFromToken = pickExcelEditorThemeColors;

/** 包裹层 CSS 变量 */
export const buildThemeCssVars = (colors: ProjectThemeColors): CSSProperties =>
  ({
    '--colorPrimary': colors.colorPrimary,
    '--colorPrimaryHover': colors.colorPrimaryHover || colors.colorPrimary,
    '--colorPrimaryActive': colors.colorPrimaryActive || colors.colorPrimary,
    '--colorBgPrimary': colors.colorPrimaryBg || colors.colorPrimary,
    '--primary-color': colors.colorPrimary,
    '--primary-color-hover': colors.colorPrimaryHover || colors.colorPrimary,
    '--primary-color-active': colors.colorPrimaryActive || colors.colorPrimary,
    '--excel-office-green': OFFICE_EXCEL_GREEN,
    '--excel-chrome-bg': '#F3F3F3',
    '--excel-chrome-border': '#C6C6C6',
  }) as CSSProperties;
