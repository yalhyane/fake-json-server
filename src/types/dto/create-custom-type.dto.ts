import { SchemeTypeMapping } from '../schemas/custom-type.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsTypeUnique } from '../validators/unique-type.validator';

export class CreateCustomTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsTypeUnique()
  name: string;

  @ApiProperty({
    type: () => SchemeTypeMapping,
    example: {
      name: 'fullname',
      email: 'email',
      phones: {
        type: 'phone',
        isArray: true,
        size: 2,
      },
    },
  })
  @IsNotEmpty()
  mapping: SchemeTypeMapping;
}
