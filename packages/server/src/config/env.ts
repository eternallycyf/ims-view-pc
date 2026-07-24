import { z } from 'zod';

/**
 * 进程环境变量（启动时校验一次）。
 * 未设置的项用默认值，不强制要求 .env。
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
  /** 超过该体积走分块挂载（LuckyExcel 解析后切块） */
  IMS_EXCEL_CHUNK_BYTES: z.coerce.number().int().positive().default(2 * 1024 * 1024),
  /** 每块行数（渐进挂载切片，不是总行上限） */
  IMS_EXCEL_BLOCK_ROWS: z.coerce.number().int().min(100).default(5_000),
  /** 全量导入行上限；0=不截断 */
  IMS_EXCEL_MAX_ROWS: z.coerce.number().int().nonnegative().default(150_000),
  /** 单次解析超时（LuckyExcel 大文件可能较久） */
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
