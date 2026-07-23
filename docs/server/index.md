---
title: 使用方式
order: 0
nav:
  title: server
  order: 5
---

## 使用方式

`@ims-view/server`：NestJS Excel 导入导出服务，与 `@ims-view/utils` 共用转换逻辑，供 `ExcelEditor` 大文件场景使用。

### install

```shell
pnpm i @ims-view/server
```

### start

```shell
# CLI
npx ims-view-server

# 指定端口
IMS_SERVER_PORT=3010 npx ims-view-server

# 仓库内开发
IMS_SERVER_PORT=3010 pnpm start:server
```

端口占用会自动顺延，并提示设置 `IMS_EXCHANGE_ENDPOINT`。

### use（嵌入 Nest）

```ts
import { Module } from '@nestjs/common';
import { ExcelModule } from '@ims-view/server';

@Module({
  imports: [ExcelModule],
})
export class AppModule {}
```

### 环境变量

| 变量 | 说明 | 默认值 |
| ---- | ---- | ------ |
| `IMS_SERVER_PORT` | 服务端口（优先） | `3010` |
| `PORT` | 兼容通用端口变量 | - |
| `IMS_EXCHANGE_ENDPOINT` | 前端对接的完整服务地址 | `http://localhost:{port}` |

### Base URL

```text
http://localhost:3010
```

HTTP 接口见侧栏 [excel](./excel)。
