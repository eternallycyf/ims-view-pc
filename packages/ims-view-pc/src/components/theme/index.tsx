import React from 'react';
import { CustomTheme } from '../../styles/customTheme';
import Badge from './Badge';
import Empty, { emptyImages } from './Empty';
import { ThemeHandle, ThemeProps } from './interface';
import Tag from './Tag';
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
  Tag: typeof Tag;
  Empty: Record<keyof typeof emptyImages, typeof Empty>;
};

const Theme = CompoundedTheme as CompoundedComponent;

Theme.Badge = Badge;
Theme.ThemeColor = CustomTheme;
Theme.Tag = Tag;

Theme.Empty = {
  Search: () => <Empty src={emptyImages.Search} name={'search'} />,
  Doc: () => <Empty src={emptyImages.Doc} name={'doc'} />,
  Upload: () => <Empty src={emptyImages.Upload} name={'upload'} />,
};

export default Theme;
