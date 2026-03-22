import { describe, expect, it } from 'vitest';
import { clamp, echoAfterMs } from './helpers';

describe('clamp', () => {
  it('returns value inside range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps below minimum', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('clamps above maximum', () => {
    expect(clamp(100, 0, 10)).toBe(10);
  });
});

describe('echoAfterMs', () => {
  it('resolves with the same string', async () => {
    await expect(echoAfterMs('ping', 10)).resolves.toBe('ping');
  });
});
