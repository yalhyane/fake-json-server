import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorController } from './generator.controller';
import { generatorServiceProviders } from './generator.service.spec';

describe('GeneratorController', () => {
  let controller: GeneratorController;

  beforeEach(async () => {
    const [module] = await Promise.all([
      Test.createTestingModule({
        providers: [...generatorServiceProviders],
        controllers: [GeneratorController],
      }).compile(),
    ]);

    controller = module.get<GeneratorController>(GeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
