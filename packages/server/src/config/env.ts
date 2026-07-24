import { z } from 'zod';

/**
 * 进程环境变量（启动时校验一次）。
 * 未设置的项用默认值，不强制要求 .env。
 *
 * 解析固定走 ExcelJS Worker 分块（含样式）；不再用环境变量切换引擎 / 截断行数 / 关样式。
 */
export const serverEnvSchema = z.object({
  IMS_SERVER_PORT: z.coerce.number().int().positive().default(3010),
  PORT: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === '') return undefined;
      const num = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(num) && num > 0 ? num : undefined;
    }),
  IMS_SERVER_BODY_LIMIT: z.string().default('50mb'),
  IMS_SERVER_GZIP_THRESHOLD: z.coerce.number().int().nonnegative().default(1024),
  IMS_EXCEL_UPLOAD_DIR: z.string().optional(),
  IMS_EXCEL_UPLOAD_TTL_MS: z.coerce.number().int().positive().default(60 * 60 * 1000),
  IMS_EXCEL_UPLOAD_CLEANUP_MS: z.coerce.number().int().positive().default(10 * 60 * 1000),
  /** 单次解析 / 导出超时 */
  IMS_EXCEL_PARSE_TIMEOUT_MS: z.coerce.number().int().positive().default(10 * 60 * 1000),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const loadServerEnv = (env: NodeJS.ProcessEnv = process.env): ServerEnv => {
  const result = serverEnvSchema.safeParse(env);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`[@ims-view/server] 环境变量校验失败: ${message}`);
  }
  return result.data;
};
