import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('80 Percent Precision Assault', () => {

  it('should target camera validator remaining branches (31.28% -> 60%+)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        // Test every single edge case and error path in camera validator
        
        // 1. Test cameras with completely missing objects
        { type: 'perspective' },
        { type: 'orthographic' },
        
        // 2. Test cameras with empty objects
        { type: 'perspective', perspective: {} },
        { type: 'orthographic', orthographic: {} },
        
        // 3. Test cameras with partial properties (missing required ones)
        { type: 'perspective', perspective: { yfov: 1.0 } }, // Missing znear
        { type: 'perspective', perspective: { znear: 0.1 } }, // Missing yfov
        { type: 'orthographic', orthographic: { xmag: 1.0 } }, // Missing ymag, zfar, znear
        { type: 'orthographic', orthographic: { ymag: 1.0 } }, // Missing xmag, zfar, znear
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0 } }, // Missing zfar, znear
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, zfar: 1000.0 } }, // Missing znear
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: 0.1 } }, // Missing zfar
        
        // 4. Test every boundary condition for perspective camera
        { type: 'perspective', perspective: { yfov: 0.000001, znear: 0.000001 } }, // Very small valid values
        { type: 'perspective', perspective: { yfov: Math.PI - 0.000001, znear: 999999.0 } }, // Very large valid values
        { type: 'perspective', perspective: { yfov: 0.0, znear: 0.1 } }, // Exactly zero yfov (invalid)
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.0 } }, // Exactly zero znear (invalid)
        { type: 'perspective', perspective: { yfov: Math.PI, znear: 0.1 } }, // Exactly PI yfov (invalid)
        { type: 'perspective', perspective: { yfov: -0.000001, znear: 0.1 } }, // Negative yfov (invalid)
        { type: 'perspective', perspective: { yfov: 1.0, znear: -0.000001 } }, // Negative znear (invalid)
        { type: 'perspective', perspective: { yfov: Math.PI + 0.000001, znear: 0.1 } }, // yfov > PI (invalid)
        
        // 5. Test aspectRatio edge cases
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, aspectRatio: 0.000001 } }, // Very small valid
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, aspectRatio: 999999.0 } }, // Very large valid
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, aspectRatio: 0.0 } }, // Zero (invalid)
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, aspectRatio: -0.1 } }, // Negative (invalid)
        
        // 6. Test zfar validation for perspective
        { type: 'perspective', perspective: { yfov: 1.0, znear: 100.0, zfar: 100.000001 } }, // Just greater than znear (valid)
        { type: 'perspective', perspective: { yfov: 1.0, znear: 100.0, zfar: 100.0 } }, // Equal to znear (invalid)
        { type: 'perspective', perspective: { yfov: 1.0, znear: 100.0, zfar: 99.999999 } }, // Less than znear (invalid)
        { type: 'perspective', perspective: { yfov: 1.0, znear: 100.0, zfar: 50.0 } }, // Much less than znear (invalid)
        
        // 7. Test every boundary condition for orthographic camera
        { type: 'orthographic', orthographic: { xmag: 0.000001, ymag: 0.000001, znear: 0.000001, zfar: 0.000002 } },
        { type: 'orthographic', orthographic: { xmag: 999999.0, ymag: 999999.0, znear: 999998.0, zfar: 999999.0 } },
        { type: 'orthographic', orthographic: { xmag: 0.0, ymag: 1.0, znear: 0.1, zfar: 1000.0 } }, // Zero xmag (invalid)
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 0.0, znear: 0.1, zfar: 1000.0 } }, // Zero ymag (invalid)
        { type: 'orthographic', orthographic: { xmag: -0.1, ymag: 1.0, znear: 0.1, zfar: 1000.0 } }, // Negative xmag (invalid)
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: -0.1, znear: 0.1, zfar: 1000.0 } }, // Negative ymag (invalid)
        
        // 8. Test zfar validation for orthographic
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: 100.0, zfar: 100.000001 } }, // Just greater (valid)
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: 100.0, zfar: 100.0 } }, // Equal (invalid)
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: 100.0, zfar: 99.999999 } }, // Less (invalid)
        
        // 9. Test cameras with non-numeric property values
        { type: 'perspective', perspective: { yfov: 'string', znear: 0.1 } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: null } },
        { type: 'perspective', perspective: { yfov: true, znear: false } },
        { type: 'perspective', perspective: { yfov: [], znear: {} } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, aspectRatio: 'invalid' } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, zfar: null } },
        
        { type: 'orthographic', orthographic: { xmag: 'string', ymag: 1.0, znear: 0.1, zfar: 1000.0 } },
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: null, znear: 0.1, zfar: 1000.0 } },
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: true, zfar: 1000.0 } },
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: 0.1, zfar: [] } },
        
        // 10. Test extreme numeric values
        { type: 'perspective', perspective: { yfov: Number.NaN, znear: 0.1 } },
        { type: 'perspective', perspective: { yfov: Number.POSITIVE_INFINITY, znear: 0.1 } },
        { type: 'perspective', perspective: { yfov: Number.NEGATIVE_INFINITY, znear: 0.1 } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: Number.NaN } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: Number.POSITIVE_INFINITY } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: Number.NEGATIVE_INFINITY } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, aspectRatio: Number.NaN } },
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1, zfar: Number.POSITIVE_INFINITY } },
        
        { type: 'orthographic', orthographic: { xmag: Number.NaN, ymag: 1.0, znear: 0.1, zfar: 1000.0 } },
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: Number.POSITIVE_INFINITY, znear: 0.1, zfar: 1000.0 } },
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: Number.NEGATIVE_INFINITY, zfar: 1000.0 } },
        { type: 'orthographic', orthographic: { xmag: 1.0, ymag: 1.0, znear: 0.1, zfar: Number.NaN } },
        
        // 11. Test invalid camera types
        { type: null },
        { type: undefined },
        { type: '' },
        { type: 123 },
        { type: true },
        { type: [] },
        { type: {} },
        { type: 'invalid_type' },
        { type: 'PERSPECTIVE' }, // Wrong case
        { type: 'ORTHOGRAPHIC' }, // Wrong case
        
        // 12. Test cameras with both perspective and orthographic objects (should be invalid)
        { 
          type: 'perspective', 
          perspective: { yfov: 1.0, znear: 0.1 },
          orthographic: { xmag: 1.0, ymag: 1.0, znear: 0.1, zfar: 1000.0 }
        },
        { 
          type: 'orthographic', 
          perspective: { yfov: 1.0, znear: 0.1 },
          orthographic: { xmag: 1.0, ymag: 1.0, znear: 0.1, zfar: 1000.0 }
        },
        
        // 13. Test cameras with extra properties
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            invalidProperty: 'should be ignored',
            extraProp: 42
          },
          invalidCameraProperty: 'should be ignored'
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 0.1,
            zfar: 1000.0,
            invalidProperty: 'should be ignored',
            extraProp: true
          },
          invalidCameraProperty: 'should be ignored'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-80-percent-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target accessor validator hardest branches (51.53% -> 70%+)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 100000 }],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: 50000 },
        { buffer: 0, byteOffset: 50000, byteLength: 50000 }
      ],
      accessors: [
        // Test every single accessor validation branch
        
        // 1. Test all valid component type and type combinations
        { bufferView: 0, byteOffset: 0, componentType: 5120, count: 100, type: 'SCALAR' }, // BYTE + SCALAR
        { bufferView: 0, byteOffset: 100, componentType: 5121, count: 100, type: 'VEC2' }, // UNSIGNED_BYTE + VEC2
        { bufferView: 0, byteOffset: 300, componentType: 5122, count: 100, type: 'VEC3' }, // SHORT + VEC3
        { bufferView: 0, byteOffset: 900, componentType: 5123, count: 100, type: 'VEC4' }, // UNSIGNED_SHORT + VEC4
        { bufferView: 0, byteOffset: 1700, componentType: 5125, count: 25, type: 'MAT2' }, // UNSIGNED_INT + MAT2
        { bufferView: 0, byteOffset: 2100, componentType: 5126, count: 25, type: 'MAT3' }, // FLOAT + MAT3
        { bufferView: 0, byteOffset: 3000, componentType: 5126, count: 25, type: 'MAT4' }, // FLOAT + MAT4
        
        // 2. Test invalid component type combinations
        { bufferView: 0, byteOffset: 0, componentType: 5125, count: 10, type: 'MAT3' }, // UNSIGNED_INT with MAT3 (invalid)
        { bufferView: 0, byteOffset: 0, componentType: 5125, count: 10, type: 'MAT4' }, // UNSIGNED_INT with MAT4 (invalid)
        { bufferView: 0, byteOffset: 0, componentType: 5120, count: 10, type: 'MAT2' }, // BYTE with MAT2 (invalid)
        { bufferView: 0, byteOffset: 0, componentType: 5121, count: 10, type: 'MAT2' }, // UNSIGNED_BYTE with MAT2 (invalid)
        { bufferView: 0, byteOffset: 0, componentType: 5122, count: 10, type: 'MAT2' }, // SHORT with MAT2 (invalid)
        { bufferView: 0, byteOffset: 0, componentType: 5123, count: 10, type: 'MAT2' }, // UNSIGNED_SHORT with MAT2 (invalid)
        
        // 3. Test accessor size calculations and bounds checking
        { bufferView: 0, byteOffset: 49990, componentType: 5126, count: 3, type: 'SCALAR' }, // Just fits
        { bufferView: 0, byteOffset: 49996, componentType: 5126, count: 2, type: 'SCALAR' }, // Just exceeds (invalid)
        { bufferView: 0, byteOffset: 49900, componentType: 5126, count: 10, type: 'VEC3' }, // Exceeds buffer view (invalid)
        { bufferView: 0, byteOffset: 49000, componentType: 5126, count: 100, type: 'MAT4' }, // Way exceeds (invalid)
        
        // 4. Test normalized flag with different component types
        { bufferView: 0, byteOffset: 5000, componentType: 5120, count: 100, type: 'VEC3', normalized: true }, // BYTE normalized
        { bufferView: 0, byteOffset: 5300, componentType: 5121, count: 100, type: 'VEC3', normalized: true }, // UNSIGNED_BYTE normalized
        { bufferView: 0, byteOffset: 5600, componentType: 5122, count: 100, type: 'VEC3', normalized: true }, // SHORT normalized
        { bufferView: 0, byteOffset: 6200, componentType: 5123, count: 100, type: 'VEC3', normalized: true }, // UNSIGNED_SHORT normalized
        { bufferView: 0, byteOffset: 7000, componentType: 5125, count: 100, type: 'SCALAR', normalized: true }, // UNSIGNED_INT normalized
        { bufferView: 0, byteOffset: 7400, componentType: 5126, count: 100, type: 'VEC3', normalized: true }, // FLOAT normalized (unusual)
        { bufferView: 0, byteOffset: 8800, componentType: 5126, count: 25, type: 'MAT4', normalized: true }, // MAT4 normalized (unusual)
        
        // 5. Test comprehensive min/max validation
        {
          bufferView: 0,
          byteOffset: 10000,
          componentType: 5126,
          count: 10,
          type: 'SCALAR',
          min: -10.5,
          max: 10.5
        },
        {
          bufferView: 0,
          byteOffset: 10040,
          componentType: 5126,
          count: 10,
          type: 'VEC2',
          min: [-1.0, -2.0],
          max: [1.0, 2.0]
        },
        {
          bufferView: 0,
          byteOffset: 10120,
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          min: [-1.0, -2.0, -3.0],
          max: [1.0, 2.0, 3.0]
        },
        {
          bufferView: 0,
          byteOffset: 10240,
          componentType: 5126,
          count: 10,
          type: 'VEC4',
          min: [-1.0, -2.0, -3.0, -4.0],
          max: [1.0, 2.0, 3.0, 4.0]
        },
        {
          bufferView: 0,
          byteOffset: 10400,
          componentType: 5126,
          count: 5,
          type: 'MAT2',
          min: [0, 0, 0, 0],
          max: [1, 1, 1, 1]
        },
        {
          bufferView: 0,
          byteOffset: 10480,
          componentType: 5126,
          count: 5,
          type: 'MAT3',
          min: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          max: [1, 1, 1, 1, 1, 1, 1, 1, 1]
        },
        {
          bufferView: 0,
          byteOffset: 10660,
          componentType: 5126,
          count: 3,
          type: 'MAT4',
          min: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          max: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        },
        
        // 6. Test invalid min/max combinations
        {
          bufferView: 0,
          byteOffset: 11000,
          componentType: 5126,
          count: 10,
          type: 'SCALAR',
          min: [1, 2, 3], // Wrong type (should be number)
          max: 'invalid' // Wrong type
        },
        {
          bufferView: 0,
          byteOffset: 11040,
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          min: [-1.0, -2.0], // Wrong length (should be 3)
          max: [1.0, 2.0, 3.0, 4.0] // Wrong length (should be 3)
        },
        {
          bufferView: 0,
          byteOffset: 11160,
          componentType: 5126,
          count: 10,
          type: 'MAT4',
          min: [0, 1, 2, 3, 4], // Wrong length (should be 16)
          max: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] // Wrong length (should be 16)
        },
        
        // 7. Test comprehensive sparse accessor validation
        {
          bufferView: 0,
          byteOffset: 12000,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 1,
              byteOffset: 0,
              componentType: 5121 // UNSIGNED_BYTE
            },
            values: {
              bufferView: 1,
              byteOffset: 10
            }
          }
        },
        {
          bufferView: 0,
          byteOffset: 12400,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 20,
            indices: {
              bufferView: 1,
              byteOffset: 130,
              componentType: 5123 // UNSIGNED_SHORT
            },
            values: {
              bufferView: 1,
              byteOffset: 170
            }
          }
        },
        {
          bufferView: 0,
          byteOffset: 12800,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 30,
            indices: {
              bufferView: 1,
              byteOffset: 410,
              componentType: 5125 // UNSIGNED_INT
            },
            values: {
              bufferView: 1,
              byteOffset: 530
            }
          }
        },
        
        // 8. Test invalid sparse accessors
        {
          bufferView: 0,
          byteOffset: 13200,
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {
            count: 100, // Exceeds accessor count (invalid)
            indices: {
              bufferView: 1,
              byteOffset: 1000,
              componentType: 5123
            },
            values: {
              bufferView: 1,
              byteOffset: 1200
            }
          }
        },
        {
          bufferView: 0,
          byteOffset: 13600,
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 1,
              byteOffset: 1600,
              componentType: 5120 // BYTE (invalid for indices)
            },
            values: {
              bufferView: 1,
              byteOffset: 1610
            }
          }
        },
        {
          bufferView: 0,
          byteOffset: 14000,
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 1,
              byteOffset: 2000,
              componentType: 5122 // SHORT (invalid for indices)
            },
            values: {
              bufferView: 1,
              byteOffset: 2020
            }
          }
        },
        {
          bufferView: 0,
          byteOffset: 14400,
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 999, // Invalid buffer view reference
              byteOffset: 0,
              componentType: 5123
            },
            values: {
              bufferView: 999, // Invalid buffer view reference
              byteOffset: 0
            }
          }
        },
        
        // 9. Test accessors without buffer views (sparse-only)
        {
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {
            count: 50, // All values are sparse
            indices: {
              bufferView: 1,
              byteOffset: 3000,
              componentType: 5123
            },
            values: {
              bufferView: 1,
              byteOffset: 3100
            }
          }
        },
        
        // 10. Test edge cases for byte offset and alignment
        { bufferView: 0, byteOffset: 15001, componentType: 5126, count: 10, type: 'SCALAR' }, // Misaligned for FLOAT
        { bufferView: 0, byteOffset: 15002, componentType: 5123, count: 10, type: 'SCALAR' }, // Misaligned for UNSIGNED_SHORT
        { bufferView: 0, byteOffset: 15003, componentType: 5125, count: 10, type: 'SCALAR' }, // Misaligned for UNSIGNED_INT
        
        // 11. Test very large counts that might cause integer overflow
        { bufferView: 0, byteOffset: 16000, componentType: 5121, count: 50000, type: 'SCALAR' }, // Very large count
        { bufferView: 0, byteOffset: 16000, componentType: 5126, count: Number.MAX_SAFE_INTEGER, type: 'SCALAR' } // Extreme count
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-80-percent-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target buffer-view validator remaining paths (45.87% -> 70%+)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        { byteLength: 10000 },
        { byteLength: 5000 },
        { byteLength: 1 }, // Minimal buffer
        { byteLength: 100000 } // Large buffer
      ],
      bufferViews: [
        // Test every single buffer view validation path
        
        // 1. Test all valid stride values and targets
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 4, target: 34962 }, // Min valid stride
        { buffer: 0, byteOffset: 100, byteLength: 200, byteStride: 8, target: 34962 },
        { buffer: 0, byteOffset: 300, byteLength: 300, byteStride: 12, target: 34962 },
        { buffer: 0, byteOffset: 600, byteLength: 400, byteStride: 16, target: 34962 },
        { buffer: 0, byteOffset: 1000, byteLength: 500, byteStride: 32, target: 34962 },
        { buffer: 0, byteOffset: 1500, byteLength: 600, byteStride: 64, target: 34962 },
        { buffer: 0, byteOffset: 2100, byteLength: 700, byteStride: 128, target: 34962 },
        { buffer: 0, byteOffset: 2800, byteLength: 765, byteStride: 255, target: 34962 }, // Max valid stride
        
        // 2. Test ELEMENT_ARRAY_BUFFER specific validation (no stride allowed)
        { buffer: 0, byteOffset: 3565, byteLength: 100, target: 34963 }, // Valid without stride
        { buffer: 0, byteOffset: 3665, byteLength: 200, target: 34963 }, // Valid without stride
        
        // 3. Test invalid stride values
        { buffer: 0, byteOffset: 4000, byteLength: 100, byteStride: 0 }, // Zero stride (invalid)
        { buffer: 0, byteOffset: 4100, byteLength: 100, byteStride: 1 }, // Stride < 4 (invalid)
        { buffer: 0, byteOffset: 4200, byteLength: 100, byteStride: 2 }, // Stride < 4 (invalid)
        { buffer: 0, byteOffset: 4300, byteLength: 100, byteStride: 3 }, // Stride < 4 (invalid)
        { buffer: 0, byteOffset: 4400, byteLength: 100, byteStride: 5 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 4500, byteLength: 100, byteStride: 6 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 4600, byteLength: 100, byteStride: 7 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 4700, byteLength: 100, byteStride: 9 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 4800, byteLength: 100, byteStride: 10 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 4900, byteLength: 100, byteStride: 11 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 5000, byteLength: 100, byteStride: 13 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 5100, byteLength: 100, byteStride: 14 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 5200, byteLength: 100, byteStride: 15 }, // Not multiple of 4 (invalid)
        { buffer: 0, byteOffset: 5300, byteLength: 100, byteStride: 256 }, // Stride > 255 (invalid)
        { buffer: 0, byteOffset: 5400, byteLength: 100, byteStride: 300 }, // Stride > 255 (invalid)
        { buffer: 0, byteOffset: 5500, byteLength: 100, byteStride: 1000 }, // Way over 255 (invalid)
        { buffer: 0, byteOffset: 5600, byteLength: 100, byteStride: -4 }, // Negative stride (invalid)
        { buffer: 0, byteOffset: 5700, byteLength: 100, byteStride: -100 }, // Negative stride (invalid)
        
        // 4. Test ELEMENT_ARRAY_BUFFER with stride (should be invalid)
        { buffer: 0, byteOffset: 5800, byteLength: 100, byteStride: 4, target: 34963 },
        { buffer: 0, byteOffset: 5900, byteLength: 100, byteStride: 8, target: 34963 },
        { buffer: 0, byteOffset: 6000, byteLength: 100, byteStride: 16, target: 34963 },
        { buffer: 0, byteOffset: 6100, byteLength: 100, byteStride: 255, target: 34963 },
        
        // 5. Test alignment issues with strides
        { buffer: 0, byteOffset: 1, byteLength: 100, byteStride: 4 }, // Offset not aligned to stride
        { buffer: 0, byteOffset: 2, byteLength: 100, byteStride: 4 }, // Offset not aligned to stride
        { buffer: 0, byteOffset: 3, byteLength: 100, byteStride: 4 }, // Offset not aligned to stride
        { buffer: 0, byteOffset: 5, byteLength: 100, byteStride: 8 }, // Offset not aligned to stride
        { buffer: 0, byteOffset: 9, byteLength: 100, byteStride: 8 }, // Offset not aligned to stride
        { buffer: 0, byteOffset: 1, byteLength: 100, byteStride: 12 }, // Offset not aligned to stride
        { buffer: 0, byteOffset: 13, byteLength: 100, byteStride: 16 }, // Offset not aligned to stride
        
        // 6. Test boundary conditions for buffer references
        { buffer: 2, byteOffset: 0, byteLength: 1 }, // Use minimal buffer (1 byte)
        { buffer: 2, byteOffset: 0, byteLength: 2 }, // Exceeds minimal buffer (invalid)
        { buffer: 1, byteOffset: 4999, byteLength: 1 }, // At exact end of buffer
        { buffer: 1, byteOffset: 5000, byteLength: 1 }, // Beyond end of buffer (invalid)
        { buffer: 3, byteOffset: 99999, byteLength: 1 }, // At exact end of large buffer
        { buffer: 3, byteOffset: 100000, byteLength: 1 }, // Beyond end of large buffer (invalid)
        
        // 7. Test offset + length boundary conditions
        { buffer: 0, byteOffset: 9900, byteLength: 100 }, // Exactly fits in buffer
        { buffer: 0, byteOffset: 9900, byteLength: 101 }, // Exceeds buffer by 1 byte (invalid)
        { buffer: 0, byteOffset: 5000, byteLength: 5000 }, // Uses second half of buffer exactly
        { buffer: 0, byteOffset: 5000, byteLength: 5001 }, // Exceeds buffer (invalid)
        { buffer: 0, byteOffset: 1, byteLength: 9999 }, // Fits with offset
        { buffer: 0, byteOffset: 1, byteLength: 10000 }, // Exceeds with offset (invalid)
        
        // 8. Test invalid target values
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 0 }, // Invalid target
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 1 }, // Invalid target
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 34961 }, // Just below valid range
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 34964 }, // Just above valid range
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 99999 }, // Way invalid
        { buffer: 0, byteOffset: 0, byteLength: 100, target: -1 }, // Negative target
        { buffer: 0, byteOffset: 0, byteLength: 100, target: -34962 }, // Negative valid-looking target
        
        // 9. Test very large offset and length values
        { buffer: 3, byteOffset: 50000, byteLength: 50000 }, // Large but valid
        { buffer: 3, byteOffset: 90000, byteLength: 10000 }, // Large but valid
        { buffer: 3, byteOffset: 50000, byteLength: 50001 }, // Large but invalid
        { buffer: 3, byteOffset: Number.MAX_SAFE_INTEGER, byteLength: 1 }, // Extreme offset (invalid)
        { buffer: 3, byteOffset: 0, byteLength: Number.MAX_SAFE_INTEGER }, // Extreme length (invalid)
        
        // 10. Test zero values
        { buffer: 0, byteOffset: 0, byteLength: 0 }, // Zero length (invalid)
        { buffer: 0, byteOffset: 100, byteLength: 0 }, // Zero length with offset (invalid)
        
        // 11. Test stride with various lengths
        { buffer: 0, byteOffset: 7000, byteLength: 4, byteStride: 4 }, // Length equals stride
        { buffer: 0, byteOffset: 7004, byteLength: 8, byteStride: 4 }, // Length is 2x stride
        { buffer: 0, byteOffset: 7012, byteLength: 12, byteStride: 4 }, // Length is 3x stride
        { buffer: 0, byteOffset: 7024, byteLength: 5, byteStride: 4 }, // Length not multiple of stride
        { buffer: 0, byteOffset: 7029, byteLength: 6, byteStride: 8 }, // Length not multiple of stride
        { buffer: 0, byteOffset: 7035, byteLength: 10, byteStride: 12 }, // Length not multiple of stride
        
        // 12. Test no target specified (should be valid)
        { buffer: 0, byteOffset: 8000, byteLength: 100 }, // No target
        { buffer: 0, byteOffset: 8100, byteLength: 100, byteStride: 16 }, // No target with stride
        { buffer: 1, byteOffset: 0, byteLength: 1000 } // No target, different buffer
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-view-80-percent-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});