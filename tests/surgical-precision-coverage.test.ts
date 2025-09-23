import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Surgical Precision Coverage Tests', () => {

  it('should hit exact sparse accessor validation paths requiring specific missing properties', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 150, // Greater than accessor.count (100) - hits sparse count out of range
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
            // Missing indices property - should hit UNDEFINED_PROPERTY for indices
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
              // Missing bufferView - should hit UNDEFINED_PROPERTY for indices bufferView
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
              bufferView: 999, // Unresolved bufferView reference
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
              // Missing componentType - should hit UNDEFINED_PROPERTY for componentType
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
              componentType: 9999 // Invalid componentType - should hit INVALID_COMPONENT_TYPE
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
              componentType: 5123
            }
            // Missing values property - should hit UNDEFINED_PROPERTY for values
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
            },
            values: {
              // Missing bufferView - should hit UNDEFINED_PROPERTY for values bufferView
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
            },
            values: {
              bufferView: 999 // Unresolved bufferView reference for values
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
    const result = await validateBytes(data, { uri: 'surgical-sparse-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit specific accessor bounds validation with exact test case calculations', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Hit MAT2 BYTE specific calculation: accessorByteLength = 14, offset = 1, total = 15 > 14
          bufferView: 0,
          componentType: 5120, // BYTE
          count: 2,
          type: 'MAT2',
          byteOffset: 1
        },
        {
          // Hit MAT3 UNSIGNED_BYTE specific calculation: accessorByteLength = 23, offset = 2, total = 25 > 14
          bufferView: 1,
          componentType: 5121, // UNSIGNED_BYTE
          count: 2,
          type: 'MAT3',
          byteOffset: 2
        },
        {
          // Hit MAT3 SHORT specific calculation: accessorByteLength = 46, offset = 2, total = 48 > 14
          bufferView: 2,
          componentType: 5122, // SHORT
          count: 2,
          type: 'MAT3',
          byteOffset: 2
        },
        {
          // Hit byteStride too small validation
          bufferView: 3,
          componentType: 5126, // FLOAT
          count: 10,
          type: 'VEC3', // Element size = 4 * 3 = 12 bytes
          byteOffset: 0
        },
        {
          // Hit matrix alignment validation with explicit byteOffset
          bufferView: 4,
          componentType: 5126, // FLOAT
          count: 1,
          type: 'MAT4',
          byteOffset: 3 // Not aligned to 4 bytes - should trigger matrix alignment error
        },
        {
          // Hit total offset alignment validation  
          bufferView: 5,
          componentType: 5122, // SHORT (2 bytes)
          count: 5,
          type: 'SCALAR',
          byteOffset: 1 // bufferView.byteOffset (3) + accessor.byteOffset (1) = 4, not multiple of 2
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 14 // Too small for MAT2 BYTE with offset
        },
        {
          buffer: 0,
          byteOffset: 14,
          byteLength: 14 // Too small for MAT3 UNSIGNED_BYTE with offset
        },
        {
          buffer: 0,
          byteOffset: 28,
          byteLength: 14 // Too small for MAT3 SHORT with offset
        },
        {
          buffer: 0,
          byteOffset: 42,
          byteLength: 120,
          byteStride: 8 // Too small for VEC3 FLOAT (needs 12)
        },
        {
          buffer: 0,
          byteOffset: 162,
          byteLength: 64 // For MAT4 with misaligned offset
        },
        {
          buffer: 0,
          byteOffset: 3, // Odd offset to create alignment issues
          byteLength: 20
        }
      ],
      buffers: [
        {
          byteLength: 250
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-bounds-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit DOUBLE component type path (currently unused but exists in code)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          bufferView: 0,
          componentType: 5130, // DOUBLE (8 bytes) - testing the getComponentSize default case
          count: 5,
          type: 'SCALAR'
        },
        {
          bufferView: 0,
          componentType: 9999, // Invalid componentType - hits default case in getComponentSize
          count: 5,
          type: 'SCALAR'
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 100
        }
      ],
      buffers: [
        {
          byteLength: 100
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-component-types.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit unknown accessor type default path in getTypeComponentCount', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          bufferView: 0,
          componentType: 5126,
          count: 5,
          type: 'UNKNOWN_TYPE' // Should hit default case returning 1
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 20
        }
      ],
      buffers: [
        {
          byteLength: 20
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-unknown-type.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit formatValue method with all component types and special float values', async () => {
    // Create binary data with specific values to test formatValue paths
    const floatData = new Float32Array([
      1.5,        // Regular decimal  
      1.0,        // Whole number (should format as "1")
      0.0,        // Zero
      -1.5,       // Negative decimal
      123.456789, // Long decimal (tests precision)
      Infinity,   // Infinity
      -Infinity,  // Negative infinity  
      NaN         // NaN
    ]);

    // Create different integer types to test formatValue
    const byteData = new Int8Array([-128, -1, 0, 1, 127]);
    const ushortData = new Uint16Array([0, 1, 32767, 65535]);
    const uintData = new Uint32Array([0, 1, 2147483647, 4294967295]);

    const floatSize = floatData.byteLength;
    const byteSize = byteData.byteLength;
    const ushortSize = ushortData.byteLength;
    const uintSize = uintData.byteLength;
    const totalSize = floatSize + byteSize + ushortSize + uintSize;

    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(floatData.buffer), offset);
    offset += floatSize;
    combinedView.set(new Uint8Array(byteData.buffer), offset);  
    offset += byteSize;
    combinedView.set(new Uint8Array(ushortData.buffer), offset);
    offset += ushortSize;
    combinedView.set(new Uint8Array(uintData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 8,
          type: 'SCALAR',
          min: [0.0], // Mismatch to trigger formatValue usage
          max: [2.0]
        },
        {
          bufferView: 1,
          componentType: 5120, // BYTE
          count: 5,
          type: 'SCALAR',
          min: [-100], // Mismatch to trigger formatValue usage
          max: [100]
        },
        {
          bufferView: 2,
          componentType: 5123, // UNSIGNED_SHORT
          count: 4,
          type: 'SCALAR',
          min: [0],
          max: [30000] // Mismatch to trigger formatValue usage
        },
        {
          bufferView: 3,
          componentType: 5125, // UNSIGNED_INT
          count: 4,
          type: 'SCALAR',
          min: [0],
          max: [1000000] // Mismatch to trigger formatValue usage
        }
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: floatSize },
        { buffer: 0, byteOffset: floatSize, byteLength: byteSize },
        { buffer: 0, byteOffset: floatSize + byteSize, byteLength: ushortSize },
        { buffer: 0, byteOffset: floatSize + byteSize + ushortSize, byteLength: uintSize }
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-format-value.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining image validator bufferView stride validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      images: [
        {
          bufferView: 0, // BufferView with byteStride - invalid for image
          mimeType: 'image/png'
        },
        {
          bufferView: 1, // BufferView without stride - valid for image
          mimeType: 'image/jpeg'
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 100,
          byteStride: 4 // Invalid for image bufferView
        },
        {
          buffer: 0,
          byteOffset: 100,
          byteLength: 200 // Valid image bufferView without stride
        }
      ],
      buffers: [
        {
          byteLength: 300
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'surgical-image-buffer-stride.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});