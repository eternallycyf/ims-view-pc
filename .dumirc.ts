import { defineConfig } from 'dumi';
import type { SiteThemeConfig } from 'dumi-theme-antd-style';
import { footer } from 'ims-template-config';
import path from 'path';
import { features } from './config/features';
import style from './docs/siteIndexStyle';
import { homepage, name as repo } from './package.json';

const basePath = `/${repo}/`;
const isProd = process.env.NODE_ENV === 'production';

/**
 * 通过 package.json 定位 @univerjs/core 包根，比 double dirname 更可靠。
 * 多路径尝试：先从根 node_modules 解析，再从子包解析。
 */
const resolveUniverCore = () => {
  const pkgJsonPath = '@univerjs/core/package.json';
  const searchPaths = [
    __dirname,
    path.join(__dirname, 'packages/ims-view-pc'),
  ];
  for (const p of searchPaths) {
    try {
      const resolved = require.resolve(pkgJsonPath, { paths: [p] });
      return path.dirname(resolved);
    } catch { /* try next */ }
  }
  // 兜底：返回相对路径，依赖 chainWebpack resolve.modules
  return path.join(__dirname, 'node_modules/@univerjs/core');
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
    exclude: [
      '@zwight/luckyexcel',
      '@ims-view/univer-import-excel',
      '@progress/jszip-esm',
    ],
  },
  chainWebpack(config) {
    // 兜底：让 webpack 能从子包 node_modules 解析 @univerjs/*
    config.resolve.modules
      .add(path.join(__dirname, 'packages/ims-view-pc/node_modules'))
      .add(path.join(__dirname, 'node_modules'));
  },
});
