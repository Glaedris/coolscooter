import { AccessLog, AccessLogSchema } from 'src/Schemas/auth/accessLog.schema';
import {
  AccessToken,
  AccessTokenSchema,
} from 'src/Schemas/auth/accessToken.schema';
import { Auth, AuthSchema } from 'src/Schemas/auth/auth.schema';
import {
  ResetPassword,
  ResetPasswordSchema,
} from 'src/Schemas/auth/resetPassword.schema';
import { Employee, EmployeeSchema } from 'src/Schemas/employee/employee.schema';
import { User, UserSchema } from 'src/Schemas/users/user.schema';

export const schemaProviders = [
  { name: Auth.name, schema: AuthSchema },
  { name: User.name, schema: UserSchema },
  { name: Employee.name, schema: EmployeeSchema },
  { name: AccessLog.name, schema: AccessLogSchema },
  { name: AccessToken.name, schema: AccessTokenSchema },
  { name: ResetPassword.name, schema: ResetPasswordSchema },
];
