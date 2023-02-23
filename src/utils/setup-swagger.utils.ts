import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTags } from '../common/utils/swagger.utils';
import { ConfigService } from '@nestjs/config';
import { ENV_VAR_NAMES } from '../app/constants';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const config = new DocumentBuilder()
    .setTitle('Fake json data server')
    .setDescription('API to generate fake json data based on given schema')
    .setContact(
      'Yacine ALHYANE',
      'https://github.com/yalhyane',
      'y.alhyane@gmail.com',
    )
    .setVersion(configService.get<string>(ENV_VAR_NAMES.SWAGGER_VERSION))
    .addTag(SwaggerTags.Authentication)
    .addTag(SwaggerTags.Types)
    .addTag(SwaggerTags.Generator)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);
}
