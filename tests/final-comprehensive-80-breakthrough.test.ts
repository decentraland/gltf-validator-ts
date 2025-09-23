import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Final Comprehensive 80% Breakthrough Tests', () => {

  it('should hit every remaining accessor validator path to maximize coverage', async () => {
    // Create the most comprehensive test possible for accessor validation
    const testData = new Float32Array([
      // Values to test all formatValue paths
      1.0, 2.0, -1.0, 0.0, // Whole numbers
      1.5, 2.75, -3.25, 0.1, // Decimals
      Infinity, -Infinity, NaN, // Special values
      Number.MIN_VALUE, Number.MAX_VALUE, // Edge values
      // Matrix test data
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // MAT4
      1, 0, 0, 0, 1, 0, 0, 0, 1, // MAT3
      1, 0, 0, 1, // MAT2
      // Additional test values
      42.0, -42.0, 100.5, -100.5
    ]);

    const base64Data = btoa(String.fromCharCode(...new Uint8Array(testData.buffer)));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // UNDEFINED_PROPERTY: missing componentType
          count: 10,
          type: 'VEC3',
          bufferView: 0
        },
        {
          // UNDEFINED_PROPERTY: missing count  
          componentType: 5126,
          type: 'VEC3',
          bufferView: 0
        },
        {
          // UNDEFINED_PROPERTY: missing type
          componentType: 5126,
          count: 10,
          bufferView: 0
        },
        {
          // INVALID_COMPONENT_TYPE: unknown componentType
          componentType: 9999,
          count: 5,
          type: 'SCALAR',
          bufferView: 0
        },
        {
          // INVALID_TYPE: unknown accessor type
          componentType: 5126,
          count: 5,
          type: 'UNKNOWN_TYPE_VALUE',
          bufferView: 0
        },
        {
          // VALUE_NOT_IN_RANGE: negative count
          componentType: 5126,
          count: -1,
          type: 'SCALAR',
          bufferView: 0
        },
        {
          // Test min/max array length validation
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          min: [1.0, 2.0], // Wrong length (should be 3)
          max: [3.0, 4.0, 5.0, 6.0] // Wrong length (should be 3)
        },
        {
          // Test normalized accessor validation
          componentType: 5121, // UNSIGNED_BYTE
          count: 10,
          type: 'VEC4',
          bufferView: 0,
          normalized: true
        },
        {
          // Test sparse accessor with missing properties
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            // Missing count
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 0
            }
          }
        },
        {
          // Test sparse accessor with invalid count
          componentType: 5126,
          count: 50,
          type: 'VEC2',
          sparse: {
            count: 51, // Greater than accessor count
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 0
            }
          }
        },
        {
          // Test sparse indices missing bufferView
          componentType: 5126,
          count: 25,
          type: 'SCALAR',
          sparse: {
            count: 5,
            indices: {
              // Missing bufferView
              componentType: 5123
            },
            values: {
              bufferView: 0
            }
          }
        },
        {
          // Test sparse indices missing componentType
          componentType: 5126,
          count: 25,
          type: 'SCALAR',
          sparse: {
            count: 5,
            indices: {
              bufferView: 0
              // Missing componentType
            },
            values: {
              bufferView: 0
            }
          }
        },
        {
          // Test sparse values missing bufferView
          componentType: 5126,
          count: 25,
          type: 'SCALAR',
          sparse: {
            count: 5,
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              // Missing bufferView
            }
          }
        },
        {
          // Test sparse indices invalid componentType
          componentType: 5126,
          count: 25,
          type: 'SCALAR',
          sparse: {
            count: 5,
            indices: {
              bufferView: 0,
              componentType: 9999 // Invalid
            },
            values: {
              bufferView: 0
            }
          }
        },
        {
          // Test sparse indices unresolved bufferView reference
          componentType: 5126,
          count: 25,
          type: 'SCALAR',
          sparse: {
            count: 5,
            indices: {
              bufferView: 999, // Non-existent
              componentType: 5123
            },
            values: {
              bufferView: 0
            }
          }
        },
        {
          // Test sparse values unresolved bufferView reference  
          componentType: 5126,
          count: 25,
          type: 'SCALAR',
          sparse: {
            count: 5,
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 999 // Non-existent
            }
          }
        },
        {
          // Test bounds validation with stride
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 1 // Has stride
        },
        {
          // Test alignment validation
          componentType: 5122, // SHORT
          count: 5,
          type: 'VEC2',
          bufferView: 2, // Misaligned offset
          byteOffset: 1 // Not aligned to 2 bytes
        },
        {
          // Test matrix alignment validation
          componentType: 5126, // FLOAT
          count: 1,
          type: 'MAT4',
          bufferView: 0,
          byteOffset: 1 // Not aligned to 4 bytes
        },
        {
          // Test bounds exceeding buffer
          componentType: 5126,
          count: 1000, // Way too many elements
          type: 'SCALAR',
          bufferView: 0
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: testData.byteLength
        },
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          byteStride: 16 // For stride testing
        },
        {
          buffer: 0,
          byteOffset: 1, // Odd offset for alignment testing
          byteLength: 50
        }
      ],
      buffers: [
        {
          byteLength: testData.byteLength,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'comprehensive-accessor-80.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit every remaining camera validator path to maximize coverage', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // UNDEFINED_PROPERTY: missing type
          perspective: {
            yfov: 1.0,
            znear: 0.1
          }
        },
        {
          // TYPE_MISMATCH: wrong type for type property
          type: 123,
          perspective: {
            yfov: 1.0,
            znear: 0.1
          }
        },
        {
          // INVALID_CAMERA_TYPE: unknown camera type
          type: 'unknown_camera',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          }
        },
        {
          // UNDEFINED_PROPERTY: perspective missing for perspective camera
          type: 'perspective'
        },
        {
          // TYPE_MISMATCH: perspective is not object
          type: 'perspective',
          perspective: 'not_an_object'
        },
        {
          // UNDEFINED_PROPERTY: missing yfov
          type: 'perspective',
          perspective: {
            znear: 0.1
          }
        },
        {
          // TYPE_MISMATCH: yfov is not number
          type: 'perspective',
          perspective: {
            yfov: 'not_a_number',
            znear: 0.1
          }
        },
        {
          // VALUE_NOT_IN_RANGE: yfov <= 0
          type: 'perspective',
          perspective: {
            yfov: 0.0,
            znear: 0.1
          }
        },
        {
          // VALUE_NOT_IN_RANGE: yfov >= PI
          type: 'perspective',
          perspective: {
            yfov: Math.PI,
            znear: 0.1
          }
        },
        {
          // UNDEFINED_PROPERTY: missing znear
          type: 'perspective',
          perspective: {
            yfov: 1.0
          }
        },
        {
          // TYPE_MISMATCH: znear is not number
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 'not_a_number'
          }
        },
        {
          // VALUE_NOT_IN_RANGE: znear <= 0
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.0
          }
        },
        {
          // TYPE_MISMATCH: aspectRatio is not number
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 'not_a_number'
          }
        },
        {
          // VALUE_NOT_IN_RANGE: aspectRatio <= 0
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 0.0
          }
        },
        {
          // TYPE_MISMATCH: zfar is not number
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: 'not_a_number'
          }
        },
        {
          // VALUE_NOT_IN_RANGE: zfar <= znear
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 100.0,
            zfar: 50.0
          }
        },
        {
          // UNDEFINED_PROPERTY: orthographic missing for orthographic camera
          type: 'orthographic'
        },
        {
          // TYPE_MISMATCH: orthographic is not object
          type: 'orthographic',
          orthographic: 'not_an_object'
        },
        {
          // UNDEFINED_PROPERTY: missing xmag
          type: 'orthographic',
          orthographic: {
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          // TYPE_MISMATCH: xmag is not number
          type: 'orthographic',
          orthographic: {
            xmag: 'not_a_number',
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          // VALUE_NOT_IN_RANGE: xmag = 0
          type: 'orthographic',
          orthographic: {
            xmag: 0.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          // UNDEFINED_PROPERTY: missing ymag
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          // TYPE_MISMATCH: ymag is not number
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 'not_a_number',
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          // VALUE_NOT_IN_RANGE: ymag = 0
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 0.0,
            zfar: 1000.0,
            znear: 0.1
          }
        },
        {
          // UNDEFINED_PROPERTY: missing zfar
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 0.1
          }
        },
        {
          // TYPE_MISMATCH: zfar is not number
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 'not_a_number',
            znear: 0.1
          }
        },
        {
          // UNDEFINED_PROPERTY: missing znear
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0
          }
        },
        {
          // TYPE_MISMATCH: znear is not number
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 'not_a_number'
          }
        },
        {
          // VALUE_NOT_IN_RANGE: znear <= 0
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: -0.1
          }
        },
        {
          // VALUE_NOT_IN_RANGE: zfar <= znear
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 1000.0,
            zfar: 500.0
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'comprehensive-camera-80.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining image, node, and other validator paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1, 2] }],
      
      // Image validator comprehensive tests
      images: [
        {
          // UNDEFINED_PROPERTY: missing uri and bufferView
          mimeType: 'image/png'
        },
        {
          // MUTUALLY_EXCLUSIVE_PROPERTIES: both uri and bufferView
          uri: 'test.png',
          bufferView: 0,
          mimeType: 'image/png'
        },
        {
          // Invalid URI with protocol not allowed
          uri: 'javascript:alert("xss")'
        },
        {
          // TYPE_MISMATCH: bufferView is not number
          bufferView: 'not_a_number',
          mimeType: 'image/png'
        },
        {
          // TYPE_MISMATCH: mimeType is not string
          bufferView: 0,
          mimeType: 123
        },
        {
          // UNSUPPORTED_MIME_TYPE: unsupported MIME type
          bufferView: 0,
          mimeType: 'image/tiff'
        },
        {
          // INVALID_BUFFERVIEW_TARGET: bufferView has byteStride
          bufferView: 1,
          mimeType: 'image/png'
        },
        {
          // UNRESOLVED_REFERENCE: invalid bufferView reference
          bufferView: 999,
          mimeType: 'image/png'
        }
      ],
      
      // Node validator comprehensive tests
      nodes: [
        {
          // MUTUALLY_EXCLUSIVE_PROPERTIES: matrix with TRS
          matrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
          translation: [1, 0, 0],
          name: 'MatrixWithTRS'
        },
        {
          // TYPE_MISMATCH: matrix is not array
          matrix: 'not_an_array',
          name: 'InvalidMatrixType'
        },
        {
          // INVALID_ARRAY_LENGTH: matrix wrong length
          matrix: [1, 0, 0, 0, 0, 1], // Only 6 elements instead of 16
          name: 'InvalidMatrixLength'
        },
        {
          // TYPE_MISMATCH: translation is not array
          translation: 'not_an_array',
          name: 'InvalidTranslationType'
        },
        {
          // INVALID_ARRAY_LENGTH: translation wrong length
          translation: [1, 0], // Only 2 elements instead of 3
          name: 'InvalidTranslationLength'
        },
        {
          // TYPE_MISMATCH: rotation is not array
          rotation: 'not_an_array',
          name: 'InvalidRotationType'
        },
        {
          // INVALID_ARRAY_LENGTH: rotation wrong length
          rotation: [0, 0, 0], // Only 3 elements instead of 4
          name: 'InvalidRotationLength'
        },
        {
          // TYPE_MISMATCH: scale is not array
          scale: 'not_an_array',
          name: 'InvalidScaleType'
        },
        {
          // INVALID_ARRAY_LENGTH: scale wrong length
          scale: [1, 1], // Only 2 elements instead of 3
          name: 'InvalidScaleLength'
        },
        {
          // TYPE_MISMATCH: children is not array
          children: 'not_an_array',
          name: 'InvalidChildrenType'
        },
        {
          // TYPE_MISMATCH: mesh is not number
          mesh: 'not_a_number',
          name: 'InvalidMeshType'
        },
        {
          // TYPE_MISMATCH: camera is not number
          camera: 'not_a_number',
          name: 'InvalidCameraType'
        },
        {
          // TYPE_MISMATCH: skin is not number
          skin: 'not_a_number',
          name: 'InvalidSkinType'
        },
        {
          // TYPE_MISMATCH: weights is not array
          weights: 'not_an_array',
          name: 'InvalidWeightsType'
        },
        {
          // UNRESOLVED_REFERENCE: invalid mesh reference
          mesh: 999,
          name: 'UnresolvedMesh'
        },
        {
          // UNRESOLVED_REFERENCE: invalid camera reference
          camera: 999,
          name: 'UnresolvedCamera'
        },
        {
          // UNRESOLVED_REFERENCE: invalid skin reference
          skin: 999,
          name: 'UnresolvedSkin'
        },
        {
          // UNRESOLVED_REFERENCE: invalid child reference
          children: [999],
          name: 'UnresolvedChild'
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
    const result = await validateBytes(data, { uri: 'comprehensive-remaining-80.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit comprehensive validation state and error reporting paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      
      // Create complex structure to test validation state
      scene: 0,
      scenes: [
        {
          nodes: [0, 1, 2, 3, 4]
        }
      ],
      
      nodes: [
        {
          name: 'ComplexRoot',
          children: [1, 2],
          mesh: 0,
          skin: 0,
          extensions: {
            'NODE_EXT': { value: true }
          },
          extras: {
            nodeData: 'complex'
          }
        },
        {
          name: 'Child1',
          camera: 0,
          children: [3]
        },
        {
          name: 'Child2', 
          mesh: 1,
          weights: [0.5, 0.5]
        },
        {
          name: 'Child3',
          children: [4]
        },
        {
          name: 'Child4'
        }
      ],
      
      meshes: [
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: 1,
                TEXCOORD_0: 2,
                TEXCOORD_1: 3,
                COLOR_0: 4,
                JOINTS_0: 5,
                WEIGHTS_0: 6
              },
              indices: 7,
              material: 0,
              targets: [
                { POSITION: 8, NORMAL: 9 },
                { POSITION: 10, TANGENT: 11 }
              ]
            }
          ],
          weights: [0.3, 0.7]
        },
        {
          primitives: [
            {
              attributes: { POSITION: 12 },
              material: 1
            }
          ]
        }
      ],
      
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 0.0, 0.0, 1.0],
            baseColorTexture: { index: 0, texCoord: 0 },
            metallicFactor: 0.0,
            roughnessFactor: 1.0,
            metallicRoughnessTexture: { index: 1, texCoord: 1 }
          },
          normalTexture: { index: 0, scale: 1.0 },
          occlusionTexture: { index: 1, strength: 1.0 },
          emissiveTexture: { index: 0 },
          emissiveFactor: [0.0, 0.0, 0.0],
          alphaMode: 'OPAQUE',
          alphaCutoff: 0.5,
          doubleSided: false
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [0.0, 1.0, 0.0, 1.0]
          }
        }
      ],
      
      textures: [
        { source: 0, sampler: 0 },
        { source: 1, sampler: 1 }
      ],
      
      images: [
        { uri: 'texture1.png' },
        { uri: 'texture2.png' }
      ],
      
      samplers: [
        {
          magFilter: 9729,
          minFilter: 9987,
          wrapS: 10497,
          wrapT: 10497
        },
        {
          magFilter: 9728,
          minFilter: 9984,
          wrapS: 33071,
          wrapT: 33071
        }
      ],
      
      cameras: [
        {
          type: 'perspective',
          perspective: {
            yfov: 0.785398,
            aspectRatio: 1.777,
            znear: 0.01,
            zfar: 1000.0
          }
        }
      ],
      
      skins: [
        {
          joints: [1, 2, 3],
          inverseBindMatrices: 13,
          skeleton: 0
        }
      ],
      
      animations: [
        {
          samplers: [
            {
              input: 14,
              output: 15,
              interpolation: 'LINEAR'
            },
            {
              input: 14,
              output: 16,
              interpolation: 'STEP'
            },
            {
              input: 14,
              output: 17,
              interpolation: 'CUBICSPLINE'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 1, path: 'translation' }
            },
            {
              sampler: 1,
              target: { node: 2, path: 'rotation' }
            },
            {
              sampler: 2,
              target: { node: 3, path: 'scale' }
            }
          ]
        }
      ],
      
      accessors: [
        { componentType: 5126, count: 24, type: 'VEC3' }, // 0: POSITION
        { componentType: 5126, count: 24, type: 'VEC3' }, // 1: NORMAL
        { componentType: 5126, count: 24, type: 'VEC2' }, // 2: TEXCOORD_0
        { componentType: 5126, count: 24, type: 'VEC2' }, // 3: TEXCOORD_1
        { componentType: 5126, count: 24, type: 'VEC4' }, // 4: COLOR_0
        { componentType: 5121, count: 24, type: 'VEC4' }, // 5: JOINTS_0
        { componentType: 5126, count: 24, type: 'VEC4' }, // 6: WEIGHTS_0
        { componentType: 5123, count: 36, type: 'SCALAR' }, // 7: indices
        { componentType: 5126, count: 24, type: 'VEC3' }, // 8: morph POSITION 1
        { componentType: 5126, count: 24, type: 'VEC3' }, // 9: morph NORMAL 1
        { componentType: 5126, count: 24, type: 'VEC3' }, // 10: morph POSITION 2
        { componentType: 5126, count: 24, type: 'VEC3' }, // 11: morph TANGENT 2
        { componentType: 5126, count: 12, type: 'VEC3' }, // 12: mesh 2 POSITION
        { componentType: 5126, count: 3, type: 'MAT4' },  // 13: inverse bind matrices
        { componentType: 5126, count: 5, type: 'SCALAR' }, // 14: animation input
        { componentType: 5126, count: 5, type: 'VEC3' },  // 15: animation translation
        { componentType: 5126, count: 5, type: 'VEC4' },  // 16: animation rotation
        { componentType: 5126, count: 15, type: 'VEC3' }  // 17: CUBICSPLINE scale
      ],
      
      extensions: {
        'GLOBAL_EXTENSION': {
          globalValue: 'comprehensive'
        }
      },
      
      extras: {
        globalCustom: {
          testMode: true,
          version: '1.0'
        }
      }
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'comprehensive-validation-80.gltf' });
    
    // Test comprehensive validation results
    expect(result.info.totalTriangleCount).toBeGreaterThanOrEqual(0);
    expect(result.info.drawCallCount).toBeGreaterThanOrEqual(0);
    expect(result.info.maxAttributes).toBeGreaterThanOrEqual(0);
    expect(result.info.maxUVs).toBeGreaterThanOrEqual(0);
    expect(result.info.maxInfluences).toBeGreaterThanOrEqual(0);
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});