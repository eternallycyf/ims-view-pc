import { createFromIconfontCN } from '@ant-design/icons';
import { FC } from 'react';
import iconfont from '../../styles/iconfont/iconfont.js';
import { iconFontJSON } from './iconfont';

type IconType = (typeof iconFontJSON)['glyphs'][number]['font_class'];
type CapitalizeStr<Str extends string> = Str extends `${infer Rest}` ? `icon-${Rest}` : Str;
export interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  type: CapitalizeStr<IconType>;
  spin?: boolean;
  rotate?: number;
}

const Icon: FC<IconProps> = createFromIconfontCN({
  scriptUrl: iconfont,
});

export default Icon;
