import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNumber } from 'class-validator';
import { Model, Types } from 'mongoose';
import { GeoPoint } from 'src/Schemas/point.schema';
import { Transfer } from 'src/Schemas/vehicles/transfers.schema';
import {
  Vehicle,
  VehicleDocument,
  VehicleStatus,
} from 'src/Schemas/vehicles/vehicle.schema';
import { isObjectId, metrosToKm } from 'src/utils/generic';
import { getCurrentTimestamp } from 'src/utils/time';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { SetLocationDto } from './dto/set-location.dto';
import { TransferVehicleDto } from './dto/transfer-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, created_by: string) {
    if (!isObjectId(created_by)) throw new BadRequestException();
    const { serial_number } = createVehicleDto;

    const checkIfVehicleExists = await this.vehicleModel
      .findOne({ serial_number })
      .exec();

    if (checkIfVehicleExists) throw new ConflictException();

    const newVehicle = new this.vehicleModel({
      ...createVehicleDto,
      created_by,
    });
    newVehicle.save();

    return newVehicle;
  }

  async setTransfer(id: string, transferVehicleDto: TransferVehicleDto) {
    if (!isObjectId(id)) throw new BadRequestException();

    const getVehicle = await this.vehicleModel.findOne({ _id: id }).exec();

    if (!getVehicle) throw new BadRequestException();

    let activeTransfer = -1;
    if (getVehicle.transfers && getVehicle.transfers.length > 0) {
      for (let i = 0; i < getVehicle.transfers.length; i++) {
        console.log(getVehicle.transfers[i]);
        if (getVehicle.transfers[i].active == true) {
          activeTransfer = i;
          break;
        }
      }
    }

    let newTransfer = new Transfer();
    let transfers: any = [];
    newTransfer.current_location_area =
      transferVehicleDto.current_location_area;
    if (getVehicle.transfers && getVehicle.transfers.length > 0) {
      newTransfer.previous_location_area =
        getVehicle.transfers[activeTransfer].current_location_area;
      transfers = [...getVehicle.transfers, newTransfer];
      getVehicle.transfers[activeTransfer].active = false;
    } else {
      transfers = [newTransfer];
    }

    getVehicle.transfers = transfers;
    getVehicle.location_area = transferVehicleDto.current_location_area;
    getVehicle.save();

    return getVehicle;
  }

  async findTransfers(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfVehicleExists = await this.vehicleModel
      .findOne({ _id: id })
      .exec();

    if (!checkIfVehicleExists) throw new NotFoundException();

    return checkIfVehicleExists.transfers ? checkIfVehicleExists.transfers : [];
  }

  async findByPoint(
    id: string,
    longitude: number,
    latitude: number,
    distance: number,
  ) {
    const realDistance = metrosToKm(distance);
    if (realDistance >= 40000)
      throw new BadRequestException('The distance must be less than 40000');
    const coordinates = [longitude, latitude];
    return await this.vehicleModel
      .find(
        {
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates,
              },
              $maxDistance: realDistance,
            },
          },
          $or: [
            { status: VehicleStatus[VehicleStatus.AVAILABLE] },
            {
              $and: [
                { status: VehicleStatus[VehicleStatus.RESERVED] },
                { reserve_by: new Types.ObjectId(id) },
              ],
            },
          ],
        },
        {
          model: 1,
          serial_number: 1,
          battery: 1,
          location: 1,
          max_velocity: 1,
        },
      )
      .populate('vechicle_type', 'description cost');
  }

  async findAll(page: number = 1, filter: object = {}) {
    const limit = 10;
    const count = await this.vehicleModel.find(filter).count();
    const lastPage = Math.ceil(count / limit);
    page = Math.ceil(count / limit) >= page ? page : 1;
    const aux = await this.vehicleModel
      .find(filter, {
        _id: true,
        model: true,
        serial_number: true,
        battery: true,
        max_velocity: true,
        total_km: true,
        status: true,
        active: true,
      })
      .populate('vechicle_type', 'description cost')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return {
      count: count,
      data: aux,
      perPage: limit,
      page: +page,
      firstPage: 1,
      lastPage: lastPage ? lastPage : 1,
    };
  }

  async findOne(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfVehicleExists = await this.vehicleModel
      .findOne({ _id: id })
      .exec();

    if (!checkIfVehicleExists) throw new NotFoundException();

    return checkIfVehicleExists;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfVehicleExists = await this.vehicleModel
      .findOne({ _id: id })
      .exec();

    if (!checkIfVehicleExists) throw new NotFoundException();

    await checkIfVehicleExists.updateOne(updateVehicleDto).exec();

    const vehicleUpdated = await this.vehicleModel.findOne({ _id: id });

    return vehicleUpdated;
  }

  async updateReserve(id: string, identity_id: Types.ObjectId) {
    if (!isObjectId(id) || !isObjectId(identity_id))
      throw new BadRequestException();
    const checkIfVehicleExists = await this.vehicleModel.findOne({ _id: id });
    const checkIfIdentityExists = await this.vehicleModel
      .findOne({
        reserve_by: new Types.ObjectId(identity_id),
      })
      .count();

    if (checkIfIdentityExists != 0) throw new BadRequestException();
    if (!checkIfVehicleExists) throw new NotFoundException();
    if (checkIfVehicleExists.status == VehicleStatus[VehicleStatus.RESERVED])
      throw new ConflictException('Busy'); //Busy

    checkIfVehicleExists.status = VehicleStatus[VehicleStatus.RESERVED];
    checkIfVehicleExists.reserve_by = new Types.ObjectId(identity_id);
    checkIfVehicleExists.reserve_expire = getCurrentTimestamp() + 600; //10 minutes
    checkIfVehicleExists.save();

    return;
  }

  async updateLocation(setLocationDto: SetLocationDto, id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    const checkIfVehicleExists = await this.vehicleModel.findById(id);
    if (!checkIfVehicleExists) throw new NotFoundException();

    checkIfVehicleExists.location = new GeoPoint(
      setLocationDto.longitude,
      setLocationDto.latitude,
    );

    await checkIfVehicleExists.save();
    return;
  }

  async remove(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfVehicleExists = await this.vehicleModel
      .findOne({ _id: id })
      .exec();

    if (!checkIfVehicleExists) throw new NotFoundException();

    //TODO check if this vehicle not in use
    const check = false;

    if (!check) checkIfVehicleExists.delete();

    return;
  }

  async getVehicleStatus() {
    const statusList = Object.values(VehicleStatus)
      .filter((status) => !isNumber(status))
      .map((status) => status);
    return statusList;
  }
}
