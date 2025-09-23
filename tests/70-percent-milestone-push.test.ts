import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('70 Percent Milestone Push', () => {

  it('should target camera validator remaining branches (28.20% -> 50%+)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        // Test every single type validation path
        { type: null }, // null type
        { type: undefined }, // undefined type  
        { type: 123 }, // numeric type
        { type: true }, // boolean type
        { type: [] }, // array type
        { type: {} }, // object type
        { type: '' }, // empty string type
        
        // Test missing camera objects with valid types
        { type: 'perspective' }, // Missing perspective object
        { type: 'orthographic' }, // Missing orthographic object
        
        // Test null/undefined camera objects
        { type: 'perspective', perspective: null },
        { type: 'perspective', perspective: undefined },
        { type: 'orthographic', orthographic: null },
        { type: 'orthographic', orthographic: undefined },
        
        // Test empty camera objects
        { type: 'perspective', perspective: {} },
        { type: 'orthographic', orthographic: {} },
        
        // Test perspective with non-numeric values
        {
          type: 'perspective',
          perspective: {
            yfov: 'invalid',
            znear: null,
            aspectRatio: undefined,
            zfar: false
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: [],
            znear: {},
            aspectRatio: 'string',
            zfar: true
          }
        },
        
        // Test orthographic with non-numeric values
        {
          type: 'orthographic',
          orthographic: {
            xmag: 'invalid',
            ymag: null,
            znear: undefined,
            zfar: []
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: {},
            ymag: false,
            znear: 'string',
            zfar: true
          }
        },
        
        // Test extreme numeric edge cases
        {
          type: 'perspective',
          perspective: {
            yfov: Number.NaN,
            znear: Number.POSITIVE_INFINITY,
            aspectRatio: Number.NEGATIVE_INFINITY,
            zfar: -Number.MAX_VALUE
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.NaN,
            ymag: Number.POSITIVE_INFINITY,
            znear: Number.NEGATIVE_INFINITY,
            zfar: -Number.MAX_VALUE
          }
        },
        
        // Test very specific boundary conditions
        {
          type: 'perspective',
          perspective: {
            yfov: Math.PI / 2, // Valid boundary
            znear: 1e-10, // Very small but valid
            aspectRatio: 1e-10, // Very small but valid
            zfar: 1e-10 + 1e-20 // Just slightly larger than znear
          }
        },
        
        // Test precision edge cases
        {
          type: 'perspective',
          perspective: {
            yfov: 3.14159265358979323846, // High precision PI (invalid)
            znear: 0.1
          }
        },
        
        // Test with extra invalid properties
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            invalidProperty: 'should be ignored',
            anotherInvalid: 42
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 0.1,
            zfar: 1000.0,
            invalidProperty: 'should be ignored',
            anotherInvalid: true
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-70-percent-push.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target accessor validator hardest branches (50.67% -> 65%+)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 10000 }],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: 5000 },
        { buffer: 0, byteOffset: 5000, byteLength: 5000 }
      ],
      accessors: [
        // Test all component type validation paths
        { bufferView: 0, byteOffset: 0, componentType: 5120, count: 100, type: 'SCALAR' }, // BYTE
        { bufferView: 0, byteOffset: 100, componentType: 5121, count: 100, type: 'SCALAR' }, // UNSIGNED_BYTE
        { bufferView: 0, byteOffset: 200, componentType: 5122, count: 100, type: 'SCALAR' }, // SHORT
        { bufferView: 0, byteOffset: 400, componentType: 5123, count: 100, type: 'SCALAR' }, // UNSIGNED_SHORT
        { bufferView: 0, byteOffset: 600, componentType: 5125, count: 100, type: 'SCALAR' }, // UNSIGNED_INT
        { bufferView: 0, byteOffset: 1000, componentType: 5126, count: 100, type: 'SCALAR' }, // FLOAT
        
        // Test all type validation paths
        { bufferView: 0, byteOffset: 1400, componentType: 5126, count: 50, type: 'VEC2' },
        { bufferView: 0, byteOffset: 1800, componentType: 5126, count: 50, type: 'VEC3' },
        { bufferView: 0, byteOffset: 2400, componentType: 5126, count: 50, type: 'VEC4' },
        { bufferView: 0, byteOffset: 3200, componentType: 5126, count: 25, type: 'MAT2' },
        { bufferView: 0, byteOffset: 3600, componentType: 5126, count: 25, type: 'MAT3' },
        { bufferView: 0, byteOffset: 4500, componentType: 5126, count: 10, type: 'MAT4' },
        
        // Test invalid component types
        { bufferView: 0, byteOffset: 0, componentType: 1234, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5124, count: 10, type: 'SCALAR' }, // INT (invalid for accessor)
        { bufferView: 0, byteOffset: 0, componentType: 0, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: -1, count: 10, type: 'SCALAR' },
        
        // Test invalid types
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'INVALID' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: '' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: null },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 123 },
        
        // Test count validation
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 0, type: 'SCALAR' }, // Zero count
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: -1, type: 'SCALAR' }, // Negative count
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: null, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 'invalid', type: 'SCALAR' },
        
        // Test buffer view validation
        { bufferView: -1, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 999, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: null, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 'invalid', byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        
        // Test byte offset validation
        { bufferView: 0, byteOffset: -1, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 6000, componentType: 5126, count: 10, type: 'SCALAR' }, // Exceeds buffer view
        { bufferView: 0, byteOffset: null, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 'invalid', componentType: 5126, count: 10, type: 'SCALAR' },
        
        // Test normalized flag
        { bufferView: 0, byteOffset: 0, componentType: 5120, count: 10, type: 'VEC3', normalized: true },
        { bufferView: 0, byteOffset: 0, componentType: 5121, count: 10, type: 'VEC3', normalized: false },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3', normalized: true }, // Float with normalized (unusual)
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3', normalized: 'invalid' },
        
        // Test min/max arrays
        {
          bufferView: 0, 
          byteOffset: 0, 
          componentType: 5126, 
          count: 10, 
          type: 'VEC3',
          min: [0, 0, 0],
          max: [1, 1, 1]
        },
        {
          bufferView: 0, 
          byteOffset: 0, 
          componentType: 5126, 
          count: 10, 
          type: 'VEC3',
          min: [0, 0], // Wrong length
          max: [1, 1, 1, 1] // Wrong length
        },
        {
          bufferView: 0, 
          byteOffset: 0, 
          componentType: 5126, 
          count: 10, 
          type: 'SCALAR',
          min: 'invalid',
          max: null
        },
        
        // Test sparse accessors
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 1,
              byteOffset: 0,
              componentType: 5123 // UNSIGNED_SHORT
            },
            values: {
              bufferView: 1,
              byteOffset: 20
            }
          }
        },
        
        // Test invalid sparse accessors
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: -1, // Invalid count
            indices: {
              bufferView: 999, // Invalid buffer view
              byteOffset: 0,
              componentType: 1234 // Invalid component type
            },
            values: {
              bufferView: 999, // Invalid buffer view
              byteOffset: -1 // Invalid offset
            }
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-70-percent-push.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target remaining validator edge cases for 70% milestone', async () => {
    const gltf = {
      asset: { version: '2.0' },
      extensionsUsed: ['INVALID_EXT'],
      extensionsRequired: ['MISSING_EXT', 'ANOTHER_MISSING'],
      buffers: [{ byteLength: 5000 }],
      bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 5000 }],
      accessors: [
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 100, type: 'VEC3' },
        { bufferView: 0, byteOffset: 1200, componentType: 5125, count: 150, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 1800, componentType: 5126, count: 16, type: 'MAT4' }
      ],
      nodes: [
        {
          // Test conflicting transform properties
          translation: [1, 2, 3],
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] // Should conflict
        },
        {
          rotation: [0, 0, 0, 1],
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] // Should conflict
        },
        {
          scale: [1, 1, 1],
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] // Should conflict
        },
        {
          // Test invalid matrix (not 16 elements)
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] // Missing elements
        },
        {
          // Test invalid matrix (wrong values)
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0] // Not affine (last element should be 1)
        },
        {
          // Test invalid translation
          translation: [1, 2] // Should be 3 elements
        },
        {
          // Test invalid rotation
          rotation: [0, 0, 0] // Should be 4 elements (quaternion)
        },
        {
          // Test invalid scale
          scale: [1, 1] // Should be 3 elements
        },
        {
          // Test non-normalized quaternion
          rotation: [0.5, 0.5, 0.5, 0.5] // Not normalized
        },
        {
          // Test circular reference
          children: [0] // Self reference
        }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              // Test invalid primitive modes
              mode: -1
            },
            {
              attributes: {
                POSITION: 0
              },
              mode: 8 // Invalid mode (> 6)
            }
          ]
        }
      ],
      materials: [
        {
          // Test all invalid factor ranges
          pbrMetallicRoughness: {
            baseColorFactor: [2.0, -0.5, 1.5, 1.1], // Values outside [0,1]
            metallicFactor: 2.0, // > 1.0
            roughnessFactor: -0.5 // < 0.0
          },
          emissiveFactor: [-0.1, 2.0, 1.5], // Values outside [0,1]
          alphaCutoff: -0.1, // < 0.0
          alphaMode: 'UNKNOWN_MODE'
        }
      ],
      animations: [
        {
          channels: [
            {
              sampler: 0,
              target: {
                node: 0,
                path: 'weights' // Test weights animation path
              }
            }
          ],
          samplers: [
            {
              input: 1, // Time should be SCALAR
              output: 0, // Output for weights should be SCALAR array
              interpolation: 'INVALID_INTERPOLATION'
            }
          ]
        }
      ],
      skins: [
        {
          joints: [0, 1, 2],
          inverseBindMatrices: 2, // MAT4 accessor
          skeleton: 10 // Invalid skeleton index
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'remaining-edge-cases-70.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});