import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Auth, AuthDocument } from 'src/Schemas/auth/auth.schema';
import { Wallet, WalletDocument } from 'src/Schemas/financial/wallet.schema';
import { SettingsDocument } from 'src/Schemas/users/settings.schema';
import { UserDocument } from 'src/Schemas/users/user.schema';
import { User } from 'src/Schemas/users/user.schema';
import { getHashPassword, isObjectId } from 'src/utils/generic';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password, birthday } = createUserDto;
    const checkIfUserExists = await this.userModel.findOne({ email }).exec();
    const checkIfAuthExists = await this.authModel
      .findOne({ username: email })
      .exec();
    if (checkIfUserExists || checkIfAuthExists)
      throw new ConflictException('Email already exists.');

    const newWallet = await new this.walletModel().save();
    const newUser = await new this.userModel({
      firstName,
      lastName,
      email,
      birthday,
      wallet: newWallet._id,
    }).save();
    const newAuth = await new this.authModel({
      username: email,
      password: await getHashPassword(password),
      identity_id: newUser._id,
    }).save();

    return newUser;
  }

  async findAll(page: number = 1, sort: number = 1, filter: object = {}) {
    const limit = 10;
    const count = await this.userModel.find(filter).count();
    const lastPage = Math.ceil(count / limit);
    page = Math.ceil(count / limit) >= page ? page : 1;
    let toSort = {};
    toSort['firstName'] = sort == 1 ? 1 : -1;
    const aux = await this.userModel
      .find(filter, { _id: true, firstName: true, lastName: true, email: true })
      .sort(toSort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return {
      count: count,
      data: aux,
      perPage: limit,
      page: +page,
      firstPage: 1,
      lastPage: lastPage ? lastPage : 1,
    };
  }

  async findOne(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    const user = await this.userModel.find({ _id: id }).exec();
    if (!user) throw new NotFoundException();
    return user;
  }

  async findMe(id: string) {
    const checkIfUserExists = await await this.userModel
      .findOne({ _id: id })
      .populate('wallet');

    if (!checkIfUserExists) throw new NotFoundException();

    return checkIfUserExists;
  }

  async settings(data: UpdateSettingsDto, id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) throw new BadRequestException();

    user.settings = {
      dark_mode: data.dark_mode ? data.dark_mode : user.settings.dark_mode,
      language: data.language ? data.language : user.settings.language,
    };

    user.save();

    return await user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfUserExists = await this.userModel.findOne({ _id: id }).exec();

    if (!checkIfUserExists) throw new NotFoundException();

    //TODO check if user in use
    const check = false;

    if (!check) {
      checkIfUserExists.delete();
      await (
        await this.authModel.findOne({ identity_id: checkIfUserExists._id })
      ).delete();
    }
    return;
  }
}
