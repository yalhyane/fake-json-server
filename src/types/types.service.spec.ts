import { Test, TestingModule } from '@nestjs/testing';
import { TypesService } from './types.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { CustomType } from './schemas/custom-type.schema';

export const typesServiceProviders = [
  {
    provide: getModelToken(CustomType.name),
    useValue: Model,
  },
  TypesService,
];

describe('TypesService', () => {
  let service: TypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...typesServiceProviders],
    }).compile();

    service = module.get<TypesService>(TypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
