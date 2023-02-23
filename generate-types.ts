import {
  Project,
  VariableDeclarationKind,
  InterfaceDeclaration,
  FunctionDeclaration,
  SourceFile,
  ParameterDeclaration,
  Type,
} from 'ts-morph';

const fs = require('fs');

import * as falso from '@ngneat/falso';
import * as process from 'process';

const Keys = (intName: string): string[] => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    `./node_modules/@ngneat/falso/lib/**/*{.d.ts}`,
  );
  const node = sourceFile.getInterface(intName)!;
  const allKeys = node.getProperties().map((p) => p.getName());

  return allKeys;
};

const getFunctions = (): FunctionDeclaration[] => {
  const project = new Project();
  const sourceFiles = project.addSourceFilesAtPaths(
    `./node_modules/@ngneat/falso/lib/*.d.ts`,
  );
  const functions = [];
  sourceFiles.forEach((sf: SourceFile) => {
    functions.push(...sf.getFunctions());
  });

  return functions;
};

const buildTypeProps = (type: Type): any => {
  const params = {};

  if (type.isUnion() && !type.isBoolean()) {
    return type.getUnionTypes().map((t) => t.getText().slice(1, -1));
  }
  if (type.isClassOrInterface() || type.isObject()) {
    type.getProperties().map((p) => {
      try {
        const tt = p.getValueDeclarationOrThrow().getType();
        params[p.getName()] = buildTypeProps(tt);
      } catch (e) {
        console.log(`Error: ${p.compilerSymbol.getName()}`, e.message);
      }
    });

    return params;
  }

  return type.getText();
};

const getFunctionParams = (f: FunctionDeclaration): any => {
  const paramsDec = f.getParameters();
  const params = {};

  paramsDec.forEach((p: ParameterDeclaration) => {
    const name = p.getName();
    if (name !== 'options') {
      return;
    }

    const type = p.getType();

    type.getProperties().forEach((p) => {
      if (p.getName() === 'locale' || p.getName() === 'length') {
        return;
      }
      params[p.getName()] = buildTypeProps(
        p.getValueDeclarationOrThrow().getType(),
      );
    });
  });

  return params;
};

const formatFunctionName = (f: FunctionDeclaration): string => {
  return f
    .getName()
    .replace(/((?<=[A-Z])[A-Z](?=([A-Z]|\b)))/g, (letter) =>
      letter.toLowerCase(),
    )
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace('rand_', '');
};

// class SubClass {
//   aa: string;
//   bb: number;
//   cc: boolean;
// }
//
// interface SubInterface {
//   a: string;
//   b: string;
//   c: number;
//   d: SubClass;
//   m: SubType;
//   n: SubType2;
//   p: Required<SS2>;
// }
//
// interface SS2 {
//   aaa: string;
//   bbb: number;
// }
//
// type SubType = 'Hello' | 'There' | 'World';
// type SubType2 = Partial<SS2>;

// const project = new Project();
// const sourceFile = project.addSourceFileAtPath('./generate-types.ts');
// const intfc = sourceFile.getInterface('SubInterface');
// const typ = sourceFile.getTypeAliasOrThrow('SubType');
// console.log(typ.getChildCount());
// console.log(typ.getType().getProperties().map(p => p.getTypeAtLocation(typ).getText()));
// const somethingTypeAlias = sourceFile.getTypeAliasOrThrow('SubType');
// const somethingType = somethingTypeAlias.getType();
// const properties = somethingType.getProperties();
// for (const prop of properties)
//   console.log(prop.getTypeAtLocation(somethingTypeAlias).getText());
// process.exit(1);

// const params = buildTypeProps(intfc.getType());
// console.log(params);
// process.exit(0);

const functions = getFunctions();
const types = functions.map((f: FunctionDeclaration) => {
  return {
    func: f.getName(),
    name: formatFunctionName(f),
    properties: getFunctionParams(f),
  };
});

fs.writeFileSync('data/types.json', JSON.stringify(types, null, 2));

console.log(`Done writing ${types.length} types to data/types.json`);
