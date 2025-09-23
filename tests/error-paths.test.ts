import { describe, it, expect, vi } from 'vitest';
import { validateBytes } from '../src/index';

describe('Error Paths and Edge Cases', () => {

  it('should handle all accessor validation error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [{
        primitives: [{
          attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2, TANGENT: 3 },
          indices: 4
        }]
      }],
      accessors: [
        // Position with wrong format
        { bufferView: 0, componentType: 5126, count: 10, type: 'VEC2' }, // Should be VEC3
        // Normal without bounds
        { bufferView: 1, componentType: 5126, count: 10, type: 'VEC3' }, // Missing min/max for positions
        // Texcoord with invalid format
        { bufferView: 2, componentType: 5120, count: 10, type: 'VEC2', normalized: false }, // BYTE not normalized
        // Tangent with wrong type
        { bufferView: 3, componentType: 5126, count: 10, type: 'VEC3' }, // Should be VEC4
        // Indices with wrong format
        { bufferView: 4, componentType: 5126, count: 30, type: 'VEC3' }, // Should be SCALAR
        // Sparse accessor
        {
          bufferView: 5,
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 15, // > accessor.count
            indices: { bufferView: 6, componentType: 5123 },
            values: { bufferView: 7 }
          }
        },
        // Float with normalized flag
        { bufferView: 8, componentType: 5126, count: 10, type: 'VEC3', normalized: true },
        // Misaligned offset
        { bufferView: 9, byteOffset: 1, componentType: 5126, count: 10, type: 'VEC3' },
        // Exceeds buffer view
        { bufferView: 10, componentType: 5126, count: 1000, type: 'VEC3' }
      ],
      bufferViews: Array.from({ length: 11 }, (_, i) => ({
        buffer: 0,
        byteOffset: i * 100,
        byteLength: i === 10 ? 50 : 100
      })),
      buffers: [{ byteLength: 2000 }]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(8);
  });

  it('should handle buffer validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        { byteLength: 0 }, // Zero length
        { byteLength: -100 }, // Negative length
        { uri: 'http://example.com/buffer.bin', byteLength: 100 }, // Non-relative URI
        { uri: 'data:text/plain;base64,SGVsbG8=', byteLength: 100 }, // Wrong MIME type
        { uri: 'data:application/octet-stream;base64,invalid', byteLength: 100 }, // Invalid base64
        { uri: 'data:application/octet-stream;base64,AAAA', byteLength: 100 }, // Wrong byte length
        { uri: 'ftp://example.com/buffer.bin', byteLength: 100 }, // Invalid URI scheme
        { uri: 'missing.bin', byteLength: 100 } // Will fail to load
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should handle buffer view validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 1000 }],
      bufferViews: [
        { buffer: 10, byteLength: 100 }, // Invalid buffer reference
        { buffer: 0, byteLength: 0 }, // Zero length
        { buffer: 0, byteLength: -100 }, // Negative length
        { buffer: 0, byteOffset: 500, byteLength: 600 }, // Exceeds buffer
        { buffer: 0, byteLength: 100, byteStride: 3 }, // Invalid stride (< 4)
        { buffer: 0, byteLength: 100, byteStride: 300 }, // Invalid stride (> 252)
        { buffer: 0, byteLength: 100, byteStride: 5 }, // Not 4-byte aligned
        { buffer: 0, byteLength: 100, byteStride: 8, target: 34963 }, // ELEMENT_ARRAY_BUFFER with stride
        { buffer: 0, byteLength: 100, target: 12345 } // Invalid target
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'bufferview-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(8);
  });

  it('should handle mesh validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 1000 }],
      bufferViews: [
        { buffer: 0, byteLength: 400, target: 34962 },
        { buffer: 0, byteOffset: 400, byteLength: 200, target: 34963, byteStride: 4 } // Invalid stride for image
      ],
      accessors: [
        { bufferView: 0, componentType: 5126, count: 25, type: 'VEC3', min: [-1,-1,-1], max: [1,1,1] },
        { bufferView: 0, componentType: 5126, count: 50, type: 'VEC3' }, // Different count
        { bufferView: 1, componentType: 5126, count: 25, type: 'SCALAR' } // Wrong component type for indices
      ],
      materials: [{}],
      meshes: [
        { primitives: [] }, // Empty primitives
        {
          primitives: [{
            attributes: { NORMAL: 0 } // Missing POSITION
          }]
        },
        {
          primitives: [{
            attributes: { POSITION: 10 }, // Invalid accessor
            indices: 10, // Invalid accessor
            material: 10, // Invalid material
            mode: 10 // Invalid mode
          }]
        },
        {
          primitives: [{
            attributes: { POSITION: 0, NORMAL: 1 }, // Different counts
          }]
        },
        {
          primitives: [{
            attributes: { POSITION: 0 },
            indices: 2 // Wrong component type for indices
          }]
        },
        {
          primitives: [
            {
              attributes: { POSITION: 0 },
              targets: [{ POSITION: 0 }, { POSITION: 0 }]
            },
            {
              attributes: { POSITION: 0 },
              targets: [{ POSITION: 0 }] // Different target count
            }
          ]
        },
        {
          primitives: [{
            attributes: { POSITION: 0 },
            targets: [{ NORMAL: 0 }] // Target without base
          }],
          weights: [0.5, 0.3, 0.2] // Wrong weight count
        }
      ],
      images: [
        { bufferView: 1 } // BufferView with stride
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mesh-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should handle camera validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        { type: 'invalid' }, // Invalid type
        { type: 'perspective' }, // Missing perspective properties
        { type: 'orthographic' }, // Missing orthographic properties
        {
          type: 'perspective',
          perspective: { yfov: 0, znear: 0.1 } // Invalid yfov
        },
        {
          type: 'perspective',
          perspective: { yfov: Math.PI + 1, znear: 0.1 } // yfov > PI
        },
        {
          type: 'perspective',
          perspective: { yfov: 1.0, znear: 0 } // Invalid znear
        },
        {
          type: 'perspective',
          perspective: { yfov: 1.0, znear: 10, zfar: 5 } // zfar < znear
        },
        {
          type: 'perspective',
          perspective: { yfov: 1.0, znear: 0.1, aspectRatio: 0 } // Invalid aspect ratio
        },
        {
          type: 'perspective',
          perspective: { yfov: 1.0, znear: Infinity } // Infinite znear
        },
        {
          type: 'orthographic',
          orthographic: { xmag: 0, ymag: 2, zfar: 10, znear: 0.1 } // Invalid xmag
        },
        {
          type: 'orthographic',
          orthographic: { xmag: 2, ymag: 0, zfar: 10, znear: 0.1 } // Invalid ymag
        },
        {
          type: 'orthographic',
          orthographic: { xmag: 2, ymag: 2, zfar: 0.1, znear: 10 } // zfar < znear
        },
        {
          type: 'orthographic',
          orthographic: { xmag: 2, ymag: 2, zfar: 10, znear: Infinity } // Infinite znear
        },
        {
          type: 'perspective',
          perspective: { yfov: 1.0, znear: 0.1 },
          orthographic: { xmag: 2, ymag: 2, zfar: 10, znear: 0.1 } // Both types
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThanOrEqual(12);
  });

  it('should handle material validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          alphaMode: 'invalid', // Invalid alpha mode
          alphaCutoff: -0.5 // Invalid cutoff
        },
        {
          alphaMode: 'MASK',
          alphaCutoff: 1.5 // Invalid cutoff > 1
        },
        {
          alphaMode: 'OPAQUE',
          alphaCutoff: 0.5 // Cutoff with non-MASK mode
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [1, 1, 1], // Wrong length
            metallicFactor: -0.5, // Invalid value
            roughnessFactor: 1.5, // Invalid value
            baseColorTexture: { index: 10 }, // Invalid texture
            metallicRoughnessTexture: { index: 10 }
          },
          normalTexture: { index: 10 },
          occlusionTexture: { index: 10 },
          emissiveTexture: { index: 10 },
          emissiveFactor: [1, 1] // Wrong length
        },
        {
          extensions: {
            KHR_materials_pbrSpecularGlossiness: {},
            KHR_materials_unlit: {} // Multiple extensions
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'material-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should handle node validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      nodes: [
        {
          matrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
          translation: [1, 2, 3] // Matrix and TRS
        },
        {
          translation: [1, 2] // Wrong length
        },
        {
          rotation: [0, 0, 1] // Wrong length
        },
        {
          scale: [1, 1] // Wrong length
        },
        {
          matrix: [1, 0, 0, 0, 0, 1] // Wrong length
        },
        {
          rotation: [2, 2, 2, 2] // Non-unit quaternion
        },
        {
          matrix: [1,0,0,0, 1,0,0,0, 0,0,1,0, 0,0,0,1] // Non-decomposable
        },
        {
          children: [0] // Self-reference
        },
        {
          children: [10], // Invalid child
          mesh: 10, // Invalid mesh
          camera: 10, // Invalid camera
          skin: 10 // Invalid skin
        },
        {
          skin: 0 // Skin without mesh
        },
        {
          weights: [0.5] // Weights without mesh
        },
        {
          translation: [Infinity, 0, 0] // Infinite values
        },
        {
          children: [] // Empty children
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'node-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should handle skin validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 1000 }],
      bufferViews: [{ buffer: 0, byteLength: 256 }],
      accessors: [
        { bufferView: 0, componentType: 5126, count: 4, type: 'MAT4' },
        { bufferView: 0, componentType: 5123, count: 4, type: 'MAT4' }, // Wrong component type
        { bufferView: 0, componentType: 5126, count: 4, type: 'VEC4' } // Wrong type
      ],
      nodes: Array.from({ length: 10 }, (_, i) => ({ name: `Node${i}` })),
      skins: [
        { joints: [] }, // Empty joints
        { joints: [10], inverseBindMatrices: 0 }, // Invalid joint
        { joints: [0, 1], skeleton: 10 }, // Invalid skeleton
        { joints: [0, 1], inverseBindMatrices: 10 }, // Invalid IBM accessor
        { joints: [0, 1, 2], inverseBindMatrices: 0 }, // Wrong IBM count (accessor has 4, skin has 3 joints)
        { joints: [0, 1], inverseBindMatrices: 1 }, // Wrong IBM component type
        { joints: [0, 1], inverseBindMatrices: 2 } // Wrong IBM type
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'skin-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(6);
  });

  it('should handle scene validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 10, // Invalid default scene
      nodes: [
        { children: [1] },
        { name: 'Child' },
        { name: 'Root2' }
      ],
      scenes: [
        { nodes: [] }, // Empty nodes
        { nodes: [10] }, // Invalid node
        { nodes: [0, 0] }, // Duplicate node
        { nodes: [1] } // Non-root node (child of 0)
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'scene-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should handle animation validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 1000 }],
      bufferViews: Array.from({ length: 10 }, (_, i) => ({
        buffer: 0,
        byteOffset: i * 100,
        byteLength: 100
      })),
      accessors: [
        { bufferView: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 1, componentType: 5126, count: 10, type: 'VEC3' },
        { bufferView: 2, componentType: 5126, count: 15, type: 'VEC3' }, // Wrong count
        { bufferView: 3, componentType: 5126, count: 10, type: 'VEC3' }, // Input - wrong type
        { bufferView: 4, componentType: 5126, count: 10, type: 'VEC2' }, // Output - wrong type for rotation
        { bufferView: 5, componentType: 5126, count: 1, type: 'SCALAR' }, // Too few for cubic
        { bufferView: 6, componentType: 5126, count: 3, type: 'VEC3' }
      ],
      nodes: [{ name: 'Target' }],
      animations: [
        {
          samplers: [], // Empty samplers
          channels: []
        },
        {
          samplers: [{ input: 0, output: 1, interpolation: 'LINEAR' }],
          channels: [] // Empty channels
        },
        {
          samplers: [
            { input: 10, output: 1, interpolation: 'LINEAR' }, // Invalid input
            { input: 0, output: 10, interpolation: 'LINEAR' }, // Invalid output
            { input: 0, output: 2, interpolation: 'LINEAR' }, // Count mismatch
            { input: 3, output: 1, interpolation: 'LINEAR' }, // Wrong input type
            { input: 0, output: 4, interpolation: 'LINEAR' }, // Wrong output type for rotation
            { input: 0, output: 1, interpolation: 'INVALID' }, // Invalid interpolation
            { input: 5, output: 6, interpolation: 'CUBICSPLINE' } // Too few frames for cubic
          ],
          channels: [
            { sampler: 10, target: { node: 0, path: 'translation' } }, // Invalid sampler
            { sampler: 0, target: { node: 10, path: 'translation' } }, // Invalid node
            { sampler: 1, target: { node: 0, path: 'invalid' } }, // Invalid path
            { sampler: 2, target: { node: 0, path: 'rotation' } }, // Type mismatch
            { sampler: 0, target: { node: 0, path: 'translation' } }, // Duplicate target
            { sampler: 1, target: { node: 0, path: 'translation' } }  // Duplicate target
          ]
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(12);
  });

  it('should handle GLB validation edge cases', async () => {
    const testCases = [
      // Invalid magic
      { magic: 0x12345678, version: 2, content: '{"asset":{"version":"2.0"}}' },
      // Unsupported version
      { magic: 0x46546C67, version: 1, content: '{"asset":{"version":"2.0"}}' },
      // Invalid JSON
      { magic: 0x46546C67, version: 2, content: '{"asset":' },
      // Empty JSON
      { magic: 0x46546C67, version: 2, content: '' },
    ];

    for (const testCase of testCases) {
      const jsonChunk = new TextEncoder().encode(testCase.content);
      const paddedJsonLength = Math.ceil(jsonChunk.length / 4) * 4;
      const paddedJsonChunk = new Uint8Array(paddedJsonLength);
      paddedJsonChunk.set(jsonChunk);

      const totalLength = 12 + 8 + paddedJsonLength;
      const buffer = new ArrayBuffer(totalLength);
      const view = new DataView(buffer);

      view.setUint32(0, testCase.magic, true);
      view.setUint32(4, testCase.version, true);
      view.setUint32(8, totalLength, true);
      view.setUint32(12, paddedJsonLength, true);
      view.setUint32(16, 0x4E4F534A, true);
      new Uint8Array(buffer, 20).set(paddedJsonChunk);

      const result = await validateBytes(new Uint8Array(buffer), { uri: 'test.glb' });
      expect(result.issues.numErrors).toBeGreaterThan(0);
    }
  });

  it.skip('should handle external resource loading errors', async () => {
    const mockLoader = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(new Uint8Array(50)); // Wrong size

    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        { uri: 'missing.bin', byteLength: 100 },
        { uri: 'wrong-size.bin', byteLength: 100 }
      ],
      images: [
        { uri: 'missing.png' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, {
      uri: 'external-errors.gltf',
      externalResourceFunction: mockLoader
    });

    expect(result.issues.numErrors).toBeGreaterThan(0);
    expect(mockLoader).toHaveBeenCalledTimes(3);
  });

  it('should handle type validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scenes: 'not-array', // Should be array
      nodes: [
        'not-object', // Should be object
        { translation: 'not-array' }, // Should be array
        { children: 'not-array' } // Should be array
      ],
      meshes: [
        { primitives: 'not-array' } // Should be array
      ],
      accessors: [
        { count: 'not-number' } // Should be number
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'type-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should handle sampler and texture validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      samplers: [
        { magFilter: 12345 }, // Invalid filter
        { minFilter: 12345 }, // Invalid filter
        { wrapS: 12345 }, // Invalid wrap
        { wrapT: 12345 } // Invalid wrap
      ],
      textures: [
        { source: 10 }, // Invalid source
        { source: 0, sampler: 10 } // Invalid sampler
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'sampler-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should achieve maximum coverage with all error combinations', async () => {
    // Create a GLTF that hits as many error paths as possible
    const maxErrorGltf = {
      asset: { version: '1.0' }, // Wrong version
      scene: 999,
      scenes: [
        { nodes: [] }, // Empty nodes
        { nodes: [999, 0, 0] } // Invalid + duplicate
      ],
      nodes: [
        {
          matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
          translation: [1,2,3], // Matrix + TRS
          rotation: [1,1,1,1], // Non-unit
          children: [0, 999], // Self + invalid
          mesh: 999,
          camera: 999,
          skin: 999,
          weights: [1,2,3]
        }
      ],
      meshes: [
        { primitives: [] },
        {
          primitives: [{
            attributes: { NORMAL: 999 },
            indices: 999,
            material: 999,
            mode: 999,
            targets: [{ UNKNOWN: 999 }]
          }],
          weights: [1]
        }
      ],
      // Continue with all other object types with errors...
      accessors: [{ count: 0, type: 'INVALID', componentType: 999 }],
      bufferViews: [{ buffer: 999, byteLength: -1 }],
      buffers: [{ byteLength: -1, uri: 'http://invalid' }],
      materials: [{ alphaMode: 'INVALID', alphaCutoff: -1 }],
      textures: [{ source: 999, sampler: 999 }],
      images: [{ uri: 'http://invalid' }],
      samplers: [{ magFilter: 999, minFilter: 999 }],
      cameras: [{ type: 'INVALID' }],
      skins: [{ joints: [], inverseBindMatrices: 999 }],
      animations: [{
        samplers: [],
        channels: [{
          sampler: 999,
          target: { node: 999, path: 'INVALID' }
        }]
      }]
    };

    const data = new TextEncoder().encode(JSON.stringify(maxErrorGltf));
    const result = await validateBytes(data, { uri: 'max-errors.gltf' });

    expect(result.issues.numErrors).toBeGreaterThan(20);
  });

});
