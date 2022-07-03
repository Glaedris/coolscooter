import { Auth, AuthSchema } from 'src/Schemas/auth/auth.schema';
import { Employee, EmployeeSchema } from 'src/Schemas/employee/employee.schema';

export const schemaProviders = [
  { name: Employee.name, schema: EmployeeSchema },
  { name: Auth.name, schema: AuthSchema },
];
