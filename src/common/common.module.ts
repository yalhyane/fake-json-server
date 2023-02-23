import { Module } from '@nestjs/common';
import { ParamParserService } from './services/param-parser.service';

@Module({
  providers: [ParamParserService],
  exports: [ParamParserService],
})
export class CommonModule {}
