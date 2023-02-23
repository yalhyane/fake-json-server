export enum NODE_ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum ENV_VAR_NAMES {
  JWT_SECRET = 'JWT_SECRET',
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  JWT_EXPIRATION = 'JWT_EXPIRATION',
  SWAGGER_VERSION = 'SWAGGER_VERSION',
}

export const FALSY_VALUES = ['false', 'f', 'no', 'n', '0', 'none'];

export const TRUTHY_VALUES = ['true', 't', 'yes', 'y', '1'];
