import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/config/jwtSettings';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { getCurrentAccessToken } from 'src/utils/generic';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Headers() headers, @Body() loginDto: LoginDto) {
    return await this.authService.login({
      auth_id: req.user,
      application: headers['user-agent'] || 'UNDEFINED',
    });
  }

  @Put('logout')
  @HttpCode(204)
  @Roles(Role.ALL)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async logout(@Headers() headers, @Request() req) {
    return await this.authService.logout(getCurrentAccessToken(req));
  }

  @Post('refresh-token')
  @HttpCode(201)
  async newToken(@Body() refreshTokenDto: RefreshTokenDto, @Request() req) {
    return await this.authService.getNewToken(refreshTokenDto, {
      application: req.headers['user-agent'] || 'UNDEFINED',
    });
  }
}
