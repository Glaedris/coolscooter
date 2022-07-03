import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
  Request,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { TransferVehicleDto } from './dto/transfer-vehicle.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { isObjectId } from 'src/utils/generic';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/config/jwtSettings';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SetLocationDto } from './dto/set-location.dto';

@Controller('vehicles')
@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    const created_by = req.user.identity_id;

    return this.vehiclesService.create(createVehicleDto, created_by);
  }

  @Put(':id/transfer')
  @Roles(Role.ADMIN, Role.MANAGER)
  setTransfer(
    @Param('id') id: string,
    @Body() transferVehicleDto: TransferVehicleDto,
  ) {
    return this.vehiclesService.setTransfer(id, transferVehicleDto);
  }

  @Get('point')
  @Roles(Role.ALL)
  findByPoint(@Query() { longitude, latitude, distance }, @Request() req) {
    const user_id = req.user.identity_id;
    return this.vehiclesService.findByPoint(
      user_id,
      longitude,
      latitude,
      distance,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.AGENT, Role.MANAGER)
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('status')
  @Roles(Role.ADMIN, Role.AGENT, Role.MANAGER)
  getVehicleStatus() {
    return this.vehiclesService.getVehicleStatus();
  }

  @Get(':id/transfer')
  @Roles(Role.ADMIN, Role.AGENT, Role.MANAGER)
  findTransfers(@Param('id') id: string) {
    return this.vehiclesService.findTransfers(id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.AGENT, Role.MANAGER, Role.CLIENT)
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.AGENT, Role.MANAGER)
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Put(':id/reserve')
  @HttpCode(204)
  @Roles(Role.CLIENT)
  updateReserve(@Param('id') id: string, @Request() req) {
    if (!isObjectId(id)) throw new BadRequestException();
    const user_id = req.user.identity_id;
    return this.vehiclesService.updateReserve(id, user_id);
  }

  @Put(':id/location')
  @HttpCode(204)
  @Roles(Role.MANAGER, Role.ADMIN)
  updateLocation(@Body() setLocationDto: SetLocationDto, @Param('id') id) {
    return this.vehiclesService.updateLocation(setLocationDto, id);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.MANAGER, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
