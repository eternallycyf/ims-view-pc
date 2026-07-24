import { z } from 'zod';
import { createZodBaseModel } from '../../shared/create-zod-base-model';

const workbookDataSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    appVersion: z.string().optional(),
    locale: z.string().optional(),
    sheetOrder: z.array(z.string()).optional(),
    sheets: z.record(z.string(), z.any()).optional(),
    styles: z.record(z.string(), z.any()).optional(),
    resources: z.array(z.any()).optional(),
  })
  .passthrough();

/** 导出：Univer snapshot → xlsx */
export const exportExcelSchema = z
  .object({
    data: z.any().optional().describe('工作簿 snapshot'),
    fileName: z.string().trim().min(1, '文件名不能为空').optional().describe('导出文件名'),
  })
  .superRefine((value, ctx) => {
    if (value.data == null || typeof value.data !== 'object' || Array.isArray(value.data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['data'],
        message: '缺少工作簿数据 data',
      });
      return;
    }
    const parsed = workbookDataSchema.safeParse(value.data);
    if (!parsed.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['data'],
        message: parsed.error.issues[0]?.message || 'data 格式无效',
      });
    }
  })
  .transform((value) => ({
    fileName: value.fileName,
    data: workbookDataSchema.parse(value.data),
  }));

export class ExportExcelDto extends createZodBaseModel(exportExcelSchema) {}

export type ExportExcelPlain = z.infer<typeof exportExcelSchema>;
