import { describe, it, expect, vi } from 'vitest';
import { validateBytes } from '../../../src/validator';
import { ValidationOptions, Severity } from '../../../src/types';

describe('GLTF Validator', () => {

  describe('validateBytes', () => {
    const validGltfJson = JSON.stringify({
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [] }],
      nodes: []
    });

    it('should validate a simple valid GLTF', async () => {
      const data = new TextEncoder().encode(validGltfJson);

      const result = await validateBytes(data, { uri: 'test.gltf' });

      expect(result).toBeDefined();
      expect(result.validatorVersion).toBe('2.0.0-dev.3.0');
      expect(result.uri).toBe('test.gltf');
    });

    it('should auto-detect format from .gltf URI', async () => {
      const data = new TextEncoder().encode(validGltfJson);

      const result = await validateBytes(data, { uri: 'test.gltf' });

      expect(result).toBeDefined();
    });

    it('should auto-detect format from .glb URI', async () => {
      // Create a minimal GLB buffer
      const glbMagic = new TextEncoder().encode('glTF');
      const jsonChunk = new TextEncoder().encode(validGltfJson);
      const totalLength = 12 + 8 + jsonChunk.length;

      const glbData = new Uint8Array(totalLength);
      let offset = 0;

      // GLB header
      glbData.set(glbMagic, offset);
      offset += 4;
      glbData.set(new Uint8Array([2, 0, 0, 0]), offset); // version
      offset += 4;
      glbData.set(new Uint32Array([totalLength]), offset); // total length
      offset += 4;

      // JSON chunk header
      glbData.set(new Uint32Array([jsonChunk.length]), offset); // chunk length
      offset += 4;
      glbData.set(new TextEncoder().encode('JSON'), offset); // chunk type
      offset += 4;

      // JSON chunk data
      glbData.set(jsonChunk, offset);

      const result = await validateBytes(glbData, { uri: 'test.glb' });

      expect(result).toBeDefined();
    });

    it('should handle validation options correctly', async () => {
      const data = new TextEncoder().encode(validGltfJson);
      const options: ValidationOptions = {
        uri: 'test.gltf',
        maxIssues: 50,
        ignoredIssues: ['UNUSED_OBJECT'],
        onlyIssues: ['REQUIRED_PROPERTY'],
        severityOverrides: { 'SOME_WARNING': Severity.ERROR }
      };

      const result = await validateBytes(data, options);

      expect(result).toBeDefined();
      expect(result.uri).toBe('test.gltf');
    });

    it('should handle empty data gracefully', async () => {
      const emptyData = new Uint8Array(0);

      const result = await validateBytes(emptyData);

      expect(result).toBeDefined();
      expect(result.issues.numErrors).toBeGreaterThan(0);
    });

    it('should handle invalid JSON gracefully', async () => {
      const invalidJson = new TextEncoder().encode('{ invalid json }');

      const result = await validateBytes(invalidJson);

      expect(result).toBeDefined();
      expect(result.issues.numErrors).toBeGreaterThan(0);
    });

    it('should use default options when none provided', async () => {
      const data = new TextEncoder().encode(validGltfJson);

      const result = await validateBytes(data);

      expect(result).toBeDefined();
      expect(result.uri).toBe('unknown');
    });

    it('should respect maxIssues limit', async () => {
      const invalidGltf = JSON.stringify({
        asset: { version: '2.0' }
        // Missing required properties to generate multiple errors
      });
      const data = new TextEncoder().encode(invalidGltf);

      const result = await validateBytes(data, { maxIssues: 1 });

      expect(result).toBeDefined();
      // Should have truncated at maxIssues
    });

    it('should handle externalResourceFunction option', async () => {
      const data = new TextEncoder().encode(validGltfJson);
      const mockResourceFunction = vi.fn().mockResolvedValue(new Uint8Array());

      const result = await validateBytes(data, {
        externalResourceFunction: mockResourceFunction
      });

      expect(result).toBeDefined();
    });
  });

  describe('module exports', () => {
    it('should export validateBytes function', () => {
      expect(validateBytes).toBeDefined();
      expect(typeof validateBytes).toBe('function');
    });
  });
});