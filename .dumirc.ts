import { defineConfig } from 'dumi';
import type { SiteThemeConfig } from 'dumi-theme-antd-style';
import { footer } from 'ims-template-config';
import path from 'path';
import { features } from './config/features';
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
          link: '/components',
        },
        {
          text: 'Github',
          link: 'https://github.com/eternallycyf/',
          openExternal: true,
        },
      ],
      features: features,
    },
  },
  socialLinks: { github: homepage },
  apiHeader: {
    sourceUrl: `https://github.com/eternallycyf/ims-view-pc/tree/master/packages/ims-view-pc/src/components/{atomId}/index.tsx`,
    docUrl: `https://github.com/eternallycyf/ims-view-pc/tree/master/packages/ims-view-pc/src/components/{atomId}/index.md`,
    pkg: 'ims-view-pc',
    match: ['components'],
  },
  footerConfig: {
    bottom: '2023',
    copyright: 'Made with ❤️ by eternallycyf - AFX & 数字科技',
    columns: footer(repo),
  },
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
    '@ims-view/chart': path.join(__dirname, './packages/chart/src'),
    'ims-view-pc': path.join(__dirname, './packages/ims-view-pc/src'),
    '@ims-view/hooks/src': path.join(__dirname, './packages/hooks/src/*'),
    '@ims-view/utils/src': path.join(__dirname, './packages/utils/src/*'),
    '@ims-view/chart/src': path.join(__dirname, './packages/chart/src/*'),
    'ims-view-pc/src': path.join(__dirname, './packages/ims-view-pc/src/*'),
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      { type: 'component', dir: './packages/ims-view-pc/src/components' },
      { type: 'hooks', dir: './packages/hooks/src' },
      { type: 'utils', dir: './packages/utils/src' },
      { type: 'chart', dir: './packages/chart/src' },
    ],
    // entryFile: './packages/ims-view-pc/src/index.ts',
  },
  styles: [
    `html, body { background: transparent;  }
  @media (prefers-color-scheme: dark) {
    html, body { background: #0E1116; }
  }`,
    style,
  ],
  outputPath: 'docs-dist',
  devtool: isProd ? false : 'source-map',
  clickToComponent: {},
  ignoreMomentLocale: true,
  targets: { chrome: 79 },
  codeSplitting: { jsStrategy: 'granularChunks' },
  themeConfig,
  ssr: isProd ? {} : false,
  mock: {
    include: ['mock/**/*.{ts}'],
  },
  exportStatic: false,
  html2sketch: {},
  mfsu: {
    runtimePublicPath: true,
  },
});
