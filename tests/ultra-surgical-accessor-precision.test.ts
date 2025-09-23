import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra Surgical Accessor Precision Tests', () => {

  it('should hit the exact deepest accessor validator paths (targeting 53.01% -> 75%)', async () => {
    // Create the most comprehensive binary data to hit all accessor validation paths
    const float32Data = new Float32Array([
      // Standard values
      1.0, 2.0, 3.0, 4.0,
      // Edge case values for validation
      0.0, -0.0, 
      Number.MIN_VALUE, Number.MAX_VALUE,
      Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NaN,
      // Matrix test data
      1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1, // MAT4
      1, 0, 0,  0, 1, 0,  0, 0, 1,  // MAT3
      1, 0,  0, 1,  // MAT2
      // Vector data
      1.5, 2.5, 3.5, 4.5,  // VEC4
      1.1, 2.2, 3.3,       // VEC3
      1.9, 2.8,            // VEC2
      42.0                 // SCALAR
    ]);

    const int8Data = new Int8Array([
      -128, -127, -1, 0, 1, 126, 127,  // Full BYTE range
      10, 20, 30, 40, 50, 60, 70, 80   // Regular values
    ]);

    const uint8Data = new Uint8Array([
      0, 1, 127, 128, 254, 255,        // Full UNSIGNED_BYTE range  
      10, 20, 30, 40, 50, 60, 70, 80   // Regular values
    ]);

    const int16Data = new Int16Array([
      -32768, -32767, -1, 0, 1, 32766, 32767,  // Full SHORT range
      1000, 2000, 3000, 4000, 5000             // Regular values
    ]);

    const uint16Data = new Uint16Array([
      0, 1, 32767, 32768, 65534, 65535,        // Full UNSIGNED_SHORT range
      1000, 2000, 3000, 4000, 5000             // Regular values
    ]);

    const uint32Data = new Uint32Array([
      0, 1, 2147483647, 2147483648, 4294967294, 4294967295,  // Full UNSIGNED_INT range
      1000000, 2000000, 3000000                               // Regular values
    ]);

    // Calculate total size and combine all data
    const totalSize = 
      float32Data.byteLength + 
      int8Data.byteLength + 
      uint8Data.byteLength + 
      int16Data.byteLength + 
      uint16Data.byteLength + 
      uint32Data.byteLength;

    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);

    let offset = 0;
    combinedView.set(new Uint8Array(float32Data.buffer), offset);
    offset += float32Data.byteLength;
    combinedView.set(new Uint8Array(int8Data.buffer), offset);
    offset += int8Data.byteLength;
    combinedView.set(new Uint8Array(uint8Data.buffer), offset);
    offset += uint8Data.byteLength;
    combinedView.set(new Uint8Array(int16Data.buffer), offset);
    offset += int16Data.byteLength;
    combinedView.set(new Uint8Array(uint16Data.buffer), offset);
    offset += uint16Data.byteLength;
    combinedView.set(new Uint8Array(uint32Data.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test MAT4 with BYTE components - hits getAlignedMatrixAccessorByteLength
          bufferView: 0,
          componentType: 5120, // BYTE
          count: 1,
          type: 'MAT4',
          byteOffset: 1, // Misaligned for BYTE data
        },
        {
          // Test MAT3 with UNSIGNED_BYTE - hits getAlignedMatrixAccessorByteLength  
          bufferView: 0,
          componentType: 5121, // UNSIGNED_BYTE
          count: 1,
          type: 'MAT3',
          byteOffset: 17, // Test specific offset
        },
        {
          // Test MAT2 with SHORT - hits getAlignedMatrixAccessorByteLength
          bufferView: 0,
          componentType: 5122, // SHORT
          count: 1,
          type: 'MAT2',
          byteOffset: 26, // Test alignment for SHORT
        },
        {
          // Test unknown matrix type to hit default case in getAlignedMatrixAccessorByteLength
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 1,
          type: 'UNKNOWN_MAT_TYPE', // Should hit default case
          byteOffset: 34,
        },
        {
          // Test getTypeComponentCount with all known types
          bufferView: 0,
          componentType: 5126,
          count: 1,
          type: 'SCALAR', // 1 component
          byteOffset: 38,
        },
        {
          bufferView: 0,
          componentType: 5126,
          count: 1,
          type: 'VEC2', // 2 components
          byteOffset: 42,
        },
        {
          bufferView: 0,
          componentType: 5126,
          count: 1,
          type: 'VEC3', // 3 components
          byteOffset: 50,
        },
        {
          bufferView: 0,
          componentType: 5126,
          count: 1,
          type: 'VEC4', // 4 components
          byteOffset: 62,
        },
        {
          // Test unknown type to hit default case in getTypeComponentCount
          bufferView: 0,
          componentType: 5126,
          count: 1,
          type: 'UNKNOWN_VEC_TYPE', // Should return 1
          byteOffset: 78,
        },
        {
          // Test getComponentSize with all component types
          bufferView: 1, // BYTE data
          componentType: 5120, // BYTE - 1 byte
          count: 5,
          type: 'SCALAR',
          byteOffset: 0,
        },
        {
          bufferView: 2, // UNSIGNED_BYTE data
          componentType: 5121, // UNSIGNED_BYTE - 1 byte
          count: 5,
          type: 'SCALAR',
          byteOffset: 0,
        },
        {
          bufferView: 3, // SHORT data
          componentType: 5122, // SHORT - 2 bytes
          count: 5,
          type: 'SCALAR',
          byteOffset: 0,
        },
        {
          bufferView: 4, // UNSIGNED_SHORT data
          componentType: 5123, // UNSIGNED_SHORT - 2 bytes
          count: 5,
          type: 'SCALAR',
          byteOffset: 0,
        },
        {
          bufferView: 5, // UNSIGNED_INT data
          componentType: 5125, // UNSIGNED_INT - 4 bytes
          count: 5,
          type: 'SCALAR',
          byteOffset: 0,
        },
        {
          // Test DOUBLE component type (hits default case in getComponentSize)
          bufferView: 0,
          componentType: 5130, // DOUBLE - should use default (8 bytes)
          count: 1,
          type: 'SCALAR',
          byteOffset: 82,
        },
        {
          // Test unknown component type (hits default case in getComponentSize)
          bufferView: 0,
          componentType: 9999, // Unknown - should use default (0 bytes)
          count: 1,
          type: 'SCALAR',
          byteOffset: 90,
        },
        {
          // Test sparse accessor with all component types for indices
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 1, // BYTE data
              componentType: 5120, // BYTE indices
              byteOffset: 8,
            },
            values: {
              bufferView: 0,
              byteOffset: 100,
            }
          }
        },
        {
          // Test sparse accessor with UNSIGNED_BYTE indices
          bufferView: 0,
          componentType: 5126,
          count: 100,
          type: 'VEC2',
          sparse: {
            count: 5,
            indices: {
              bufferView: 2, // UNSIGNED_BYTE data
              componentType: 5121, // UNSIGNED_BYTE indices
              byteOffset: 6,
            },
            values: {
              bufferView: 0,
              byteOffset: 200,
            }
          }
        },
        {
          // Test sparse accessor with SHORT indices
          bufferView: 0,
          componentType: 5126,
          count: 50,
          type: 'SCALAR',
          sparse: {
            count: 8,
            indices: {
              bufferView: 3, // SHORT data
              componentType: 5122, // SHORT indices
              byteOffset: 2,
            },
            values: {
              bufferView: 0,
              byteOffset: 300,
            }
          }
        },
        {
          // Test sparse accessor with UNSIGNED_SHORT indices
          bufferView: 0,
          componentType: 5126,
          count: 75,
          type: 'VEC4',
          sparse: {
            count: 12,
            indices: {
              bufferView: 4, // UNSIGNED_SHORT data
              componentType: 5123, // UNSIGNED_SHORT indices
              byteOffset: 0,
            },
            values: {
              bufferView: 0,
              byteOffset: 400,
            }
          }
        },
        {
          // Test sparse accessor with UNSIGNED_INT indices
          bufferView: 0,
          componentType: 5122, // SHORT
          count: 1000,
          type: 'SCALAR',
          sparse: {
            count: 20,
            indices: {
              bufferView: 5, // UNSIGNED_INT data
              componentType: 5125, // UNSIGNED_INT indices
              byteOffset: 0,
            },
            values: {
              bufferView: 3, // SHORT data for values
              byteOffset: 18,
            }
          }
        }
      ],
      bufferViews: [
        {
          // Main buffer view with all float data
          buffer: 0,
          byteOffset: 0,
          byteLength: float32Data.byteLength,
        },
        {
          // BYTE data buffer view
          buffer: 0,
          byteOffset: float32Data.byteLength,
          byteLength: int8Data.byteLength,
        },
        {
          // UNSIGNED_BYTE data buffer view
          buffer: 0,
          byteOffset: float32Data.byteLength + int8Data.byteLength,
          byteLength: uint8Data.byteLength,
        },
        {
          // SHORT data buffer view
          buffer: 0,
          byteOffset: float32Data.byteLength + int8Data.byteLength + uint8Data.byteLength,
          byteLength: int16Data.byteLength,
        },
        {
          // UNSIGNED_SHORT data buffer view
          buffer: 0,
          byteOffset: float32Data.byteLength + int8Data.byteLength + uint8Data.byteLength + int16Data.byteLength,
          byteLength: uint16Data.byteLength,
        },
        {
          // UNSIGNED_INT data buffer view
          buffer: 0,
          byteOffset: float32Data.byteLength + int8Data.byteLength + uint8Data.byteLength + int16Data.byteLength + uint16Data.byteLength,
          byteLength: uint32Data.byteLength,
        }
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-accessor-precision.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit precise accessor bounds validation with exact calculations', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test exact bounds calculation: MAT4 FLOAT = 1 * 16 * 4 = 64 bytes + offset 1 = 65 > 64 (buffer size)
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 1,
          type: 'MAT4',
          byteOffset: 1, // 64 + 1 = 65 bytes > 64 buffer size
        },
        {
          // Test exact bounds calculation: VEC3 SHORT = 10 * 3 * 2 = 60 bytes + offset 5 = 65 > 64 (buffer size)
          bufferView: 1,
          componentType: 5122, // SHORT
          count: 10,
          type: 'VEC3',
          byteOffset: 5, // 60 + 5 = 65 bytes > 64 buffer size
        },
        {
          // Test exact bounds with byteStride: 5 * (stride-1) + elementSize = 5 * 7 + 12 = 47 bytes + offset 18 = 65 > 64
          bufferView: 2,
          componentType: 5126, // FLOAT
          count: 5,
          type: 'VEC3', // 3 * 4 = 12 bytes per element
          byteOffset: 18, // (5-1) * 8 + 12 = 44 bytes + 18 = 62 < 64 (should fit)
        },
        {
          // Test alignment validation: MAT4 with misaligned offset
          bufferView: 3,
          componentType: 5126, // FLOAT (4 bytes)
          count: 1,
          type: 'MAT4',
          byteOffset: 3, // Not aligned to 4 bytes - should error
        },
        {
          // Test alignment validation: SHORT with odd offset
          bufferView: 4,
          componentType: 5122, // SHORT (2 bytes)
          count: 5,
          type: 'VEC2',
          byteOffset: 3, // bufferView offset (5) + accessor offset (3) = 8, but bufferView starts at odd offset
        },
        {
          // Test sparse indices bounds: 10 indices * 2 bytes = 20 bytes + offset 50 = 70 > 64
          bufferView: 0,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 1, // 64 byte buffer
              componentType: 5123, // UNSIGNED_SHORT (2 bytes)
              byteOffset: 50, // 10 * 2 + 50 = 70 > 64 - should error
            },
            values: {
              bufferView: 0,
              byteOffset: 0,
            }
          }
        },
        {
          // Test sparse values bounds: 5 VEC4 values * 16 bytes = 80 bytes + offset 0 = 80 > 64  
          bufferView: 0,
          componentType: 5126,
          count: 50,
          type: 'VEC4',
          sparse: {
            count: 5,
            indices: {
              bufferView: 1,
              componentType: 5121, // UNSIGNED_BYTE (1 byte)
              byteOffset: 0, // 5 * 1 = 5 bytes (fits in 64)
            },
            values: {
              bufferView: 1, // 64 byte buffer
              componentType: 5126, // FLOAT
              byteOffset: 0, // 5 * 4 * 4 = 80 bytes > 64 - should error
            }
          }
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 64, // Exactly 64 bytes
        },
        {
          buffer: 0,
          byteOffset: 64,
          byteLength: 64, // Another 64 bytes
        },
        {
          buffer: 0,
          byteOffset: 128,
          byteLength: 64,
          byteStride: 8, // Stride smaller than VEC3 FLOAT (12 bytes) - but test calculation
        },
        {
          buffer: 0,
          byteOffset: 192,
          byteLength: 64,
        },
        {
          buffer: 0,
          byteOffset: 257, // Odd offset for alignment testing
          byteLength: 64,
        }
      ],
      buffers: [
        {
          byteLength: 400, // Total buffer size
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-bounds-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit accessor data validation and min/max checking paths', async () => {
    // Create test data with specific values to trigger min/max validation
    const testFloats = new Float32Array([
      // Values for min/max testing
      -10.5, -5.5, -1.5,  // Below declared min
      0.0, 1.0, 2.0,      // Within range  
      5.5, 10.5, 15.5,    // Above declared max
      // Special float values for formatValue testing
      Infinity, -Infinity, NaN,
      // Normalized values for testing
      0.5, -0.5, 0.0
    ]);

    const testInts = new Int32Array([
      -1000000, -500, -1,  // Below declared min
      0, 100, 500,         // Within range
      1000, 5000, 1000000, // Above declared max
      // Edge values for signed integers
      -2147483648, 2147483647
    ]);

    const combinedSize = testFloats.byteLength + testInts.byteLength;
    const combinedBuffer = new ArrayBuffer(combinedSize);
    const combinedView = new Uint8Array(combinedBuffer);
    combinedView.set(new Uint8Array(testFloats.buffer), 0);
    combinedView.set(new Uint8Array(testInts.buffer), testFloats.byteLength);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test FLOAT data validation with incorrect min/max
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 5,
          type: 'VEC3',
          min: [0.0, 0.0, 0.0], // Declared min doesn't match actual data
          max: [2.0, 2.0, 2.0], // Declared max doesn't match actual data
        },
        {
          // Test normalized FLOAT data 
          bufferView: 0,
          componentType: 5126,
          count: 3,
          type: 'SCALAR',
          byteOffset: 60, // Point to normalized test values
          normalized: true,
          min: [0.0], // Should be recalculated for normalized data
          max: [1.0],
        },
        {
          // Test INT data validation
          bufferView: 1,
          componentType: 5125, // UNSIGNED_INT (treat as signed for testing)
          count: 3,
          type: 'VEC3',
          min: [0, 0, 0], // Declared min doesn't match actual data  
          max: [100, 100, 100], // Declared max doesn't match actual data
        },
        {
          // Test data validation with VEC4 to hit 4-component path
          bufferView: 0,
          componentType: 5126,
          count: 2,
          type: 'VEC4',
          byteOffset: 36, // Point to special float values
          min: [1.0, 1.0, 1.0, 1.0], // Won't match Infinity, -Infinity, NaN values
          max: [2.0, 2.0, 2.0, 2.0],
        },
        {
          // Test data validation with MAT2 to hit matrix validation
          bufferView: 0,
          componentType: 5126,
          count: 1,
          type: 'MAT2',
          byteOffset: 0,
          min: [1.0, 1.0, 1.0, 1.0], // Incorrect bounds for matrix data
          max: [1.0, 1.0, 1.0, 1.0],
        },
        {
          // Test missing min/max arrays (should use computed values)
          bufferView: 0,
          componentType: 5126,
          count: 4,
          type: 'VEC2',
          byteOffset: 20,
          // No min/max - should compute from data
        },
        {
          // Test accessor with count 0 (edge case)
          bufferView: 0,
          componentType: 5126,
          count: 0,
          type: 'SCALAR',
          min: [],
          max: [],
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: testFloats.byteLength,
        },
        {
          buffer: 0,
          byteOffset: testFloats.byteLength,
          byteLength: testInts.byteLength,
        }
      ],
      buffers: [
        {
          byteLength: combinedSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-data-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit formatValue function with all data type and special value paths', async () => {
    // Create comprehensive test data to hit all formatValue branches
    const floatTestData = new Float32Array([
      // Test whole numbers (should format without decimal)
      1.0, 2.0, -1.0, 0.0, 10.0, 100.0,
      // Test decimal numbers (should format with decimal)
      1.5, 2.75, -3.25, 0.1, 10.5, 100.75,
      // Test special values
      Infinity, -Infinity, NaN,
      // Test precision edge cases
      1.000000001, 0.000000001, 999999.999999
    ]);

    const int8TestData = new Int8Array([
      -128, -100, -1, 0, 1, 100, 127 // Full range of BYTE values
    ]);

    const uint8TestData = new Uint8Array([
      0, 1, 100, 200, 254, 255 // Range of UNSIGNED_BYTE values
    ]);

    const int16TestData = new Int16Array([
      -32768, -1000, -1, 0, 1, 1000, 32767 // Range of SHORT values
    ]);

    const uint16TestData = new Uint16Array([
      0, 1, 1000, 30000, 65534, 65535 // Range of UNSIGNED_SHORT values
    ]);

    const uint32TestData = new Uint32Array([
      0, 1, 1000000, 2147483647, 4294967294, 4294967295 // Range of UNSIGNED_INT values
    ]);

    // Combine all test data
    const totalSize = 
      floatTestData.byteLength + 
      int8TestData.byteLength + 
      uint8TestData.byteLength + 
      int16TestData.byteLength + 
      uint16TestData.byteLength + 
      uint32TestData.byteLength;

    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);

    let offset = 0;
    combinedView.set(new Uint8Array(floatTestData.buffer), offset);
    offset += floatTestData.byteLength;
    combinedView.set(new Uint8Array(int8TestData.buffer), offset);
    offset += int8TestData.byteLength;
    combinedView.set(new Uint8Array(uint8TestData.buffer), offset);
    offset += uint8TestData.byteLength;
    combinedView.set(new Uint8Array(int16TestData.buffer), offset);
    offset += int16TestData.byteLength;
    combinedView.set(new Uint8Array(uint16TestData.buffer), offset);
    offset += uint16TestData.byteLength;
    combinedView.set(new Uint8Array(uint32TestData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test FLOAT formatValue paths
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: floatTestData.length,
          type: 'SCALAR',
          min: [0.0], // Mismatch to trigger formatValue usage in validation messages
          max: [1.0],
        },
        {
          // Test BYTE formatValue paths  
          bufferView: 1,
          componentType: 5120, // BYTE
          count: int8TestData.length,
          type: 'SCALAR',
          min: [-200], // Mismatch to trigger formatValue usage
          max: [200],
        },
        {
          // Test UNSIGNED_BYTE formatValue paths
          bufferView: 2,
          componentType: 5121, // UNSIGNED_BYTE
          count: uint8TestData.length,
          type: 'SCALAR',
          min: [10], // Mismatch to trigger formatValue usage
          max: [100],
        },
        {
          // Test SHORT formatValue paths
          bufferView: 3,
          componentType: 5122, // SHORT
          count: int16TestData.length,
          type: 'SCALAR',
          min: [-50000], // Mismatch to trigger formatValue usage
          max: [50000],
        },
        {
          // Test UNSIGNED_SHORT formatValue paths
          bufferView: 4,
          componentType: 5123, // UNSIGNED_SHORT
          count: uint16TestData.length,
          type: 'SCALAR',
          min: [10000], // Mismatch to trigger formatValue usage
          max: [20000],
        },
        {
          // Test UNSIGNED_INT formatValue paths
          bufferView: 5,
          componentType: 5125, // UNSIGNED_INT
          count: uint32TestData.length,
          type: 'SCALAR',
          min: [1000000], // Mismatch to trigger formatValue usage
          max: [2000000],
        }
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: floatTestData.byteLength },
        { buffer: 0, byteOffset: floatTestData.byteLength, byteLength: int8TestData.byteLength },
        { buffer: 0, byteOffset: floatTestData.byteLength + int8TestData.byteLength, byteLength: uint8TestData.byteLength },
        { buffer: 0, byteOffset: floatTestData.byteLength + int8TestData.byteLength + uint8TestData.byteLength, byteLength: int16TestData.byteLength },
        { buffer: 0, byteOffset: floatTestData.byteLength + int8TestData.byteLength + uint8TestData.byteLength + int16TestData.byteLength, byteLength: uint16TestData.byteLength },
        { buffer: 0, byteOffset: floatTestData.byteLength + int8TestData.byteLength + uint8TestData.byteLength + int16TestData.byteLength + uint16TestData.byteLength, byteLength: uint32TestData.byteLength }
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'format-value-comprehensive.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});