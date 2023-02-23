import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TypesService } from '../types.service';
import { Injectable } from '@nestjs/common';

export function IsTypeUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueTypeValidator,
    });
  };
}

@ValidatorConstraint({ name: 'name' })
@Injectable()
export class UniqueTypeValidator implements ValidatorConstraintInterface {
  constructor(private readonly typesService: TypesService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Type with name ${validationArguments.value} already exists`;
  }

  validate(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return !this.typesService.isInternalType(value);
  }
}
