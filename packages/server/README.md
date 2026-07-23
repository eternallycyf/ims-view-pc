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

仓库内开发：

```shell
IMS_SERVER_PORT=3010 pnpm start:server
```

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

前端对接：`IMS_EXCHANGE_ENDPOINT=http://localhost:3010`

## API

见文档站：

- https://ims-view-pc-eternallycyfs-projects.vercel.app/server
- https://ims-view-pc-eternallycyfs-projects.vercel.app/server/excel
