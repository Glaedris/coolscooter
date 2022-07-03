import { Auth, AuthSchema } from 'src/Schemas/auth/auth.schema';
import { Wallet, WalletSchema } from 'src/Schemas/financial/wallet.schema';
import { User, UserSchema } from 'src/Schemas/users/user.schema';

export const schemaProviders = [
  { name: User.name, schema: UserSchema },
  { name: Auth.name, schema: AuthSchema },
  { name: Wallet.name, schema: WalletSchema },
];
