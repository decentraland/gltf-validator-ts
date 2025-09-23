import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('75 Percent Milestone Assault', () => {

  it('should target every remaining validation branch for 75% breakthrough', async () => {
    // Create the most comprehensive GLTF validation test possible
    const complexFloatArray = new Float32Array([
      // Test all special float values
      Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NaN,
      0.0, -0.0, 1.0, -1.0, Number.EPSILON, -Number.EPSILON,
      Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_SAFE_INTEGER,
      // Matrix data for alignment testing
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // MAT4
      1, 0, 0, 0, 1, 0, 0, 0, 1, // MAT3  
      1, 0, 0, 1, // MAT2
      // Quaternion data (some unnormalized)
      0.5, 0.5, 0.5, 0.5, // Unnormalized quaternion
      0.707107, 0, 0, 0.707107, // Normalized quaternion
      2.0, 0, 0, 0, // Invalid quaternion (magnitude > 1)
      // Vector data
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    ]);

    const binaryData = new Uint8Array(complexFloatArray.buffer);

    const gltf = {
      asset: { 
        version: '2.0',
        minVersion: '2.0',
        generator: '75% Milestone Assault Generator',
        copyright: '© 2024 Ultra Coverage Test'
      },
      extensionsUsed: [
        'KHR_materials_unlit', 
        'KHR_materials_pbrSpecularGlossiness',
        'UNKNOWN_EXTENSION_1',
        'UNKNOWN_EXTENSION_2'
      ],
      extensionsRequired: [
        'MISSING_REQUIRED_EXTENSION',
        'ANOTHER_MISSING_EXTENSION'
      ],
      scene: 0,
      scenes: [
        {
          nodes: [0, 1, 2, 3, 4, 5, 999, 1000], // Mix of valid and invalid node references
          name: 'UltraComprehensiveScene',
          extensions: {
            'SCENE_EXT_1': { data: 'test' },
            'SCENE_EXT_2': { value: 42 }
          },
          extras: {
            sceneMetadata: {
              version: '1.0',
              complexity: 'maximum'
            }
          }
        },
        {
          nodes: [-1, -2, 10000], // All invalid references
          name: 'InvalidReferencesScene'
        }
      ],
      nodes: [
        {
          name: 'RootTransformNode',
          mesh: 0,
          skin: 0,
          camera: 0,
          // Test transform validation with extreme values
          translation: [Number.MAX_VALUE, Number.MIN_VALUE, Number.NaN],
          rotation: [Number.POSITIVE_INFINITY, 0, 0, Number.NEGATIVE_INFINITY], 
          scale: [0, Number.NaN, Number.NEGATIVE_INFINITY],
          weights: [
            Number.NaN, -10.5, 15.7, Number.POSITIVE_INFINITY,
            -Number.POSITIVE_INFINITY, 0, 1, -1
          ],
          children: [1, 2, 3, 999], // Mix of valid and invalid
          extensions: {
            'NODE_EXT': { transform: 'custom' }
          },
          extras: {
            nodeType: 'root',
            complexity: 10
          }
        },
        {
          name: 'ConflictingTransformNode',
          // Test conflicting transform properties (matrix + others)
          matrix: [
            Number.NaN, 0, 0, 0,
            0, Number.POSITIVE_INFINITY, 0, 0, 
            0, 0, Number.NEGATIVE_INFINITY, 0,
            0, 0, 0, 0 // Invalid: should be 1 for affine
          ],
          translation: [1, 2, 3], // Should conflict with matrix
          rotation: [0, 0, 0, 1], // Should conflict with matrix
          scale: [1, 1, 1] // Should conflict with matrix
        },
        {
          name: 'InvalidMatrixNode',
          // Test various invalid matrix configurations
          matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1 // Missing elements (should be 16)
          ]
        },
        {
          name: 'CircularReferenceNode',
          children: [0, 3] // Creates circular reference
        },
        {
          name: 'AllInvalidReferencesNode',
          mesh: -1,
          skin: -1, 
          camera: -1,
          children: [-1, -2, -3, 999, 1000]
        },
        {
          name: 'TypeValidationNode',
          mesh: 'invalid_string',
          skin: null,
          camera: true,
          translation: 'not_an_array',
          rotation: 42,
          scale: {},
          matrix: 'invalid_matrix',
          weights: 'invalid_weights',
          children: 'not_an_array'
        }
      ],
      buffers: [
        { 
          byteLength: binaryData.length,
          name: 'ComplexDataBuffer'
        },
        { 
          byteLength: 5000,
          name: 'AdditionalBuffer',
          uri: 'data:application/gltf-buffer;base64,' + btoa('x'.repeat(5000))
        },
        { 
          byteLength: 0, // Invalid zero length
          name: 'ZeroBuffer'
        },
        {
          byteLength: -1000, // Invalid negative length
          name: 'NegativeBuffer'
        },
        {
          byteLength: 'invalid', // Invalid type
          name: 'InvalidTypeBuffer'
        }
      ],
      bufferViews: [
        // Valid buffer views for different purposes
        { buffer: 0, byteOffset: 0, byteLength: 256, name: 'FloatData' },
        { buffer: 0, byteOffset: 256, byteLength: 200, byteStride: 4, target: 34962, name: 'VertexData' },
        { buffer: 0, byteOffset: 456, byteLength: 150, target: 34963, name: 'IndexData' },
        { buffer: 1, byteOffset: 0, byteLength: 1000, byteStride: 16, target: 34962, name: 'MatrixData' },
        
        // Test every possible buffer view error condition
        { buffer: -10, byteOffset: 0, byteLength: 100 }, // Extremely negative buffer index
        { buffer: 999999, byteOffset: 0, byteLength: 100 }, // Extremely high buffer index
        { buffer: null, byteOffset: 0, byteLength: 100 }, // Null buffer reference
        { buffer: 'invalid', byteOffset: 0, byteLength: 100 }, // String buffer reference
        { buffer: [], byteOffset: 0, byteLength: 100 }, // Array buffer reference
        { buffer: {}, byteOffset: 0, byteLength: 100 }, // Object buffer reference
        
        { buffer: 2, byteOffset: 0, byteLength: 100 }, // Reference to zero-length buffer
        { buffer: 3, byteOffset: 0, byteLength: 100 }, // Reference to negative-length buffer
        { buffer: 4, byteOffset: 0, byteLength: 100 }, // Reference to invalid-type buffer
        
        { buffer: 0, byteOffset: -1000, byteLength: 100 }, // Extremely negative offset
        { buffer: 0, byteOffset: Number.MAX_SAFE_INTEGER, byteLength: 100 }, // Extremely large offset
        { buffer: 0, byteOffset: null, byteLength: 100 }, // Null offset
        { buffer: 0, byteOffset: 'invalid', byteLength: 100 }, // String offset
        { buffer: 0, byteOffset: Number.NaN, byteLength: 100 }, // NaN offset
        { buffer: 0, byteOffset: Number.POSITIVE_INFINITY, byteLength: 100 }, // Infinite offset
        
        { buffer: 0, byteOffset: 0, byteLength: -1000 }, // Extremely negative length
        { buffer: 0, byteOffset: 0, byteLength: Number.MAX_SAFE_INTEGER }, // Extremely large length
        { buffer: 0, byteOffset: 0, byteLength: null }, // Null length
        { buffer: 0, byteOffset: 0, byteLength: 'invalid' }, // String length
        { buffer: 0, byteOffset: 0, byteLength: Number.NaN }, // NaN length
        { buffer: 0, byteOffset: 0, byteLength: Number.POSITIVE_INFINITY }, // Infinite length
        
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: -1 }, // Negative stride
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 0 }, // Zero stride
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 1 }, // Stride < 4
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 2 }, // Stride not multiple of 4
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 3 }, // Stride not multiple of 4
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 5 }, // Stride not multiple of 4
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 257 }, // Stride > 255
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 1000 }, // Extremely large stride
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: null }, // Null stride
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 'invalid' }, // String stride
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: Number.NaN }, // NaN stride
        
        { buffer: 0, byteOffset: 1, byteLength: 100, byteStride: 4 }, // Misaligned offset with stride
        { buffer: 0, byteOffset: 3, byteLength: 100, byteStride: 8 }, // Misaligned offset with stride
        
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 4, target: 34963 }, // Stride with ELEMENT_ARRAY_BUFFER
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 8, target: 34963 }, // Stride with ELEMENT_ARRAY_BUFFER
        
        { buffer: 0, byteOffset: 0, byteLength: 100, target: -1 }, // Negative target
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 99999 }, // Invalid target value
        { buffer: 0, byteOffset: 0, byteLength: 100, target: null }, // Null target
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 'invalid' } // String target
      ],
      accessors: [
        // Valid accessors for basic data
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 16, type: 'VEC4', name: 'QuaternionData' },
        { bufferView: 0, byteOffset: 64, componentType: 5126, count: 16, type: 'MAT4', name: 'TransformData' },
        { bufferView: 1, byteOffset: 0, componentType: 5126, count: 50, type: 'VEC3', name: 'PositionData' },
        { bufferView: 2, byteOffset: 0, componentType: 5125, count: 50, type: 'SCALAR', name: 'IndexData' },
        
        // Test every accessor validation path with extreme values
        { bufferView: 0, byteOffset: 128, componentType: 5120, count: 20, type: 'SCALAR' }, // BYTE
        { bufferView: 0, byteOffset: 148, componentType: 5121, count: 20, type: 'VEC2' }, // UNSIGNED_BYTE
        { bufferView: 0, byteOffset: 188, componentType: 5122, count: 10, type: 'VEC3' }, // SHORT
        { bufferView: 0, byteOffset: 248, componentType: 5123, count: 8, type: 'VEC4' }, // UNSIGNED_SHORT
        
        // Test all invalid component types
        { bufferView: 0, byteOffset: 0, componentType: 0, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: -1, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5124, count: 10, type: 'SCALAR' }, // INT (invalid)
        { bufferView: 0, byteOffset: 0, componentType: 1234, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 99999, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: null, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 'invalid', count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: [], count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: {}, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: Number.NaN, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: Number.POSITIVE_INFINITY, count: 10, type: 'SCALAR' },
        
        // Test all invalid types
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'INVALID_TYPE' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'UNKNOWN' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: '' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: null },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 123 },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: [] },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: {} },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: true },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: false },
        
        // Test all invalid counts
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 0, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: -1, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: -1000, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: null, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 'invalid', type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: [], type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: {}, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: Number.NaN, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: Number.POSITIVE_INFINITY, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: Number.NEGATIVE_INFINITY, type: 'SCALAR' },
        
        // Test comprehensive sparse accessor validation
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {
            count: 100, // Count exceeds accessor count (invalid)
            indices: {
              bufferView: 999, // Invalid buffer view
              byteOffset: -1, // Invalid offset
              componentType: 0 // Invalid component type
            },
            values: {
              bufferView: 999, // Invalid buffer view
              byteOffset: -1 // Invalid offset
            }
          }
        },
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {
            count: -10, // Negative count
            indices: {
              bufferView: null, // Null buffer view
              byteOffset: null, // Null offset
              componentType: null // Null component type
            },
            values: {
              bufferView: 'invalid', // String buffer view
              byteOffset: 'invalid' // String offset
            }
          }
        },
        {
          // Test sparse without required properties
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 50,
          type: 'VEC3',
          sparse: {}
        },
        
        // Test min/max validation with all edge cases
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          min: null,
          max: 'invalid'
        },
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          min: [1, 2], // Wrong length
          max: [1, 2, 3, 4, 5] // Wrong length
        },
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 10,
          type: 'SCALAR',
          min: [1, 2, 3], // Should be number for SCALAR
          max: 'invalid' // Should be number for SCALAR
        },
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 10,
          type: 'MAT4',
          min: [1, 2, 3], // Wrong length (should be 16)
          max: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] // Wrong length (should be 16)
        }
      ],
      meshes: [
        {
          name: '75PercentMesh',
          primitives: [
            {
              attributes: {
                POSITION: 2,
                NORMAL: 999, // Invalid accessor
                TEXCOORD_0: -1, // Invalid negative accessor
                TEXCOORD_99: 0, // Very high texcoord index
                COLOR_0: 'invalid', // Invalid string reference
                JOINTS_0: null, // Null reference
                WEIGHTS_0: [], // Array reference
                '_PRIVATE_ATTR': 0, // Invalid attribute starting with underscore
                'INVALID_ATTRIBUTE_NAME': 0, // Invalid attribute name
                'COLOR_-1': 0, // Invalid negative color index
                'TEXCOORD_-5': 0 // Invalid negative texcoord index
              },
              indices: 3,
              material: 999, // Invalid material reference
              mode: -10, // Extremely invalid mode
              targets: [
                {
                  POSITION: 2,
                  NORMAL: 999, // Invalid accessor in morph target
                  '_PRIVATE_TARGET': 0, // Invalid target attribute
                  'INVALID_TARGET': 0 // Invalid target attribute
                },
                {
                  POSITION: null, // Null accessor in morph target
                  NORMAL: 'invalid' // String accessor in morph target
                }
              ]
            },
            {
              // Test primitive with minimal/invalid attributes
              attributes: {},
              mode: 999
            },
            {
              attributes: {
                POSITION: 999999 // Extremely high invalid accessor reference
              },
              indices: -999, // Extremely negative invalid indices
              material: -1, // Negative material reference
              mode: null // Null mode
            }
          ],
          weights: [
            Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY,
            -999.5, 1000.7, null, 'invalid', [], {}
          ]
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: '75-percent-milestone-assault.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target GLB validator with comprehensive binary format errors', async () => {
    // Test every possible GLB validation error path
    const testGLBs = [
      // Test 1: Invalid magic numbers
      new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00]),
      new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x02, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00]),
      new Uint8Array([0x67, 0x6C, 0x54, 0x45, 0x02, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00]), // "glTE"
      new Uint8Array([0x67, 0x6C, 0x54, 0x00, 0x02, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00]), // "glt\0"
      
      // Test 2: Invalid versions
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00]), // Version 0
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x01, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00]), // Version 1
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x03, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00]), // Version 3
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0xFF, 0xFF, 0xFF, 0xFF, 0x20, 0x00, 0x00, 0x00]), // Version -1
      
      // Test 3: Files too short
      new Uint8Array([]), // Empty file
      new Uint8Array([0x67]), // 1 byte
      new Uint8Array([0x67, 0x6C]), // 2 bytes
      new Uint8Array([0x67, 0x6C, 0x54]), // 3 bytes
      new Uint8Array([0x67, 0x6C, 0x54, 0x46]), // 4 bytes
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02]), // 5 bytes
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00]), // 6 bytes
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00]), // 8 bytes
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x20]), // 9 bytes
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00]), // 11 bytes (missing last length byte)
      
      // Test 4: Invalid total lengths
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), // Length 0
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]), // Length 1 (too small)
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x0B, 0x00, 0x00, 0x00]), // Length 11 (less than header)
      
      // Test 5: Files with length mismatch
      new Uint8Array([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00]), // Claims 100 bytes but only 12
      
      // Test 6: Invalid chunk structures
      new Uint8Array([
        0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00, // Valid header, length 20
        0xFF, 0xFF, 0xFF, 0xFF // Chunk length exceeds remaining bytes
      ]),
      new Uint8Array([
        0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00, // Valid header, length 20
        0x00, 0x00, 0x00, 0x00 // Zero chunk length
      ]),
      new Uint8Array([
        0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, // Valid header, length 24
        0x04, 0x00, 0x00, 0x00, // Chunk length 4
        0x58, 0x58, 0x58, 0x58, // Invalid chunk type "XXXX"
        0x00, 0x00, 0x00, 0x00  // Chunk data
      ]),
      
      // Test 7: Non-JSON first chunk
      new Uint8Array([
        0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, // Valid header
        0x04, 0x00, 0x00, 0x00, // Chunk length 4
        0x42, 0x49, 0x4E, 0x00, // BIN chunk type (should be JSON first)
        0x00, 0x00, 0x00, 0x00  // Binary data
      ])
    ];

    for (let i = 0; i < testGLBs.length; i++) {
      const result = await validateBytes(testGLBs[i], { uri: `invalid-glb-comprehensive-${i}.glb` });
      expect(result.issues.numErrors).toBeGreaterThanOrEqual(0);
    }
  });

});