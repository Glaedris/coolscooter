import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/config/jwtSettings';
import { Auth, AuthDocument, Type } from 'src/Schemas/auth/auth.schema';
import {
  Employee,
  EmployeeDocument,
} from 'src/Schemas/employee/employee.schema';
import { getHashPassword, isObjectId } from 'src/utils/generic';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
  ) {
    const admin = {
      email: 'admin@admin.com',
      password: 'adminxpto123',
      firstName: 'Admin',
      lastName: 'Admin',
      role: Role[Role.ADMIN],
    };
    const getAdmin = this.authModel
      .findOne({ username: admin.email })
      .then(async (user) => {
        if (!user) {
          const employee = await new this.employeeModel({
            firstName: admin.firstName,
            lastName: admin.lastName,
            status: true,
            email: admin.email,
          }).save();
          new this.authModel({
            username: admin.email,
            password: await getHashPassword(admin.password),
            identity_id: employee._id,
            type: Type[Type.EMPLOYEE],
            role: Role[Role.ADMIN],
          }).save();
        }
      });
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { firstName, lastName, email, password, birthday, role } =
      createEmployeeDto;
    const checkIfEmployeeExists = await this.employeeModel
      .findOne({ email })
      .exec();
    const checkIfAuthExists = await this.authModel
      .findOne({ username: email })
      .exec();
    if (checkIfEmployeeExists || checkIfAuthExists)
      throw new ConflictException('Email already exists.');

    if (!Object.values(Role).includes(role)) throw new BadRequestException();

    const newUser = await new this.employeeModel({
      firstName,
      lastName,
      email,
      birthday,
    }).save();
    const newAuth = await new this.authModel({
      username: email,
      password: await getHashPassword(password),
      identity_id: newUser._id,
      type: Type[Type.EMPLOYEE],
      role: role.toUpperCase(),
    }).save();
    return newUser;
  }

  async findAll(page: number = 1, sort: number = 1, filter: object = {}) {
    const limit = 10;
    const count = await this.employeeModel.find(filter).count();
    const lastPage = Math.ceil(count / limit);
    page = Math.ceil(count / limit) >= page ? page : 1;
    let toSort = {};
    toSort['firstName'] = sort == 1 ? 1 : -1;
    const aux = await this.employeeModel
      .find(filter, { _id: true, firstName: true, lastName: true, email: true })
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

    const checkIfEmployeeExists = await this.employeeModel
      .findOne({ _id: id })
      .exec();

    if (!checkIfEmployeeExists) throw new NotFoundException();

    return checkIfEmployeeExists;
  }

  async findMe(id: string) {
    const checkIfEmployeeExists = await this.employeeModel.findOne({ _id: id });

    if (!checkIfEmployeeExists) throw new NotFoundException();

    return checkIfEmployeeExists;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if (!isObjectId(id)) throw new BadRequestException();

    const { firstName, lastName, birthday, role } = updateEmployeeDto;

    let checkIfEmployeeExists = await this.employeeModel
      .findOne({ _id: id })
      .exec();

    if (!checkIfEmployeeExists) throw new NotFoundException();

    await checkIfEmployeeExists.updateOne(updateEmployeeDto).exec();

    const employeeUpdated = await this.employeeModel.findOne({ _id: id });
    const authUpdated = await this.authModel.findOne({ identity_id: id });

    return employeeUpdated;
  }

  async remove(id: string) {
    if (!isObjectId(id)) throw new BadRequestException();

    const checkIfEmployeeExists = await this.employeeModel
      .findOne({ _id: id })
      .exec();

    if (!checkIfEmployeeExists) throw new NotFoundException();

    //TODO check if employee in use
    const check = false;

    if (!check) {
      checkIfEmployeeExists.delete();
      await (
        await this.authModel.findOne({ identity_id: checkIfEmployeeExists._id })
      ).delete();
    }
    return;
  }
}
