import { applyDecorators } from '@nestjs/common';

export default function Action(): MethodDecorator {
  return applyDecorators();
}
