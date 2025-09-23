import { describe, it, expect } from 'vitest';
import { SceneValidator } from '../../src/validators/scene-validator';
import { GLTF, Issues, ValidationOptions } from '../../src/types';

describe('SceneValidator', () => {
  let validator: SceneValidator;
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
    validator = new SceneValidator();
  });

  describe('validate', () => {
    it('should validate scenes array when present', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          { nodes: [0, 1] },
          { nodes: [] }
        ],
        nodes: [
          { name: 'node1' },
          { name: 'node2' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle empty scenes array', () => {
      const gltf: Partial<GLTF> = {
        scenes: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle missing scenes array', () => {
      const gltf: Partial<GLTF> = {};

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate scene with node references', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          {
            nodes: [0, 1, 2],
            name: 'Main Scene'
          }
        ],
        nodes: [
          { name: 'root' },
          { name: 'child1' },
          { name: 'child2' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle scene with invalid node references', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          { nodes: [0, 5, 10] } // 5 and 10 don't exist
        ],
        nodes: [
          { name: 'node1' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle scenes with extensions', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          {
            nodes: [0],
            extensions: {
              'CUSTOM_extension': {
                value: 42
              }
            }
          }
        ],
        nodes: [
          { name: 'node1' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle scenes with extras', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          {
            nodes: [0],
            extras: {
              customData: 'test'
            }
          }
        ],
        nodes: [
          { name: 'node1' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null scenes in array', () => {
      const gltf: any = {
        scenes: [
          { nodes: [0] },
          null,
          { nodes: [1] }
        ],
        nodes: [
          { name: 'node1' },
          { name: 'node2' }
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle scene with duplicate node references', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          { nodes: [0, 0, 1, 1] } // Duplicate references
        ],
        nodes: [
          { name: 'node1' },
          { name: 'node2' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle scene with empty nodes array', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          { nodes: [] }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle scene without nodes property', () => {
      const gltf: Partial<GLTF> = {
        scenes: [
          { name: 'Empty Scene' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });
  });
});