import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { schemaProviders } from './schemas.providers';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature(schemaProviders)],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
