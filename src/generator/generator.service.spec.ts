import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorService } from './generator.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypesService } from '../types/types.service';
import { CustomType } from '../types/schemas/custom-type.schema';
import { ParamParserService } from '../common/services/param-parser.service';

export const generatorServiceProviders = [
  {
    provide: getModelToken(CustomType.name),
    useValue: Model,
  },
  TypesService,
  GeneratorService,
  ParamParserService,
];

describe('GeneratorService', () => {
  let service: GeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...generatorServiceProviders],
    }).compile();

    service = module.get<GeneratorService>(GeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
