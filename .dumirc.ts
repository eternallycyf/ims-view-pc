import { defineConfig } from 'dumi';
import type { SiteThemeConfig } from 'dumi-theme-antd-style';
import path from 'path';
import { featuresZh } from './config/features';
import style from './docs/siteIndexStyle';
import { homepage, name as repo } from './package.json';

const basePath = `/${repo}/`;
const isProd = process.env.NODE_ENV === 'production';

const themeConfig: SiteThemeConfig = {
  name: repo,
  github: homepage,
  logo: isProd ? '/images/origin.png' : `/${repo}/images/origin.png`,
  hero: {
    'zh-CN': {
      description: 'Ant Design Style 文档站主题包',
      actions: [
        {
          type: 'primary',
          text: '开始使用',
          link: '/guide',
        },
        {
          text: 'Github',
          link: 'https://github.com/eternallycyf/',
          openExternal: true,
        },
      ],
      features: featuresZh,
    },
    'en-US': {
      description: 'dumi2 theme similar to antd v5 website',
      actions: [
        {
          type: 'primary',
          text: 'Start',
          link: '/guide-en',
        },
        {
          text: 'Config',
          link: '/config-en',
        },
      ],
    },
  },
  socialLinks: { github: homepage },
  footer: 'Made with ❤️ by eternallycyf - AFX & 数字科技',
};

export default defineConfig({
  title: repo,
  define: {
    'process.env': process.env,
  },
  base: isProd ? '/' : `/${repo}`,
  publicPath: isProd ? '/' : basePath,
  favicons: [isProd ? '/images/favicon.ico' : `/${repo}/images/favicon.ico`],
  alias: {
    '@ims-view/hooks': path.join(__dirname, './packages/hooks/src'),
    '@ims-view/utils': path.join(__dirname, './packages/utils/src'),
  },
  styles: [
    `html, body { background: transparent;  }
  @media (prefers-color-scheme: dark) {
    html, body { background: #0E1116; }
  }`,
    style,
  ],
  devtool: isProd ? false : 'source-map',
  clickToComponent: {},
  ignoreMomentLocale: true,
  targets: { chrome: 79 },
  codeSplitting: { jsStrategy: 'granularChunks' },
  themeConfig,
  ssr: isProd ? {} : false,
  hash: true,
  mock: {},
  html2sketch: {},
  mfsu: {
    runtimePublicPath: true,
  },
});
