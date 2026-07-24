---
title: excel
order: 1
toc: content
nav:
  title: server
  order: 5
group:
  title: API
  order: 1
---

## excel

Excel 导入导出 HTTP 接口（`ExcelController`）。默认 Base URL：`http://localhost:3010`。

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| `GET` | `/excel/health` | 健康检查 |
| `POST` | `/excel/upload` | 上传 `.xlsx` / `.csv`，立即返回；后台异步解析 |
| `GET` | `/excel/task/:id` | 轮询解析任务状态 |
| `GET` | `/excel/static/*` | 下载 xlsx / snapshot / meta / block 产物 |
| `POST` | `/excel/export` | 工作簿快照导出为 `.xlsx` |

源码：[excel.controller.ts](https://github.com/eternallycyf/ims-view-pc/blob/master/packages/server/src/excel/excel.controller.ts)

### 导入策略

一律 **ExcelJS Worker** → `{id}.meta.json` + blocks（约 10 万行 / 10s 级；默认映射样式 + 浮动图 + 冻结窗格；不做条件格式/图表等）。

可调环境变量：`IMS_EXCEL_PARSE_TIMEOUT_MS`（超时）、`IMS_EXCEL_UPLOAD_DIR` / `IMS_EXCEL_UPLOAD_TTL_MS`（上传目录与 TTL）。

---

### GET /excel/health

#### Response

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `ok` | `boolean` | 是否正常 |
| `service` | `string` | 固定为 `excel-exchange` |
| `importMode` | `string` | `async-chunked` |

```bash
curl http://localhost:3010/excel/health
```

---

### POST /excel/upload

上传 `.xlsx` / `.csv`（不支持旧版 `.xls`），落盘后立即返回；后台异步解析。最大约 50MB。

#### Request

| 位置 | 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| Header | `Content-Type` | `string` | 是 | `multipart/form-data` |
| Body | `file` | `File` | 是 | `.xlsx` / `.csv` 文件 |

#### Response（`data`）

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `mode` | `string` | `async-snapshot` |
| `id` | `string` | 任务 / 文件 id |
| `fileName` | `string` | 原始文件名 |
| `path` / `url` | `string` | 原始 xlsx 静态路径 |
| `taskPath` / `taskUrl` | `string` | 任务查询路径 |
| `size` | `number` | 字节数 |
| `expiresAt` | `number` | 过期时间戳 |
| `parseHint` | `string` | 固定 `chunked` |

```bash
curl -X POST http://localhost:3010/excel/upload \
  -F "file=@./workbook.xlsx"
```

```ts
const formData = new FormData();
formData.append('file', file);
const res = await fetch('http://localhost:3010/excel/upload', {
  method: 'POST',
  body: formData,
});
const { data } = await res.json();
// data.id / data.taskUrl / data.parseHint
```

---

### GET /excel/task/:id

轮询解析进度；`done` 后用 `snapshotUrl` 或 `metaUrl` 拉产物。

#### Response（`data`）

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `status` | `string` | `pending` \| `done` \| `error` |
| `mode` | `string` | `snapshot` \| `chunked` |
| `progress` | `number` | 0–100 |
| `parsedBlocks` / `totalBlocks` | `number` | chunked 进度 |
| `snapshotUrl` | `string` | snapshot 模式产物 |
| `metaUrl` | `string` | chunked 模式 meta |
| `truncated` | `boolean` | 是否触达行上限截断 |
| `error` | `string` | 失败原因 |

```bash
curl http://localhost:3010/excel/task/{id}
```

chunked 块文件路径约定：`/excel/static/{id}.block.{sheetIndex}.{blockIndex}.json`

---

### POST /excel/export

将 Univer 工作簿快照导出为 `.xlsx` 文件流。

#### Request

| 位置 | 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| Header | `Content-Type` | `string` | 是 | `application/json` |
| Body | `data` | `Partial<IWorkbookData>` | 是 | 工作簿快照 |
| Body | `fileName` | `string` | 否 | 下载名 |

#### Example

```bash
curl -X POST http://localhost:3010/excel/export \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"wb-1","sheets":{},"sheetOrder":[]},"fileName":"workbook.xlsx"}' \
  -o workbook.xlsx
```

---

### 与 ExcelEditor

`ExcelEditor` **默认走浏览器本地**导入导出；传入 `exchangeEndpoint`（如 `http://localhost:3010`）后走 upload → task 轮询 → 分块挂载。导入为 ExcelJS；导出浏览器 / Nest 均为 LuckyExcel（无 exceljs 回退）。
