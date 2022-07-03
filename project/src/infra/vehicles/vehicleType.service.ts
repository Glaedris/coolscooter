import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VehicleType,
  VehicleTypeDocument,
} from 'src/Schemas/vehicles/vehicle_type.schema';
import { isObjectId } from 'src/utils/generic';
import { VehicleTypeUpdateDto } from './dto/vehicle-type-update.dto';
import { VehicleTypeDto } from './dto/vehicle-type.dto';

@Injectable()
export class VehicleTypeService {
  constructor(
    @InjectModel(VehicleType.name)
    private vehicleTypeModel: Model<VehicleTypeDocument>,
  ) {}

  async getAll() {
    const getAll = await this.vehicleTypeModel.find({}).exec();
    return getAll;
  }
  async getOne(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    const getVehicleType = await this.vehicleTypeModel
      .findOne({ _id: id })
      .exec();

    if (!getVehicleType) throw new BadRequestException();
    return getVehicleType;
  }

  async create(data: VehicleTypeDto) {
    let { description, cost } = data;
    description = description.toUpperCase(); //uppercase
    const checkIfExists = await this.vehicleTypeModel
      .findOne({ description })
      .exec();

    if (checkIfExists)
      throw new ConflictException('Vehicle Type already exists.');

    const newVehicleType = await new this.vehicleTypeModel({
      description,
      cost,
    });
    newVehicleType.save();

    return newVehicleType;
  }

  async update(id: string, data: VehicleTypeUpdateDto) {
    if (!isObjectId(id)) throw new BadRequestException();
    let { description, cost } = data;

    const checkIfExists = await this.vehicleTypeModel
      .findOne({ _id: id })
      .exec();
    if (!checkIfExists) throw new NotFoundException();

    if (description) {
      description = description.toUpperCase();
      const checkEquals = await this.vehicleTypeModel
        .findOne({ description })
        .exec();
      if (checkEquals)
        throw new BadRequestException(
          'This Vehicle Type description already exists',
        );
      checkIfExists.description = description;
    }

    if (cost) checkIfExists.cost = cost;
    checkIfExists.save();

    return;
  }

  async delete(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    const getLocationArea = await this.vehicleTypeModel
      .findOne({ _id: id })
      .exec();

    if (!getLocationArea)
      throw new BadRequestException('Vehicle Type not exists.');

    //TODO verificar se esta a ser usado, se sim inativar (status = false)
    const check = false;

    if (check) throw new BadRequestException('This Vehicle Type is in use.');
    await getLocationArea.delete();
    return;
  }
}
