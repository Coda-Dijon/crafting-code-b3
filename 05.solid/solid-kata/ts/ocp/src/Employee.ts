import { EmployeeType } from './EmployeeType.js';

export class Employee {
  constructor(
    private readonly salary: number,
    private readonly bonus: number,
    private readonly type: EmployeeType
  ) {}

  payAmount(): number {
    switch (this.type) {
      case EmployeeType.ENGINEER:
        return this.salary;
      case EmployeeType.MANAGER:
        return this.salary + this.bonus;
      default:
        return 0;
    }
  }
}
