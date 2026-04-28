import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Dog } from '../src/Dog.js';

describe('Dog', () => {
  const dog = new Dog();
  let writeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs', () => {
    dog.run();
    expect(writeSpy).toHaveBeenCalledWith('Dog is running');
  });

  it('barks', () => {
    dog.bark();
    expect(writeSpy).toHaveBeenCalledWith('Dog is barking');
  });
});
