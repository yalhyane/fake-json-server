import * as fs from 'fs';

export function readJsonFile(filename: string) {
  if (!fs.existsSync(filename)) {
    throw new Error(`File ${filename} not found`);
  }

  const content = fs.readFileSync(filename).toString();

  return JSON.parse(content);
}

