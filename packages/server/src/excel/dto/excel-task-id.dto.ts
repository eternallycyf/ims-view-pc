import { z } from 'zod';
import { createZodBaseModel } from '../../shared/create-zod-base-model';

export const excelTaskIdSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, '任务 id 不能为空')
    .regex(/^[a-zA-Z0-9_-]+$/, '任务 id 格式无效')
    .describe('解析任务 id'),
});

export class ExcelTaskIdDto extends createZodBaseModel(excelTaskIdSchema) {}

export type ExcelTaskIdPlain = z.infer<typeof excelTaskIdSchema>;
