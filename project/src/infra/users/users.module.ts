import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { schemaProviders } from './schemas.providers';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature(schemaProviders)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
