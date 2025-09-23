import { describe, it, expect } from 'vitest';
import { GLTFParser } from '../../src/parser';

describe('GLTFParser', () => {
  let parser: GLTFParser;

  beforeEach(() => {
    parser = new GLTFParser();
  });

  describe('parse', () => {
    it('should parse valid GLTF JSON', () => {
      const validGltf = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: []
      };
      const data = new TextEncoder().encode(JSON.stringify(validGltf));

      const result = parser.parse(data);

      expect(result).toBeDefined();
      expect(result.asset).toEqual(validGltf.asset);
      expect(result.scene).toBe(0);
      expect(result.scenes).toEqual(validGltf.scenes);
      expect(result.nodes).toEqual(validGltf.nodes);
    });

    it('should normalize missing arrays to empty arrays', () => {
      const minimalGltf = {
        asset: { version: '2.0' }
      };
      const data = new TextEncoder().encode(JSON.stringify(minimalGltf));

      const result = parser.parse(data);

      expect(result.scenes).toEqual([]);
      expect(result.nodes).toEqual([]);
      expect(result.materials).toEqual([]);
      expect(result.accessors).toEqual([]);
      expect(result.animations).toEqual([]);
      expect(result.buffers).toEqual([]);
      expect(result.bufferViews).toEqual([]);
      expect(result.cameras).toEqual([]);
      expect(result.images).toEqual([]);
      expect(result.meshes).toEqual([]);
      expect(result.samplers).toEqual([]);
    });

    it('should throw error when BOM is present', () => {
      const gltfJson = JSON.stringify({ asset: { version: '2.0' } });
      const bomData = new Uint8Array([0xEF, 0xBB, 0xBF, ...new TextEncoder().encode(gltfJson)]);

      expect(() => parser.parse(bomData)).toThrow('BOM found at the beginning of UTF-8 stream');
    });

    it('should throw error for invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      const data = new TextEncoder().encode(invalidJson);

      expect(() => parser.parse(data)).toThrow('Failed to parse GLTF JSON');
    });

    it('should throw error for non-object JSON (array)', () => {
      const arrayJson = JSON.stringify([1, 2, 3]);
      const data = new TextEncoder().encode(arrayJson);

      expect(() => parser.parse(data)).toThrow('Type mismatch. Property value [] is not a \'object\'');
    });

    it('should throw error for non-object JSON (string)', () => {
      const stringJson = JSON.stringify('hello');
      const data = new TextEncoder().encode(stringJson);

      expect(() => parser.parse(data)).toThrow('Type mismatch. Property value string is not a \'object\'');
    });

    it('should throw error for non-object JSON (number)', () => {
      const numberJson = JSON.stringify(42);
      const data = new TextEncoder().encode(numberJson);

      expect(() => parser.parse(data)).toThrow('Type mismatch. Property value number is not a \'object\'');
    });

    it('should throw error for non-object JSON (null)', () => {
      const nullJson = JSON.stringify(null);
      const data = new TextEncoder().encode(nullJson);

      expect(() => parser.parse(data)).toThrow('Type mismatch. Property value object is not a \'object\'');
    });

    it('should handle empty data', () => {
      const emptyData = new Uint8Array(0);

      expect(() => parser.parse(emptyData)).toThrow('Failed to parse GLTF JSON');
    });

    it('should handle partial BOM (less than 3 bytes)', () => {
      const partialBom = new Uint8Array([0xEF, 0xBB]);

      expect(() => parser.parse(partialBom)).toThrow('Failed to parse GLTF JSON');
    });

    it('should handle data that starts with BOM-like bytes but is longer', () => {
      const gltfJson = JSON.stringify({ asset: { version: '2.0' } });
      const data = new Uint8Array([0xEF, 0xBB, 0xBF, ...new TextEncoder().encode(gltfJson)]);

      expect(() => parser.parse(data)).toThrow('BOM found at the beginning of UTF-8 stream');
    });

    it('should preserve existing arrays when present', () => {
      const gltfWithArrays = {
        asset: { version: '2.0' },
        scenes: [{ nodes: [0] }],
        nodes: [{ mesh: 0 }],
        materials: [{ name: 'mat1' }],
        accessors: [{ componentType: 5126 }],
        animations: [{ name: 'anim1' }],
        buffers: [{ byteLength: 100 }],
        bufferViews: [{ buffer: 0 }],
        cameras: [{ type: 'perspective' }],
        images: [{ uri: 'test.png' }],
        meshes: [{ primitives: [] }],
        samplers: [{ magFilter: 9729 }]
      };
      const data = new TextEncoder().encode(JSON.stringify(gltfWithArrays));

      const result = parser.parse(data);

      expect(result.scenes).toEqual(gltfWithArrays.scenes);
      expect(result.nodes).toEqual(gltfWithArrays.nodes);
      expect(result.materials).toEqual(gltfWithArrays.materials);
      expect(result.accessors).toEqual(gltfWithArrays.accessors);
      expect(result.animations).toEqual(gltfWithArrays.animations);
      expect(result.buffers).toEqual(gltfWithArrays.buffers);
      expect(result.bufferViews).toEqual(gltfWithArrays.bufferViews);
      expect(result.cameras).toEqual(gltfWithArrays.cameras);
      expect(result.images).toEqual(gltfWithArrays.images);
      expect(result.meshes).toEqual(gltfWithArrays.meshes);
      expect(result.samplers).toEqual(gltfWithArrays.samplers);
    });

    it('should handle complex nested structures', () => {
      const complexGltf = {
        asset: {
          version: '2.0',
          generator: 'test-generator',
          copyright: 'test-copyright'
        },
        scene: 0,
        scenes: [
          {
            nodes: [0, 1],
            name: 'Scene'
          }
        ],
        nodes: [
          {
            mesh: 0,
            translation: [1, 2, 3],
            rotation: [0, 0, 0, 1],
            scale: [1, 1, 1]
          },
          {
            children: [0]
          }
        ],
        extensionsUsed: ['KHR_materials_pbr'],
        extensionsRequired: ['KHR_materials_pbr'],
        extensions: {
          customExtension: { value: 42 }
        },
        extras: {
          customData: 'test'
        }
      };
      const data = new TextEncoder().encode(JSON.stringify(complexGltf));

      const result = parser.parse(data);

      expect(result.asset).toEqual(complexGltf.asset);
      expect(result.scene).toBe(complexGltf.scene);
      expect(result.scenes).toEqual(complexGltf.scenes);
      expect(result.nodes).toEqual(complexGltf.nodes);
      expect(result.extensionsUsed).toEqual(complexGltf.extensionsUsed);
      expect(result.extensionsRequired).toEqual(complexGltf.extensionsRequired);
      expect(result.extensions).toEqual(complexGltf.extensions);
      expect(result.extras).toEqual(complexGltf.extras);
    });
  });
});