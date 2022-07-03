import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
} from '@nestjs/common';
import { FinancialService } from './financial.service';
import {
  CreatePaymentMethodMbWayDto,
  CreatePaymentMethodCardDto,
} from './dto/create-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/config/jwtSettings';
import { CreateCreditDto } from './dto/create-credit.dto';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('payment-method/mbway')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  newPaymentMethodMbWay(
    @Body()
    createNewMethod: CreatePaymentMethodMbWayDto,
    @Request() req,
  ) {
    const user = req.user;
    //TODO: ver data que entra de mobile
    return this.financialService.createPaymentMethodMbWay(
      createNewMethod,
      user.identity_id,
    );
  }

  @Post('payment-method/card')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  newPaymentMethodCard(
    @Body()
    createNewMethod: CreatePaymentMethodCardDto,
    @Request() req,
  ) {
    const user = req.user;
    //TODO: ver data que entra de mobile
    return this.financialService.createPaymentMethodCard(
      createNewMethod,
      user.identity_id,
    );
  }

  @Delete('payment-method/:id')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removePaymentMethod(@Param('id') paymentMethodId: string, @Request() req) {
    return this.financialService.removePaymentMethod(
      req.user.identity_id,
      paymentMethodId,
    );
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('balance/credit')
  newCredit(@Body() data: CreateCreditDto, @Request() req) {
    return this.financialService.newCredit(req.user.identity_id, data);
  }

  //from ended trip
  newDebit() {}
}
