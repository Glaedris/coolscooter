import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  AccessToken,
  AccessTokenDocument,
} from 'src/Schemas/auth/accessToken.schema';
import {
  ResetPassword,
  ResetPasswordDocument,
} from 'src/Schemas/auth/resetPassword.schema';
import { getCurrentTimestamp } from 'src/utils/time';

@Injectable()
export class ResetCronService {
  constructor(
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPasswordDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async invalidateToken() {
    const currentTime = getCurrentTimestamp();
    const invalidate = await this.resetPasswordModel
      .updateMany(
        {
          expired: false,
          expiration: { $lt: currentTime },
        },
        {
          expired: true,
        },
      )
      .exec();
  }
}
