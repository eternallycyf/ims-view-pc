import { Catch, type ExceptionFilter, type ArgumentsHost } from '@nestjs/common';
import type { Response } from 'express';
import { ZodValidationError } from './create-zod-base-model';
import { ResponseEntity, StatusCode } from './response-entity';

@Catch(ZodValidationError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const message = exception.message || '参数校验失败';
    res.status(400).json(ResponseEntity.ofFailure(message, StatusCode.BAD_REQUEST));
  }
}
