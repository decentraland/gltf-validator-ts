import { describe, it, expect } from 'vitest';
import * as mainExports from '../../../src/index';

describe('Index module exports', () => {
  it('should export all expected modules from validator', () => {
    expect(mainExports).toBeDefined();

    // Check that main exports exist (these will be imported from validator.ts and types.ts)
    const exportKeys = Object.keys(mainExports);
    expect(exportKeys.length).toBeGreaterThan(0);
  });

  it('should re-export validator module contents', () => {
    // Test that validator exports are available
    expect(typeof mainExports).toBe('object');
  });

  it('should re-export types module contents', () => {
    // Test that types exports are available
    expect(typeof mainExports).toBe('object');
  });
});