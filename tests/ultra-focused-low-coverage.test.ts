import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra-Focused Low Coverage Validators', () => {

  it('should target buffer-view-validator (22.01% coverage)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 100 }],
      bufferViews: [
        // Test all buffer view validation paths
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 50,
          byteStride: 4, // Valid stride
          target: 34962 // ARRAY_BUFFER
        },
        {
          buffer: 0,
          byteOffset: 50,
          byteLength: 25,
          byteStride: 12, // Valid for vertex attributes
          target: 34963 // ELEMENT_ARRAY_BUFFER
        },
        {
          buffer: 0,
          byteOffset: 75,
          byteLength: 25,
          byteStride: 255, // Maximum valid stride
          target: 34962
        },
        // Test validation errors
        {
          buffer: 999, // Invalid buffer reference
          byteOffset: 0,
          byteLength: 10
        },
        {
          buffer: 0,
          byteOffset: 150, // Exceeds buffer length
          byteLength: 10
        },
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 200 // Exceeds buffer length
        },
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 10,
          byteStride: 256 // Exceeds maximum stride
        },
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 10,
          byteStride: 3 // Invalid stride alignment
        },
        {
          buffer: 0,
          byteOffset: 1, // Misaligned offset
          byteLength: 10,
          byteStride: 4
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-view-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target camera-validator (21.53% coverage)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        // Test all camera validation error paths
        {
          type: 'perspective',
          perspective: {
            yfov: 0, // Invalid: must be > 0
            znear: 0.1
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: Math.PI + 0.1, // Invalid: must be < PI
            znear: 0.1
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0 // Invalid: must be > 0
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 10.0,
            zfar: 5.0 // Invalid: must be > znear
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 0 // Invalid: must be > 0
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 0, // Invalid: must be > 0
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 0, // Invalid: must be > 0
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 5.0,
            znear: 10.0 // Invalid: zfar <= znear
          }
        },
        {
          type: 'invalid_type' // Invalid camera type
        },
        {
          // Missing type and camera objects
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target glb-validator (25.25% coverage)', async () => {
    // Test invalid GLB headers and structures
    const invalidGlbHeaders = [
      // Invalid magic number
      new Uint8Array([0x67, 0x6C, 0x54, 0x45, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
      // Invalid version
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
      // Too short header
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00]),
      // Invalid JSON chunk
      new Uint8Array([
        0x67, 0x6C, 0x54, 0x46, // Magic
        0x02, 0x00, 0x00, 0x00, // Version
        0x20, 0x00, 0x00, 0x00, // Length
        0x10, 0x00, 0x00, 0x00, // Chunk length
        0x4A, 0x53, 0x4F, 0x4E, // JSON type
        0x7B, 0x22, 0x61, 0x73, 0x73, 0x65, 0x74, 0x22, 0x3A, 0x7B, 0x22, 0x76, // Invalid JSON
      ])
    ];

    for (const invalidGlb of invalidGlbHeaders) {
      const result = await validateBytes(invalidGlb, { uri: 'invalid.glb' });
      expect(result.issues.numErrors).toBeGreaterThan(0);
    }
  });

  it('should target mesh-validator specific error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 1000 }],
      bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 1000 }],
      accessors: [
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 3, type: 'VEC3' },
        { bufferView: 0, byteOffset: 36, componentType: 5125, count: 3, type: 'SCALAR' }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                INVALID_ATTRIBUTE: 999 // Invalid accessor reference
              },
              indices: 1,
              mode: 999, // Invalid primitive mode
              material: 999 // Invalid material reference
            },
            {
              attributes: {
                POSITION: 999 // Invalid accessor reference
              },
              indices: 999 // Invalid accessor reference
            },
            {
              // Missing attributes (required)
              indices: 1
            }
          ]
        },
        {
          // Empty primitives array
          primitives: []
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mesh-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target material-validator specific paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 999, // Invalid texture reference
              texCoord: 1
            },
            metallicRoughnessTexture: {
              index: 999, // Invalid texture reference
              texCoord: 2
            },
            baseColorFactor: [1.0, 1.0, 1.0, 1.0],
            metallicFactor: 1.0,
            roughnessFactor: 1.0
          },
          normalTexture: {
            index: 999, // Invalid texture reference
            texCoord: 0,
            scale: 1.0
          },
          occlusionTexture: {
            index: 999, // Invalid texture reference
            texCoord: 0,
            strength: 1.0
          },
          emissiveTexture: {
            index: 999, // Invalid texture reference
            texCoord: 0
          },
          emissiveFactor: [1.0, 1.0, 1.0],
          alphaMode: 'INVALID_MODE', // Invalid alpha mode
          alphaCutoff: 0.5,
          doubleSided: true
        },
        {
          // Test factor validation
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 1.0, 1.0, -0.1], // Invalid: negative alpha
            metallicFactor: -0.1, // Invalid: negative
            roughnessFactor: 1.1 // Invalid: > 1.0
          },
          emissiveFactor: [1.1, 1.0, 1.0], // Invalid: > 1.0
          alphaCutoff: -0.1 // Invalid: negative
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'material-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});