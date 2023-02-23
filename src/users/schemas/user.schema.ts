import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema({
  autoIndex: true,
})
export class User {
  @Transform(({ value }) => value.toString())
  _id?: string | any;

  @ApiProperty()
  @Expose({
    name: 'id',
  })
  get id() {
    if (!this._id) {
      return null;
    }
    return this._id.toString();
  }

  @ApiProperty()
  @Prop({ required: true })
  fullname: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop()
  @Exclude()
  createdAt: Date;

  @Prop()
  @Exclude()
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  __v?: any;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
