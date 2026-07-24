# @ims-view/server

[![NPM version][version-image]][version-url] [![NPM downloads][download-image]][download-url]

## License

[MIT](../../LICENSE) ® eternallycyf

<!-- npm url -->

[version-image]: http://img.shields.io/npm/v/@ims-view/server.svg?color=deepgreen&label=latest
[version-url]: http://npmjs.org/package/@ims-view/server
[download-image]: https://img.shields.io/npm/dm/@ims-view/server.svg
[download-url]: https://npmjs.org/package/@ims-view/server

<!-- docs url -->

- https://ims-view-pc-eternallycyfs-projects.vercel.app/server

## 安装

```shell
pnpm i @ims-view/server
```

## 独立启动

```shell
# 全局 / npx
npx ims-view-server

# 或指定端口
IMS_SERVER_PORT=3010 npx ims-view-server
```

仓库内开发（默认热重载，改 `packages/server/src` / `packages/utils/src/excel` 会自动重启）：

```shell
IMS_SERVER_PORT=3010 pnpm start:server
```

不需要热重载时：`pnpm --dir packages/server start:once`

请求体校验使用 Zod（`createZodBaseModel` + `ZodValidationPipe`），JSON 接口统一 `ResponseEntity`：`{ code, data, msg }`（`code === 0` 成功）。`POST /excel/export` 返回 xlsx 二进制，内部走 **ExcelJS `worker_threads`**（不堵 Nest 主线程）。

## 嵌入 Nest 应用

```ts
import { Module } from '@nestjs/common';
import { ExcelModule } from '@ims-view/server';

@Module({
  imports: [ExcelModule],
})
export class AppModule {}
```

## 环境变量

| 变量 | 说明 | 默认 |
| ---- | ---- | ---- |
| `IMS_SERVER_PORT` | 服务端口（优先） | `3010` |
| `PORT` | 兼容通用端口变量 | - |
| `IMS_SERVER_BODY_LIMIT` | JSON body 体积上限 | `50mb` |
| `IMS_SERVER_GZIP_THRESHOLD` | 响应 gzip 压缩阈值（字节） | `1024` |
| `IMS_EXCEL_UPLOAD_DIR` | 上传文件目录 | `os.tmpdir()/ims-excel-uploads` |
| `IMS_EXCEL_UPLOAD_TTL_MS` | 上传文件保留时长 | `3600000`（1h） |
| `IMS_EXCEL_UPLOAD_CLEANUP_MS` | 定时清理间隔 | `600000`（10min） |
| `IMS_EXCEL_PARSE_TIMEOUT_MS` | 单次解析 / 导出超时 | `600000`（10min） |

前端对接：`IMS_EXCHANGE_ENDPOINT=http://localhost:3010`

## 导入策略

参考 [CasualOffice/sheets large-file pipeline](https://github.com/CasualOffice/sheets/blob/main/docs/LARGE_FILE_PIPELINE.md)：解析放 Worker，前端渐进挂载。

- 一律 **ExcelJS Worker** → meta + blocks（不堵 Nest，有进度日志）
  - 目标：约 **10 万行级 xlsx，解析完成约 10s 内**
  - 样式：默认映射（字体/填充/边框/对齐/数字格式/锁定 `lo` + `meta.styles` intern）
  - 另支持：浮动图（`SHEET_DRAWING_PLUGIN`）、冻结窗格（`sheet.freeze`）
  - **不做**：条件格式、数据验证、图表、EMF 等非位图
## API

见文档站：

- https://ims-view-pc-eternallycyfs-projects.vercel.app/server
- https://ims-view-pc-eternallycyfs-projects.vercel.app/server/excel
