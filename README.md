# ims-view-pc

a antd component plus, and more component

[![Gitmoji][gitmoji]][gitmoji-url] [![semantic-release][semantic-release]][semantic-release-repo]

[![ docs by dumi][dumi-url]](https://d.umijs.org/) [![Build With father][father-url]](https://github.com/umijs/father/) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)][lerna-url] [![typedoc](https://img.shields.io/badge/API%20by-typedoc-9600ff.svg)](https://typedoc.org/)

<!-- umi url -->

[lerna-url]: https://lernajs.io/
[dumi-url]: https://img.shields.io/badge/docs%20by-dumi-blue
[father-url]: https://img.shields.io/badge/build%20with-father-028fe4.svg

<!-- badage url -->

[gitmoji]: https://img.shields.io/badge/Gitmoji-%20😜%20😍-FFDD67.svg
[gitmoji-url]: https://gitmoji.carloscuesta.me/
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-repo]: https://github.com/semantic-release/semantic-release

## 本地运行

在线地址: ➡️ [传送门](https://ims-view-pc-eternallycyfs-projects.vercel.app/)

```shell
node v20.19.0

pnpm i

# 文档站 / 组件开发
pnpm run start

# 可选：Excel 大文件导入导出 Nest 服务（packages/server）
IMS_SERVER_PORT=3010 pnpm start:server
```

文档导航：`components` / `chart` / `hooks` / `utils` / **`server`**（`@ims-view/server` API）。

## 🖥 浏览器兼容性

- 现代浏览器
- [Electron](https://www.electronjs.org/)

| [![edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](http://godban.github.io/browsers-support-badges/) | [![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](http://godban.github.io/browsers-support-badges/) | [![chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](http://godban.github.io/browsers-support-badges/) | [![safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)](http://godban.github.io/browsers-support-badges/) | [![electron_48x48](https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png)](http://godban.github.io/browsers-support-badges/) |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge                                                                                                                                              | last 2 versions                                                                                                                                         | last 2 versions                                                                                                                                         | last 2 versions                                                                                                                                         | last 2 versions                                                                                                                                                     |

## 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 😃 ：

- 通过 [Issue](https://github.com/eternallycyf/ims-view-pc/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://github.com/eternallycyf/ims-view-pc/pulls) 改进代码。

## 组件看板

| 组件                                                             | 下载量                                                                                                       | 版本                                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [ims-view-pc](https://www.npmjs.com/package/ims-view-pc)         | ![npm-image](http://img.shields.io/npm/v/ims-view-pc.svg?style=flat-square&color=deepgreen&label=latest)     | [![NPM downloads][ims-view-pc-download-image]][ims-view-pc-download-url]         |
| [@ims-view/chart](https://www.npmjs.com/package/@ims-view/chart) | ![npm-image](http://img.shields.io/npm/v/@ims-view/chart?style=flat-square&color=deepgreen&label=latest)     | [![NPM downloads][@ims-view/chart-download-image]][@ims-view/chart-download-url] |
| [@ims-view/hooks](https://www.npmjs.com/package/@ims-view/hooks) | ![npm-image](http://img.shields.io/npm/v/@ims-view/hooks.svg?style=flat-square&color=deepgreen&label=latest) | [![NPM downloads][@ims-view/hooks-download-image]][@ims-view/hooks-download-url] |
| [@ims-view/utils](https://www.npmjs.com/package/@ims-view/utils) | ![npm-image](http://img.shields.io/npm/v/@ims-view/utils.svg?style=flat-square&color=deepgreen&label=latest) | [![NPM downloads][@ims-view/utils-download-image]][@ims-view/utils-download-url] |
| [@ims-view/server](https://www.npmjs.com/package/@ims-view/server) | ![npm-image](http://img.shields.io/npm/v/@ims-view/server.svg?style=flat-square&color=deepgreen&label=latest) | [![NPM downloads][@ims-view/server-download-image]][@ims-view/server-download-url] |

[ims-view-pc-download-url]: https://npmjs.org/package/ims-view-pc
[ims-view-pc-download-image]: https://img.shields.io/npm/dm/ims-view-pc.svg?style=flat-square
[@ims-view/chart-download-url]: https://npmjs.org/package/@ims-view/chart
[@ims-view/chart-download-image]: https://img.shields.io/npm/dm/@ims-view/chart?style=flat-square
[@ims-view/hooks-download-url]: https://npmjs.org/package/@ims-view/hooks
[@ims-view/hooks-download-image]: https://img.shields.io/npm/dm/@ims-view/hooks.svg?style=flat-square
[@ims-view/utils-download-url]: https://npmjs.org/package/@ims-view/utils
[@ims-view/utils-download-image]: https://img.shields.io/npm/dm/@ims-view/utils.svg?style=flat-square
[@ims-view/server-download-url]: https://npmjs.org/package/@ims-view/server
[@ims-view/server-download-image]: https://img.shields.io/npm/dm/@ims-view/server.svg?style=flat-square

## Monorepo 包

| 包名 | 路径 | 说明 |
| ---- | ---- | ---- |
| `ims-view-pc` | `packages/ims-view-pc` | React 组件库（含 `ExcelEditor` 等） |
| `@ims-view/chart` | `packages/chart` | 图表 |
| `@ims-view/hooks` | `packages/hooks` | Hooks |
| `@ims-view/utils` | `packages/utils` | 工具（含 Excel ↔ Univer 转换） |
| `@ims-view/server` | `packages/server` | NestJS Excel 导入导出服务（`pnpm start:server` / `npx ims-view-server`） |

文档站侧栏对应：`/components`、`/chart`、`/hooks`、`/utils`、`/server`。

## License

[MIT](./LICENSE) ® eternallycyf
