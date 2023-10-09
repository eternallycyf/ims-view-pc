import { theme, ThemeConfig } from 'antd';
const { getDesignToken } = theme;

export interface IThemeConfig {
  variables: ThemeConfig['token'];
}

// import { themeConfig } from '../../../styles/variables';
// style={{ '--colorPrimaryHover': themeConfig?.variables?.colorPrimary }}

export const themeConfig: IThemeConfig = {
  variables: getDesignToken(),
};
