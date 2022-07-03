import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { User, UserDocument } from './user.schema';

export class UserSeeder implements Seeder {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  drop(): Promise<any> {
    return this.userModel.deleteMany({}) as any;
  }

  seed(): Promise<any> {
    const users: any = DataFactory.createForClass(User).generate(50);
    return this.userModel.insertMany(users);
  }
}
