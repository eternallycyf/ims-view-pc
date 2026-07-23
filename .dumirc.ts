import { defineConfig } from 'dumi';
import type { SiteThemeConfig } from 'dumi-theme-antd-style';
import fs from 'fs';
import { footer } from 'ims-template-config';
import path from 'path';
import { features } from './config/features';
import style from './docs/siteIndexStyle';
import { homepage, name as repo } from './package.json';

const basePath = `/${repo}/`;
const isProd = process.env.NODE_ENV === 'production';

/**
 * 仅精确 alias 主入口，避免把 `@univerjs/core` 指到包根导致
 * `@univerjs/core/facade` 等 exports 子路径失效。
 */
const resolveUniverCore = () => {
  const presetsEntry = require.resolve('@univerjs/presets', {
    paths: [path.join(__dirname, 'packages/ims-view-pc')],
  });
  let dir = path.dirname(presetsEntry);
  for (let i = 0; i < 12; i += 1) {
    const candidate = path.join(dir, 'node_modules/@univerjs/core');
    if (fs.existsSync(path.join(candidate, 'package.json'))) {
      return candidate;
    }
    dir = path.dirname(dir);
  }
  throw new Error('Cannot resolve @univerjs/core (expected 0.25.x via @univerjs/presets)');
};

const univerCorePath = resolveUniverCore();
const univerCoreEs = path.join(univerCorePath, 'lib/es');

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
    '@ims-view/server': path.join(__dirname, './packages/server/src'),
    'ims-view-pc': path.join(__dirname, './packages/ims-view-pc/src'),
    '@ims-view/hooks/src': path.join(__dirname, './packages/hooks/src/*'),
    '@ims-view/utils/src': path.join(__dirname, './packages/utils/src/*'),
    '@ims-view/chart/src': path.join(__dirname, './packages/chart/src/*'),
    '@ims-view/server/src': path.join(__dirname, './packages/server/src/*'),
    'ims-view-pc/src': path.join(__dirname, './packages/ims-view-pc/src/*'),
    // `$` 仅匹配精确导入，保留 `/facade` 等子路径
    '@univerjs/core$': path.join(univerCoreEs, 'index.js'),
    '@univerjs/core/facade': path.join(univerCoreEs, 'facade.js'),
    '@univerjs/core/lib/facade': path.join(univerCoreEs, 'facade.js'),
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
  ssr: false,
  mock: {
    include: ['mock/**/*.{ts}'],
  },
  exportStatic: false,
  html2sketch: {},
  mfsu: {
    runtimePublicPath: true,
    // LuckyExcel 预编译易踩 HTML/双 core；排除后走正常解析 + 上方 core alias
    exclude: ['@zwight/luckyexcel', '@progress/jszip-esm', '@zwight/exceljs'],
  },
});
