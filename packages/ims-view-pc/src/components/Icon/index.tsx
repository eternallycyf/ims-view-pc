import { createFromIconfontCN } from '@ant-design/icons';
import { FC } from 'react';
import { iconFontJSON } from './iconfont';

type IconType = (typeof iconFontJSON)['glyphs'][number]['font_class'];
type CapitalizeStr<Str extends string> = Str extends `${infer Rest}` ? `icon-${Rest}` : Str;

export interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  type: CapitalizeStr<IconType>;
  spin?: boolean;
  rotate?: number;
}

import localIconfont from '../../styles/iconfont/iconfont.js';

function getIconScriptUrl() {
  if (typeof window === 'undefined') return '';
  const script = document.createElement('script');
  script.src = localIconfont; // 尝试本地
  script.onerror = () => {
    script.src = 'https://ims-view-pc-eternallycyfs-projects.vercel.app/iconfont/iconfont.js'; // 在线回退
    document.body.appendChild(script);
  };
  document.body.appendChild(script);
  return localIconfont; // 先返回本地路径，createFromIconfontCN 会用这个
}

const Icon: FC<IconProps> = createFromIconfontCN({
  scriptUrl: getIconScriptUrl(),
});

export default Icon;
