import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Put,
  HttpCode,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { Role } from 'src/config/jwtSettings';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FindAllDto } from './dto/find-all.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() find: FindAllDto) {
    const searchFirstName = { firstName: new RegExp(find.firstName, 'i') };
    const searchLastName = { lastName: new RegExp(find.lastName, 'i') };
    const searchEmail = { email: new RegExp(find.email, 'i') };
    let ors = [];
    if (find.firstName) ors.push(searchFirstName);
    if (find.lastName) ors.push(searchLastName);
    if (find.email) ors.push(searchEmail);
    const search = {
      $or: ors,
    };
    return this.usersService.findAll(
      find.page,
      find.sort,
      ors.length > 0 ? search : {},
    );
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.AGENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('profile')
  @HttpCode(200)
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findMe(@Request() req) {
    const id = req.user.identity_id;
    return this.usersService.findMe(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    this.usersService.remove(id);
  }

  @Put('settings')
  @HttpCode(200)
  @Roles(Role.ALL)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateSettings(
    @Body() updateSettingsModel: UpdateSettingsDto,
    @Request() req,
  ) {
    const id = req.user.identity_id;
    return this.usersService.settings(updateSettingsModel, id);
  }
}
