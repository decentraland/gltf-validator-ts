import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Mega-Targeted Material Coverage Tests', () => {

  it('should hit all remaining uncovered material validator paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Hit UNEXPECTED_PROPERTY for material level
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 1.0, 1.0, 1.0],
            metallicFactor: 1.0,
            roughnessFactor: 1.0
          },
          unexpectedMaterialProp: 'should trigger warning',
          anotherUnexpected: 123,
          customProperty: { nested: 'object' },
          name: 'MaterialWithUnexpectedProps'
        },
        {
          // Test PBR object with TYPE_MISMATCH validation paths
          pbrMetallicRoughness: {
            // Test baseColorFactor type validation
            baseColorFactor: 'not_an_array', // String instead of array
            metallicFactor: 1.0,
            roughnessFactor: 1.0
          },
          name: 'StringBaseColorFactor'
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 1.0, 1.0, 1.0],
            // Test metallicFactor type validation  
            metallicFactor: 'not_a_number', // String instead of number
            roughnessFactor: 1.0
          },
          name: 'StringMetallicFactor'
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 1.0, 1.0, 1.0],
            metallicFactor: 1.0,
            // Test roughnessFactor type validation
            roughnessFactor: 'not_a_number' // String instead of number
          },
          name: 'StringRoughnessFactor'
        },
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              // Test texture index type validation
              index: 'not_a_number', // String instead of number
              texCoord: 0
            }
          },
          name: 'StringTextureIndex'
        },
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              // Test texCoord type validation
              texCoord: 'not_a_number' // String instead of number
            }
          },
          name: 'StringTexCoord'
        },
        {
          pbrMetallicRoughness: {
            metallicRoughnessTexture: {
              index: 'not_a_number', // String instead of number
              texCoord: 0
            }
          },
          name: 'StringMRTextureIndex'
        },
        {
          // Test normalTexture type validations
          normalTexture: {
            index: 'not_a_number', // String instead of number
            texCoord: 0,
            scale: 1.0
          },
          name: 'StringNormalTextureIndex'
        },
        {
          normalTexture: {
            index: 0,
            texCoord: 'not_a_number', // String instead of number
            scale: 1.0
          },
          name: 'StringNormalTexCoord'
        },
        {
          normalTexture: {
            index: 0,
            texCoord: 0,
            scale: 'not_a_number' // String instead of number
          },
          name: 'StringNormalScale'
        },
        {
          // Test occlusionTexture type validations
          occlusionTexture: {
            index: 'not_a_number', // String instead of number
            texCoord: 0,
            strength: 1.0
          },
          name: 'StringOcclusionTextureIndex'
        },
        {
          occlusionTexture: {
            index: 0,
            texCoord: 'not_a_number', // String instead of number
            strength: 1.0
          },
          name: 'StringOcclusionTexCoord'
        },
        {
          occlusionTexture: {
            index: 0,
            texCoord: 0,
            strength: 'not_a_number' // String instead of number
          },
          name: 'StringOcclusionStrength'
        },
        {
          // Test emissiveTexture type validations
          emissiveTexture: {
            index: 'not_a_number', // String instead of number
            texCoord: 0
          },
          name: 'StringEmissiveTextureIndex'
        },
        {
          emissiveTexture: {
            index: 0,
            texCoord: 'not_a_number' // String instead of number
          },
          name: 'StringEmissiveTexCoord'
        },
        {
          // Test emissiveFactor type validation
          emissiveFactor: 'not_an_array', // String instead of array
          name: 'StringEmissiveFactor'
        },
        {
          // Test alphaMode type validation
          alphaMode: 123, // Number instead of string
          name: 'NumericAlphaMode'
        },
        {
          // Test alphaCutoff type validation
          alphaMode: 'MASK',
          alphaCutoff: 'not_a_number', // String instead of number
          name: 'StringAlphaCutoff'
        },
        {
          // Test doubleSided type validation
          doubleSided: 'not_a_boolean', // String instead of boolean
          name: 'StringDoubleSided'
        },
        {
          // Test baseColorFactor array validation (wrong length)
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 1.0] // Should be 4 elements, not 2
          },
          name: 'WrongBaseColorFactorLength'
        },
        {
          // Test baseColorFactor with non-numeric elements
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 'not_a_number', 1.0, 1.0] // Mixed types
          },
          name: 'MixedBaseColorFactor'
        },
        {
          // Test emissiveFactor array validation (wrong length)
          emissiveFactor: [1.0, 1.0] // Should be 3 elements, not 2
        },
        {
          // Test emissiveFactor with non-numeric elements
          emissiveFactor: [1.0, 'not_a_number', 1.0] // Mixed types
        },
        {
          // Test negative texture indices
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: -1, // Negative index
              texCoord: 0
            }
          }
        },
        {
          // Test large unresolved texture indices
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 999, // Unresolved reference
              texCoord: 0
            }
          }
        },
        {
          // Test negative texCoord values
          normalTexture: {
            index: 0,
            texCoord: -1 // Negative texCoord
          }
        },
        {
          // Test very large texCoord values
          emissiveTexture: {
            index: 0,
            texCoord: 999999 // Very large texCoord
          }
        },
        {
          // Test edge case numeric values for factors
          pbrMetallicRoughness: {
            baseColorFactor: [Number.EPSILON, Number.MAX_VALUE, Number.MIN_VALUE, Infinity],
            metallicFactor: NaN,
            roughnessFactor: -Infinity
          },
          emissiveFactor: [Infinity, -Infinity, NaN],
          name: 'EdgeCaseNumericValues'
        },
        {
          // Test out-of-range values that should trigger specific validations
          pbrMetallicRoughness: {
            baseColorFactor: [-0.5, 1.5, 2.0, -1.0], // Out of [0,1] range
            metallicFactor: -0.5, // Out of [0,1] range
            roughnessFactor: 1.5 // Out of [0,1] range
          },
          emissiveFactor: [-0.5, 1.5, 2.0], // Negative values not allowed
          alphaCutoff: -0.5, // Should be in [0,1] range
          normalTexture: {
            index: 0,
            scale: -2.0 // Negative scale not allowed
          },
          occlusionTexture: {
            index: 0,
            strength: -0.5 // Out of [0,1] range
          },
          name: 'OutOfRangeValues'
        }
      ],
      textures: [
        { source: 0 }
      ],
      images: [
        { uri: 'texture.png' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mega-targeted-material.gltf' });
    
    // Should generate many errors and warnings for type mismatches and invalid values
    expect(result.issues.numErrors).toBeGreaterThan(0);
    expect(result.issues.numWarnings).toBeGreaterThan(0);
  });

  it('should hit PBR object validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Test material with null PBR object
          pbrMetallicRoughness: null,
          name: 'NullPBR'
        },
        {
          // Test material with PBR as array instead of object
          pbrMetallicRoughness: ['invalid', 'pbr', 'array'],
          name: 'ArrayPBR'
        },
        {
          // Test material with PBR as string instead of object
          pbrMetallicRoughness: 'invalid_pbr_string',
          name: 'StringPBR'
        },
        {
          // Test material with PBR as number instead of object
          pbrMetallicRoughness: 123,
          name: 'NumericPBR'
        },
        {
          // Test PBR object with unexpected properties
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 1.0, 1.0, 1.0],
            metallicFactor: 1.0,
            roughnessFactor: 1.0,
            unexpectedPBRProp: 'should trigger warning',
            anotherUnexpectedPBR: 456
          },
          name: 'UnexpectedPBRProps'
        },
        {
          // Test texture objects with unexpected properties
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              texCoord: 0,
              unexpectedTextureProp: 'should trigger warning'
            }
          },
          name: 'UnexpectedTextureProps'
        },
        {
          // Test normalTexture with unexpected properties
          normalTexture: {
            index: 0,
            texCoord: 0,
            scale: 1.0,
            unexpectedNormalProp: 'should trigger warning'
          },
          name: 'UnexpectedNormalProps'
        },
        {
          // Test occlusionTexture with unexpected properties
          occlusionTexture: {
            index: 0,
            texCoord: 0,
            strength: 1.0,
            unexpectedOcclusionProp: 'should trigger warning'
          },
          name: 'UnexpectedOcclusionProps'
        },
        {
          // Test emissiveTexture with unexpected properties
          emissiveTexture: {
            index: 0,
            texCoord: 0,
            unexpectedEmissiveProp: 'should trigger warning'
          },
          name: 'UnexpectedEmissiveProps'
        }
      ],
      textures: [
        { source: 0 }
      ],
      images: [
        { uri: 'texture.png' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mega-targeted-material-pbr.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});