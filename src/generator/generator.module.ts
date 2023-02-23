import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { TypesModule } from '../types/types.module';
import { GeneratorService } from './generator.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypesModule, CommonModule],
  controllers: [GeneratorController],
  providers: [GeneratorService],
  exports: [GeneratorService],
})
export class GeneratorModule {}
