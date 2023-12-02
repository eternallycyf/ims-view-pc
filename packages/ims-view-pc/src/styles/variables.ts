import { theme, ThemeConfig } from 'antd';
import { CustomTheme as defaultCustomTheme } from './customTheme';
const { getDesignToken } = theme;

export interface IThemeConfig {
  variables: ThemeConfig['token'];
}

// import { variables } from '../../../styles/variables';
// style={{ '--colorPrimaryHover': variables?.colorPrimary }}

export const themeConfig: IThemeConfig = {
  variables: getDesignToken(),
};

export const variables = themeConfig.variables;
export const CustomTheme = defaultCustomTheme;
