#!/usr/bin/env node
/**
 * monorepo 开发入口：tsx 直接跑 TS，加载 packages/utils/src 源码（无需 build utils）。
 * 默认 watch：改 server / utils excel 源码自动重启，无需反复 pnpm start:server。
 * 单次跑：node scripts/dev.cjs --once
 */
const { spawn } = require('child_process');
const { existsSync, readdirSync, watch } = require('fs');
const { join, relative } = require('path');

const serverRoot = join(__dirname, '..');
const repoRoot = join(serverRoot, '../..');
const once = process.argv.includes('--once');
const debug = process.argv.includes('--inspect-brk');
const watchMode = !once;

const findTsxCli = () => {
  const shims = [
    join(serverRoot, 'node_modules/.bin/tsx'),
    join(repoRoot, 'node_modules/.bin/tsx'),
  ];
  for (const p of shims) {
    if (existsSync(p)) return { cmd: p, args: [] };
  }

  const pnpmDir = join(repoRoot, 'node_modules/.pnpm');
  if (!existsSync(pnpmDir)) return null;
  const match = readdirSync(pnpmDir).find((name) => name.startsWith('tsx@'));
  if (!match) return null;
  const cli = join(pnpmDir, match, 'node_modules/tsx/dist/cli.js');
  if (!existsSync(cli)) return null;
  return { cmd: process.execPath, args: [cli] };
};

const tsx = findTsxCli();
if (!tsx) {
  console.error('[@ims-view/server] 找不到 tsx，请在仓库根目录安装依赖');
  process.exit(1);
}

const entryArgs = [...tsx.args, ...(debug ? ['--inspect-brk'] : []), 'src/main.ts'];

/** @type {import('child_process').ChildProcess | null} */
let child = null;
let debounceTimer = null;
let shuttingDown = false;

const startChild = () => {
  child = spawn(tsx.cmd, entryArgs, {
    cwd: serverRoot,
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    child = null;
    if (shuttingDown) {
      process.exit(code || (signal ? 1 : 0));
    }
    if (!watchMode) {
      process.exit(code || 0);
    }
  });
};

const stopChild = () =>
  new Promise((resolve) => {
    if (!child || child.killed) {
      resolve();
      return;
    }
    const current = child;
    const onExit = () => {
      clearTimeout(forceTimer);
      resolve();
    };
    current.once('exit', onExit);
    current.kill('SIGTERM');
    const forceTimer = setTimeout(() => {
      try {
        current.kill('SIGKILL');
      } catch {
        // ignore
      }
      resolve();
    }, 3000);
  });

const restart = async (reason) => {
  if (shuttingDown || !watchMode) return;
  // eslint-disable-next-line no-console
  console.log(`\n[@ims-view/server] 检测到变更 → 重启（${reason}）\n`);
  await stopChild();
  if (!shuttingDown) startChild();
};

const scheduleRestart = (reason) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void restart(reason);
  }, 400);
};

const shouldWatchFile = (filename) => {
  if (!filename) return false;
  return /\.(ts|js|cjs|mjs|json)$/i.test(filename);
};

const watchDirs = [
  join(serverRoot, 'src'),
  join(repoRoot, 'packages/utils/src/excel'),
];

if (watchMode) {
  for (const dir of watchDirs) {
    if (!existsSync(dir)) continue;
    try {
      watch(dir, { recursive: true }, (_event, filename) => {
        if (!shouldWatchFile(filename)) return;
        const label = relative(repoRoot, join(dir, filename || ''));
        scheduleRestart(label || dir);
      });
      // eslint-disable-next-line no-console
      console.log(`[@ims-view/server] watching ${relative(repoRoot, dir) || dir}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `[@ims-view/server] watch 失败 ${dir}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
  // eslint-disable-next-line no-console
  console.log('[@ims-view/server] 热重载已开启，改代码自动重启（Ctrl+C 退出）');
}

const shutdown = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  if (debounceTimer) clearTimeout(debounceTimer);
  await stopChild();
  process.exit(0);
};

process.on('SIGINT', () => {
  void shutdown();
});
process.on('SIGTERM', () => {
  void shutdown();
});

startChild();
