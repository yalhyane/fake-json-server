import { BadRequestException } from '@nestjs/common';

export class InvalidTypeException extends BadRequestException {
  constructor(type: string) {
    super(`Unknown type ${type}`);
  }
}
