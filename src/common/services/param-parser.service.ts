import { Injectable } from '@nestjs/common';
import { SchemeType } from '../../generator/dto/generate-scheme-body.dto';

@Injectable()
export class ParamParserService {
  parse(param: string): SchemeType {
    const parts = param.split(/(?<!\\)\|/);

    const type = parts[0];
    const schemaType = new SchemeType();
    schemaType.setProperty('type', type);

    if (parts.length === 1) {
      return schemaType;
    }

    const props = parts.slice(1);

    props.forEach((prop) => {
      const propParts = prop.split(/(?<!\\):/);
      const propName = propParts[0];
      const propParams = propParts.slice(1);
      if (propParams.length === 0) {
        schemaType.setProperty(propName, true);
        return;
      }
      if (propParams.length === 1) {
        schemaType.setProperty(propName, propParams[0]);
        return;
      }

      schemaType.setProperty(propName, propParams);
    });

    return schemaType;
  }

  parseSchema(schema: any) {
    for (const name in schema) {
      const type = schema[name];
      if (typeof type === 'string') {
        schema[name] = this.parse(type);
      }
    }

    return schema;
  }
}
