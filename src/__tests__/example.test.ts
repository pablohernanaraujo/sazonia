import { describe, expect, it } from 'vitest';

// Example utility function
function sum(a: number, b: number): number {
  return a + b;
}

describe('Example Test Suite', () => {
  it('should add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
