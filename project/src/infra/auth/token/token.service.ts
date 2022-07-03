import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtSettings } from 'src/config/jwtSettings';
import { Auth, AuthDocument } from 'src/Schemas/auth/auth.schema';
import { getCurrentTimestamp } from 'src/utils/time';
import { jwtPayload, responseSign } from './token.types';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async signIn(data) {
    const { id, application, role } = data;
    const setPayload = {
      sub: id,
      application: application,
      role,
    };
    const expiresIn = this.getExpireTime();
    const access = await this.getNewAccessAndRefreshToken(
      setPayload,
      expiresIn,
    );

    return { ...access, ...expiresIn };
  }

  async getAccessToken(payload: jwtPayload) {
    const accessToken = await this.jwtService.sign(payload, {
      secret: jwtSettings.accessTokenSecret,
      expiresIn: parseInt(jwtSettings.accessTokenExpire),
    });
    return accessToken;
  }

  async getRefreshToken(payload: jwtPayload) {
    const refreshToken = await this.jwtService.sign(payload, {
      secret: jwtSettings.refreshTokenSecret,
      expiresIn: parseInt(jwtSettings.refreshTokenExpire),
    });
    return refreshToken;
  }

  async getNewAccessAndRefreshToken(
    payload: jwtPayload,
    expiresIn: any,
  ): Promise<responseSign> {
    return {
      access_token: await this.getAccessToken(payload),
      refresh_token: await this.getRefreshToken(payload),
    };
  }

  getExpireTime() {
    const currentTimestamp = getCurrentTimestamp();
    const refresh_token_expire =
      this.getRefreshTokenExpiration(currentTimestamp);
    const access_token_expire = this.getAccessTokenExpiration(currentTimestamp);
    return {
      access_token_expire,
      refresh_token_expire,
    };
  }

  getAccessTokenExpiration = (currentTime) => {
    return currentTime + parseInt(jwtSettings.accessTokenExpire);
  };

  getRefreshTokenExpiration = (currentTime) => {
    return currentTime + parseInt(jwtSettings.refreshTokenExpire);
  };

  validateToken = (token: string) => {
    return this.jwtService.verify(token, {
      secret: jwtSettings.refreshTokenSecret,
    });
  };
}
