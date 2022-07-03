import { Task, TaskSchema } from 'src/Schemas/administration/task.schema';
import { Ticket, TicketSchema } from 'src/Schemas/administration/ticket.schema';
import { Employee, EmployeeSchema } from 'src/Schemas/employee/employee.schema';

export const schemaProviders = [
  { name: Ticket.name, schema: TicketSchema },
  { name: Task.name, schema: TaskSchema },
  { name: Employee.name, schema: EmployeeSchema },
];
