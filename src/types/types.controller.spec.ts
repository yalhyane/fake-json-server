import { Test, TestingModule } from '@nestjs/testing';
import { TypesController } from './types.controller';
import { typesServiceProviders } from './types.service.spec';

describe('TypesController', () => {
  let controller: TypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...typesServiceProviders],
      controllers: [TypesController],
    }).compile();

    controller = module.get<TypesController>(TypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
