import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback, FeedbackDocument } from 'src/Schemas/trip/feedback.schema';
import { Location, LocationDocument } from 'src/Schemas/trip/location.schema';
import { Trip, TripDocument, TripStatus } from 'src/Schemas/trip/trip.schema';
import {
  Vehicle,
  VehicleDocument,
  VehicleStatus,
} from 'src/Schemas/vehicles/vehicle.schema';
import { calcTripDistance, isObjectId } from 'src/utils/generic';
import { getCurrentTimestamp } from 'src/utils/time';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectModel(Trip.name)
    private tripModel: Model<TripDocument>,
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,

    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
  ) {}

  async startTrip(createTripDto: CreateTripDto, user_id: string) {
    if (!isObjectId(createTripDto.vehicle_id)) throw new BadRequestException();

    const vehicle = await this.vehicleModel.findOne({
      _id: createTripDto.vehicle_id,
    });

    if (!vehicle) throw new NotFoundException();

    if (vehicle.status != VehicleStatus[VehicleStatus.AVAILABLE])
      throw new ConflictException();

    const currentTime = getCurrentTimestamp();
    const newTripObject: Trip = {
      vehicle: new Types.ObjectId(createTripDto.vehicle_id),
      user: new Types.ObjectId(user_id),
      start_time: currentTime,
      start_position: vehicle.location,
      start_battery: vehicle.battery,
    };

    const newTrip = new this.tripModel(newTripObject);
    vehicle.status = VehicleStatus[VehicleStatus.RUNNING];
    await newTrip.save();
    await vehicle.save();

    return newTrip;
  }

  async endTrip(id: string, user_id: string) {
    if (!isObjectId(id) || !isObjectId(user_id))
      throw new BadRequestException();

    const trip = await this.tripModel.findOne({
      $and: [
        { _id: id },
        {
          status: {
            $nin: [TripStatus[TripStatus.ENDED], TripStatus[TripStatus.CLOSED]],
          },
        },
        { user: new Types.ObjectId(user_id) },
      ],
    });

    if (!trip) throw new NotFoundException();
    const locations = await this.locationModel.find(
      { trip_id: trip._id },
      { position: 1, _id: 0 },
    );
    const tripDistance = calcTripDistance(locations);

    const vehicle = await (
      await this.vehicleModel.findOne({ _id: trip.vehicle })
    ).populate('vechicle_type', '-_id cost');

    if (!vehicle) throw new InternalServerErrorException();

    const vehicle_type: any = vehicle.vechicle_type;
    const currentTime = getCurrentTimestamp();
    trip.end_position = vehicle.location;
    trip.end_battery = vehicle.battery;
    trip.end_time = currentTime;
    trip.duration_time = trip.end_time - trip.start_time;
    const totalMinutes = (trip.end_time - trip.start_time) / 60;
    trip.total_cost =
      totalMinutes < 1 ? vehicle_type.cost : totalMinutes * vehicle_type.cost;
    trip.total_km = tripDistance;
    trip.status = TripStatus[TripStatus.ENDED];
    await trip.save();
    vehicle.status = VehicleStatus[VehicleStatus.AVAILABLE];
    await vehicle.save();

    return trip;
  }

  async createFeedback(createFeedbackDto: CreateFeedbackDto, id: number) {
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfFeedbackExists = await this.feedbackModel.findOne({
      trip_id: id,
    });

    const checkIfTripExists = await this.tripModel.findById(id);

    if (checkIfFeedbackExists) throw new ConflictException();
    if (!checkIfTripExists) throw new NotFoundException();

    const newFeedback = await new this.feedbackModel({
      trip_id: id,
      ...createFeedbackDto,
    });
    newFeedback.save();
    return;
  }

  async getTripLocations(id: string, user_id: string, isAdmin: boolean) {
    if (!isObjectId(id) || !isObjectId(user_id))
      throw new BadRequestException();

    const search = isAdmin ? { _id: id } : { _id: id, user: user_id };

    const trip = await this.tripModel.findOne(search).exec();
    if (!trip) throw new NotFoundException();
    const locations = await this.locationModel.find({ trip_id: trip._id });
    return { trip_data: trip, locations: locations };
  }

  async findAll(user_id: string, isAdmin: boolean) {
    if (!isObjectId(user_id)) throw new BadRequestException();

    const search = isAdmin ? {} : { user: new Types.ObjectId(user_id) };

    const trip = await await this.tripModel
      .find(search, { created_at: 0, updated_at: 0 })
      .populate({
        path: 'vehicle',
        select: '-_id model serial_number total_km status battery max_velocity',
        populate: [
          { path: 'location_area', select: 'description -_id' },
          { path: 'vechicle_type', select: 'description cost -_id' },
        ],
      });

    return trip;
  }

  async findOne(id: string, user_id: string, isAdmin: boolean) {
    if (!isObjectId(id) || !isObjectId(user_id))
      throw new BadRequestException();

    const search = isAdmin ? { _id: id } : { _id: id, user: user_id };

    const trip = await this.tripModel.findOne(search);

    if (!trip) throw new NotFoundException();

    return trip;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
