import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as net from 'net';

const getPreferredPort = () =>
  Number(process.env.IMS_SERVER_PORT || process.env.PORT || 3010);

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

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[@ims-view/server] listening on http://localhost:${port}`);
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
