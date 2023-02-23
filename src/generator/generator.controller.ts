import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { TypesService } from '../types/types.service';
import { Response } from 'express';
import { GenerateTypeQueryDto } from './dto/generate-type-query.dto';
import {
  GenerateSchemeBodyDto,
  SchemaSwaggerExample,
} from './dto/generate-scheme-body.dto';
import { GeneratorService } from './generator.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerTags } from '../common/utils/swagger.utils';
import { Protected } from '../auth/decorators/protected.decorator';
import { AllowGuest } from '../auth/decorators/allow-guest.decorator';
import { AuthUser } from '../auth/decorators/user.decorator';
import { JsonContentType } from '../common/decorators/json-content-type.decorator';
import { User } from '../users/schemas/user.schema';
import { ParamParserService } from '../common/services/param-parser.service';

@ApiTags(SwaggerTags.Generator)
@Controller('g')
export class GeneratorController {
  constructor(
    private typesService: TypesService,
    private generatorService: GeneratorService,
    private paramParserService: ParamParserService,
  ) {}

  @Protected()
  @AllowGuest()
  @Get(':type')
  @JsonContentType()
  @ApiOkResponse({
    description: 'Returns fake data of given type',
  })
  @ApiBadRequestResponse({
    description: 'Invalid given type',
  })
  async generate(
    @Param() params: { type: string },
    @Query() query: { size: number },
    @AuthUser() user,
  ): Promise<any> {
    const type = this.paramParserService.parse(params.type);
    if (
      !(await this.typesService.validType(type.type, type.properties, user))
    ) {
      throw new BadRequestException(`Unknown type ${params.type}`);
    }

    const r = await this.generatorService.generateType(
      type.type,
      type.properties,
      type.isArray ? type.size : ( query.size || 0 ),
      user,
    );

    return Promise.resolve(r);
  }

  @Protected()
  @AllowGuest()
  @Post('')
  @JsonContentType()
  @ApiOkResponse({
    description: 'Returns fake data of given schema',
  })
  @ApiBadRequestResponse({
    description: 'Invalid given schema',
  })
  @ApiBody({ type: SchemaSwaggerExample })
  async generateScheme(
    @Body() scheme: any,
    @AuthUser() user: User,
  ): Promise<any> {
    scheme = this.paramParserService.parseSchema(scheme);
    await this.typesService.validateScheme(scheme, user);
    const r = await this.generatorService.generateScheme(scheme, user);
    return Promise.resolve(r);
  }
}
