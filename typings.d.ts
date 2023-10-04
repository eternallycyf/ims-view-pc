import '@umijs/max/typings';

declare module '*.less';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string;
  }
}
