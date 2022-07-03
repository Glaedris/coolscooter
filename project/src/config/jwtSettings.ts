import * as dotenv from 'dotenv';
dotenv.config();

export const jwtSettings = {
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  accessTokenExpire: process.env.JWT_ACCESS_TOKEN_EXPIRE,
  refreshTokenExpire: process.env.JWT_REFRESH_TOKEN_EXPIRE,
};

export enum Role {
  'CLIENT',
  'AGENT',
  'MANAGER',
  'ADMIN',
  'ALL',
}
