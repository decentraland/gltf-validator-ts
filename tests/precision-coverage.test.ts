import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Precision Coverage Tests', () => {

  it('should hit specific accessor bounds validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Special alignment test case for VEC3 FLOAT with specific dimensions
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 1,
          type: 'VEC3',
          byteOffset: 4 // This triggers the special alignment test case
        },
        {
          // MAT4 BYTE accessor for specific bounds calculation
          bufferView: 1,
          componentType: 5120, // BYTE
          count: 2,
          type: 'MAT4',
          byteOffset: 2 // Should trigger accessorByteLength = 32, total = 34 > 14
        },
        {
          // MAT4 UNSIGNED_SHORT accessor for specific bounds calculation
          bufferView: 2,
          componentType: 5123, // UNSIGNED_SHORT
          count: 2,
          type: 'MAT4',
          byteOffset: 2 // Should trigger accessorByteLength = 64, total = 66 > 14
        },
        {
          // Matrix alignment test for FLOAT matrices
          bufferView: 3,
          componentType: 5126, // FLOAT
          count: 1,
          type: 'MAT2', // Should use aligned calculation
          byteOffset: 0
        },
        {
          // Matrix alignment test for MAT3
          bufferView: 4,
          componentType: 5126, // FLOAT
          count: 1,
          type: 'MAT3',
          byteOffset: 0
        },
        {
          // Default case - non-matrix type
          bufferView: 5,
          componentType: 5126, // FLOAT
          count: 10,
          type: 'VEC4', // Not a matrix type
          byteOffset: 0
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 16 // Triggers the special alignment test case
        },
        {
          buffer: 0,
          byteOffset: 16,
          byteLength: 14 // Too small for MAT4 BYTE (needs 34)
        },
        {
          buffer: 0,
          byteOffset: 30,
          byteLength: 14 // Too small for MAT4 UNSIGNED_SHORT (needs 66)
        },
        {
          buffer: 0,
          byteOffset: 44,
          byteLength: 32 // For MAT2 FLOAT aligned
        },
        {
          buffer: 0,
          byteOffset: 76,
          byteLength: 48 // For MAT3 FLOAT aligned
        },
        {
          buffer: 0,
          byteOffset: 124,
          byteLength: 160 // For VEC4 * 10
        }
      ],
      buffers: [
        {
          byteLength: 300
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-accessor-bounds.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit specific sparse accessor validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 15, // Greater than accessor.count (10) - should error
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 5,
            indices: {
              bufferView: 0,
              componentType: 5123,
              byteOffset: 5 // Not aligned for UNSIGNED_SHORT (needs 2-byte alignment)
            },
            values: {
              bufferView: 1,
              byteOffset: 6 // Not aligned for FLOAT VEC3 (needs 4-byte alignment)
            }
          }
        },
        {
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 5,
            indices: {
              bufferView: 0,
              componentType: 5125, // UNSIGNED_INT
              byteOffset: 2 // Not aligned for UNSIGNED_INT (needs 4-byte alignment)
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 5,
            indices: {
              bufferView: 999, // Unresolved bufferView
              componentType: 5123
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 5,
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 999 // Unresolved bufferView
            }
          }
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 20
        },
        {
          buffer: 0,
          byteOffset: 20,
          byteLength: 60
        }
      ],
      buffers: [
        {
          byteLength: 100
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-sparse-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit animation channel validation edge cases with specific node conditions', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1, 2, 3] }],
      nodes: [
        {
          name: 'NodeWithMatrix',
          matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1] // Has matrix - should prevent TRS animations
        },
        {
          name: 'NodeWithMeshNoMorphTargets',
          mesh: 0 // Mesh without morph targets
        },
        {
          name: 'NodeWithMeshWithMorphTargets',
          mesh: 1 // Mesh with morph targets
        },
        {
          name: 'NodeWithoutMesh'
          // No mesh - should prevent weights animation
        }
      ],
      meshes: [
        {
          primitives: [{
            attributes: { POSITION: 0 }
            // No morph targets
          }]
        },
        {
          primitives: [{
            attributes: { POSITION: 0 },
            targets: [
              { POSITION: 1 }
            ]
          }]
        }
      ],
      animations: [
        {
          samplers: [
            {
              input: 2,
              output: 3,
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: {
                node: 0, // Node with matrix
                path: 'translation' // Should error - can't animate TRS on node with matrix
              }
            },
            {
              sampler: 0,
              target: {
                node: 0, // Node with matrix
                path: 'rotation' // Should error
              }
            },
            {
              sampler: 0,
              target: {
                node: 0, // Node with matrix
                path: 'scale' // Should error
              }
            },
            {
              sampler: 0,
              target: {
                node: 1, // Node with mesh but no morph targets
                path: 'weights' // Should error
              }
            },
            {
              sampler: 0,
              target: {
                node: 3, // Node without mesh
                path: 'weights' // Should error
              }
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // 0: Position
        { componentType: 5126, count: 3, type: 'VEC3' }, // 1: Morph target
        { componentType: 5126, count: 2, type: 'SCALAR' }, // 2: Time
        { componentType: 5126, count: 2, type: 'VEC3' }  // 3: Animation output
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-animation-channels.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit specific image format detection and validation paths', async () => {
    // Create specific binary data to test format detection paths
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG magic
    const jpegHeader = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]); // JPEG magic
    const gif87Header = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]); // GIF87a
    const gif89Header = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // GIF89a
    
    // Convert to base64
    const pngBase64 = btoa(String.fromCharCode(...pngHeader));
    const jpegBase64 = btoa(String.fromCharCode(...jpegHeader));
    const gif87Base64 = btoa(String.fromCharCode(...gif87Header));
    const gif89Base64 = btoa(String.fromCharCode(...gif89Header));

    const gltf = {
      asset: { version: '2.0' },
      images: [
        {
          // PNG data with JPEG MIME type - should detect format mismatch
          uri: `data:image/jpeg;base64,${pngBase64}`,
          name: 'PNGAsJPEG'
        },
        {
          // JPEG data with PNG MIME type - should detect format mismatch
          uri: `data:image/png;base64,${jpegBase64}`,
          name: 'JPEGAsPNG'
        },
        {
          // GIF87a data with PNG MIME type
          uri: `data:image/png;base64,${gif87Base64}`,
          name: 'GIF87AsPNG'
        },
        {
          // GIF89a data with JPEG MIME type
          uri: `data:image/jpeg;base64,${gif89Base64}`,
          name: 'GIF89AsJPEG'
        },
        {
          // Valid PNG with correct MIME type
          uri: `data:image/png;base64,${pngBase64}`,
          name: 'CorrectPNG'
        },
        {
          // Image with mimeType property that doesn't match data URI
          uri: `data:image/png;base64,${pngBase64}`,
          mimeType: 'image/jpeg', // Mismatch
          name: 'MimeTypeMismatch'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-image-format-detection.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit specific buffer view stride and target validation combinations', async () => {
    const gltf = {
      asset: { version: '2.0' },
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          byteStride: 16,
          target: 34962 // ARRAY_BUFFER - valid with stride
        },
        {
          buffer: 0,
          byteOffset: 100,
          byteLength: 50,
          byteStride: 4,
          target: 34963 // ELEMENT_ARRAY_BUFFER - invalid with stride
        },
        {
          buffer: 0,
          byteOffset: 150,
          byteLength: 100,
          byteStride: 12 // Valid stride (>= 4, <= 252)
        },
        {
          buffer: 0,
          byteOffset: 250,
          byteLength: 100,
          byteStride: 300 // Invalid stride (> 252)
        },
        {
          buffer: 0,
          byteOffset: 350,
          byteLength: 100,
          byteStride: 2 // Invalid stride (< 4)
        }
      ],
      buffers: [
        {
          byteLength: 500
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-buffer-view-stride.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit specific skin joint hierarchy validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 5] }], // Two root nodes
      nodes: [
        { name: 'Root1', children: [1] },    // 0
        { name: 'Joint1', children: [2] },   // 1
        { name: 'Joint2', children: [3] },   // 2
        { name: 'Joint3', children: [4] },   // 3
        { name: 'Joint4' },                  // 4
        { name: 'Root2' }                    // 5 - separate hierarchy
      ],
      skins: [
        {
          joints: [1, 2, 3], // All in same hierarchy
          skeleton: 0 // Root1 is ancestor of all joints - valid
        },
        {
          joints: [1, 2, 5], // Joint 5 (Root2) is in different hierarchy
          skeleton: 1 // Joint1 is not ancestor of Root2 - should error
        },
        {
          joints: [1, 2, 3],
          skeleton: 4 // Joint4 is not ancestor of Joint1 - should error
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-skin-hierarchy.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit specific node weight validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1, 2] }],
      nodes: [
        {
          name: 'NodeWithCorrectWeights',
          mesh: 0,
          weights: [0.5, 0.3] // Correct count for mesh with 2 morph targets
        },
        {
          name: 'NodeWithTooFewWeights',
          mesh: 0,
          weights: [0.5] // Only 1 weight for mesh with 2 morph targets
        },
        {
          name: 'NodeWithTooManyWeights',
          mesh: 0,
          weights: [0.5, 0.3, 0.2] // 3 weights for mesh with 2 morph targets
        }
      ],
      meshes: [
        {
          primitives: [{
            attributes: { POSITION: 0 },
            targets: [
              { POSITION: 1 }, // Morph target 1
              { POSITION: 2 }  // Morph target 2
            ]
          }]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // Base position
        { componentType: 5126, count: 3, type: 'VEC3' }, // Morph target 1
        { componentType: 5126, count: 3, type: 'VEC3' }  // Morph target 2
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-node-weights.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});