import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';
import { loadServerEnv } from './config/env';
import { EXCEL_STATIC_PREFIX, getExcelUploadDir } from './excel/excel-storage.service';
import { ZodExceptionFilter, ZodValidationPipe } from './shared';
import * as net from 'net';

const env = loadServerEnv();

/** 导出接口会 POST 整份 workbook JSON，默认 100kb 易 413 */
const BODY_LIMIT = env.IMS_SERVER_BODY_LIMIT || '50mb';

/** gzip 阈值（导出 JSON / 其它文本响应） */
const GZIP_THRESHOLD = env.IMS_SERVER_GZIP_THRESHOLD;

const getPreferredPort = () => env.IMS_SERVER_PORT || env.PORT || 3010;

const isPortFree = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });

const findAvailablePort = async (preferred: number, maxTry = 20): Promise<number> => {
  for (let i = 0; i < maxTry; i += 1) {
    const port = preferred + i;
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) {
      return port;
    }
  }
  throw new Error(`端口 ${preferred}~${preferred + maxTry - 1} 均被占用，请释放后重试`);
};

async function bootstrap() {
  const preferred = getPreferredPort();
  const port = await findAvailablePort(preferred);

  if (port !== preferred) {
    // eslint-disable-next-line no-console
    console.warn(
      `[@ims-view/server] 端口 ${preferred} 已被占用，自动切换到 ${port}。请设置 IMS_EXCHANGE_ENDPOINT=http://localhost:${port}`,
    );
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new ZodExceptionFilter());
  // CORS 必须在静态资源之前，否则 /excel/static/* 跨域无 Access-Control-* 头
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.useBodyParser('json', { limit: BODY_LIMIT });
  app.useBodyParser('urlencoded', { limit: BODY_LIMIT, extended: true });

  const uploadDir = getExcelUploadDir();
  app.use(
    compression({
      threshold: Number.isFinite(GZIP_THRESHOLD) ? GZIP_THRESHOLD : 1024,
      level: 6,
      filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) return false;
        const contentType = String(res.getHeader('Content-Type') || '');
        if (
          contentType.includes('spreadsheetml') ||
          contentType.includes('octet-stream') ||
          contentType.includes('ms-excel')
        ) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );
  // 上传的 .xlsx / snapshot.json 静态对外
  app.useStaticAssets(uploadDir, {
    prefix: EXCEL_STATIC_PREFIX,
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=300');
      // express.static 可能绕过 cors 中间件，静态资源再显式补一次
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
      if (
        filePath.endsWith('.snapshot.json') ||
        filePath.endsWith('.meta.json') ||
        /\.block\.\d+\.\d+\.json$/i.test(filePath)
      ) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      } else if (filePath.endsWith('.xlsx')) {
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
      } else if (filePath.endsWith('.csv')) {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      }
    },
  });

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[@ims-view/server] listening on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`[@ims-view/server] body limit=${BODY_LIMIT}`);
  // eslint-disable-next-line no-console
  console.log(`[@ims-view/server] excel static ${EXCEL_STATIC_PREFIX} -> ${uploadDir}`);
  // eslint-disable-next-line no-console
  console.log(
    `[@ims-view/server] 前端可通过 IMS_EXCHANGE_ENDPOINT=http://localhost:${port} 对接`,
  );
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[@ims-view/server] 启动失败:', error);
  process.exit(1);
});
