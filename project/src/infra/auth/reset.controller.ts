import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordConfirmationDto } from './dto/reset-confirmation.dto';
import { ResetPasswordDto } from './dto/reset.dto';
import { ResetService } from './reset.service';
import { TokenService } from './token/token.service';

@Controller('reset')
@ApiTags('Reset Password')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @HttpCode(204)
  @Post('password')
  async newResetPassword(@Body() data: ResetPasswordDto) {
    return this.resetService.newResetPassword(data);
  }

  @HttpCode(204)
  @Put('password')
  async resetPasswordCode(@Body() data: ResetPasswordConfirmationDto) {
    return this.resetService.resetPasswordCode(data);
  }
}
