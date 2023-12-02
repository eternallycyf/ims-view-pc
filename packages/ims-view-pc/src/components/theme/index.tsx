import React from 'react';
import { CustomTheme } from '../../styles/customTheme';
import Badge from './Badge';
import { ThemeHandle, ThemeProps } from './interface';
import ThemeComponent from './Theme';

const CompoundedTheme = React.forwardRef<ThemeHandle, ThemeProps>(ThemeComponent) as <
  Values = Record<string, unknown>,
>(
  props: React.PropsWithChildren<ThemeProps<Values>> & {
    ref?: React.Ref<ThemeHandle<Values>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedTheme & {
  Badge: typeof Badge;
  ThemeColor: typeof CustomTheme;
};

const Theme = CompoundedTheme as CompoundedComponent;

Theme.Badge = Badge;
Theme.ThemeColor = CustomTheme;

export default Theme;
