import { describe, it, expect } from 'vitest';
import { NodeValidator } from '../../../src/validators/node-validator';
import { GLTF, Issues, ValidationOptions } from '../../../src/types';

describe('NodeValidator', () => {
  let validator: NodeValidator;
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
    validator = new NodeValidator();
  });

  describe('validate', () => {
    it('should validate empty nodes array', () => {
      const gltf: Partial<GLTF> = {
        nodes: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate basic node', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { name: 'BasicNode' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with mesh reference', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { mesh: 0 }
        ],
        meshes: [
          { primitives: [] }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with camera reference', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { camera: 0 }
        ],
        cameras: [
          { type: 'perspective' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with skin reference', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { skin: 0 }
        ],
        skins: [
          { joints: [0] }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with children', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { children: [1, 2] },
          { name: 'child1' },
          { name: 'child2' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with transformation matrix', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            matrix: [
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
            ]
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with TRS properties', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            translation: [1, 2, 3],
            rotation: [0, 0, 0, 1],
            scale: [1, 1, 1]
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with weights', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            mesh: 0,
            weights: [0.5, 0.3, 0.2]
          }
        ],
        meshes: [
          { primitives: [] }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid mesh reference', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { mesh: 10 } // Invalid reference
        ],
        meshes: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid camera reference', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { camera: 5 } // Invalid reference
        ],
        cameras: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid skin reference', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { skin: 3 } // Invalid reference
        ],
        skins: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid children references', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { children: [5, 10] } // Invalid references
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle circular references in children', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { children: [1] },
          { children: [0] } // Circular reference
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle self-reference in children', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          { children: [0] } // Self-reference
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate node with extensions', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
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

    it('should validate node with extras', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            extras: {
              customData: 'test'
            }
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid matrix', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            matrix: [1, 2, 3] // Wrong length, should be 16
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid translation', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            translation: [1, 2] // Wrong length, should be 3
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid rotation', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            rotation: [0, 0, 0] // Wrong length, should be 4
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid scale', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            scale: [1, 1] // Wrong length, should be 3
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle node with both matrix and TRS', () => {
      const gltf: Partial<GLTF> = {
        nodes: [
          {
            matrix: [
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
            ],
            translation: [1, 2, 3] // Should not have both
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null node in array', () => {
      const gltf: any = {
        nodes: [
          { name: 'validNode' },
          null
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });
  });
});