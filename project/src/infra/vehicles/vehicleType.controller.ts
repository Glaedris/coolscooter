import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VehicleTypeUpdateDto } from './dto/vehicle-type-update.dto';
import { VehicleTypeDto } from './dto/vehicle-type.dto';
import { VehicleTypeService } from './vehicleType.service';

@Controller('vehicle-type')
@ApiTags('Vehicle Types')
@ApiBearerAuth()
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createLocationAreaDto: VehicleTypeDto) {
    return this.vehicleTypeService.create(createLocationAreaDto);
  }

  @Get(':id')
  @HttpCode(200)
  getOne(@Param('id') id: string) {
    return this.vehicleTypeService.getOne(id);
  }

  @Get()
  @HttpCode(200)
  getAll() {
    return this.vehicleTypeService.getAll();
  }

  @Put(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() data: VehicleTypeUpdateDto) {
    return this.vehicleTypeService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.vehicleTypeService.delete(id);
  }
}
