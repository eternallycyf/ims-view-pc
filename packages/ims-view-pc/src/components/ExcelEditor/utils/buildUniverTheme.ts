import { defaultTheme, type Theme } from '@univerjs/presets';
import type { GlobalToken } from 'antd';
import type { CSSProperties } from 'react';
import { variables } from '../../../styles/variables';

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

export type ProjectThemeColors = {
  colorPrimary: string;
  colorPrimaryHover?: string;
  colorPrimaryActive?: string;
  colorPrimaryBg?: string;
};

/** 从项目主色生成 Univer primary 色阶 */
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
    500: primary,
    600: active,
    700: mix(primary, '#000000', 0.28),
    800: mix(primary, '#000000', 0.4),
    900: mix(primary, '#000000', 0.52),
  };
};

export const buildUniverTheme = (colors: ProjectThemeColors): Theme => ({
  ...defaultTheme,
  primary: buildPrimaryScale(colors),
});

/** antd token → 项目主色（优先 ConfigProvider） */
export const pickThemeColorsFromToken = (token?: Partial<GlobalToken>): ProjectThemeColors => ({
  colorPrimary: token?.colorPrimary || variables?.colorPrimary || '#1677ff',
  colorPrimaryHover: token?.colorPrimaryHover || variables?.colorPrimaryHover,
  colorPrimaryActive: token?.colorPrimaryActive || variables?.colorPrimaryActive,
  colorPrimaryBg: token?.colorPrimaryBg || variables?.colorPrimaryBg,
});

/** 包裹层 CSS 变量，与项目其他组件保持一致 */
export const buildThemeCssVars = (colors: ProjectThemeColors): CSSProperties =>
  ({
    '--colorPrimary': colors.colorPrimary,
    '--colorPrimaryHover': colors.colorPrimaryHover || colors.colorPrimary,
    '--colorPrimaryActive': colors.colorPrimaryActive || colors.colorPrimary,
    '--colorBgPrimary': colors.colorPrimaryBg || colors.colorPrimary,
    '--primary-color': colors.colorPrimary,
    '--primary-color-hover': colors.colorPrimaryHover || colors.colorPrimary,
    '--primary-color-active': colors.colorPrimaryActive || colors.colorPrimary,
  }) as CSSProperties;
