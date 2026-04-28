import { Clock } from './Clock.js';
import { Email } from './Email.js';
import { EmailSender } from './EmailSender.js';
import { Employee } from './Employee.js';
import { EmployeeRepository } from './EmployeeRepository.js';

export class BirthdayGreeter {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly clock: Clock
  ) {}

  sendGreetings(): void {
    const today = this.clock.monthDay();
    this.employeeRepository
      .findEmployeesBornOn(today)
      .map(employee => this.emailFor(employee))
      .forEach(email => new EmailSender().send(email));
  }

  private emailFor(employee: Employee): Email {
    const message = `Happy birthday, dear ${employee.firstName}!`;
    return new Email(employee.email, 'Happy birthday!', message);
  }
}
