# @ims-view/server

可选 NestJS 服务（不参与主项目 `start` / `build`），基于 NestJS + exceljs，与前端使用同一套 xlsx ↔ `IWorkbookData` 转换逻辑。

## 环境变量

| 变量 | 说明 | 默认 |
| ---- | ---- | ---- |
| `IMS_SERVER_PORT` | 服务端口（优先） | `3010` |
| `PORT` | 兼容通用端口变量 | - |

前端对应：

| 变量 | 说明 |
| ---- | ---- |
| `IMS_EXCHANGE_ENDPOINT` | 完整服务地址，如 `http://localhost:3010` |
| `IMS_SERVER_PORT` / `PORT` | 未设 endpoint 时用于拼接本地地址 |

可参考仓库根目录 `.env.example` 与 `packages/server/.env.example`。

## 何时需要

`ExcelEditor` 默认：

- **&lt; 10MB**：浏览器本地处理（无需启动本服务）
- **≥ 10MB**：优先请求本服务；服务未启动或失败时自动回退本地

## 启动

```bash
IMS_SERVER_PORT=3010 pnpm start:server
```

若端口被占用会自动顺延，并提示设置 `IMS_EXCHANGE_ENDPOINT`。

健康检查：`GET http://localhost:3010/excel/health`

## API

- `POST /excel/import` — multipart `file` → `IWorkbookData`
- `POST /excel/export` — JSON `{ data, fileName }` → xlsx 流
