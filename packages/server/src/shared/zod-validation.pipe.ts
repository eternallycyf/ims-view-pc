import { Injectable, type ArgumentMetadata, type PipeTransform } from '@nestjs/common';
import { isZodModel } from './create-zod-base-model';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const cstr = metadata?.metatype as unknown;
    if (isZodModel(cstr)) {
      return new cstr(value);
    }
    return value;
  }
}
