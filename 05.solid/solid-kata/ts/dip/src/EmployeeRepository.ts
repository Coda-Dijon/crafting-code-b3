import { MonthDay } from '../../shared/MonthDay.js';
import { Employee } from './Employee.js';

export interface EmployeeRepository {
  findEmployeesBornOn(monthDay: MonthDay): Employee[];
}
