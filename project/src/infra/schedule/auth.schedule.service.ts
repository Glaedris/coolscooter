import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  AccessToken,
  AccessTokenDocument,
} from 'src/Schemas/auth/accessToken.schema';
import { getCurrentTimestamp } from 'src/utils/time';

@Injectable()
export class AuthCronService {
  constructor(
    @InjectModel(AccessToken.name)
    private accessTokenModel: Model<AccessTokenDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async invalidateToken() {
    const currentTime = getCurrentTimestamp();
    await this.accessTokenModel
      .updateMany(
        {
          status: true,
          refresh_token_expirate: { $lt: currentTime },
        },
        {
          status: false,
        },
      )
      .exec();
  }
}
