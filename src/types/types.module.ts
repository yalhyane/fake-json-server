import { Module } from '@nestjs/common';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomType, CustomTypeSchema } from './schemas/custom-type.schema';
import { UniqueTypeValidator } from './validators/unique-type.validator';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomType.name, schema: CustomTypeSchema },
    ]),
  ],
  controllers: [TypesController],
  providers: [TypesService, UniqueTypeValidator],
  exports: [TypesService, MongooseModule, UniqueTypeValidator],
})
export class TypesModule {}
