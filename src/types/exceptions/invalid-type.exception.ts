import { BadRequestException } from '@nestjs/common';

export class InvalidTypeException extends BadRequestException {
  constructor(type: string | object) {
    const typeStr = typeof type === 'string' ? type : JSON.stringify(type);
    super(`Unknown type ${type}`);
  }
}
