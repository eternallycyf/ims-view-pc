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
| `POST` | `/excel/import` | 上传 Excel，返回工作簿快照 |
| `POST` | `/excel/export` | 工作簿快照导出为 `.xlsx` |

源码：[excel.controller.ts](https://github.com/eternallycyf/ims-view-pc/blob/master/packages/server/src/excel/excel.controller.ts)

---

### GET /excel/health

检查服务是否可用。

#### Response

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `ok` | `boolean` | 是否正常 |
| `service` | `string` | 固定为 `excel-exchange` |

#### Status

| 状态码 | 说明 |
| ------ | ---- |
| `200` | 成功 |

#### Example

```bash
curl http://localhost:3010/excel/health
```

```json
{ "ok": true, "service": "excel-exchange" }
```

---

### POST /excel/import

上传 `.xlsx` / `.xls`，返回 Univer 工作簿数据。

#### Request

| 位置 | 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| Header | `Content-Type` | `string` | 是 | `multipart/form-data` |
| Body | `file` | `File` | 是 | Excel 文件，最大 20MB |

#### Response

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `workbookData` | `Partial<IWorkbookData>` | Univer 工作簿快照 |
| `images` | `ExcelSheetImage[]` | 可选，解析出的图片元数据 |

```ts
type ExcelImportResult = {
  workbookData: Partial<IWorkbookData>;
  images?: Array<{
    sheetId: string;
    dataUrl: string;
    row: number;
    col: number;
    offsetX?: number;
    offsetY?: number;
  }>;
};
```

#### Status

| 状态码 | 说明 |
| ------ | ---- |
| `200` | 导入成功 |
| `400` | 未上传文件：`请上传 Excel 文件（.xlsx / .xls）` |

#### Example

```bash
curl -X POST http://localhost:3010/excel/import \
  -F "file=@./workbook.xlsx"
```

```ts
const formData = new FormData();
formData.append('file', file);

const res = await fetch('http://localhost:3010/excel/import', {
  method: 'POST',
  body: formData,
});
const data = await res.json();
// data.workbookData / data.images
```

---

### POST /excel/export

将 Univer 工作簿快照导出为 `.xlsx` 文件流。

#### Request

| 位置 | 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| Header | `Content-Type` | `string` | 是 | `application/json` |
| Body | `data` | `Partial<IWorkbookData>` | 是 | 工作簿快照 |
| Body | `fileName` | `string` | 否 | 下载名，默认 `data.name` 或 `workbook.xlsx` |

```ts
type ExportExcelDto = {
  data: Partial<IWorkbookData>;
  fileName?: string;
};
```

#### Response

| Header / Body | 说明 |
| ------------- | ---- |
| `Content-Type` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `Content-Disposition` | `attachment; filename*=UTF-8''{fileName}` |
| Body | `.xlsx` 二进制 |

#### Status

| 状态码 | 说明 |
| ------ | ---- |
| `200` | 导出成功 |
| `400` | 缺少 `data`：`缺少工作簿数据 data` |

#### Example

```bash
curl -X POST http://localhost:3010/excel/export \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"wb-1","sheets":{},"sheetOrder":[]},"fileName":"workbook.xlsx"}' \
  -o workbook.xlsx
```

```ts
const res = await fetch('http://localhost:3010/excel/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: workbookData, fileName: 'workbook.xlsx' }),
});
const blob = await res.blob();
```

---

### 与 ExcelEditor

`ExcelEditor` **默认走浏览器本地**导入导出；显式传入 `exchangeEndpoint`（如 `http://localhost:3010`）后才调用以上 Nest 接口，适合大文件（建议 ≥1MB）。不再按文件大小自动切换。
