import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypesModule } from './types/types.module';
import { GeneratorController } from './generator/generator.controller';
import { GeneratorModule } from './generator/generator.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from '@hapi/joi';
import { NODE_ENV } from './app/constants';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .required()
          .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().optional(),
        SWAGGER_VERSION: Joi.optional().default('1.0.0'),
        MONGODB_URL: Joi.string().required(),
      }),
    }),
    TypesModule,
    GeneratorModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGODB_URL'),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController, GeneratorController],
  providers: [AppService],
})
export class AppModule {}
