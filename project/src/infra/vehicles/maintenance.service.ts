import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNumber } from 'class-validator';
import { Model, ObjectId } from 'mongoose';
import { Employee } from 'src/Schemas/employee/employee.schema';
import {
  Maintenance,
  MaintenanceDocument,
  StatusMaintenance,
} from 'src/Schemas/vehicles/maintenance.schema';
import { Vehicle } from 'src/Schemas/vehicles/vehicle.schema';
import { isObjectId } from 'src/utils/generic';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { MaintenanceUpdateDto } from './dto/maintenance-update.dto';
import { MaintenanceDto } from './dto/maintenance.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<MaintenanceDocument>,
  ) {}

  async create(maintenanceDto: MaintenanceDto) {
    const newVehicle = new this.maintenanceModel(maintenanceDto);
    await newVehicle.save();

    return newVehicle;
  }

  async findAll(page: number = 1, sort: number = 1, filter: object = {}) {
    const limit = 10;
    const count = await this.maintenanceModel.find(filter).count();
    const lastPage = Math.ceil(count / limit);
    page = Math.ceil(count / limit) >= page ? page : 1;
    let toSort = {};
    toSort['firstName'] = sort == 1 ? 1 : -1;
    const aux = await this.maintenanceModel
      .find(filter)
      .populate('vehicle_id', 'model')
      .populate('technician_id', 'firstName lastName')
      .sort(toSort)
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

    const checkIfMaintenanceExists = await this.maintenanceModel
      .findOne({ _id: id })
      .populate('vehicle_id', 'model')
      .populate('technician_id', 'firstName lastName');

    if (!checkIfMaintenanceExists) throw new NotFoundException();

    return checkIfMaintenanceExists;
  }

  async getMaintenanceStatus() {
    const statusList = Object.values(StatusMaintenance)
      .filter(
        (status) =>
          status != StatusMaintenance[StatusMaintenance.CANCELLED] &&
          !isNumber(status),
      )
      .map((status) => status);
    console.log(statusList);
    return statusList;
  }

  async update(id: string, maintenanceUpdateDto: MaintenanceUpdateDto) {
    const checkIfMaintenanceExists = await this.maintenanceModel
      .findOne({
        _id: id,
        status: { $nin: [StatusMaintenance[StatusMaintenance.CANCELLED]] },
      })
      .exec();

    if (!checkIfMaintenanceExists) throw new NotFoundException();

    const updatedDocument = await checkIfMaintenanceExists
      .updateOne(maintenanceUpdateDto)
      .exec();
    await checkIfMaintenanceExists.save();

    return await this.maintenanceModel.findOne({ _id: id });
  }

  async changeStatus(id: string, status: string) {
    const checkIfMaintenanceExists = await this.maintenanceModel
      .findOne({
        _id: id,
        status: { $nin: [StatusMaintenance[StatusMaintenance.CANCELLED]] },
      })
      .exec();

    if (!checkIfMaintenanceExists) throw new NotFoundException();

    if (
      (checkIfMaintenanceExists.status !=
        StatusMaintenance[StatusMaintenance.OPEN] &&
        status == StatusMaintenance[StatusMaintenance.OPEN]) ||
      !Object.values(StatusMaintenance).includes(status)
    )
      throw new BadRequestException('Status cannot be change.');

    checkIfMaintenanceExists.status = status;
    checkIfMaintenanceExists.save();
    return;
  }

  async remove(id: string) {
    //TODO only admin and manager
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfMaintenanceExists = await this.maintenanceModel
      .findOne({
        _id: id,
        status: { $nin: [StatusMaintenance[StatusMaintenance.CANCELLED]] },
      })
      .exec();

    if (!checkIfMaintenanceExists) throw new NotFoundException();

    checkIfMaintenanceExists.status =
      StatusMaintenance[StatusMaintenance.CANCELLED];
    checkIfMaintenanceExists.obs = checkIfMaintenanceExists.obs
      ? checkIfMaintenanceExists.obs + '\n###CANCELLED###'
      : '###CANCELLED###';

    checkIfMaintenanceExists.save();
    return;
  }
}
