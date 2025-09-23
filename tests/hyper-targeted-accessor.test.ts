import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Hyper-Targeted Accessor Coverage Tests', () => {

  it('should hit all uncovered accessor validator TYPE_MISMATCH and validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Hit UNEXPECTED_PROPERTY validation (line 13-22)
          componentType: 5126,
          count: 3,
          type: 'VEC3',
          unexpectedAccessorProp: 'should trigger warning',
          anotherUnexpected: 123,
          yetAnotherUnexpected: { nested: 'object' }
        },
        {
          // Hit TYPE_MISMATCH for byteOffset (line 100-106)
          bufferView: 0,
          byteOffset: 'not_a_number', // String instead of number
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        },
        {
          // Hit TYPE_MISMATCH for bufferView (line 123-129)
          bufferView: 'not_a_number', // String instead of number
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        },
        {
          // Hit negative byteOffset validation (line 100-106)
          bufferView: 0,
          byteOffset: -1, // Negative byteOffset
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        },
        {
          // Hit negative bufferView validation (line 123-129)
          bufferView: -1, // Negative bufferView
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        },
        {
          // Hit TYPE_MISMATCH for count (line 66-72)
          componentType: 5126,
          count: 'not_a_number', // String instead of number
          type: 'VEC3'
        },
        {
          // Hit negative count validation (line 66-72)
          componentType: 5126,
          count: -1, // Negative count
          type: 'VEC3'
        },
        {
          // Hit UNSATISFIED_DEPENDENCY for byteOffset without bufferView (line 93-99)
          byteOffset: 4, // byteOffset without bufferView
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        },
        {
          // Hit ACCESSOR_NORMALIZED_INVALID for FLOAT with normalized (line 42-57)
          componentType: 5126, // FLOAT
          count: 3,
          type: 'VEC3',
          normalized: true // Invalid: FLOAT cannot be normalized
        },
        {
          // Hit ACCESSOR_NORMALIZED_INVALID for UNSIGNED_INT with normalized (line 42-57)
          componentType: 5125, // UNSIGNED_INT
          count: 3,
          type: 'SCALAR',
          normalized: true // Invalid: UNSIGNED_INT cannot be normalized
        },
        {
          // Hit TYPE_MISMATCH for min array (line 150-168)
          componentType: 5126,
          count: 3,
          type: 'VEC3',
          min: 'not_an_array' // String instead of array
        },
        {
          // Hit TYPE_MISMATCH for max array (line 171-189)
          componentType: 5126,
          count: 3,
          type: 'VEC3',
          max: 'not_an_array' // String instead of array
        },
        {
          // Hit ACCESSOR_MIN_MISMATCH for wrong array length (line 160-167)
          componentType: 5126,
          count: 3,
          type: 'VEC3',
          min: [1.0, 2.0] // Wrong length: VEC3 needs 3 components, not 2
        },
        {
          // Hit ACCESSOR_MAX_MISMATCH for wrong array length (line 181-188)
          componentType: 5126,
          count: 3,
          type: 'VEC3',
          max: [1.0, 2.0, 3.0, 4.0] // Wrong length: VEC3 needs 3 components, not 4
        },
        {
          // Hit ACCESSOR_OFFSET_ALIGNMENT for misaligned byteOffset (line 108-116)
          bufferView: 0,
          byteOffset: 3, // Not aligned to 4-byte boundary for FLOAT
          componentType: 5126, // FLOAT (4 bytes)
          count: 1,
          type: 'SCALAR'
        },
        {
          // Hit ACCESSOR_OFFSET_ALIGNMENT for SHORT misalignment (line 108-116)
          bufferView: 0,
          byteOffset: 1, // Not aligned to 2-byte boundary for SHORT
          componentType: 5122, // SHORT (2 bytes)
          count: 1,
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
    const result = await validateBytes(data, { uri: 'hyper-targeted-accessor.gltf' });
    
    // Should generate many errors and warnings for type mismatches and invalid values
    expect(result.issues.numErrors).toBeGreaterThan(0);
    expect(result.issues.numWarnings).toBeGreaterThan(0);
  });

  it('should hit specific sparse accessor uncovered validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 2,
            indices: {
              bufferView: 1, // BufferView with byteStride - should trigger error for sparse
              componentType: 5123
            },
            values: {
              bufferView: 0
            }
          }
        },
        {
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 2,
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 2 // BufferView with byteStride - should trigger error for sparse values
            }
          }
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 100
        },
        {
          buffer: 0,
          byteOffset: 100,
          byteLength: 20,
          byteStride: 4 // This should trigger sparse indices error
        },
        {
          buffer: 0,
          byteOffset: 120,
          byteLength: 60,
          byteStride: 12 // This should trigger sparse values error
        }
      ],
      buffers: [
        {
          byteLength: 200
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'hyper-targeted-sparse.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});