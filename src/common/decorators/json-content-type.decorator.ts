import { applyDecorators, Header } from '@nestjs/common';

export const JsonContentType = () =>
  applyDecorators(Header('content-type', 'application/json'));
