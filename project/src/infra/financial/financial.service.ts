import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Balance, TypeBalance } from 'src/Schemas/financial/balance.schema';
import { CreditCard } from 'src/Schemas/financial/PaymentMethods/card.schema';
import { MbWay } from 'src/Schemas/financial/PaymentMethods/mbway.schema';
import { Wallet, WalletDocument } from 'src/Schemas/financial/wallet.schema';
import { User, UserDocument } from 'src/Schemas/users/user.schema';
import { isObjectId } from 'src/utils/generic';
import { CreateCreditDto } from './dto/create-credit.dto';
import {
  CreatePaymentMethodCardDto,
  CreatePaymentMethodMbWayDto,
} from './dto/create-payment-method.dto';

@Injectable()
export class FinancialService {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createPaymentMethodMbWay(
    createPaymentMethodMbWay: CreatePaymentMethodMbWayDto,
    id: string,
  ) {
    if (!isObjectId(id)) throw new BadRequestException();
    const user = await this.userModel
      .findOne({ _id: id })
      .populate('wallet')
      .exec();

    if (!user) throw new NotFoundException();
    const wallet = await this.walletModel.findOne({ _id: user.wallet }).exec();
    if (!wallet) throw new NotFoundException();

    const mbway = new MbWay();
    mbway.mbway_number = createPaymentMethodMbWay.mbway_number;
    wallet.payment_methods.push(mbway);
    wallet.save();

    return;
  }

  async createPaymentMethodCard(
    createPaymentMethodCard: CreatePaymentMethodCardDto,
    id: string,
  ) {
    if (!isObjectId(id)) throw new BadRequestException();
    const user = await this.userModel
      .findOne({ _id: id })
      .populate('wallet')
      .exec();

    if (!user) throw new NotFoundException();
    const wallet = await this.walletModel.findOne({ _id: user.wallet }).exec();
    if (!wallet) throw new NotFoundException();

    const creditCard = new CreditCard();
    creditCard.card_name = createPaymentMethodCard.card_name;
    creditCard.card_number = createPaymentMethodCard.card_number;
    creditCard.card_expiration_date =
      createPaymentMethodCard.card_expiration_date;
    creditCard.card_cvc = createPaymentMethodCard.card_cvc;
    wallet.payment_methods.push(creditCard);
    wallet.save();

    return;
  }

  async removePaymentMethod(user_id: string, paymentMethod_id: string) {
    if (!isObjectId(user_id) || !isObjectId(paymentMethod_id))
      throw new BadRequestException();

    const user = await this.userModel.findOne({ _id: user_id });
    const delPaymentMethod = await this.walletModel
      .updateOne(
        {
          $and: [
            { _id: user.wallet },
            { 'payment_methods._id': new Types.ObjectId(paymentMethod_id) },
          ],
        },
        {
          $pull: {
            payment_methods: {
              $and: [{ _id: new Types.ObjectId(paymentMethod_id) }],
            },
          },
        },
        { safe: true, multi: true },
      )
      .exec();

    if (delPaymentMethod.matchedCount == 0) throw new NotFoundException();
    if (delPaymentMethod.modifiedCount != 1)
      throw new InternalServerErrorException();

    return;
  }

  async newCredit(user_id, data: CreateCreditDto) {
    if (!isObjectId(user_id) || !isObjectId(data.method_id))
      throw new BadRequestException();

    const user = await this.userModel.findOne({ _id: user_id });
    if (!user) throw new NotFoundException();

    const wallet = await this.walletModel.findOne({
      $and: [
        { _id: user.wallet },
        { 'payment_methods._id': new Types.ObjectId(data.method_id) },
      ],
    });
    if (!wallet) throw new NotFoundException();

    const newBalance = new Balance();
    newBalance.value = data.value;
    newBalance.method_type = data.method_id;

    wallet.current_balance = wallet.current_balance + data.value;
    wallet.balance.push(newBalance);
    wallet.save();

    return;
  }
}
