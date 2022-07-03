import { Wallet, WalletSchema } from 'src/Schemas/financial/wallet.schema';
import { User, UserSchema } from 'src/Schemas/users/user.schema';

export const schemaProviders = [
  { name: Wallet.name, schema: WalletSchema },
  { name: User.name, schema: UserSchema },
];
