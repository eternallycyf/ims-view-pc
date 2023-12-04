import { BadgeProps, TagProps } from 'antd';
import { LiteralUnion, ValueOf } from 'ims-view-pc';
import { IBaseHoverActiveBg, ICustomThemeType } from '../../styles/customTheme';
import { emptyImages } from './Empty';

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

type ICustomBaseHoverActiveBg = IBaseHoverActiveBg extends `${infer Color}-${infer T}`
  ? Color extends 'light' | 'brown'
    ? never
    : T extends 'bg'
    ? Color
    : never
  : never;

export interface IThemeTagProps<T = any> extends TagProps {
  color?: LiteralUnion<ICustomBaseHoverActiveBg | TagProps['color']>;
}

export interface IThemeEmptyProps {
  src?: string;
  name?: string;
}
