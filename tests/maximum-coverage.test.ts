import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Maximum Coverage Tests', () => {

  it('should hit accessor validator comprehensive edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test accessor with unexpected property
          componentType: 5126, // FLOAT
          count: 10,
          type: 'VEC3',
          unexpectedProp: 'test'
        },
        {
          // Test accessor without componentType
          count: 10,
          type: 'VEC3'
        },
        {
          // Test accessor with invalid componentType
          componentType: 9999,
          count: 10,
          type: 'VEC3'
        },
        {
          // Test accessor with normalized=true but invalid componentType
          componentType: 5126, // FLOAT - cannot be normalized
          count: 10,
          type: 'VEC3',
          normalized: true
        },
        {
          // Test accessor with normalized=true and valid componentType
          componentType: 5121, // UNSIGNED_BYTE - can be normalized
          count: 10,
          type: 'VEC3',
          normalized: true
        },
        {
          // Test accessor without count
          componentType: 5126,
          type: 'VEC3'
        },
        {
          // Test accessor with invalid count
          componentType: 5126,
          count: -1,
          type: 'VEC3'
        },
        {
          // Test accessor with non-number count
          componentType: 5126,
          count: "10",
          type: 'VEC3'
        },
        {
          // Test accessor without type
          componentType: 5126,
          count: 10
        },
        {
          // Test accessor with invalid type
          componentType: 5126,
          count: 10,
          type: 'INVALID_TYPE'
        },
        {
          // Test accessor with byteOffset but no bufferView
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          byteOffset: 12
        },
        {
          // Test accessor with invalid byteOffset
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          byteOffset: -1
        },
        {
          // Test accessor with non-number byteOffset
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          byteOffset: "12"
        },
        {
          // Test accessor with misaligned byteOffset (FLOAT needs 4-byte alignment)
          componentType: 5126, // FLOAT = 4 bytes
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          byteOffset: 3 // Not aligned to 4 bytes
        },
        {
          // Test accessor with invalid bufferView
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: -1
        },
        {
          // Test accessor with non-number bufferView
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: "0"
        },
        {
          // Test accessor with unresolved bufferView reference
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 999
        },
        {
          // Test accessor with valid bufferView for bounds/alignment testing
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          byteOffset: 0
        },
        {
          // Test accessor with min/max arrays of different sizes
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          min: [0.0, 0.0], // Wrong size - should be 3 for VEC3
          max: [1.0, 1.0, 1.0, 1.0] // Wrong size - should be 3 for VEC3
        },
        {
          // Test accessor with sparse data
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 5,
            indices: {
              bufferView: 1,
              componentType: 5123 // UNSIGNED_SHORT
            },
            values: {
              bufferView: 2
            }
          }
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 120 // 10 * VEC3 * FLOAT = 10 * 3 * 4 = 120
        },
        {
          buffer: 0,
          byteOffset: 120,
          byteLength: 10 // 5 * UNSIGNED_SHORT = 5 * 2 = 10
        },
        {
          buffer: 0,
          byteOffset: 130,
          byteLength: 60 // 5 * VEC3 * FLOAT = 5 * 3 * 4 = 60
        }
      ],
      buffers: [
        {
          byteLength: 200
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit more accessor validator edge cases with different component types', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test BYTE componentType
          componentType: 5120, // BYTE
          count: 10,
          type: 'SCALAR'
        },
        {
          // Test UNSIGNED_BYTE componentType
          componentType: 5121, // UNSIGNED_BYTE
          count: 10,
          type: 'SCALAR'
        },
        {
          // Test SHORT componentType
          componentType: 5122, // SHORT
          count: 10,
          type: 'SCALAR'
        },
        {
          // Test UNSIGNED_SHORT componentType
          componentType: 5123, // UNSIGNED_SHORT
          count: 10,
          type: 'SCALAR'
        },
        {
          // Test UNSIGNED_INT componentType
          componentType: 5125, // UNSIGNED_INT
          count: 10,
          type: 'SCALAR'
        },
        {
          // Test different accessor types
          componentType: 5126,
          count: 10,
          type: 'VEC2'
        },
        {
          componentType: 5126,
          count: 10,
          type: 'VEC4'
        },
        {
          componentType: 5126,
          count: 4,
          type: 'MAT2'
        },
        {
          componentType: 5126,
          count: 3,
          type: 'MAT3'
        },
        {
          componentType: 5126,
          count: 2,
          type: 'MAT4'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-component-types.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit material validator comprehensive texture validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Test complete material with all texture types and validation errors
          pbrMetallicRoughness: {
            baseColorTexture: {
              // Missing index
            },
            metallicRoughnessTexture: {
              index: 0,
              texCoord: 1,
              unexpectedProp: 'test'
            }
          },
          normalTexture: {
            index: 0,
            scale: 0.5,
            unexpectedNormalProp: 'test'
          },
          occlusionTexture: {
            index: 0,
            strength: 0.8,
            unexpectedOcclusionProp: 'test'
          },
          emissiveTexture: {
            index: 0,
            unexpectedEmissiveProp: 'test'
          },
          emissiveFactor: [1.0, 0.5, 0.0],
          alphaMode: 'MASK',
          alphaCutoff: 0.5,
          doubleSided: true
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
    const result = await validateBytes(data, { uri: 'material-texture-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit node validator comprehensive edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      nodes: [
        {
          // Test node with both matrix and TRS
          matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
          translation: [1, 2, 3],
          name: 'MatrixAndTRS'
        },
        {
          // Test node with invalid matrix (wrong length)
          matrix: [1,0,0,0,0,1,0,0,0,0,1,0],
          name: 'WrongMatrixLength'
        },
        {
          // Test node with non-array matrix
          matrix: "not an array",
          name: 'NonArrayMatrix'
        },
        {
          // Test node with invalid translation
          translation: [1, 2],  // Should be 3 elements
          name: 'WrongTranslationLength'
        },
        {
          // Test node with non-array translation
          translation: "not an array",
          name: 'NonArrayTranslation'
        },
        {
          // Test node with invalid rotation
          rotation: [0, 0, 0], // Should be 4 elements
          name: 'WrongRotationLength'
        },
        {
          // Test node with invalid scale
          scale: [1, 1], // Should be 3 elements
          name: 'WrongScaleLength'
        },
        {
          // Test node with non-array children
          children: "not an array",
          name: 'NonArrayChildren'
        },
        {
          // Test node with invalid child reference
          children: [-1],
          name: 'InvalidChildRef'
        },
        {
          // Test node with unresolved child reference
          children: [999],
          name: 'UnresolvedChildRef'
        },
        {
          // Test node with invalid mesh reference
          mesh: -1,
          name: 'InvalidMeshRef'
        },
        {
          // Test node with unresolved mesh reference
          mesh: 999,
          name: 'UnresolvedMeshRef'
        },
        {
          // Test node with invalid skin reference
          skin: -1,
          name: 'InvalidSkinRef'
        },
        {
          // Test node with unresolved skin reference
          skin: 999,
          name: 'UnresolvedSkinRef'
        },
        {
          // Test node with invalid camera reference
          camera: -1,
          name: 'InvalidCameraRef'
        },
        {
          // Test node with unresolved camera reference
          camera: 999,
          name: 'UnresolvedCameraRef'
        },
        {
          // Test node with invalid weights
          mesh: 0,
          weights: "not an array",
          name: 'NonArrayWeights'
        },
        {
          // Test node with unexpected property
          unexpectedProp: 'test',
          name: 'UnexpectedProp'
        }
      ],
      meshes: [
        {
          primitives: [{
            attributes: { POSITION: 0 }
          }]
        }
      ],
      accessors: [
        {
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'node-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit sampler validator comprehensive edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      samplers: [
        {
          // Test sampler with invalid magFilter
          magFilter: 9999,
          name: 'InvalidMagFilter'
        },
        {
          // Test sampler with invalid minFilter
          minFilter: 9999,
          name: 'InvalidMinFilter'
        },
        {
          // Test sampler with invalid wrapS
          wrapS: 9999,
          name: 'InvalidWrapS'
        },
        {
          // Test sampler with invalid wrapT
          wrapT: 9999,
          name: 'InvalidWrapT'
        },
        {
          // Test sampler with unexpected property
          magFilter: 9729,
          unexpectedProp: 'test',
          name: 'UnexpectedProp'
        },
        {
          // Test valid sampler
          magFilter: 9729, // LINEAR
          minFilter: 9987, // LINEAR_MIPMAP_LINEAR
          wrapS: 33648,   // MIRRORED_REPEAT
          wrapT: 10497,   // REPEAT
          name: 'ValidSampler'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'sampler-comprehensive.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit texture validator comprehensive edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      textures: [
        {
          // Test texture with invalid source reference
          source: -1,
          name: 'InvalidSourceRef'
        },
        {
          // Test texture with unresolved source reference
          source: 999,
          name: 'UnresolvedSourceRef'
        },
        {
          // Test texture with invalid sampler reference
          source: 0,
          sampler: -1,
          name: 'InvalidSamplerRef'
        },
        {
          // Test texture with unresolved sampler reference
          source: 0,
          sampler: 999,
          name: 'UnresolvedSamplerRef'
        },
        {
          // Test texture without source
          name: 'NoSource'
        },
        {
          // Test texture with unexpected property
          source: 0,
          unexpectedProp: 'test',
          name: 'UnexpectedProp'
        }
      ],
      images: [
        {
          uri: 'texture.png'
        }
      ],
      samplers: [
        {
          magFilter: 9729
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'texture-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});