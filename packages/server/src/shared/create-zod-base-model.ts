import { z } from 'zod';

export const zodSchemaSymbol = '$$zod-schema';

export class ZodValidationError extends TypeError {
  readonly cause: {
    raw: unknown;
    schema: z.ZodTypeAny;
    error: z.ZodError;
  };

  constructor(
    message: string,
    cause: { raw: unknown; schema: z.ZodTypeAny; error: z.ZodError },
  ) {
    super(message);
    this.name = 'ZodValidationError';
    this.cause = cause;
  }
}

export function isZodModel(o: unknown): o is ZodBaseModel {
  if (!o) return false;
  return Boolean((o as { [zodSchemaSymbol]?: unknown })[zodSchemaSymbol]);
}

export interface ZodBaseModel<T extends z.ZodTypeAny = z.ZodTypeAny> {
  new (raw?: unknown): z.infer<T> & {
    getRaw(): unknown;
    getPlain(): z.infer<T>;
    getSchema(): T;
    getConfig(): ZodBaseModelConfig;
  };
  [zodSchemaSymbol]: T;
  getSchema(): T;
}

interface ZodBaseModelConfig {}

export function createZodBaseModel<T extends z.ZodTypeAny>(
  schema: T,
  config: ZodBaseModelConfig = {},
) {
  function ZodBaseModelCtor(raw: unknown) {
    const res = schema.safeParse(raw ?? {});
    if (!res.success) {
      const message =
        res.error.issues[0]?.message ||
        res.error.message ||
        '参数校验失败';
      throw new ZodValidationError(message, { raw, schema, error: res.error });
    }
    const plain = res.data;
    return Object.assign({}, plain, {
      __raw__: raw,
      getRaw() {
        return this.__raw__;
      },
      __plain__: plain,
      getPlain() {
        return this.__plain__;
      },
      __schema__: schema,
      getSchema() {
        return this.__schema__;
      },
      __config__: config,
      getConfig() {
        return this.__config__;
      },
    });
  }

  ZodBaseModelCtor.getSchema = function getSchema() {
    return schema;
  };
  (ZodBaseModelCtor as unknown as ZodBaseModel<T>)[zodSchemaSymbol] = schema;
  return ZodBaseModelCtor as unknown as ZodBaseModel<T>;
}
