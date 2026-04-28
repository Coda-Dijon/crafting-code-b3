import { Animal } from './Animal.js';

export class Bird implements Animal {
  bark(): void {}

  run(): void {
    process.stdout.write('Bird is running');
  }

  fly(): void {
    process.stdout.write('Bird is flying');
  }
}
