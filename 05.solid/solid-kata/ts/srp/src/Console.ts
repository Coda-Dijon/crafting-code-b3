export class Console {
  printLine(line: string): void {
    process.stdout.write(line + '\n');
  }
}
