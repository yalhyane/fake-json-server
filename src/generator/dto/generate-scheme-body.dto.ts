import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SchemeType {
  // maybe other subtypes
  // [key: string]: string | SchemeType;
  @ApiProperty()
  type: string;

  @ApiProperty()
  isArray?: boolean;

  @ApiProperty()
  size?: number;

  @ApiProperty({
    example: {
      minLength: 10,
      maxLength: 100,
    },
  })
  properties?: {
    [key: string]: any;
  } = {};

  @Exclude()
  setProperty(name: string, value: any) {
    switch (name.toLowerCase()) {
      case 'type':
        this.type = value;
        break;
      case 'isarray':
        this.isArray = !!value;
        break;
      case 'size':
        this.size = +value;
        break;
      default:
        this.properties[name] = value;
    }
  }
}

export class GenerateSchemeBodyDto {
  [key: string]: string | SchemeType;
}

export class SchemaSwaggerExample {
  @ApiProperty({
    example: 'fullname',
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 'email',
    required: false,
  })
  email: string;

  @ApiProperty({
    example: {
      type: 'phone',
      isArray: true,
      size: 2,
    },
    required: false,
  })
  phones: string[];
}

// {'name': {type: 'first'}}
// {person: {name: 'firstname'}}
