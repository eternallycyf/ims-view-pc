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

基于 [Univer](https://univer.ai/) 的表格组件，用于在页面里预览、编辑 Excel（仅 `.xlsx`），并支持导入导出。

- `mode`：功能档位（简单 / 全部 / 自定义）
- `viewMode`：预览或编辑
- 默认浏览器本地导入导出；大文件导入可配置 `exchangeEndpoint` 走服务端

### 功能档位

| mode | 说明 |
| ---- | ---- |
| `simple`（默认） | 核心编辑 + 插入 + 导入导出 |
| `all` | 筛选、排序、条件格式、数据验证、超链接、查找替换、备注、表格、图片等 |
| `custom` | 按 `features` 勾选 |

### 如何使用

```tsx | pure
import { ExcelEditor } from 'ims-view-pc';

{/* 父容器需有高度 */}
<div style={{ height: 500 }}>
  <ExcelEditor mode="simple" />
</div>

<ExcelEditor mode="all" height={500} width="100%" />
<ExcelEditor mode="custom" features={{ filter: true, drawing: true }} height="60vh" />
<ExcelEditor mode="simple" viewMode="preview" src="/excel.xlsx" height={480} />

{/* 大文件导入：先 pnpm start:server，再传服务地址 */}
<ExcelEditor exchangeEndpoint="http://localhost:3010" height={500} />
```

## 示例

<code description="简单模式：核心编辑、插入、导入导出" src="./demo/base.tsx">简单模式</code>

<code description="全部能力（评论默认关闭）" src="./demo/all.tsx">全部能力</code>

<code description="只读预览：可拖列表头调列宽/行高，不可操作单元格" src="./demo/preview.tsx">预览模式</code>

<code description="通过 src 加载 Excel" src="./demo/src.tsx">加载远程文件</code>

<code description="前端本地导入导出（默认）" src="./demo/exchange.tsx">导入导出</code>

<code description="上传后服务端异步解析；大文件 ExcelJS 分块 + 渐进挂载" src="./demo/server.tsx">服务端导入</code>

:::info{title=提示}
- 默认宽高 `100%`，请给父容器明确高度，或传 `height` / `width`。
- `data` 优先于 `src`。
- 编辑视图默认显示 Ribbon「导入导出」，可用 `showExchange={false}` 关闭。
- 本地导入建议 ≤5MB；更大文件请配置 `exchangeEndpoint`（`pnpm start:server`）：
  - **小文件**：Nest LuckyExcel → snapshot，前端一次挂载
  - **大文件（默认 >2MB）**：同一套 Nest LuckyExcel 解析 → meta + blocks，前端骨架（含图片/样式）+ 分批挂载；默认最多约 15 万行（`IMS_EXCEL_MAX_ROWS`）
- 仅支持 `.xlsx`，不支持旧版 `.xls`。
:::

## API

| 属性                 | 说明                                      | 类型                           | 默认值                    |
| -------------------- | ----------------------------------------- | ------------------------------ | ------------------------- |
| mode                 | 功能档位                                  | `'simple' \| 'all' \| 'custom'` | `'simple'`               |
| features             | custom 模式下勾选的能力                   | `ExcelEditorFeatures`          | -                         |
| viewMode             | 预览 / 编辑                               | `'preview' \| 'edit'`          | `'edit'`                  |
| src                  | Excel 文件地址（仅 .xlsx）                | `string`                       | -                         |
| data                 | 工作簿数据，优先级高于 `src`              | `Partial<IWorkbookData>`       | -                         |
| exchangeEndpoint     | 大文件导入服务；上传后异步解析（snapshot / chunked）并轮询 | `string`                       | -                         |
| showExchange         | Ribbon「导入导出」                        | `boolean`                      | `viewMode === 'edit'`     |
| height               | 容器高度                                  | `number \| string`             | `100%`                    |
| width                | 容器宽度                                  | `number \| string`             | `100%`                    |
| className            | 自定义类名                                | `string`                       | -                         |
| style                | 自定义样式                                | `CSSProperties`                | -                         |
| onReady              | 初始化完成回调                            | `(univerAPI: FUniver) => void` | -                         |
| onError              | 失败回调                                  | `(error: Error) => void`       | -                         |

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

| 方法            | 说明               | 类型                                              |
| --------------- | ------------------ | ------------------------------------------------- |
| getUniverAPI    | 获取 Univer API    | `() => FUniver \| null`                           |
| getWorkbookData | 获取当前工作簿快照 | `() => Partial<IWorkbookData> \| null`            |
| importXlsx      | 导入 Excel         | `(file: File) => Promise<Partial<IWorkbookData>>` |
| exportXlsx      | 导出 Excel         | `(fileName?: string) => Promise<void>`            |
