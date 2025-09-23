import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultimate Coverage Tests', () => {

  it('should hit accessor validator min/max and sparse validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test accessor with non-array min
          componentType: 5126, // FLOAT
          count: 10,
          type: 'VEC3',
          min: "not an array"
        },
        {
          // Test accessor with non-array max
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          max: "not an array"
        },
        {
          // Test accessor with sparse data and byteStride in indices bufferView
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          bufferView: 0,
          sparse: {
            count: 10,
            indices: {
              bufferView: 1, // This will have byteStride
              componentType: 5123 // UNSIGNED_SHORT
            },
            values: {
              bufferView: 2 // This will also have byteStride
            }
          }
        },
        {
          // Test accessor with different alignment requirements
          componentType: 5122, // SHORT - 2 byte alignment
          count: 10,
          type: 'SCALAR',
          bufferView: 3,
          byteOffset: 1 // Not aligned to 2 bytes
        },
        {
          // Test accessor with UNSIGNED_INT - 4 byte alignment
          componentType: 5125, // UNSIGNED_INT
          count: 10,
          type: 'SCALAR',
          bufferView: 3,
          byteOffset: 2 // Not aligned to 4 bytes
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 1200 // 100 * VEC3 * FLOAT = 100 * 3 * 4 = 1200
        },
        {
          buffer: 0,
          byteOffset: 1200,
          byteLength: 20, // 10 * UNSIGNED_SHORT = 10 * 2 = 20
          byteStride: 4 // This should cause an error for sparse indices
        },
        {
          buffer: 0,
          byteOffset: 1220,
          byteLength: 120, // 10 * VEC3 * FLOAT = 10 * 3 * 4 = 120
          byteStride: 16 // This should cause an error for sparse values
        },
        {
          buffer: 0,
          byteOffset: 1340,
          byteLength: 100
        }
      ],
      buffers: [
        {
          byteLength: 1500
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-min-max-sparse.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit extensive sparse accessor validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            // Test sparse with missing count
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
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            // Test sparse with missing indices
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 5123
            }
            // Test sparse with missing values
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: -1, // Invalid count
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
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              // Missing bufferView
              componentType: 5123
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: -1, // Invalid bufferView
              componentType: 5123
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
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
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              // Missing componentType
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 9999 // Invalid componentType
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 5126, // FLOAT - invalid for indices
              byteOffset: -1 // Invalid byteOffset
            },
            values: {
              bufferView: 1,
              byteOffset: "invalid" // Non-number byteOffset
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
          byteLength: 120
        }
      ],
      buffers: [
        {
          byteLength: 200
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'sparse-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit buffer validator additional URI validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          byteLength: 100,
          // Test plain data URI (not base64)
          uri: 'data:application/octet-stream,rawdatahere'
        },
        {
          byteLength: 100,
          // Test data URI with valid MIME type variant
          uri: 'data:application/gltf-buffer;base64,dGVzdGRhdGE='
        },
        {
          byteLength: 100,
          // Test HTTP URI (should generate warning)
          uri: 'http://example.com/buffer.bin'
        },
        {
          byteLength: 100,
          // Test malformed URI with multiple issues
          uri: 'data:invalid-mime;;base64invalid-data'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-uri-edge-cases.gltf' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit remaining mesh validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          // Test mesh with no primitives
          name: 'NoPrimitives'
        },
        {
          // Test mesh with empty primitives array
          primitives: [],
          name: 'EmptyPrimitives'
        },
        {
          // Test mesh with primitive missing attributes
          primitives: [
            {
              // Missing attributes
              indices: 0
            }
          ],
          name: 'MissingAttributes'
        },
        {
          // Test mesh with primitive invalid attributes
          primitives: [
            {
              attributes: "not an object"
            }
          ],
          name: 'InvalidAttributes'
        },
        {
          // Test mesh with primitive invalid indices
          primitives: [
            {
              attributes: { POSITION: 0 },
              indices: -1
            }
          ],
          name: 'InvalidIndices'
        },
        {
          // Test mesh with primitive unresolved indices
          primitives: [
            {
              attributes: { POSITION: 0 },
              indices: 999
            }
          ],
          name: 'UnresolvedIndices'
        },
        {
          // Test mesh with primitive invalid material
          primitives: [
            {
              attributes: { POSITION: 0 },
              material: -1
            }
          ],
          name: 'InvalidMaterial'
        },
        {
          // Test mesh with primitive unresolved material
          primitives: [
            {
              attributes: { POSITION: 0 },
              material: 999
            }
          ],
          name: 'UnresolvedMaterial'
        },
        {
          // Test mesh with primitive invalid mode
          primitives: [
            {
              attributes: { POSITION: 0 },
              mode: 999
            }
          ],
          name: 'InvalidMode'
        },
        {
          // Test mesh with primitive invalid targets
          primitives: [
            {
              attributes: { POSITION: 0 },
              targets: "not an array"
            }
          ],
          name: 'InvalidTargets'
        },
        {
          // Test mesh with unexpected properties
          primitives: [
            {
              attributes: { POSITION: 0 },
              unexpectedProp: 'test'
            }
          ],
          unexpectedMeshProp: 'test',
          name: 'UnexpectedProps'
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
    const result = await validateBytes(data, { uri: 'mesh-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining skin validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      skins: [
        {
          // Test skin without joints
          name: 'NoJoints'
        },
        {
          // Test skin with empty joints
          joints: [],
          name: 'EmptyJoints'
        },
        {
          // Test skin with non-array joints
          joints: "not an array",
          name: 'NonArrayJoints'
        },
        {
          // Test skin with invalid joint reference
          joints: [-1],
          name: 'InvalidJoint'
        },
        {
          // Test skin with unresolved joint reference
          joints: [999],
          name: 'UnresolvedJoint'
        },
        {
          // Test skin with invalid skeleton reference
          joints: [0],
          skeleton: -1,
          name: 'InvalidSkeleton'
        },
        {
          // Test skin with unresolved skeleton reference
          joints: [0],
          skeleton: 999,
          name: 'UnresolvedSkeleton'
        },
        {
          // Test skin with invalid inverseBindMatrices reference
          joints: [0],
          inverseBindMatrices: -1,
          name: 'InvalidInverseBindMatrices'
        },
        {
          // Test skin with unresolved inverseBindMatrices reference
          joints: [0],
          inverseBindMatrices: 999,
          name: 'UnresolvedInverseBindMatrices'
        },
        {
          // Test skin with unexpected properties
          joints: [0],
          unexpectedProp: 'test',
          name: 'UnexpectedProps'
        }
      ],
      nodes: [
        {
          name: 'Joint1'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'skin-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});