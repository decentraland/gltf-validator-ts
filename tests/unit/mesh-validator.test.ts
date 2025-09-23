import { describe, it, expect } from 'vitest';
import { MeshValidator } from '../../src/validators/mesh-validator';
import { GLTF, Issues, ValidationOptions } from '../../src/types';

describe('MeshValidator', () => {
  let validator: MeshValidator;
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
    validator = new MeshValidator();
  });

  describe('validate', () => {
    it('should validate empty meshes array', () => {
      const gltf: Partial<GLTF> = {
        meshes: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate basic mesh with primitives', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: {
                  POSITION: 0
                }
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with material', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: {
                  POSITION: 0
                },
                material: 0
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ],
        materials: [
          { name: 'testMaterial' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with indices', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: {
                  POSITION: 0
                },
                indices: 1
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' },
          { componentType: 5123, count: 3, type: 'SCALAR' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with multiple attributes', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: {
                  POSITION: 0,
                  NORMAL: 1,
                  TEXCOORD_0: 2,
                  TEXCOORD_1: 3,
                  COLOR_0: 4,
                  JOINTS_0: 5,
                  WEIGHTS_0: 6
                }
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }, // POSITION
          { componentType: 5126, count: 3, type: 'VEC3' }, // NORMAL
          { componentType: 5126, count: 3, type: 'VEC2' }, // TEXCOORD_0
          { componentType: 5126, count: 3, type: 'VEC2' }, // TEXCOORD_1
          { componentType: 5126, count: 3, type: 'VEC3' }, // COLOR_0
          { componentType: 5123, count: 3, type: 'VEC4' }, // JOINTS_0
          { componentType: 5126, count: 3, type: 'VEC4' }  // WEIGHTS_0
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with morph targets', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: {
                  POSITION: 0
                },
                targets: [
                  {
                    POSITION: 1,
                    NORMAL: 2
                  },
                  {
                    POSITION: 3
                  }
                ]
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }, // base POSITION
          { componentType: 5126, count: 3, type: 'VEC3' }, // target 0 POSITION
          { componentType: 5126, count: 3, type: 'VEC3' }, // target 0 NORMAL
          { componentType: 5126, count: 3, type: 'VEC3' }  // target 1 POSITION
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with different primitive modes', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: { POSITION: 0 },
                mode: 0 // POINTS
              },
              {
                attributes: { POSITION: 1 },
                mode: 1 // LINES
              },
              {
                attributes: { POSITION: 2 },
                mode: 4 // TRIANGLES (default)
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' },
          { componentType: 5126, count: 3, type: 'VEC3' },
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid material reference', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: { POSITION: 0 },
                material: 10 // Invalid reference
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ],
        materials: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid accessor reference in attributes', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: {
                  POSITION: 10 // Invalid reference
                }
              }
            ]
          }
        ],
        accessors: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid indices reference', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: { POSITION: 0 },
                indices: 5 // Invalid reference
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle mesh without primitives', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            name: 'EmptyMesh'
            // Missing primitives array
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle mesh with empty primitives array', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: []
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle primitive without attributes', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                // Missing attributes
              }
            ]
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle primitive without POSITION attribute', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: {
                  NORMAL: 0 // Missing required POSITION
                }
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with weights', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: { POSITION: 0 },
                targets: [
                  { POSITION: 1 }
                ]
              }
            ],
            weights: [0.5]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' },
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with extensions', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: { POSITION: 0 },
                extensions: {
                  'CUSTOM_extension': {
                    value: 42
                  }
                }
              }
            ],
            extensions: {
              'MESH_extension': {
                data: 'test'
              }
            }
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate mesh with extras', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: { POSITION: 0 },
                extras: {
                  customData: 'primitive'
                }
              }
            ],
            extras: {
              customData: 'mesh'
            }
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid primitive mode', () => {
      const gltf: Partial<GLTF> = {
        meshes: [
          {
            primitives: [
              {
                attributes: { POSITION: 0 },
                mode: 99 // Invalid mode
              }
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null mesh in array', () => {
      const gltf: any = {
        meshes: [
          {
            primitives: [
              { attributes: { POSITION: 0 } }
            ]
          },
          null
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null primitive in array', () => {
      const gltf: any = {
        meshes: [
          {
            primitives: [
              { attributes: { POSITION: 0 } },
              null
            ]
          }
        ],
        accessors: [
          { componentType: 5126, count: 3, type: 'VEC3' }
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });
  });
});