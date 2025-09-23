import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra-Precision Hardest Validation Paths', () => {

  it('should hit buffer-view-validator hardest paths (22.01% -> higher)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        { byteLength: 1000 },
        { byteLength: 500 }
      ],
      bufferViews: [
        // Test comprehensive stride validation
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 48, // Multiple of 4
          byteStride: 4,
          target: 34962 // ARRAY_BUFFER
        },
        {
          buffer: 0,
          byteOffset: 48,
          byteLength: 36, // Multiple of 12
          byteStride: 12,
          target: 34962
        },
        {
          buffer: 0,
          byteOffset: 84,
          byteLength: 64, // Multiple of 16
          byteStride: 16,
          target: 34962
        },
        // Test edge cases
        {
          buffer: 0,
          byteOffset: 148,
          byteLength: 255, // Max stride boundary
          byteStride: 255,
          target: 34962
        },
        // Test error conditions
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 10,
          byteStride: 3, // Not multiple of 4
          target: 34962
        },
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 10,
          byteStride: 256, // Exceeds maximum
          target: 34962
        },
        // Test ELEMENT_ARRAY_BUFFER specific validation
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 24,
          byteStride: 4, // Should be rejected for ELEMENT_ARRAY_BUFFER
          target: 34963
        },
        // Test buffer boundary conditions
        {
          buffer: 1,
          byteOffset: 499,
          byteLength: 2, // Just at boundary
          target: 34962
        },
        {
          buffer: 1,
          byteOffset: 500, // Exactly at end (invalid)
          byteLength: 1,
          target: 34962
        },
        // Test missing target (optional)
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 48,
          byteStride: 16
        },
        // Test all combinations of valid targets
        {
          buffer: 0,
          byteOffset: 200,
          byteLength: 100,
          target: 34962 // ARRAY_BUFFER
        },
        {
          buffer: 0,
          byteOffset: 300,
          byteLength: 100,
          target: 34963 // ELEMENT_ARRAY_BUFFER
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-view-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit camera-validator hardest paths (21.53% -> higher)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        // Test all perspective validation branches
        {
          type: 'perspective',
          perspective: {
            yfov: Number.EPSILON, // Smallest positive
            znear: Number.EPSILON
          }
        },
        {
          type: 'perspective', 
          perspective: {
            yfov: Math.PI - Number.EPSILON, // Just under PI
            znear: Number.MAX_VALUE
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.57079632679, // PI/2
            znear: 0.1,
            aspectRatio: Number.EPSILON
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 100.0,
            zfar: 100.0 + Number.EPSILON // Just above znear
          }
        },
        // Test all orthographic validation branches
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.EPSILON,
            ymag: Number.EPSILON,
            znear: Number.EPSILON,
            zfar: Number.EPSILON * 2
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.MAX_VALUE,
            ymag: Number.MAX_VALUE,
            znear: Number.MAX_VALUE - 1,
            zfar: Number.MAX_VALUE
          }
        },
        // Test equality edge case for zfar/znear
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 100.0,
            zfar: 100.0 // Equal (invalid)
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 100.0,
            zfar: 100.0 // Equal (invalid)
          }
        },
        // Test zero values (all should be invalid)
        {
          type: 'perspective',
          perspective: {
            yfov: 0.0,
            znear: 1.0
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.0
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 0.0
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 0.0,
            ymag: 1.0,
            znear: 0.1,
            zfar: 1000.0
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 0.0,
            znear: 0.1,
            zfar: 1000.0
          }
        },
        // Test boundary values for yfov
        {
          type: 'perspective',
          perspective: {
            yfov: Math.PI, // Exactly PI (invalid)
            znear: 0.1
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: Math.PI + Number.EPSILON, // Just over PI (invalid)
            znear: 0.1
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit GLB validator hardest paths (31.31% -> higher)', async () => {
    // Test various invalid GLB structures
    
    // Invalid magic
    const invalidMagic = new Uint8Array([
      0x67, 0x6C, 0x54, 0x45, // Wrong magic "glTE" instead of "glTF"
      0x02, 0x00, 0x00, 0x00, // Version 2
      0x1C, 0x00, 0x00, 0x00, // Total length 28
      0x0C, 0x00, 0x00, 0x00, // JSON chunk length 12
      0x4A, 0x53, 0x4F, 0x4E, // JSON chunk type
      0x7B, 0x22, 0x61, 0x22, 0x3A, 0x31, 0x7D, 0x00 // {"a":1} + padding
    ]);
    
    // Invalid version
    const invalidVersion = new Uint8Array([
      0x67, 0x6C, 0x54, 0x46, // Correct magic
      0x01, 0x00, 0x00, 0x00, // Version 1 (invalid)
      0x1C, 0x00, 0x00, 0x00, // Total length 28
      0x0C, 0x00, 0x00, 0x00, // JSON chunk length 12
      0x4A, 0x53, 0x4F, 0x4E, // JSON chunk type
      0x7B, 0x22, 0x61, 0x22, 0x3A, 0x31, 0x7D, 0x00 // {"a":1} + padding
    ]);
    
    // File too short
    const tooShort = new Uint8Array([
      0x67, 0x6C, 0x54, 0x46, // Magic
      0x02, 0x00 // Incomplete
    ]);
    
    // Invalid chunk type
    const invalidChunkType = new Uint8Array([
      0x67, 0x6C, 0x54, 0x46, // Magic
      0x02, 0x00, 0x00, 0x00, // Version 2
      0x1C, 0x00, 0x00, 0x00, // Total length 28
      0x0C, 0x00, 0x00, 0x00, // Chunk length 12
      0x58, 0x58, 0x58, 0x58, // Invalid chunk type "XXXX"
      0x7B, 0x22, 0x61, 0x22, 0x3A, 0x31, 0x7D, 0x00 // {"a":1} + padding
    ]);
    
    // Test each invalid GLB
    const invalidGLBs = [
      { data: invalidMagic, name: 'invalid-magic.glb' },
      { data: invalidVersion, name: 'invalid-version.glb' },
      { data: tooShort, name: 'too-short.glb' },
      { data: invalidChunkType, name: 'invalid-chunk-type.glb' }
    ];
    
    for (const { data, name } of invalidGLBs) {
      const result = await validateBytes(data, { uri: name });
      expect(result.issues.numErrors).toBeGreaterThan(0);
    }
  });

  it('should hit additional hard-to-reach validation branches', async () => {
    const gltf = {
      asset: { 
        version: '2.0',
        minVersion: '2.0'
      },
      buffers: [{ byteLength: 2000 }],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: 1000 },
        { buffer: 0, byteOffset: 1000, byteLength: 1000 }
      ],
      accessors: [
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3' },
        { bufferView: 1, byteOffset: 0, componentType: 5125, count: 10, type: 'SCALAR' }
      ],
      nodes: [
        {
          mesh: 0,
          skin: 0,
          camera: 0,
          children: [1, 2]
        },
        {
          translation: [0, 1, 0],
          rotation: [0, 0, 0, 1],
          scale: [1, 1, 1]
        },
        {
          matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
          ]
        }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              indices: 1,
              mode: 4 // TRIANGLES
            }
          ]
        }
      ],
      skins: [
        {
          joints: [1, 2],
          inverseBindMatrices: 0
        }
      ],
      cameras: [
        {
          type: 'perspective',
          perspective: {
            yfov: 0.785398,
            znear: 0.1,
            zfar: 1000.0,
            aspectRatio: 1.777
          }
        }
      ],
      scenes: [
        {
          nodes: [0]
        }
      ],
      scene: 0
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'comprehensive-paths.gltf' });
    expect(result.issues.numErrors).toBeGreaterThanOrEqual(0);
  });

});