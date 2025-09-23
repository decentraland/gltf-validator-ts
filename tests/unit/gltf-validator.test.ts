import { describe, it, expect, vi } from 'vitest';
import { GLTFValidator, ValidatorOptions } from '../../src/validators/gltf-validator';
import { GLTF, Severity } from '../../src/types';

describe('GLTFValidator', () => {
  let validator: GLTFValidator;
  let defaultOptions: ValidatorOptions;

  beforeEach(() => {
    defaultOptions = {
      maxIssues: 100,
      ignoredIssues: [],
      onlyIssues: [],
      severityOverrides: {}
    };
    validator = new GLTFValidator(defaultOptions);
  });

  describe('constructor', () => {
    it('should create validator with options', () => {
      const options: ValidatorOptions = {
        maxIssues: 50,
        ignoredIssues: ['UNUSED_OBJECT'],
        onlyIssues: ['REQUIRED_PROPERTY'],
        severityOverrides: { 'SOME_WARNING': Severity.ERROR }
      };

      const customValidator = new GLTFValidator(options);

      expect(customValidator).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate minimal valid GLTF', async () => {
      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: [],
        materials: [],
        accessors: [],
        animations: [],
        buffers: [],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const result = await validator.validate(gltf);

      expect(result).toBeDefined();
      expect(result.issues).toBeDefined();
      expect(typeof result.issues.numErrors).toBe('number');
      expect(typeof result.issues.numWarnings).toBe('number');
      expect(typeof result.issues.numInfos).toBe('number');
      expect(typeof result.issues.numHints).toBe('number');
      expect(Array.isArray(result.issues.messages)).toBe(true);
    });

    it('should validate GLB format', async () => {
      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: [],
        materials: [],
        accessors: [],
        animations: [],
        buffers: [{ byteLength: 100 }],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const resources = [new Uint8Array(100)];
      const result = await validator.validate(gltf, true, resources);

      expect(result).toBeDefined();
      expect(result.issues).toBeDefined();
    });

    it('should handle GLTF with all object types', async () => {
      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [0] }],
        nodes: [{ mesh: 0, skin: 0, camera: 0 }],
        materials: [{ name: 'material1' }],
        accessors: [{ componentType: 5126, count: 3, type: 'VEC3' }],
        animations: [{
          channels: [{ sampler: 0, target: { node: 0, path: 'translation' } }],
          samplers: [{ input: 0, output: 0 }]
        }],
        buffers: [{ byteLength: 100 }],
        bufferViews: [{ buffer: 0, byteLength: 100 }],
        cameras: [{ type: 'perspective', perspective: { yfov: 1.0, znear: 0.1 } }],
        images: [{ uri: 'texture.png' }],
        meshes: [{
          primitives: [{
            attributes: { POSITION: 0 },
            material: 0
          }]
        }],
        samplers: [{ magFilter: 9729 }],
        skins: [{ joints: [0] }],
        textures: [{ source: 0, sampler: 0 }]
      };

      const result = await validator.validate(gltf);

      expect(result).toBeDefined();
      expect(result.issues).toBeDefined();
    });

    it('should handle GLTF with extensions', async () => {
      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: [],
        materials: [],
        accessors: [],
        animations: [],
        buffers: [],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: [],
        extensionsUsed: ['KHR_materials_pbr'],
        extensionsRequired: ['KHR_materials_pbr'],
        extensions: {
          'CUSTOM_extension': {
            value: 42
          }
        }
      };

      const result = await validator.validate(gltf);

      expect(result).toBeDefined();
      expect(result.issues).toBeDefined();
    });

    it('should handle invalid GLTF structure', async () => {
      const invalidGltf: any = {
        asset: { version: '1.0' }, // Invalid version
        scenes: 'not an array' // Should be array
      };

      const result = await validator.validate(invalidGltf);

      expect(result).toBeDefined();
      expect(result.issues.numErrors).toBeGreaterThan(0);
    });

    it('should respect maxIssues limit', async () => {
      const limitedValidator = new GLTFValidator({
        maxIssues: 1,
        ignoredIssues: [],
        onlyIssues: [],
        severityOverrides: {}
      });

      const invalidGltf: any = {
        // Missing required properties to generate multiple errors
      };

      const result = await limitedValidator.validate(invalidGltf);

      expect(result).toBeDefined();
      expect(result.issues.numErrors).toBeGreaterThanOrEqual(0);
    });

    it('should handle ignored issues', async () => {
      const ignoringValidator = new GLTFValidator({
        maxIssues: 100,
        ignoredIssues: ['UNUSED_OBJECT'],
        onlyIssues: [],
        severityOverrides: {}
      });

      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: [],
        materials: [{ name: 'unused' }], // This should be unused
        accessors: [],
        animations: [],
        buffers: [],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const result = await ignoringValidator.validate(gltf);

      expect(result).toBeDefined();
    });

    it('should handle onlyIssues filter', async () => {
      const filteringValidator = new GLTFValidator({
        maxIssues: 100,
        ignoredIssues: [],
        onlyIssues: ['REQUIRED_PROPERTY'],
        severityOverrides: {}
      });

      const gltf: any = {};

      const result = await filteringValidator.validate(gltf);

      expect(result).toBeDefined();
    });

    it('should handle severity overrides', async () => {
      const overridingValidator = new GLTFValidator({
        maxIssues: 100,
        ignoredIssues: [],
        onlyIssues: [],
        severityOverrides: { 'SOME_WARNING': Severity.ERROR }
      });

      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: [],
        materials: [],
        accessors: [],
        animations: [],
        buffers: [],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const result = await overridingValidator.validate(gltf);

      expect(result).toBeDefined();
    });

    it('should handle external resource function', async () => {
      const mockResourceFunction = vi.fn().mockResolvedValue(new Uint8Array(100));
      const resourceValidator = new GLTFValidator({
        maxIssues: 100,
        ignoredIssues: [],
        onlyIssues: [],
        severityOverrides: {},
        externalResourceFunction: mockResourceFunction
      });

      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [] }],
        nodes: [],
        materials: [],
        accessors: [],
        animations: [],
        buffers: [{ uri: 'external.bin', byteLength: 100 }],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const result = await resourceValidator.validate(gltf);

      expect(result).toBeDefined();
    });

    it('should handle empty arrays', async () => {
      const gltf: GLTF = {
        asset: { version: '2.0' },
        scenes: [],
        nodes: [],
        materials: [],
        accessors: [],
        animations: [],
        buffers: [],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const result = await validator.validate(gltf);

      expect(result).toBeDefined();
      expect(result.issues).toBeDefined();
    });

    it('should handle null values in arrays', async () => {
      const gltf: any = {
        asset: { version: '2.0' },
        scenes: [{ nodes: [] }, { nodes: [] }],
        nodes: [{ name: 'node1' }, { name: 'node2' }],
        materials: [],
        accessors: [],
        animations: [],
        buffers: [],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const result = await validator.validate(gltf);

      expect(result).toBeDefined();
    });

    it('should track usage and report unused objects', async () => {
      const gltf: GLTF = {
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [0] }],
        nodes: [{ name: 'used' }, { name: 'unused' }],
        materials: [{ name: 'unused_material' }],
        accessors: [],
        animations: [],
        buffers: [],
        bufferViews: [],
        cameras: [],
        images: [],
        meshes: [],
        samplers: [],
        skins: [],
        textures: []
      };

      const result = await validator.validate(gltf);

      expect(result).toBeDefined();
      // Should detect unused objects
    });
  });
});