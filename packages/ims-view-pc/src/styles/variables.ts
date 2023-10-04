import { theme, ThemeConfig } from 'antd';
const { getDesignToken } = theme;

export interface IThemeConfig {
  variables: ThemeConfig['token'];
}

export const themeConfig: IThemeConfig = {
  variables: getDesignToken(),
};
