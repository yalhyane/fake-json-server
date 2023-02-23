import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class GenerateTypeQueryDto {
  @ApiProperty({
    description:
      'If size >= 1 an array of data will be returned. If size = 0 or not present only instance will be returned',
    required: false,
  })
  @Optional()
  size?: number;
}
