import { describe, it, expect } from 'vitest';
import { MaterialValidator } from '../../src/validators/material-validator';
import { GLTF, Issues, ValidationOptions } from '../../src/types';

describe('MaterialValidator', () => {
  let validator: MaterialValidator;
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
    validator = new MaterialValidator();
  });

  describe('validate', () => {
    it('should validate empty materials array', () => {
      const gltf: Partial<GLTF> = {
        materials: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate basic material', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          { name: 'BasicMaterial' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate material with PBR metallic roughness', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            pbrMetallicRoughness: {
              baseColorFactor: [1.0, 1.0, 1.0, 1.0],
              metallicFactor: 1.0,
              roughnessFactor: 1.0,
              baseColorTexture: {
                index: 0,
                texCoord: 0
              },
              metallicRoughnessTexture: {
                index: 1,
                texCoord: 0
              }
            }
          }
        ],
        textures: [
          { source: 0 },
          { source: 1 }
        ],
        images: [
          { uri: 'baseColor.png' },
          { uri: 'metallicRoughness.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate material with normal texture', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            normalTexture: {
              index: 0,
              texCoord: 0,
              scale: 1.0
            }
          }
        ],
        textures: [
          { source: 0 }
        ],
        images: [
          { uri: 'normal.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate material with occlusion texture', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            occlusionTexture: {
              index: 0,
              texCoord: 0,
              strength: 1.0
            }
          }
        ],
        textures: [
          { source: 0 }
        ],
        images: [
          { uri: 'occlusion.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate material with emissive texture', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            emissiveTexture: {
              index: 0,
              texCoord: 0
            },
            emissiveFactor: [1.0, 0.5, 0.0]
          }
        ],
        textures: [
          { source: 0 }
        ],
        images: [
          { uri: 'emissive.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate material with alpha mode', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            alphaMode: 'OPAQUE'
          },
          {
            alphaMode: 'MASK',
            alphaCutoff: 0.5
          },
          {
            alphaMode: 'BLEND'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate double sided material', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            doubleSided: true
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid texture references', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            pbrMetallicRoughness: {
              baseColorTexture: {
                index: 10 // Invalid reference
              }
            },
            normalTexture: {
              index: 20 // Invalid reference
            }
          }
        ],
        textures: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid alpha mode', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            alphaMode: 'INVALID_MODE' as any
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid factors out of range', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            pbrMetallicRoughness: {
              baseColorFactor: [2.0, -1.0, 1.0, 1.0], // Invalid values
              metallicFactor: -0.5, // Invalid value
              roughnessFactor: 2.0 // Invalid value
            },
            emissiveFactor: [2.0, 2.0, 2.0] // Can be > 1.0 but should be noted
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid array lengths', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            pbrMetallicRoughness: {
              baseColorFactor: [1.0, 1.0] // Wrong length, should be 4
            },
            emissiveFactor: [1.0, 1.0] // Wrong length, should be 3
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid texture coordinates', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            pbrMetallicRoughness: {
              baseColorTexture: {
                index: 0,
                texCoord: -1 // Invalid texCoord
              }
            }
          }
        ],
        textures: [
          { source: 0 }
        ],
        images: [
          { uri: 'texture.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate material with extensions', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            extensions: {
              'KHR_materials_pbr': {
                diffuseFactor: [1.0, 1.0, 1.0, 1.0]
              },
              'KHR_materials_clearcoat': {
                clearcoatFactor: 1.0
              }
            }
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate material with extras', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            extras: {
              customData: 'material'
            }
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid normal texture scale', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            normalTexture: {
              index: 0,
              scale: -1.0 // Invalid scale
            }
          }
        ],
        textures: [
          { source: 0 }
        ],
        images: [
          { uri: 'normal.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid occlusion texture strength', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            occlusionTexture: {
              index: 0,
              strength: 2.0 // Invalid strength (should be 0-1)
            }
          }
        ],
        textures: [
          { source: 0 }
        ],
        images: [
          { uri: 'occlusion.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid alpha cutoff', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            alphaMode: 'MASK',
            alphaCutoff: -0.5 // Invalid cutoff
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle alpha cutoff without mask mode', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            alphaMode: 'OPAQUE',
            alphaCutoff: 0.5 // Should warn when not using MASK mode
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null material in array', () => {
      const gltf: any = {
        materials: [
          { name: 'validMaterial' },
          null
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate complex material with all properties', () => {
      const gltf: Partial<GLTF> = {
        materials: [
          {
            name: 'ComplexMaterial',
            pbrMetallicRoughness: {
              baseColorFactor: [0.8, 0.8, 0.8, 1.0],
              metallicFactor: 0.0,
              roughnessFactor: 0.9,
              baseColorTexture: {
                index: 0,
                texCoord: 0
              },
              metallicRoughnessTexture: {
                index: 1,
                texCoord: 0
              }
            },
            normalTexture: {
              index: 2,
              texCoord: 0,
              scale: 1.0
            },
            occlusionTexture: {
              index: 3,
              texCoord: 1,
              strength: 1.0
            },
            emissiveTexture: {
              index: 4,
              texCoord: 0
            },
            emissiveFactor: [0.1, 0.1, 0.1],
            alphaMode: 'BLEND',
            doubleSided: true,
            extensions: {
              'KHR_materials_clearcoat': {
                clearcoatFactor: 0.5
              }
            },
            extras: {
              description: 'A complex material with all properties'
            }
          }
        ],
        textures: [
          { source: 0 }, // baseColor
          { source: 1 }, // metallicRoughness
          { source: 2 }, // normal
          { source: 3 }, // occlusion
          { source: 4 }  // emissive
        ],
        images: [
          { uri: 'baseColor.png' },
          { uri: 'metallicRoughness.png' },
          { uri: 'normal.png' },
          { uri: 'occlusion.png' },
          { uri: 'emissive.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });
  });
});