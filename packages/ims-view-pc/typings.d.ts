import '@umijs/max/typings';

declare module '*.less';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string;
  }
}

import { SlateDescendant, SlateElement, SlateText } from '@wangeditor/editor/dist/';

declare module '@wangeditor/editor' {
  // 扩展 Text
  interface SlateText {
    text: string;
  }

  // 扩展 Element
  interface SlateElement {
    type: string;
    children: SlateDescendant[];
  }

  type VideoElement = SlateElement & {
    src: string;
    poster?: string;
  };
}
