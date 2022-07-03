import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceDto } from './dto/maintenance.dto';
import { isObjectId } from 'src/utils/generic';
import { MaintenanceUpdateDto } from './dto/maintenance-update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/config/jwtSettings';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('maintenance')
@ApiTags('Maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @HttpCode(200)
  findAll(@Query() { page, sort, vehicle_id, technician_id }) {
    const vehicle = { vehicle_id };
    const technician = { technician_id };
    let ors = [];
    if (vehicle_id) ors.push(vehicle);
    if (technician_id) ors.push(technician);
    const search = {
      $or: ors,
    };
    return this.maintenanceService.findAll(
      page,
      sort,
      ors.length > 0 ? search : {},
    );
  }

  @Get('status')
  getMaintenanceStatus() {
    return this.maintenanceService.getMaintenanceStatus();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() maintenanceDto: MaintenanceDto) {
    return this.maintenanceService.create(maintenanceDto);
  }

  @Put(':id/status')
  @HttpCode(204)
  changeStatus(@Param('id') id: string, @Body('status') status: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    if (!status) throw new BadRequestException('Status is an required field');
    return this.maintenanceService.changeStatus(id, status);
  }

  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() maintenanceUpdateDto: MaintenanceUpdateDto,
  ) {
    return this.maintenanceService.update(id, maintenanceUpdateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(id);
  }
}
