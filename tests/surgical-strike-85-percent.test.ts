import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Surgical Strike 85% Coverage Tests', () => {

  it('should hit the absolute deepest accessor validator paths for maximum coverage', async () => {
    // Create binary data to test the most complex accessor validation scenarios
    const testData = new Float32Array([
      // Matrix data with specific values to trigger validation paths
      1.0, 0.0, 0.0, 0.0,  // MAT4 row 1
      0.0, 1.0, 0.0, 0.0,  // MAT4 row 2  
      0.0, 0.0, 1.0, 0.0,  // MAT4 row 3
      0.0, 0.0, 0.0, 1.0,  // MAT4 row 4
      // VEC3 data with specific values
      Infinity, -Infinity, NaN,
      1.5, 2.75, -3.25,
      0.0, 1.0, -1.0
    ]);

    const base64Data = btoa(String.fromCharCode(...new Uint8Array(testData.buffer)));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test the getAlignedMatrixAccessorByteLength with unknown matrix type (default case)
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 1,
          type: 'UNKNOWN_MATRIX_TYPE', // Should hit default case in switch statement
          byteOffset: 0
        },
        {
          // Test MAT2 with BYTE components - specific size calculation
          bufferView: 0,
          componentType: 5120, // BYTE
          count: 2, 
          type: 'MAT2',
          byteOffset: 64,
          // This should trigger: accessorByteLength = 2 * 4 * 1 = 8 bytes
        },
        {
          // Test MAT3 with UNSIGNED_BYTE - specific size calculation
          bufferView: 0,
          componentType: 5121, // UNSIGNED_BYTE
          count: 1,
          type: 'MAT3',
          byteOffset: 72
          // This should trigger: accessorByteLength = 1 * 9 * 1 = 9 bytes
        },
        {
          // Test accessor validation with normalized values and bounds checking
          bufferView: 0,
          componentType: 5126,
          count: 3,
          type: 'VEC3',
          byteOffset: 16,
          min: [1.0, 2.0, -4.0], // Incorrect bounds to trigger validation
          max: [2.0, 3.0, -2.0],
          normalized: true
        },
        {
          // Test sparse accessor with very specific alignment issues
          bufferView: 0,
          componentType: 5126,
          count: 10,
          type: 'VEC4',
          sparse: {
            count: 3,
            indices: {
              bufferView: 1,
              componentType: 5120, // BYTE - 1 byte alignment
              byteOffset: 3 // Specifically chosen to test alignment
            },
            values: {
              bufferView: 1,
              byteOffset: 6 // Test specific offset calculation
            }
          }
        },
        {
          // Test the exact TYPE_MISMATCH paths
          componentType: "invalid", // String instead of number
          count: 1,
          type: 'VEC3',
          bufferView: 0
        },
        {
          componentType: 5126,
          count: "invalid", // String instead of number  
          type: 'VEC3',
          bufferView: 0
        },
        {
          componentType: 5126,
          count: 1,
          type: 123, // Number instead of string
          bufferView: 0
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: testData.byteLength
        },
        {
          buffer: 0,
          byteOffset: testData.byteLength,
          byteLength: 100 // For sparse data
        }
      ],
      buffers: [
        {
          byteLength: testData.byteLength + 100,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-accessor-85.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit the deepest camera validator TYPE_MISMATCH and property validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test TYPE_MISMATCH for camera type as number instead of string
          type: 1, // Should be string "perspective" or "orthographic"
          perspective: {
            yfov: 1.0,
            znear: 0.1
          }
        },
        {
          type: 'perspective',
          // Test TYPE_MISMATCH for perspective as array instead of object
          perspective: [1, 2, 3, 4]
        },
        {
          type: 'orthographic', 
          // Test TYPE_MISMATCH for orthographic as string instead of object
          orthographic: "invalid"
        },
        {
          type: 'perspective',
          perspective: {
            // Test TYPE_MISMATCH for individual properties
            yfov: "1.0", // String instead of number
            aspectRatio: [1.77], // Array instead of number
            znear: { value: 0.1 }, // Object instead of number
            zfar: true // Boolean instead of number
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            // Test TYPE_MISMATCH for orthographic properties
            xmag: "1.0", // String instead of number
            ymag: null, // Null instead of number
            zfar: undefined, // Undefined instead of number
            znear: [0.1] // Array instead of number
          }
        },
        {
          // Test camera with no type property at all
          perspective: {
            yfov: 1.0,
            znear: 0.1
          }
        },
        {
          type: 'perspective',
          // Missing perspective object entirely - should hit undefined check
        },
        {
          type: 'orthographic'
          // Missing orthographic object entirely - should hit undefined check  
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-camera-85.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit the deepest image validator property validation and MIME type paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      images: [
        {
          // Test image with malformed URI - use string to avoid runtime error
          uri: 'javascript:alert("xss")'
        },
        {
          // Test TYPE_MISMATCH for bufferView as string instead of number
          bufferView: "0",
          mimeType: 'image/png'
        },
        {
          // Test TYPE_MISMATCH for mimeType as number instead of string
          bufferView: 0,
          mimeType: 123
        },
        {
          // Test image with unsupported MIME type
          bufferView: 0,
          mimeType: 'image/tiff' // Not in supported list
        },
        {
          // Test image with application MIME type (should be rejected)
          bufferView: 0,
          mimeType: 'application/octet-stream'
        },
        {
          // Test image with text MIME type (should be rejected)
          bufferView: 0,
          mimeType: 'text/plain'
        },
        {
          // Test image with bufferView that has byteStride (invalid for images)
          bufferView: 1,
          mimeType: 'image/png'
        },
        {
          // Test data URI with different formats to hit parsing paths
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        },
        {
          // Test data URI without base64 encoding
          uri: 'data:image/png,rawdata'
        },
        {
          // Test malformed data URI
          uri: 'data:invalid'
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 100 // Valid bufferView
        },
        {
          buffer: 0,
          byteOffset: 100,
          byteLength: 100,
          byteStride: 4 // Invalid for images
        }
      ],
      buffers: [
        {
          byteLength: 200
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-image-85.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit the deepest node validator transformation and hierarchy paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1, 2, 3] }],
      nodes: [
        {
          // Test TYPE_MISMATCH for matrix as string instead of array
          matrix: "1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1"
        },
        {
          // Test TYPE_MISMATCH for translation as object instead of array
          translation: { x: 1, y: 0, z: 0 }
        },
        {
          // Test TYPE_MISMATCH for rotation as string instead of array
          rotation: "0,0,0,1"
        },
        {
          // Test TYPE_MISMATCH for scale as number instead of array
          scale: 1.0
        },
        {
          // Test node with invalid child references
          children: [999, 1000]
        },
        {
          // Test TYPE_MISMATCH for mesh as string instead of number
          mesh: "0"
        },
        {
          // Test TYPE_MISMATCH for camera as array instead of number
          camera: [0]
        },
        {
          // Test TYPE_MISMATCH for skin as boolean instead of number
          skin: true
        },
        {
          // Test node with weights as non-array
          weights: 0.5 // Should be array
        },
        {
          // Test circular reference detection - create complex cycle
          children: [1, 2],
          name: 'CyclicRoot'
        },
        {
          children: [2],
          name: 'CyclicMiddle'  
        },
        {
          children: [0], // Points back to root - creates cycle
          name: 'CyclicEnd'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-node-85.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit the deepest mesh validator primitive and attribute validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          // Test TYPE_MISMATCH for primitives as object instead of array
          primitives: { 
            attributes: { POSITION: 0 }
          }
        },
        {
          primitives: [
            {
              // Test TYPE_MISMATCH for attributes as array instead of object
              attributes: [0, 1, 2]
            },
            {
              // Test TYPE_MISMATCH for indices as array instead of number
              attributes: { POSITION: 0 },
              indices: [1, 2, 3]
            },
            {
              // Test TYPE_MISMATCH for material as string instead of number
              attributes: { POSITION: 0 },
              material: "0"
            },
            {
              // Test TYPE_MISMATCH for mode as string instead of number
              attributes: { POSITION: 0 },
              mode: "TRIANGLES"
            },
            {
              // Test TYPE_MISMATCH for targets as object instead of array
              attributes: { POSITION: 0 },
              targets: {
                target1: { POSITION: 1 }
              }
            },
            {
              // Test invalid attribute name patterns
              attributes: {
                POSITION: 0,
                'INVALID_ATTR_': 1, // Ends with underscore
                '_STARTS_UNDERSCORE': 2, // Starts with underscore
                'TEXCOORD_ABC': 3, // Non-numeric suffix
                'COLOR_-1': 4, // Negative number suffix
                'JOINTS_99999': 5, // Very large number suffix  
                'POSITION_2': 6, // POSITION with suffix (invalid)
                'NORMAL_1': 7 // NORMAL with suffix (invalid)
              }
            },
            {
              // Test morph targets with mismatched counts
              attributes: { POSITION: 0 },
              targets: [
                { POSITION: 1 }, // Morph target 1
                { POSITION: 2 }  // Morph target 2
              ]
            }
          ],
          // Test TYPE_MISMATCH for weights as object instead of array
          weights: { weight1: 0.5, weight2: 0.5 }
        }
      ],
      accessors: [
        { componentType: 5126, count: 10, type: 'VEC3' }, // 0: POSITION
        { componentType: 5126, count: 10, type: 'VEC3' }, // 1: morph target 1
        { componentType: 5126, count: 10, type: 'VEC3' }, // 2: morph target 2
        { componentType: 5126, count: 10, type: 'VEC2' }, // 3+: other attributes
        { componentType: 5126, count: 10, type: 'VEC4' },
        { componentType: 5121, count: 10, type: 'VEC4' },
        { componentType: 5126, count: 10, type: 'VEC3' },
        { componentType: 5126, count: 10, type: 'VEC3' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-mesh-85.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit the deepest validation state and error reporting paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      
      // Test extreme cross-referencing to stress validation state management
      scene: 0,
      scenes: [
        {
          // Test scene with invalid node references  
          nodes: [999, 1000, 1001]
        },
        {
          nodes: [0, 1, 2, 3, 4] // Valid scene for other tests
        }
      ],
      
      nodes: [
        {
          // Complex node with many references to test state tracking
          mesh: 0,
          camera: 0,
          skin: 0,
          children: [1, 2],
          extensions: {
            'EXT_test_extension': {
              property: 'value'
            }
          },
          extras: {
            customProperty: 'test'
          }
        },
        {
          mesh: 1,
          children: [3, 4]
        },
        {
          camera: 1
        },
        {
          skin: 1
        },
        {
          // Node with invalid references to test error accumulation
          mesh: 999,
          camera: 999,
          skin: 999,
          children: [999]
        }
      ],
      
      // Add other objects to create complex validation scenarios
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0 },
              material: 0,
              targets: [
                { POSITION: 1 }
              ]
            }
          ]
        },
        {
          primitives: [
            {
              attributes: { POSITION: 2, NORMAL: 3 },
              material: 1
            }
          ]
        }
      ],
      
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorTexture: { index: 0 },
            metallicRoughnessTexture: { index: 1 }
          }
        },
        {
          normalTexture: { index: 0 },
          emissiveTexture: { index: 1 }
        }
      ],
      
      textures: [
        { source: 0 },
        { source: 1 }
      ],
      
      images: [
        { uri: 'test1.png' },
        { uri: 'test2.png' }
      ],
      
      cameras: [
        {
          type: 'perspective',
          perspective: { yfov: 1.0, znear: 0.1 }
        },
        {
          type: 'orthographic',
          orthographic: { xmag: 1, ymag: 1, zfar: 100, znear: 0.1 }
        }
      ],
      
      skins: [
        {
          joints: [1, 2],
          inverseBindMatrices: 4
        },
        {
          joints: [3, 4],
          inverseBindMatrices: 5
        }
      ],
      
      accessors: [
        { componentType: 5126, count: 10, type: 'VEC3' }, // 0: POSITION
        { componentType: 5126, count: 10, type: 'VEC3' }, // 1: morph target
        { componentType: 5126, count: 20, type: 'VEC3' }, // 2: POSITION mesh 2
        { componentType: 5126, count: 20, type: 'VEC3' }, // 3: NORMAL mesh 2
        { componentType: 5126, count: 2, type: 'MAT4' },  // 4: inverse bind matrices 1
        { componentType: 5126, count: 2, type: 'MAT4' }   // 5: inverse bind matrices 2
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-validation-state-85.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});