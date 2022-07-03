import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaProviders } from './schemas.providers';

@Module({
  imports: [MongooseModule.forFeature(schemaProviders)],
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinancialModule {}
