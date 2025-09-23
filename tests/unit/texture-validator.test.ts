import { describe, it, expect } from 'vitest';
import { TextureValidator } from '../../src/validators/texture-validator';
import { GLTF, Issues, ValidationOptions } from '../../src/types';

describe('TextureValidator', () => {
  let validator: TextureValidator;
  let mockIssues: Issues;
  let mockOptions: ValidationOptions;

  beforeEach(() => {
    mockIssues = {
      numErrors: 0,
      numWarnings: 0,
      numInfos: 0,
      numHints: 0,
      messages: [],
      truncated: false
    };
    mockOptions = {};
    validator = new TextureValidator();
  });

  describe('validate', () => {
    it('should validate empty textures array', () => {
      const gltf: Partial<GLTF> = {
        textures: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate basic texture', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            source: 0
          }
        ],
        images: [
          { uri: 'texture.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate texture with sampler', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            source: 0,
            sampler: 0
          }
        ],
        images: [
          { uri: 'texture.png' }
        ],
        samplers: [
          {
            magFilter: 9729,
            minFilter: 9987,
            wrapS: 10497,
            wrapT: 10497
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid source reference', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            source: 10 // Invalid reference
          }
        ],
        images: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid sampler reference', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            source: 0,
            sampler: 5 // Invalid reference
          }
        ],
        images: [
          { uri: 'texture.png' }
        ],
        samplers: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle missing source', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            // Missing source
            sampler: 0
          }
        ],
        samplers: [
          { magFilter: 9729 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate texture with extensions', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            source: 0,
            extensions: {
              'CUSTOM_extension': {
                value: 42
              }
            }
          }
        ],
        images: [
          { uri: 'texture.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate texture with extras', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            source: 0,
            extras: {
              customData: 'texture'
            }
          }
        ],
        images: [
          { uri: 'texture.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null texture in array', () => {
      const gltf: any = {
        textures: [
          { source: 0 },
          null
        ],
        images: [
          { uri: 'texture.png' }
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate multiple textures', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          { source: 0 },
          { source: 1, sampler: 0 },
          { source: 2, sampler: 1 }
        ],
        images: [
          { uri: 'texture1.png' },
          { uri: 'texture2.png' },
          { uri: 'texture3.png' }
        ],
        samplers: [
          { magFilter: 9729 },
          { minFilter: 9987 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle texture with name', () => {
      const gltf: Partial<GLTF> = {
        textures: [
          {
            name: 'DiffuseTexture',
            source: 0
          }
        ],
        images: [
          { uri: 'diffuse.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });
  });
});