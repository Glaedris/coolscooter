import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LocationArea,
  LocationAreaDocument,
} from 'src/Schemas/vehicles/location_area.schema';
import { isObjectId } from 'src/utils/generic';

@Injectable()
export class LocationAreaService {
  constructor(
    @InjectModel(LocationArea.name)
    private locationAreaModel: Model<LocationAreaDocument>,
  ) {}

  async getAll() {
    const getAll = await this.locationAreaModel.find({}).exec();
    return getAll;
  }
  async getOne(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    const getLocationArea = await this.locationAreaModel
      .findOne({ _id: id })
      .exec();

    if (!getLocationArea) throw new BadRequestException();
    return getLocationArea;
  }

  async create(data: any) {
    let { description } = data;
    description = description.toUpperCase(); //uppercase
    const checkIfExists = await this.locationAreaModel
      .findOne({ description })
      .exec();

    if (checkIfExists)
      throw new ConflictException('Location Area already exists.');

    const newLocationArea = await new this.locationAreaModel({
      description,
    });
    newLocationArea.save();

    return newLocationArea;
  }

  async update(id: string, data: any) {
    if (!isObjectId(id)) throw new BadRequestException();
    let { description } = data;
    description = description.toUpperCase();
    const checkIfExists = await this.locationAreaModel
      .findOne({ _id: id })
      .exec();
    const checkEquals = await this.locationAreaModel
      .findOne({ description })
      .exec();
    if (!checkIfExists || checkEquals)
      throw new BadRequestException(
        'This Location Area dont exists or description already exists',
      );

    checkIfExists.description = description;
    checkIfExists.save();

    return;
  }

  async delete(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();
    const getLocationArea = await this.locationAreaModel
      .findOne({ _id: id })
      .exec();

    if (!getLocationArea)
      throw new BadRequestException('Location Area not exists.');

    //TODO verificar se esta a ser usado, se sim inativar (status = false)
    const check = false;

    if (check) throw new BadRequestException('This Location Area is in use.');
    await getLocationArea.delete();
    return;
  }
}
