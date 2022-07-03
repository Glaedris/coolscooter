import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infra/auth/auth.module';
import config from './config/environmentConfig';
import { UsersModule } from './infra/users/users.module';
import { EmployeesModule } from './infra/employees/employees.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesModule } from './infra/vehicles/vehicles.module';
import { AdministrationModule } from './infra/administration/administration.module';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './infra/schedule/schedule.module';
import { TripModule } from './infra/trip/trip.module';
import { FinancialModule } from './infra/financial/financial.module';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PassportModule,
    EmployeesModule,
    VehiclesModule,
    AdministrationModule,
    CronModule,
    TripModule,
    FinancialModule,
  ],
  providers: [],
})
export class AppModule {}
