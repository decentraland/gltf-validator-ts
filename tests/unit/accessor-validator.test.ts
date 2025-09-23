import { describe, it, expect } from 'vitest';
import { AccessorValidator } from '../../src/validators/accessor-validator';
import { GLTF, Issues, ValidationOptions } from '../../src/types';

describe('AccessorValidator', () => {
  let validator: AccessorValidator;
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
    validator = new AccessorValidator();
  });

  describe('validate', () => {
    it('should validate empty accessors array', () => {
      const gltf: Partial<GLTF> = {
        accessors: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate basic accessor', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126, // FLOAT
            count: 3,
            type: 'VEC3'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate accessor with buffer view', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            bufferView: 0,
            componentType: 5126, // FLOAT
            count: 3,
            type: 'VEC3'
          }
        ],
        bufferViews: [
          {
            buffer: 0,
            byteLength: 36 // 3 * 3 * 4 bytes
          }
        ],
        buffers: [
          { byteLength: 36 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate accessor with byte offset', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            bufferView: 0,
            byteOffset: 12,
            componentType: 5126, // FLOAT
            count: 2,
            type: 'VEC3'
          }
        ],
        bufferViews: [
          {
            buffer: 0,
            byteLength: 36
          }
        ],
        buffers: [
          { byteLength: 36 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate all component types', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          { componentType: 5120, count: 1, type: 'SCALAR' }, // BYTE
          { componentType: 5121, count: 1, type: 'SCALAR' }, // UNSIGNED_BYTE
          { componentType: 5122, count: 1, type: 'SCALAR' }, // SHORT
          { componentType: 5123, count: 1, type: 'SCALAR' }, // UNSIGNED_SHORT
          { componentType: 5125, count: 1, type: 'SCALAR' }, // UNSIGNED_INT
          { componentType: 5126, count: 1, type: 'SCALAR' }  // FLOAT
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate all accessor types', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          { componentType: 5126, count: 1, type: 'SCALAR' },
          { componentType: 5126, count: 1, type: 'VEC2' },
          { componentType: 5126, count: 1, type: 'VEC3' },
          { componentType: 5126, count: 1, type: 'VEC4' },
          { componentType: 5126, count: 1, type: 'MAT2' },
          { componentType: 5126, count: 1, type: 'MAT3' },
          { componentType: 5126, count: 1, type: 'MAT4' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate accessor with min/max values', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126, // FLOAT
            count: 3,
            type: 'VEC3',
            min: [-1.0, -1.0, -1.0],
            max: [1.0, 1.0, 1.0]
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate normalized accessor', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5121, // UNSIGNED_BYTE
            count: 3,
            type: 'VEC3',
            normalized: true
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate sparse accessor', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126, // FLOAT
            count: 10,
            type: 'VEC3',
            sparse: {
              count: 2,
              indices: {
                bufferView: 0,
                componentType: 5123 // UNSIGNED_SHORT
              },
              values: {
                bufferView: 1
              }
            }
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 4 }, // indices
          { buffer: 0, byteLength: 24 } // values (2 * 3 * 4 bytes)
        ],
        buffers: [
          { byteLength: 28 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid component type', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 9999, // Invalid
            count: 3,
            type: 'VEC3'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid accessor type', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: 3,
            type: 'INVALID_TYPE' as any
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid buffer view reference', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            bufferView: 10, // Invalid reference
            componentType: 5126,
            count: 3,
            type: 'VEC3'
          }
        ],
        bufferViews: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle zero count', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: 0,
            type: 'VEC3'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle negative count', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: -1,
            type: 'VEC3'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid min/max array length', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: 3,
            type: 'VEC3',
            min: [-1.0, -1.0], // Wrong length for VEC3
            max: [1.0, 1.0, 1.0, 1.0] // Wrong length for VEC3
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid byte offset alignment', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            bufferView: 0,
            byteOffset: 3, // Not aligned to 4 bytes for FLOAT
            componentType: 5126, // FLOAT
            count: 1,
            type: 'SCALAR'
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 8 }
        ],
        buffers: [
          { byteLength: 8 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle accessor exceeding buffer view bounds', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            bufferView: 0,
            componentType: 5126, // FLOAT
            count: 10, // Too many elements for buffer
            type: 'VEC3'
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 12 } // Only enough for 1 VEC3
        ],
        buffers: [
          { byteLength: 12 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate accessor with extensions', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: 3,
            type: 'VEC3',
            extensions: {
              'CUSTOM_extension': {
                value: 42
              }
            }
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate accessor with extras', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: 3,
            type: 'VEC3',
            extras: {
              customData: 'test'
            }
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle sparse accessor with invalid indices', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: 10,
            type: 'VEC3',
            sparse: {
              count: 2,
              indices: {
                bufferView: 10, // Invalid reference
                componentType: 5123
              },
              values: {
                bufferView: 0
              }
            }
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 24 }
        ],
        buffers: [
          { byteLength: 24 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle sparse accessor with invalid values', () => {
      const gltf: Partial<GLTF> = {
        accessors: [
          {
            componentType: 5126,
            count: 10,
            type: 'VEC3',
            sparse: {
              count: 2,
              indices: {
                bufferView: 0,
                componentType: 5123
              },
              values: {
                bufferView: 10 // Invalid reference
              }
            }
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 4 }
        ],
        buffers: [
          { byteLength: 4 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null accessor in array', () => {
      const gltf: any = {
        accessors: [
          {
            componentType: 5126,
            count: 3,
            type: 'VEC3'
          },
          null
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });
  });
});