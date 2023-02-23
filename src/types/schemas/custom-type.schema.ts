import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemeType } from '../../generator/dto/generate-scheme-body.dto';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { Exclude, Transform } from 'class-transformer';

export class SchemeTypeMapping {
  [key: string]: string | SchemeType;
}

export type CustomTypeDocument = HydratedDocument<CustomType>;

@Schema({
  collection: 'custom_types',
  autoIndex: true,
})
export class CustomType {
  @Transform(({ value }) => value.toString())
  _id?: string | any;

  @Prop({
    required: true,
  })
  @ApiProperty()
  @Exclude()
  name: string;

  @Prop({
    required: true,
    type: SchemeTypeMapping,
  })
  @ApiProperty({
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
  @Exclude()
  mapping: SchemeTypeMapping;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Exclude()
  owner: User;

  @Prop()
  @Exclude()
  createdAt: Date;

  @Prop()
  @Exclude()
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  __v?: any;

  static toJson(type: CustomType) {
    return {
      name: type.name,
      mapping: type.mapping
    };
  }
}

export const CustomTypeSchema = SchemaFactory.createForClass(CustomType);
