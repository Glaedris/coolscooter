import { Model, ObjectId } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from 'src/Schemas/auth/auth.schema';
import { TokenService } from './token/token.service';
import {
  AccessLog,
  AccessLogDocument,
} from 'src/Schemas/auth/accessLog.schema';
import {
  AccessToken,
  AccessTokenDocument,
} from 'src/Schemas/auth/accessToken.schema';
import { isObjectId, isValidPassword } from 'src/utils/generic';
import { User } from 'src/Schemas/users/user.schema';
import { UserDocument } from 'src/Schemas/users/user.schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AccessLog.name)
    private accessLogModel: Model<AccessLogDocument>,
    @InjectModel(AccessToken.name)
    private accessTokenModel: Model<AccessTokenDocument>,
    private tokenService: TokenService,
  ) {}

  async login(data: any) {
    if (!isObjectId(data.auth_id.auth_id)) throw new BadRequestException();
    const getActiveLogins = await this.accessLogModel
      .find({
        auth_id: data.auth_id,
        status: true,
      })
      .exec();

    //Disable all active logins from user
    const updated = getActiveLogins.map(async (login) => {
      await this.accessTokenModel
        .find({ access_log_id: login._id, status: true })
        .updateMany({ status: false });

      await this.accessLogModel.updateOne(
        { _id: login._id, status: true },
        { status: false },
        { upsert: true },
      );
    });

    const newAccess = await this.newLogin(
      {
        id: data.auth_id,
        application: data.application,
        role: data.role,
      },
      data.auth_id,
    );

    return newAccess;
  }

  async newLogin(data: object, auth_id: ObjectId) {
    //Create new login
    const access = await this.tokenService.signIn(data);
    const accessLog = { auth_id };
    const newAccessLog = new this.accessLogModel(accessLog);
    const accessToken = {
      access_log_id: newAccessLog._id,
      access_token: access.access_token,
      access_token_expirate: access.access_token_expire,
      refresh_token: access.refresh_token,
      refresh_token_expirate: access.refresh_token_expire,
    };
    const newAccessToken = new this.accessTokenModel(accessToken);
    await newAccessLog.save();
    await newAccessToken.save();

    return access;
  }

  async logout(token: string) {
    //Get current token
    const getAccessToken = await this.accessTokenModel
      .findOne({ access_token: token, status: true })
      .exec();

    //Invalidate access log
    const getAccessLog = await this.accessLogModel.updateOne(
      { _id: getAccessToken.access_log_id },
      { status: false },
    );

    //Invalidate all tokens
    const invalidateAllTokens = await this.accessTokenModel.updateMany(
      {
        access_log_id: getAccessToken.access_log_id,
      },
      { status: false },
    );
    return;
  }

  async validateUser(username, password) {
    const getAuth = await this.authModel.findOne({
      username,
      status: true,
    });
    if (!getAuth) throw new UnauthorizedException();

    const valid = await isValidPassword(getAuth.password, password);
    if (!valid) throw new UnauthorizedException();
    return {
      auth_id: getAuth['_id'],
      identity_id: getAuth['identity_id'],
      type: getAuth['type'],
      role: getAuth.role,
    };
  }

  async blacklistValidator(token): Promise<AccessToken> {
    const getAccessToken = await this.accessTokenModel.findOne({
      access_token: token,
      status: true,
    });

    return getAccessToken;
  }

  async getNewToken(refreshTokenDto: RefreshTokenDto, data: any) {
    const validate = this.tokenService.validateToken(
      refreshTokenDto.refreshToken,
    );
    const getCurrentRefresh = await this.accessTokenModel.findOne({
      refresh_token: refreshTokenDto.refreshToken,
    });
    if (!getCurrentRefresh || getCurrentRefresh.abuse)
      throw new BadRequestException();

    if (getCurrentRefresh.status == false) {
      getCurrentRefresh.abuse = true;
      const allSessions = await this.accessLogModel.find({
        auth_id: validate.auth_id,
      });
      allSessions.map(async (session) => {
        session.status = false;
        session.save();
        return await this.accessTokenModel.updateMany(
          { auth_id: session._id },
          { status: false },
        );
      });
      getCurrentRefresh.save();
      throw new BadRequestException();

      //send email to user
    } else {
      getCurrentRefresh.status = false;
      await getCurrentRefresh.save();
    }

    const newRefreshToken = await this.newLogin(
      {
        id: {
          ...validate.sub,
        },
        application: data.application,
        role: validate.sub.role,
      },
      validate.sub,
    );
    return newRefreshToken;
  }
}
