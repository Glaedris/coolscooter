import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocationAreaDto } from './dto/location-area.dto';
import { LocationAreaService } from './locationArea.service';

@Controller('location-area')
@ApiTags('Location Area')
@ApiBearerAuth()
export class LocationAreaController {
  constructor(private readonly locationAreaService: LocationAreaService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createLocationAreaDto: LocationAreaDto) {
    console.log(createLocationAreaDto);
    return this.locationAreaService.create(createLocationAreaDto);
  }

  @Get(':id')
  @HttpCode(200)
  getOne(@Param('id') id: string) {
    return this.locationAreaService.getOne(id);
  }

  @Get()
  @HttpCode(200)
  getAll() {
    return this.locationAreaService.getAll();
  }

  @Put(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() data: LocationAreaDto) {
    return this.locationAreaService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.locationAreaService.delete(id);
  }
}
