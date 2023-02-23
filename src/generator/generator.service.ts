import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeProps, TypesService } from '../types/types.service';
import { GenerateSchemeBodyDto } from './dto/generate-scheme-body.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class GeneratorService {
  constructor(private typesService: TypesService) {}

  async generateType(
    type: string,
    props: TypeProps = {},
    size = 0,
    user: User = null,
  ): Promise<any> {
    if (this.typesService.isInternalType(type)) {
      return await this.generateInternalType(type, props, size);
    }

    return await this.generateUserType(user, type, size);
  }

  async generateInternalType(
    type: string,
    props: TypeProps = {},
    size = 0,
  ): Promise<any> {
    const func = this.typesService.getTypeFunc(type);

    if (size === 0) {
      return Promise.resolve(func({ ...props }));
    }
    const length = Math.max(1, size);

    return Promise.resolve(
      Array.from({ length }, () => {
        return func({ ...props });
      }),
    );
  }

  async generateUserType(user: User, type: string, size = 0): Promise<any> {
    const typeSchema = await this.typesService.getCustomTypeByName(user, type);

    if (!typeSchema) {
      throw new BadRequestException(`Type ${type} not found`);
    }

    if (size === 0) {
      return await this.generateScheme(typeSchema.mapping, user);
    }
    const length = Math.max(1, size);

    return await Promise.all(
      Array.from({ length }, async () => {
        return await this.generateScheme(typeSchema.mapping, user);
      }),
    );
  }

  async generateScheme(
    scheme: GenerateSchemeBodyDto,
    user: User = null,
  ): Promise<any> {
    const r = {};
    for (const name in scheme) {
      const type = scheme[name];

      if (typeof type === 'string') {
        r[name] = await this.generateType(type, {}, 0, user);
        continue;
      }
      if (typeof type === 'object') {
        if ('type' in type) {
          r[name] = await this.generateType(
            type.type,
            type.properties,
            type.isArray ? type.size || 1 : 0,
            user,
          );
        } else {
          r[name] = await this.generateScheme(type, user);
        }
        continue;
      }
      r[name] = 'undefined';
    }
    return r;
  }
}
