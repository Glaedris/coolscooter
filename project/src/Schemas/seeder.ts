import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import { UserSeeder } from './users/user.seeder';
import config from '../config/environmentConfig';
import { User, UserSchema } from './users/user.schema';

seeder({
  imports: [
    ConfigModule.forRoot(config),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      // { name: Auth.name, schema: AuthSchema },
    ]),
  ],
}).run([UserSeeder]);
