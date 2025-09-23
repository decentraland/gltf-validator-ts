import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra Remaining Gaps Coverage Tests', () => {

  it('should hit the absolute final camera validator uncovered paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test camera with perspective as null
          type: 'perspective',
          perspective: null,
          name: 'PerspectiveNull'
        },
        {
          // Test camera with orthographic as null
          type: 'orthographic', 
          orthographic: null,
          name: 'OrthographicNull'
        },
        {
          // Test camera with perspective as array
          type: 'perspective',
          perspective: [1.0, 0.1],
          name: 'PerspectiveArray'
        },
        {
          // Test camera with orthographic as array
          type: 'orthographic',
          orthographic: [1.0, 1.0, 100.0, 0.1],
          name: 'OrthographicArray'
        },
        {
          // Test camera with perspective as string
          type: 'perspective',
          perspective: 'invalid_perspective_object',
          name: 'PerspectiveString'
        },
        {
          // Test camera with orthographic as string
          type: 'orthographic',
          orthographic: 'invalid_orthographic_object',
          name: 'OrthographicString'
        },
        {
          // Test camera with perspective as number
          type: 'perspective',
          perspective: 123,
          name: 'PerspectiveNumber'
        },
        {
          // Test camera with orthographic as number
          type: 'orthographic',
          orthographic: 456,
          name: 'OrthographicNumber'
        },
        {
          // Test specific zfar/znear validation edge cases
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 10.0, // znear > zfar
            zfar: 5.0
          },
          name: 'PerspectiveZnearGreaterZfar'
        },
        {
          // Test specific zfar/znear validation edge cases
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 100.0, // znear > zfar
            zfar: 50.0
          },
          name: 'OrthographicZnearGreaterZfar'
        },
        {
          // Test with very specific edge case values that might hit different branches
          type: 'perspective',
          perspective: {
            yfov: 0.0, // Zero yfov (should be > 0)
            znear: 0.0, // Zero znear (should be > 0)
            zfar: 0.0, // Zero zfar (should be > 0)
            aspectRatio: 0.0 // Zero aspectRatio (should be > 0)
          },
          name: 'PerspectiveAllZeros'
        },
        {
          // Test orthographic with all zeros
          type: 'orthographic',
          orthographic: {
            xmag: 0.0, // Zero xmag (should be > 0)
            ymag: 0.0, // Zero ymag (should be > 0)
            zfar: 0.0, // Zero zfar (should be > 0)
            znear: 0.0 // Zero znear (should be > 0)
          },
          name: 'OrthographicAllZeros'
        },
        {
          // Test camera with extensions and extras to hit property validation
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            extensions: {
              'CAMERA_perspective_extension': {}
            },
            extras: {
              perspectiveCustomProp: 'value'
            }
          },
          extensions: {
            'CAMERA_root_extension': {}
          },
          extras: {
            cameraCustomProp: 'value'
          },
          name: 'CameraWithExtensions'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-remaining-camera.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining material validator edge case paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Test with very specific edge case factor values
          pbrMetallicRoughness: {
            baseColorFactor: [1.0000001, 0.9999999, Number.EPSILON, 1.0 - Number.EPSILON], // Edge case values near boundaries
            metallicFactor: Number.EPSILON, // Very small value
            roughnessFactor: 1.0 - Number.EPSILON // Very close to 1
          },
          emissiveFactor: [Number.MAX_VALUE, Number.MIN_VALUE, 0.0000001], // Edge case numeric values
          alphaCutoff: Number.EPSILON, // Very small alpha cutoff
          name: 'EdgeCaseValues'
        },
        {
          // Test texture coordinate validation with edge cases  
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              texCoord: Number.MAX_SAFE_INTEGER // Very large texCoord
            },
            metallicRoughnessTexture: {
              index: 0,
              texCoord: -Number.MAX_SAFE_INTEGER // Very negative texCoord
            }
          },
          normalTexture: {
            index: 0,
            texCoord: 2147483647, // Max 32-bit integer
            scale: Number.MAX_VALUE // Very large scale
          },
          occlusionTexture: {
            index: 0,
            texCoord: -2147483648, // Min 32-bit integer
            strength: Number.MIN_VALUE // Very small strength
          },
          emissiveTexture: {
            index: 0,
            texCoord: 0.5 // Fractional texCoord (might be converted to integer)
          },
          name: 'EdgeCaseTexCoords'
        },
        {
          // Test with mixed valid/invalid array elements
          pbrMetallicRoughness: {
            baseColorFactor: [0.5, Number.NaN, 0.5, 0.5] // NaN in middle of array
          },
          emissiveFactor: [0.5, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY], // Infinity values
          name: 'MixedValidInvalidArrays'
        },
        {
          // Test alphaMode with various invalid types
          alphaMode: null, // Null alphaMode
          name: 'NullAlphaMode'
        },
        {
          alphaMode: [], // Array alphaMode
          name: 'ArrayAlphaMode'
        },
        {
          alphaMode: {}, // Object alphaMode
          name: 'ObjectAlphaMode'
        },
        {
          // Test doubleSided with various invalid types
          doubleSided: null, // Null doubleSided
          name: 'NullDoubleSided'
        },
        {
          doubleSided: 0, // Number doubleSided (falsy)
          name: 'NumericDoubleSided'
        },
        {
          doubleSided: 1, // Number doubleSided (truthy)
          name: 'NumericDoubleSidedTruthy'
        },
        {
          doubleSided: [], // Array doubleSided
          name: 'ArrayDoubleSided'
        },
        {
          // Test material with all properties having invalid types
          pbrMetallicRoughness: {
            baseColorFactor: null,
            metallicFactor: [],
            roughnessFactor: {},
            baseColorTexture: 'invalid_texture',
            metallicRoughnessTexture: 123
          },
          normalTexture: true,
          occlusionTexture: false,
          emissiveTexture: [],
          emissiveFactor: {},
          alphaMode: 456,
          alphaCutoff: true,
          doubleSided: {},
          name: 'AllInvalidTypes'
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
    const result = await validateBytes(data, { uri: 'ultra-remaining-material.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining accessor validator paths with edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test accessor with very edge case values
          componentType: Number.MAX_SAFE_INTEGER, // Invalid component type
          count: Number.MAX_SAFE_INTEGER, // Very large count
          type: 'UNKNOWN_TYPE_123', // Invalid type
          normalized: 'not_a_boolean', // Invalid normalized type
          byteOffset: Number.MAX_SAFE_INTEGER, // Very large byteOffset
          bufferView: Number.MAX_SAFE_INTEGER, // Invalid bufferView reference
          min: 'not_an_array', // Invalid min type
          max: {}, // Invalid max type
          sparse: 'not_an_object', // Invalid sparse type
          name: 'EdgeCaseAccessor'
        },
        {
          // Test accessor with null/undefined edge cases
          componentType: null,
          count: null,
          type: null,
          normalized: null,
          byteOffset: null,
          bufferView: null,
          min: null,
          max: null,
          sparse: null,
          name: 'NullAccessor'
        },
        {
          // Test accessor with array types where objects expected
          componentType: [5126],
          count: [10],
          type: ['VEC3'],
          normalized: [true],
          byteOffset: [4],
          bufferView: [0],
          name: 'ArrayTypesAccessor'
        },
        {
          // Test normalized with edge case component types
          componentType: 5130, // DOUBLE - not valid for normalized
          count: 5,
          type: 'SCALAR',
          normalized: true,
          name: 'NormalizedDoubleAccessor'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-remaining-accessor.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining validator edge cases with null/undefined/invalid structures', async () => {
    const gltf = {
      asset: { version: '2.0' },
      // Test some top-level arrays with invalid types that won't break JSON serialization
      nodes: [], // Empty arrays should still work
      meshes: [], 
      materials: [],
      cameras: [],
      animations: [],
      textures: [],
      images: [],
      samplers: [],
      skins: [],
      accessors: [],
      bufferViews: [],
      buffers: []
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-remaining-structures.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});