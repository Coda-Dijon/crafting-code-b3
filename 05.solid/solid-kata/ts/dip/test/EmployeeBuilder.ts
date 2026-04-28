import { LocalDate } from '../../shared/LocalDate.js';
import { Employee } from '../src/Employee.js';

export class EmployeeBuilder {
  private firstName = 'John';
  private lastName = 'Doe';
  private dateOfBirth = LocalDate.of(1980, 9, 10);
  private email = 'john.doe@foobar.com';

  static anEmployee(): EmployeeBuilder {
    return new EmployeeBuilder();
  }

  withEmail(email: string): EmployeeBuilder {
    this.email = email;
    return this;
  }

  withFirstName(firstName: string): EmployeeBuilder {
    this.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): EmployeeBuilder {
    this.lastName = lastName;
    return this;
  }

  withDateOfBirth(dateOfBirth: LocalDate): EmployeeBuilder {
    this.dateOfBirth = dateOfBirth;
    return this;
  }

  build(): Employee {
    return new Employee(this.firstName, this.lastName, this.dateOfBirth, this.email);
  }
}
