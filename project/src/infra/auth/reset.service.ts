import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from 'src/Schemas/auth/auth.schema';
import {
  ResetPassword,
  ResetPasswordDocument,
} from 'src/Schemas/auth/resetPassword.schema';
import { getHashPassword, resetToken } from 'src/utils/generic';

@Injectable()
export class ResetService {
  constructor(
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPasswordDocument>,
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
  ) {}

  async newResetPassword(data: any) {
    const { email } = data;
    if (!email) throw new BadRequestException();

    const getAuth = await this.authModel
      .findOne({ username: data.email })
      .exec();

    if (!getAuth) throw new BadRequestException();
    const newResetToken = resetToken();

    const newResetPassword = await new this.resetPasswordModel({
      token: newResetToken,
      auth_id: getAuth._id,
    });
    newResetPassword.save();
    console.log(newResetPassword); // TO DEV

    return;
  }

  async resetPasswordCode(data: any) {
    const { code, password } = data;

    if (!code || !password) throw new BadRequestException();

    const reset = await this.resetPasswordModel
      .findOne({ token: code, expired: false, used: false })
      .exec();

    if (!reset) throw new BadRequestException();

    const getAuth = await this.authModel.findOne({ _id: reset.auth_id }).exec();
    if (!getAuth) throw new InternalServerErrorException();

    getAuth.password = await getHashPassword(password);
    getAuth.save();

    reset.used = true;
    reset.save();
    return;
  }
}
