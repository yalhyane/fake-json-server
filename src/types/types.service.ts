import { BadRequestException, Injectable } from '@nestjs/common';
import * as falsoFunctions from '@ngneat/falso';
import * as customFunctions from './custom.types';
import { GenerateSchemeBodyDto } from '../generator/dto/generate-scheme-body.dto';
import { InvalidTypeException } from './exceptions/invalid-type.exception';
import { InjectModel } from '@nestjs/mongoose';
import { CustomType, CustomTypeDocument } from './schemas/custom-type.schema';
import { Model } from 'mongoose';
import { CreateCustomTypeDto } from './dto/create-custom-type.dto';
import { User } from '../users/schemas/user.schema';
import { UpdateCustomTypeDto } from './dto/update-custom-type.dto';
import * as jsonTypes from './../../data/types.json';
import { FALSY_VALUES, TRUTHY_VALUES } from '../app/constants';

export interface TypeProps {
  [key: string]: any;
}

export interface InternalType {
  func: string;
  name: string;
  properties?: TypeProps;
}

@Injectable()
export class TypesService {
  private readonly types: Map<string, InternalType> = new Map();

  constructor(
    @InjectModel(CustomType.name)
    private customTypeModel: Model<CustomTypeDocument>,
  ) {
    // this.initTypesRuntime();
    this.initTypesJson();
  }

  isInternalType(type: string) {
    return this.types.has(type);
  }

  private initTypesRuntime() {
    for (const func in falsoFunctions) {
      const funcName = func
        .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        .replace('rand_', '');
      this.types.set(funcName, {
        func,
        name: funcName,
        properties: {},
      });
    }

    for (const func in customFunctions) {
      const funcName = func
        .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        .replace('rand_', '');
      this.types.set(funcName, {
        func,
        name: funcName,
        properties: {},
      });
    }
  }

  private initTypesJson() {
    jsonTypes.forEach((t: InternalType) => {
      this.types.set(t.name, t);
    });
  }

  getTypes() {
    return [...this.types.values()].map((t) => ({
      name: t.name,
      properties: t.properties,
    }));
  }

  getType(type): InternalType {
    return this.types.get(type);
  }

  async validType(type: string, props: TypeProps = {}, user: User = null) {
    if (this.isInternalType(type)) {
      const internalType = this.types.get(type);
      if (Object.keys(props).length > 0) {
        for (const prop in props) {
          if (!(prop in internalType.properties)) {
            throw new BadRequestException(
              `Invalid property ${prop} of type ${type}`,
            );
          }
          const propType = internalType.properties[prop];
          let propValue = props[prop];
          if (Array.isArray(propType)) {
            if (!propType.includes(propValue)) {
              throw new BadRequestException(
                `Invalid value ${propValue} for property ${prop} of type ${type}: Allowed types: ${propType.join(
                  ',',
                )}`,
              );
            }
          } else if (propType === 'number') {
            if (isNaN(propValue)) {
              throw new BadRequestException(
                `Invalid value ${propValue} for property ${prop} of type ${type}: It should be of type ${propType}`,
              );
            }
            props[prop] = +propValue;
          } else if (propType === 'boolean' || propType === 'bool') {
            // in case of bool
            if (typeof propValue === 'number') {
              propValue = `${propValue}`;
            }
            if (typeof propValue === 'string') {
              if (TRUTHY_VALUES.includes(propValue.toLowerCase())) {
                props[prop] = true;
                propValue = true;
              } else if (FALSY_VALUES.includes(propValue.toLowerCase())) {
                props[prop] = false;
                propValue = false;
              }
            }
            if (typeof propValue !== 'boolean') {
              throw new BadRequestException(
                `Invalid value ${propValue} for property ${prop} of type ${type}: It should be of type ${propType}`,
              );
            }
          }
        }
      }

      return true;
    }

    if (!user) {
      throw new InvalidTypeException(type);
    }

    const customType = await this.getCustomTypeByName(user, type);
    return !!customType;
  }

  getTypeFunc(type: string): (args?) => any {
    const { func } = this.types.get(type);
    return (args?) => {
      return (
        falsoFunctions[func] ||
        customFunctions[func] ||
        (() => 'undefined')
      )(args);
    };
  }

  async validateScheme(scheme: GenerateSchemeBodyDto, user) {
    for (const name in scheme) {
      const type = scheme[name];

      if (typeof type === 'string') {
        if (!(await this.validType(type, {}, user))) {
          throw new InvalidTypeException(type);
        }
      }
      if (typeof type === 'object') {
        if ('type' in type) {
          if (!(await this.validType(type.type, type.properties, user))) {
            throw new InvalidTypeException(type.type);
          }
        } else {
          await this.validateScheme(type, user);
        }
      }
    }
  }

  // move this to new service
  async createCustomType(
    user: User,
    createCustomTypeDto: CreateCustomTypeDto,
  ): Promise<CustomType> {
    const createdType = new this.customTypeModel({
      owner: user,
      ...createCustomTypeDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await createdType.save();
  }

  // move this to new service
  async updateCustomType(
    user: User,
    updateCustomTypeDto: UpdateCustomTypeDto,
  ): Promise<CustomType> {
    const type = await this.customTypeModel.findOneAndUpdate(
      {
        owner: user._id,
        name: updateCustomTypeDto.name,
      },
      {
        mapping: updateCustomTypeDto.mapping,
      },
      {
        new: true,
      },
    );
    if (!type) {
      throw new BadRequestException(`Unknown type ${updateCustomTypeDto.name}`);
    }
    return type;
  }

  async updateCustomTypeById(
    id: string,
    updateCustomTypeDto: UpdateCustomTypeDto,
  ): Promise<CustomType> {
    const type = await this.customTypeModel.findByIdAndUpdate(
      id,
      {
        mapping: updateCustomTypeDto.mapping,
      },
      {
        new: true,
      },
    );
    if (!type) {
      throw new BadRequestException(`Unknown type ${updateCustomTypeDto.name}`);
    }
    return type;
  }

  async getCustomType(user: User, query: object): Promise<CustomType> {
    return this.customTypeModel.findOne({
      owner: user._id,
      ...query,
    });
  }

  async getCustomTypeByName(user: User, name: string): Promise<CustomType> {
    return this.customTypeModel.findOne({
      owner: user._id,
      name,
    });
  }

  async getCustomTypes(user: User): Promise<CustomType[]> {
    return this.customTypeModel.find({
      owner: user._id,
    });
  }

  async getCustomTypeById(id: string): Promise<User> {
    return this.customTypeModel.findOne({
      _id: id,
    });
  }

  async deleteCustomTypeById(id: string): Promise<any> {
    await this.customTypeModel.deleteOne({
      _id: id,
    });

    return;
  }
}
