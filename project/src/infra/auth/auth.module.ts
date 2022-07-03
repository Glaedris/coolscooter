import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { TokenService } from './token/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { schemaProviders } from './schema.providers';
import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';

@Module({
  imports: [
    MongooseModule.forFeature(schemaProviders),
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    LocalStrategy,
    AuthService,
    ResetService,
    TokenService,
    JwtStrategy,
    JwtService,
  ],
  controllers: [AuthController, ResetController],
  exports: [AuthService],
})
export class AuthModule {}
