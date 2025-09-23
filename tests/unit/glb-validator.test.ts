import { describe, it, expect } from 'vitest';
import { GLBValidator } from '../../src/validators/glb-validator';

describe('GLBValidator', () => {
  describe('parseGLB', () => {
    const createGLBHeader = (magic: number, version: number, length: number): Uint8Array => {
      const header = new ArrayBuffer(12);
      const view = new DataView(header);
      view.setUint32(0, magic, true);
      view.setUint32(4, version, true);
      view.setUint32(8, length, true);
      return new Uint8Array(header);
    };

    const createGLBChunk = (length: number, type: string, data: Uint8Array): Uint8Array => {
      const header = new ArrayBuffer(8);
      const view = new DataView(header);
      view.setUint32(0, length, true);
      const typeBytes = new TextEncoder().encode(type);
      new Uint8Array(header, 4, 4).set(typeBytes);

      const chunk = new Uint8Array(8 + data.length);
      chunk.set(new Uint8Array(header), 0);
      chunk.set(data, 8);
      return chunk;
    };

    const createValidGLB = (): Uint8Array => {
      const gltfJson = JSON.stringify({
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: []
      });
      const jsonData = new TextEncoder().encode(gltfJson);

      // Pad to 4-byte boundary
      const paddedLength = Math.ceil(jsonData.length / 4) * 4;
      const paddedJsonData = new Uint8Array(paddedLength);
      paddedJsonData.set(jsonData);
      // Fill padding with spaces (0x20)
      for (let i = jsonData.length; i < paddedLength; i++) {
        paddedJsonData[i] = 0x20;
      }

      const jsonChunk = createGLBChunk(paddedLength, 'JSON', paddedJsonData);
      const totalLength = 12 + jsonChunk.length;
      const header = createGLBHeader(0x46546C67, 2, totalLength);

      const glb = new Uint8Array(totalLength);
      glb.set(header, 0);
      glb.set(jsonChunk, 12);

      return glb;
    };

    it('should parse valid GLB', async () => {
      const glb = createValidGLB();

      const result = await GLBValidator.parseGLB(glb);

      expect(result).toBeDefined();
      expect(result.gltf).toBeDefined();
      expect(result.gltf.asset.version).toBe('2.0');
      expect(result.resources).toBeDefined();
    });

    it('should throw error for empty data', async () => {
      const emptyData = new Uint8Array(0);

      await expect(GLBValidator.parseGLB(emptyData))
        .rejects.toThrow('GLB_UNEXPECTED_END_OF_HEADER:Unexpected end of header.:1');
    });

    it('should throw error for too short data', async () => {
      const shortData = new Uint8Array(8); // Less than 12 bytes

      await expect(GLBValidator.parseGLB(shortData))
        .rejects.toThrow('GLB_UNEXPECTED_END_OF_HEADER:Unexpected end of header.:8');
    });

    it('should throw error for invalid magic', async () => {
      const invalidMagic = createGLBHeader(0x12345678, 2, 100);

      await expect(GLBValidator.parseGLB(invalidMagic))
        .rejects.toThrow('GLB_INVALID_MAGIC:Invalid GLB magic value (305419896).:0');
    });

    it('should throw error for invalid version', async () => {
      const invalidVersion = createGLBHeader(0x46546C67, 1, 100); // Version 1 instead of 2

      await expect(GLBValidator.parseGLB(invalidVersion))
        .rejects.toThrow('GLB_INVALID_VERSION:Invalid GLB version value 1.:4');
    });

    it('should handle length mismatch - too small declared length', async () => {
      const data = new Uint8Array(100);
      data.set(createGLBHeader(0x46546C67, 2, 10), 0); // Declare 10 bytes but have 100

      await expect(GLBValidator.parseGLB(data))
        .rejects.toThrow('GLB_LENGTH_MISMATCH:Declared length (10) does not match GLB length (100).:100');
    });

    it('should handle extra data after GLB', async () => {
      const validGLB = createValidGLB();
      const extraData = new Uint8Array(validGLB.length + 10);
      extraData.set(validGLB, 0);
      // Fill extra bytes
      for (let i = validGLB.length; i < extraData.length; i++) {
        extraData[i] = 0xFF;
      }

      const result = await GLBValidator.parseGLB(extraData);

      expect(result).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.length).toBeGreaterThan(0);
    });

    it('should handle declared length larger than actual data', async () => {
      const header = createGLBHeader(0x46546C67, 2, 1000); // Declare 1000 bytes
      const smallData = new Uint8Array(50);
      smallData.set(header, 0);

      await expect(GLBValidator.parseGLB(smallData))
        .rejects.toThrow();
    });

    it('should parse GLB with JSON chunk', async () => {
      const glb = createValidGLB();

      const result = await GLBValidator.parseGLB(glb);

      expect(result.gltf).toBeDefined();
      expect(result.gltf.asset).toBeDefined();
      expect(result.gltf.scenes).toBeDefined();
    });

    it('should handle GLB with binary chunk', async () => {
      const gltfJson = JSON.stringify({
        asset: { version: '2.0' },
        buffers: [{ byteLength: 4 }],
        bufferViews: [{ buffer: 0, byteLength: 4 }]
      });
      const jsonData = new TextEncoder().encode(gltfJson);
      const paddedJsonLength = Math.ceil(jsonData.length / 4) * 4;
      const paddedJsonData = new Uint8Array(paddedJsonLength);
      paddedJsonData.set(jsonData);
      for (let i = jsonData.length; i < paddedJsonLength; i++) {
        paddedJsonData[i] = 0x20;
      }

      const binaryData = new Uint8Array(4);
      binaryData.fill(0x42); // Fill with 'B'

      const jsonChunk = createGLBChunk(paddedJsonLength, 'JSON', paddedJsonData);
      const binChunk = createGLBChunk(4, 'BIN\0', binaryData);

      const totalLength = 12 + jsonChunk.length + binChunk.length;
      const header = createGLBHeader(0x46546C67, 2, totalLength);

      const glb = new Uint8Array(totalLength);
      glb.set(header, 0);
      glb.set(jsonChunk, 12);
      glb.set(binChunk, 12 + jsonChunk.length);

      const result = await GLBValidator.parseGLB(glb);

      expect(result).toBeDefined();
      expect(result.gltf.buffers).toBeDefined();
      expect(result.resources).toBeDefined();
    });

    it('should handle invalid JSON chunk', async () => {
      const invalidJson = '{ invalid json }';
      const jsonData = new TextEncoder().encode(invalidJson);
      const paddedLength = Math.ceil(jsonData.length / 4) * 4;
      const paddedJsonData = new Uint8Array(paddedLength);
      paddedJsonData.set(jsonData);

      const jsonChunk = createGLBChunk(paddedLength, 'JSON', paddedJsonData);
      const totalLength = 12 + jsonChunk.length;
      const header = createGLBHeader(0x46546C67, 2, totalLength);

      const glb = new Uint8Array(totalLength);
      glb.set(header, 0);
      glb.set(jsonChunk, 12);

      await expect(GLBValidator.parseGLB(glb))
        .rejects.toThrow();
    });

    it('should handle missing JSON chunk', async () => {
      const header = createGLBHeader(0x46546C67, 2, 12);

      await expect(GLBValidator.parseGLB(header))
        .rejects.toThrow();
    });

    it('should handle chunk length mismatch', async () => {
      const gltfJson = JSON.stringify({ asset: { version: '2.0' } });
      const jsonData = new TextEncoder().encode(gltfJson);

      // Create chunk with wrong length declared
      const wrongLength = jsonData.length + 10;
      const jsonChunk = createGLBChunk(wrongLength, 'JSON', jsonData);
      const totalLength = 12 + jsonChunk.length;
      const header = createGLBHeader(0x46546C67, 2, totalLength);

      const glb = new Uint8Array(totalLength);
      glb.set(header, 0);
      glb.set(jsonChunk, 12);

      await expect(GLBValidator.parseGLB(glb))
        .rejects.toThrow();
    });

    it('should handle unknown chunk types', async () => {
      const gltfJson = JSON.stringify({ asset: { version: '2.0' } });
      const jsonData = new TextEncoder().encode(gltfJson);
      const paddedLength = Math.ceil(jsonData.length / 4) * 4;
      const paddedJsonData = new Uint8Array(paddedLength);
      paddedJsonData.set(jsonData);
      for (let i = jsonData.length; i < paddedLength; i++) {
        paddedJsonData[i] = 0x20;
      }

      const unknownData = new Uint8Array(8);
      unknownData.fill(0x55);

      const jsonChunk = createGLBChunk(paddedLength, 'JSON', paddedJsonData);
      const unknownChunk = createGLBChunk(8, 'UNKN', unknownData);

      const totalLength = 12 + jsonChunk.length + unknownChunk.length;
      const header = createGLBHeader(0x46546C67, 2, totalLength);

      const glb = new Uint8Array(totalLength);
      glb.set(header, 0);
      glb.set(jsonChunk, 12);
      glb.set(unknownChunk, 12 + jsonChunk.length);

      // Should parse successfully but include warnings about unknown chunks
      const result = await GLBValidator.parseGLB(glb);

      expect(result).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.includes('GLB_UNKNOWN_CHUNK_TYPE'))).toBe(true);
    });
  });
});