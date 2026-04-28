import { LocalDate } from '../../shared/LocalDate.js';

export class Employee {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dateOfBirth: LocalDate,
    public readonly email: string
  ) {}
}
