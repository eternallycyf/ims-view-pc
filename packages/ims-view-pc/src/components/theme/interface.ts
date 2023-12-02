import { BadgeProps } from 'antd';
import { LiteralUnion } from 'ims-view-pc';
import { ICustomThemeType } from '../../styles/customTheme';

/**
 * @typedef ThemeHandle - 主题
 * @template T - record
 * @property
 * @example <caption>xxx</caption>
 */
export type ThemeHandle<T = Record<string, any>> = {};

/**
 * @typedef ThemeProps - 主题
 * @template T - record
 */
export interface ThemeProps<T = Record<string, any>> {
  children?: React.ReactNode;
}

export interface IThemeBadgeProps<T = any> extends BadgeProps {
  color?: LiteralUnion<ICustomThemeType>;
  isTable?: boolean;
}
