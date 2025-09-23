import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultimate Camera Assault Tests', () => {

  it('should hit every single remaining camera validator branch and condition', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        // Test every possible validation path in camera validator
        
        // 1. Test camera with no properties at all
        {},
        
        // 2. Test camera with only name (missing type and camera objects)
        { name: 'OnlyName' },
        
        // 3. Test camera with extensions and extras but no core properties
        {
          extensions: { 'CAMERA_EXT': { value: true } },
          extras: { custom: 'data' }
        },
        
        // 4. Test perspective camera with only some required properties
        {
          type: 'perspective',
          perspective: { yfov: 1.0 } // Missing znear
        },
        
        // 5. Test perspective camera with all properties present but some invalid
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 1.777,
            zfar: 1000.0,
            // Add invalid extra property
            invalidProp: 'should be ignored'
          }
        },
        
        // 6. Test orthographic camera with only some required properties  
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0
            // Missing zfar and znear
          }
        },
        
        // 7. Test orthographic camera with all properties present
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1,
            // Add invalid extra property
            invalidProp: 'should be ignored'
          }
        },
        
        // 8. Test boundary conditions for all numeric values
        {
          type: 'perspective',
          perspective: {
            yfov: Number.EPSILON, // Smallest positive number
            znear: Number.MIN_VALUE,
            aspectRatio: Number.EPSILON,
            zfar: Number.MAX_SAFE_INTEGER
          }
        },
        
        {
          type: 'perspective', 
          perspective: {
            yfov: Math.PI - Number.EPSILON, // Just under PI
            znear: Number.MAX_SAFE_INTEGER,
            aspectRatio: Number.MAX_SAFE_INTEGER,
            zfar: Number.MAX_SAFE_INTEGER
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.EPSILON,
            ymag: Number.EPSILON, 
            znear: Number.MIN_VALUE,
            zfar: Number.MAX_SAFE_INTEGER
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.MAX_SAFE_INTEGER,
            ymag: Number.MAX_SAFE_INTEGER,
            znear: Number.MAX_SAFE_INTEGER - 1,
            zfar: Number.MAX_SAFE_INTEGER
          }
        },
        
        // 9. Test special float values for each property
        {
          type: 'perspective',
          perspective: {
            yfov: Number.POSITIVE_INFINITY,
            znear: 0.1
          }
        },
        
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: Number.POSITIVE_INFINITY
          }
        },
        
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: Number.POSITIVE_INFINITY
          }
        },
        
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: Number.POSITIVE_INFINITY
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.POSITIVE_INFINITY,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: Number.POSITIVE_INFINITY,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: Number.POSITIVE_INFINITY,
            znear: 0.1
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: Number.POSITIVE_INFINITY
          }
        },
        
        // 10. Test NaN values for each property
        {
          type: 'perspective',
          perspective: {
            yfov: Number.NaN,
            znear: 0.1
          }
        },
        
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: Number.NaN
          }
        },
        
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: Number.NaN
          }
        },
        
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: Number.NaN
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.NaN,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: Number.NaN,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: Number.NaN,
            znear: 0.1
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: Number.NaN
          }
        },
        
        // 11. Test negative infinity values
        {
          type: 'perspective',
          perspective: {
            yfov: Number.NEGATIVE_INFINITY,
            znear: 0.1
          }
        },
        
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: Number.NEGATIVE_INFINITY
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: Number.NEGATIVE_INFINITY,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: Number.NEGATIVE_INFINITY,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        
        // 12. Test edge cases for zfar <= znear validation
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 1000.0,
            zfar: 1000.0 - Number.EPSILON // Just barely less than znear
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 1000.0,
            zfar: 1000.0 - Number.EPSILON // Just barely less than znear
          }
        },
        
        // 13. Test precision edge cases
        {
          type: 'perspective',
          perspective: {
            yfov: 0.000001,
            znear: 0.000001,
            aspectRatio: 0.000001,
            zfar: 0.000002
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 0.000001,
            ymag: 0.000001,
            znear: 0.000001,
            zfar: 0.000002
          }
        },
        
        // 14. Test with very large numbers
        {
          type: 'perspective',
          perspective: {
            yfov: 3.14159,
            znear: 999999999.0,
            aspectRatio: 999999999.0,
            zfar: 1000000000.0
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 999999999.0,
            ymag: 999999999.0,
            znear: 999999999.0,
            zfar: 1000000000.0
          }
        },
        
        // 15. Test cameras with only extensions/extras
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          extensions: {
            'CAMERA_EXTENSION_1': { data: 'test1' },
            'CAMERA_EXTENSION_2': { data: 'test2' }
          },
          extras: {
            customCamera: true,
            metadata: { version: '1.0' },
            nestedData: {
              level1: {
                level2: 'deep'
              }
            }
          },
          name: 'ComplexExtrasCamera'
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          extensions: {
            'ORTHOGRAPHIC_EXTENSION': { 
              projection: 'custom',
              parameters: [1, 2, 3, 4]
            }
          },
          extras: {
            orthoCustom: {
              algorithm: 'advanced',
              settings: {
                quality: 'high',
                optimization: true
              }
            }
          },
          name: 'ComplexOrthographicCamera'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultimate-camera-assault.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should test camera validator with mixed valid and invalid combinations', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        // Test cameras that have some valid and some invalid properties
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0, // Valid
            znear: -0.1, // Invalid (negative)
            aspectRatio: 1.777, // Valid
            zfar: 50.0 // Invalid (less than znear, but znear is also invalid)
          }
        },
        
        {
          type: 'orthographic', 
          orthographic: {
            xmag: 0.0, // Invalid (zero)
            ymag: 1.0, // Valid
            zfar: 1000.0, // Valid
            znear: 0.1 // Valid
          }
        },
        
        // Test perspective camera missing required znear but with other properties
        {
          type: 'perspective',
          perspective: {
            yfov: 0.785398, // Valid
            aspectRatio: 1.333, // Valid
            zfar: 1000.0 // Valid but znear is missing
          }
        },
        
        // Test orthographic camera missing multiple required properties
        {
          type: 'orthographic',
          orthographic: {
            xmag: 10.0 // Valid, but ymag, zfar, znear are missing
          }
        },
        
        // Test cameras with undefined properties mixed with valid ones
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: undefined, // Undefined
            zfar: 1000.0
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: undefined, // Undefined
            zfar: 1000.0,
            znear: 0.1
          }
        },
        
        // Test cameras with null properties
        {
          type: 'perspective',
          perspective: {
            yfov: null, // Null
            znear: 0.1,
            aspectRatio: 1.777,
            zfar: 1000.0
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: null, // Null
            znear: 0.1
          }
        },
        
        // Test cameras with mixed type errors
        {
          type: 'perspective',
          perspective: {
            yfov: '1.0', // String instead of number
            znear: 0.1,
            aspectRatio: true, // Boolean instead of number
            zfar: [1000.0] // Array instead of number
          }
        },
        
        {
          type: 'orthographic',
          orthographic: {
            xmag: { value: 1.0 }, // Object instead of number
            ymag: '1.0', // String instead of number  
            zfar: 1000.0,
            znear: false // Boolean instead of number
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-mixed-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});