import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Bird } from '../src/Bird.js';

describe('Bird', () => {
  const bird = new Bird();
  let writeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs', () => {
    bird.run();
    expect(writeSpy).toHaveBeenCalledWith('Bird is running');
  });

  it('flies', () => {
    bird.fly();
    expect(writeSpy).toHaveBeenCalledWith('Bird is flying');
  });
});
