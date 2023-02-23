import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InternalType, TypesService } from './types.service';
import { CreateCustomTypeDto } from './dto/create-custom-type.dto';
import { CustomType } from './schemas/custom-type.schema';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerTags } from '../common/utils/swagger.utils';
import { Protected } from '../auth/decorators/protected.decorator';
import { AuthUser } from '../auth/decorators/user.decorator';
import { ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AllowGuest } from '../auth/decorators/allow-guest.decorator';
import { UpdateCustomTypeDto } from './dto/update-custom-type.dto';
import { Model } from 'mongoose';

@ApiTags(SwaggerTags.Types)
@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}

  // get type mapping
  @Protected()
  @AllowGuest()
  @Get(':type')
  @ApiOkResponse({
    description: 'Returns the definition of a given type',
    type: CustomType,
  })
  async getType(
    @Param() params: { type: string },
    @AuthUser() user,
  ): Promise<Partial<CustomType | InternalType>> {
    if (this.typesService.isInternalType(params.type)) {
      const type = await this.typesService.getType(params.type);
      return {
        name: type.name,
        properties: type.properties,
      };
    }

    if (!user) {
      throw new BadRequestException(`Unknown type ${params.type}`);
    }

    const customType = await this.typesService.getCustomTypeByName(
      user,
      params.type,
    );
    if (!customType) {
      throw new BadRequestException(`Unknown type ${params.type}`);
    }
    return CustomType.toJson(customType);
  }

  // get all types
  @Protected()
  @AllowGuest()
  @Get()
  @ApiOkResponse({
    description:
      'Returns a list of available types, Including custom types if user is authenticated',
    type: [String],
  })
  async allType(@AuthUser() user): Promise<object> {
    const types = this.typesService.getTypes();
    if (user) {
      const customTypes = (await this.typesService.getCustomTypes(user)).map(
        (t) => ({
          name: t.name,
          mapping: t.mapping,
        }),
      );
      return {
        private: customTypes,
        public: types,
      };
    }
    return {
      public: types,
    };
  }

  // create a type
  @Protected()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Returns the created custom type',
    type: CustomType,
  })
  @ApiBadRequestResponse({
    description: 'Invalid custom type',
  })
  async createType(
    @Body() customType: CreateCustomTypeDto,
    @AuthUser() user,
  ): Promise<CustomType | any> {
    await this.typesService.validateScheme(customType.mapping, user);

    let type = await this.typesService.getCustomType(user, {
      name: customType.name,
    });

    if (type) {
      throw new BadRequestException(
        `A custom type with name ${customType.name} already exists`,
      );
    }

    type = await this.typesService.createCustomType(user, customType);
    return CustomType.toJson(type);
  }

  // update a type
  @Protected()
  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Returns the created custom type',
    type: CustomType,
  })
  @ApiBadRequestResponse({
    description: 'Invalid custom type',
  })
  async updateType(
    @Body() customType: UpdateCustomTypeDto,
    @AuthUser() user,
  ): Promise<CustomType | any> {
    let type = await this.typesService.getCustomType(user, {
      name: customType.name,
    });

    if (!type) {
      throw new BadRequestException(`Unknown type ${customType.name}`);
    }

    await this.typesService.validateScheme(customType.mapping, user);

    type = await this.typesService.updateCustomType(user, customType);

    return CustomType.toJson(type);
  }

  // delete a type
  @Protected()
  @Delete(':type')
  @ApiOkResponse({
    description: 'Delete the given type',
    type: null,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteType(
    @Param() params: { type: string },
    @AuthUser() user,
  ): Promise<any> {
    const customType = await this.typesService.getCustomTypeByName(
      user,
      params.type,
    );
    if (!customType) {
      throw new BadRequestException(`Unknown type ${params.type}`);
    }

    await this.typesService.deleteCustomTypeById(customType._id);

    return Promise.resolve();
  }
}
