---
title: ExcelEditor
description: Excel 编辑器：基于 Univer 提供 Excel 预览与编辑能力
toc: content
group:
  title: 文件
  order: 5
demo:
  cols: 1
---

## ExcelEditor Excel 编辑器

基于 [Univer](https://univer.ai/) 的 Excel 编辑器：`mode` 控制功能档位，`viewMode` 切换预览 / 编辑；本地 `.xlsx` 优先 `@zwight/luckyexcel`（[JSZip](https://github.com/Stuk/jszip)），失败回退 SheetJS；`.xls` 直接走 SheetJS（LuckyExcel 对旧格式易出空表）。大文件可走 Nest 服务。

主题色跟随宿主 `ConfigProvider`（`theme.useToken().colorPrimary`）；未包裹时回退到 `variables.colorPrimary`。

### 功能档位

| mode | 说明 |
| ---- | ---- |
| `simple`（默认） | 核心编辑 + 插入 + 导入导出（无公式栏 / 数据能力） |
| `all` | 开启筛选、排序、条件格式、数据验证、超链接、查找替换、备注、表格、图片等 |
| `custom` | 按 `features` 勾选 |

评论（`threadComment`）默认关闭。

### 如何使用

```tsx | pure
import { ExcelEditor } from 'ims-view-pc';

<ExcelEditor mode="simple" height={500} />
<ExcelEditor mode="all" height={500} />
<ExcelEditor mode="custom" features={{ filter: true, drawing: true }} height={500} />
<ExcelEditor mode="simple" viewMode="preview" src="/excel.xlsx" height={500} />
```

## 示例

<code description="简单模式：核心编辑、插入、导入导出" src="./demo/base.tsx">简单模式</code>

<code description="全部能力（评论默认关闭）" src="./demo/all.tsx">全部能力</code>

<code description="只读预览：可拖列表头调列宽/行高，不可操作单元格" src="./demo/preview.tsx">预览模式</code>

<code description="通过 src 加载 Excel" src="./demo/src.tsx">加载远程文件</code>

<code description="导入导出演示" src="./demo/exchange.tsx">导入导出</code>

:::info{title=提示}
- `data` 与 `src` 同时传入时，优先使用 `data`。
- 编辑视图默认展示 Ribbon「导入导出」；可用 `showExchange={false}` 关闭。
- 预览模式走 Univer 自带只读（`setEditable(false)` + `setReadOnly`）；表头仍可调列宽 / 行高。
- 远程 `src` 需可访问（注意跨域）。
:::

## API

| 属性                 | 说明                                      | 类型                           | 默认值                    |
| -------------------- | ----------------------------------------- | ------------------------------ | ------------------------- |
| mode                 | 功能档位                                  | `'simple' \| 'all' \| 'custom'` | `'simple'`               |
| features             | custom 模式下勾选的能力                   | `ExcelEditorFeatures`          | -                         |
| viewMode             | 预览 / 编辑（预览可调表头宽高，不可操作单元格） | `'preview' \| 'edit'`        | `'edit'`                  |
| src                  | Excel 文件地址（.xlsx / .xls）            | `string`                       | -                         |
| data                 | 工作簿数据，优先级高于 `src`              | `Partial<IWorkbookData>`       | -                         |
| exchangeEndpoint     | 大文件可选 Nest 服务地址                  | `string`                       | `http://localhost:3010`  |
| serverSizeThreshold  | 超过该大小优先走 server（字节）           | `number`                       | `10485760`（10MB）        |
| showExchange         | Ribbon「导入导出」；未传时编辑视图为 true | `boolean`                      | `viewMode === 'edit'`     |
| height               | 容器高度                                  | `number \| string`             | `500`                     |
| className            | 自定义类名                                | `string`                       | -                         |
| style                | 自定义样式                                | `CSSProperties`                | -                         |
| onReady              | 初始化完成回调                            | `(univerAPI: FUniver) => void` | -                         |
| onError              | 加载或渲染失败回调                        | `(error: Error) => void`       | -                         |

### features

| 字段 | 说明 |
| ---- | ---- |
| drawing | 图片 / 绘图 |
| filter | 筛选 |
| sort | 排序 |
| conditionalFormatting | 条件格式 |
| dataValidation | 数据验证 |
| hyperLink | 超链接 |
| findReplace | 查找替换 |
| note | 批注备注 |
| table | 表格 |
| threadComment | 评论线程（默认关闭） |

### Ref 方法

| 方法            | 说明                        | 类型                                              |
| --------------- | --------------------------- | ------------------------------------------------- |
| getUniverAPI    | 获取 Univer Facade API      | `() => FUniver \| null`                           |
| getWorkbookData | 获取当前工作簿快照          | `() => Partial<IWorkbookData> \| null`            |
| importXlsx      | 导入 Excel                  | `(file: File) => Promise<Partial<IWorkbookData>>` |
| exportXlsx      | 导出 Excel                  | `(fileName?: string) => Promise<void>`            |
