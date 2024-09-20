import '@umijs/max/typings';

declare module '*.less';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string;
  }
}

import { SlateElement } from '@wangeditor/editor/dist/';

declare module '@wangeditor/editor' {
  // 扩展 Text

  type VideoElement = SlateElement & {
    src: string;
    poster?: string;
  };
}

declare global {
  interface Window {}
}
