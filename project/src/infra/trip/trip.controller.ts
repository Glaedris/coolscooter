import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/config/jwtSettings';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isLongitude } from 'class-validator';
@Controller('trips')
@ApiTags('Trips')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @Roles(Role.CLIENT)
  startTrip(@Body() createTripDto: CreateTripDto, @Request() req) {
    const user_id = req.user.identity_id;
    return this.tripService.startTrip(createTripDto, user_id);
  }

  @Put(':id/end')
  @Roles(Role.CLIENT, Role.ADMIN)
  endTrip(@Param('id') id: string, @Request() req) {
    const user_id = req.user.identity_id;
    return this.tripService.endTrip(id, user_id);
  }

  @Post(':id/feedback')
  @Roles(Role.CLIENT)
  createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Param('id') id: number,
  ) {
    return this.tripService.createFeedback(createFeedbackDto, id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CLIENT)
  findAll(@Request() req) {
    const user_id = req.user.identity_id;
    const role = req.user.role;
    return this.tripService.findAll(
      user_id,
      role != Role[Role.CLIENT] ? true : false,
    );
  }

  @Get(':id')
  @Roles(Role.ALL)
  findOne(@Param('id') id: string, @Request() req) {
    const user_id = req.user.identity_id;
    const role = req.user.role;
    return this.tripService.findOne(
      id,
      user_id,
      role != Role[Role.CLIENT] ? true : false,
    );
  }

  @Get(':id/locations')
  @Roles(Role.CLIENT, Role.ADMIN, Role.AGENT)
  getTripLocations(@Param('id') id: string, @Request() req) {
    const user_id = req.user.identity_id;
    const role = req.user.role;
    return this.tripService.getTripLocations(
      id,
      user_id,
      role != Role[Role.CLIENT] ? true : false,
    );
  }
}
