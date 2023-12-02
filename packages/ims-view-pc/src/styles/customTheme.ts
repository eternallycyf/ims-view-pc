//#region
export type IBaseThemeType = 'blue' | 'red' | 'orange' | 'green' | 'grey' | 'purple' | 'white';
export type IBaseHoverActiveBg =
  | 'blue-bg'
  | 'blue-hover'
  | 'blue-active'
  | 'red-bg'
  | 'red-hover'
  | 'red-active'
  | 'orange-bg'
  | 'orange-hover'
  | 'orange-active'
  | 'green-bg'
  | 'green-hover'
  | 'green-active'
  | 'grey-bg'
  | 'grey-hover'
  | 'grey-active'
  | 'purple-bg'
  | 'purple-hover'
  | 'purple-active'
  | 'light-blue-bg'
  | 'light-blue-hover'
  | 'light-blue-active'
  | 'brown-bg'
  | 'brown-hover'
  | 'brown-active';
export type IOtherThemeType =
  | 'primary-border-color'
  | 'primary-bg'
  | 'control-height'
  | 'text-color'
  | 'text-disabled-color'
  | 'text-disabled-weight-color'
  | 'status-text';
export type IBadgeThemeType = 'start' | 'approve' | 'success' | 'finish' | 'error' | 'draft';
export type ISimpleChartThemeType =
  | 'line-simple-color1'
  | 'line-simple-color2'
  | 'line-simple-color3'
  | 'line-simple-color4'
  | 'line-simple-color5'
  | 'line-simple-color6'
  | 'line-simple-color7'
  | 'line-simple-color8';
export type IBarGroupThemeType =
  | 'bar-group-color1'
  | 'bar-group-color2'
  | 'bar-group-color3'
  | 'bar-group-color4'
  | 'bar-group-color5'
  | 'bar-group-color6'
  | 'bar-group-color7'
  | 'bar-group-color8'
  | 'bar-group-color9'
  | 'bar-group-color10'
  | 'bar-group-color11'
  | 'bar-group-color12'
  | 'bar-group-color13'
  | 'bar-group-color14'
  | 'bar-group-color15';
export type ICustomThemeType =
  | IBaseThemeType
  | IBaseHoverActiveBg
  | IOtherThemeType
  | IBadgeThemeType
  | ISimpleChartThemeType
  | IBarGroupThemeType;
//#endregion

//#region
export const BaseTheme: Record<IBaseThemeType, string> = {
  blue: '#2b5fdc',
  red: '#e62c3b',
  orange: '#fa6a0a',
  green: '#11bb43',
  grey: '#b3b8c2',
  purple: '#b974ff',
  white: '#fff',
};

export const BaseHoverActiveBg: Record<IBaseHoverActiveBg, string> = {
  'blue-bg': '#f5f8ff',
  'blue-hover': '#4d7fe3',
  'blue-active': '#1b45b8',
  'red-bg': '#fff6f5',
  'red-hover': '#eb4f57',
  'red-active': '#c01b2f',
  'orange-bg': '#fff5e8',
  'orange-hover': '#fb8b36',
  'orange-active': '#cf5006',
  'green-bg': '#f5fff5',
  'green-hover': '#33c95b',
  'green-active': '#0b9f3c',
  'grey-bg': '#eff1f4',
  'grey-hover': '#caced7',
  'grey-active': '#8e96a4',
  'purple-bg': '#e7c7ff',
  'purple-hover': '#a04dff',
  'purple-active': '#8426ff',
  'light-blue-bg': '#e8f3ff',
  'light-blue-hover': '#54cfda',
  'light-blue-active': '#1fb4c2',
  'brown-bg': '#d6b296',
  'brown-hover': '#c89979',
  'brown-active': '#b37a5a',
};

export const OtherTheme: Record<IOtherThemeType, string> = {
  'primary-border-color': '#bed7f8',
  'primary-bg': '#e8f3ff',
  'control-height': '26px',
  'text-color': '#5b6371',
  'text-disabled-color': BaseHoverActiveBg['grey-hover'],
  'text-disabled-weight-color': '#5b6371',
  'status-text': '#2A303B',
};

export const BadgeTheme: Record<IBadgeThemeType, string> = {
  start: BaseHoverActiveBg['blue-hover'],
  approve: BaseTheme['orange'],
  success: BaseTheme['green'],
  finish: BaseTheme['grey'],
  error: BaseTheme['red'],
  draft: OtherTheme['primary-border-color'],
};

export const SimpleChartTheme: Record<ISimpleChartThemeType, string> = {
  'line-simple-color1': BaseHoverActiveBg['blue-hover'],
  'line-simple-color2': BaseHoverActiveBg['red-hover'],
  'line-simple-color3': BaseHoverActiveBg['orange-hover'],
  'line-simple-color4': BaseHoverActiveBg['green-hover'],
  'line-simple-color5': BaseHoverActiveBg['purple-hover'],
  'line-simple-color6': BaseHoverActiveBg['grey-hover'],
  'line-simple-color7': BaseHoverActiveBg['light-blue-hover'],
  'line-simple-color8': BaseHoverActiveBg['brown-hover'],
};

export const BarGroupTheme: Record<IBarGroupThemeType, string> = {
  'bar-group-color1': BaseHoverActiveBg['blue-hover'],
  'bar-group-color2': BaseTheme['blue'],
  'bar-group-color3': BaseHoverActiveBg['blue-active'],
  'bar-group-color4': BaseHoverActiveBg['green-hover'],
  'bar-group-color5': BaseTheme['green'],
  'bar-group-color6': BaseHoverActiveBg['green-active'],
  'bar-group-color7': BaseHoverActiveBg['orange-hover'],
  'bar-group-color8': BaseTheme['orange'],
  'bar-group-color9': BaseHoverActiveBg['orange-active'],
  'bar-group-color10': BaseHoverActiveBg['red-hover'],
  'bar-group-color11': BaseTheme['red'],
  'bar-group-color12': BaseHoverActiveBg['red-active'],
  'bar-group-color13': BaseHoverActiveBg['purple-hover'],
  'bar-group-color14': BaseTheme['purple'],
  'bar-group-color15': BaseHoverActiveBg['purple-active'],
};
//#endregion

//#region
export const CustomTheme: Record<ICustomThemeType, string> = {
  ...BaseTheme,
  ...BaseHoverActiveBg,
  ...OtherTheme,
  ...BadgeTheme,
  ...SimpleChartTheme,
  ...BarGroupTheme,
};
