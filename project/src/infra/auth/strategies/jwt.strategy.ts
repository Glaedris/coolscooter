import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { jwtSettings } from 'src/config/jwtSettings';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument, Type } from 'src/Schemas/auth/auth.schema';
import { User, UserDocument } from 'src/Schemas/users/user.schema';
import { Model } from 'mongoose';
import {
  Employee,
  EmployeeDocument,
} from 'src/Schemas/employee/employee.schema';
import { Request } from 'express';
import {
  AccessLog,
  AccessLogDocument,
} from 'src/Schemas/auth/accessLog.schema';
import {
  AccessToken,
  AccessTokenDocument,
} from 'src/Schemas/auth/accessToken.schema';
import { getCurrentAccessToken } from 'src/utils/generic';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSettings.accessTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    let getToken = getCurrentAccessToken(request);
    if (!getToken) throw new UnauthorizedException();

    const validaBlacklist = await this.authService.blacklistValidator(getToken);
    if (!validaBlacklist) throw new UnauthorizedException();

    return {
      auth_id: payload.sub.auth_id,
      identity_id: payload.sub.identity_id,
      type: Type[payload.sub.type],
      role: payload.sub.role,
    };
  }
}
