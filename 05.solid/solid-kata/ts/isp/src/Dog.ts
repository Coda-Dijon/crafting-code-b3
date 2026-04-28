import { Animal } from './Animal.js';

export class Dog implements Animal {
  fly(): void {}

  run(): void {
    process.stdout.write('Dog is running');
  }

  bark(): void {
    process.stdout.write('Dog is barking');
  }
}
