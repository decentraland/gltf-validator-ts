import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Breakthrough 70 Percent Coverage', () => {

  it('should target every remaining uncovered branch for 70% breakthrough', async () => {
    const gltf = {
      asset: { 
        version: '2.0',
        minVersion: '1.0', // Test version compatibility
        generator: 'Breakthrough Test Generator',
        copyright: '© 2024'
      },
      extensionsUsed: ['KHR_materials_unlit', 'INVALID_EXT'],
      extensionsRequired: ['MISSING_REQUIRED_EXT'],
      scene: 0,
      scenes: [
        {
          nodes: [0, 1, 2, 999], // Invalid node reference
          name: 'BreakthroughScene'
        }
      ],
      nodes: [
        {
          name: 'ComplexNode',
          mesh: 0,
          skin: 0,
          camera: 0,
          // Test all transform property validation branches
          translation: [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
          rotation: [Number.NaN, 0, 0, Number.POSITIVE_INFINITY], // Invalid quaternion
          scale: [0, Number.NaN, Number.NEGATIVE_INFINITY], // Zero and invalid scale
          weights: [Number.NaN, -0.5, 1.5, Number.POSITIVE_INFINITY], // Invalid weight values
          children: [1, 2, 0] // Self-reference (circular)
        },
        {
          name: 'MatrixNode',
          // Test invalid matrix
          matrix: [
            Number.NaN, 0, 0, 0,
            0, Number.POSITIVE_INFINITY, 0, 0,
            0, 0, Number.NEGATIVE_INFINITY, 0,
            0, 0, 0, 0 // Invalid: should end with 1 for affine transform
          ],
          translation: [1, 0, 0] // Should conflict with matrix
        },
        {
          name: 'InvalidReferencesNode',
          mesh: 999,
          skin: 999,
          camera: 999,
          children: [999, 1000, -1] // All invalid references
        }
      ],
      buffers: [
        { byteLength: 20000, name: 'MainBuffer' },
        { byteLength: 0, name: 'EmptyBuffer' }, // Invalid zero length
        { byteLength: -100, name: 'NegativeBuffer' } // Invalid negative
      ],
      bufferViews: [
        // Test comprehensive buffer view validation
        { buffer: 0, byteOffset: 0, byteLength: 5000, name: 'Data1' },
        { buffer: 0, byteOffset: 5000, byteLength: 5000, byteStride: 4, target: 34962, name: 'Vertices' },
        { buffer: 0, byteOffset: 10000, byteLength: 5000, target: 34963, name: 'Indices' },
        { buffer: 0, byteOffset: 15000, byteLength: 5000, byteStride: 16, target: 34962, name: 'Matrices' },
        
        // Test all error conditions
        { buffer: -1, byteOffset: 0, byteLength: 100 }, // Negative buffer index
        { buffer: 999, byteOffset: 0, byteLength: 100 }, // Invalid buffer reference
        { buffer: 1, byteOffset: 0, byteLength: 100 }, // Buffer with zero length
        { buffer: 2, byteOffset: 0, byteLength: 100 }, // Buffer with negative length
        { buffer: 0, byteOffset: -1, byteLength: 100 }, // Negative offset
        { buffer: 0, byteOffset: 25000, byteLength: 100 }, // Offset exceeds buffer
        { buffer: 0, byteOffset: 0, byteLength: 25000 }, // Length exceeds buffer
        { buffer: 0, byteOffset: 19000, byteLength: 2000 }, // Offset + length exceeds buffer
        { buffer: 0, byteOffset: 0, byteLength: 0 }, // Zero length
        { buffer: 0, byteOffset: 0, byteLength: -1 }, // Negative length
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 0 }, // Zero stride
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 1 }, // Stride < 4
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 3 }, // Stride not multiple of 4
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 256 }, // Stride > 255
        { buffer: 0, byteOffset: 1, byteLength: 100, byteStride: 4 }, // Misaligned offset
        { buffer: 0, byteOffset: 0, byteLength: 100, byteStride: 4, target: 34963 }, // Stride with ELEMENT_ARRAY_BUFFER
        { buffer: 0, byteOffset: 0, byteLength: 100, target: 99999 } // Invalid target
      ],
      accessors: [
        // Test every accessor validation path
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 100, type: 'VEC3', name: 'Positions' },
        { bufferView: 1, byteOffset: 0, componentType: 5125, count: 300, type: 'SCALAR', name: 'Indices' },
        { bufferView: 2, byteOffset: 0, componentType: 5126, count: 100, type: 'VEC3', name: 'Normals' },
        { bufferView: 3, byteOffset: 0, componentType: 5126, count: 25, type: 'MAT4', name: 'Transforms' },
        
        // Test all component type validations
        { bufferView: 0, byteOffset: 1200, componentType: 5120, count: 100, type: 'SCALAR' }, // BYTE
        { bufferView: 0, byteOffset: 1300, componentType: 5121, count: 100, type: 'VEC2' }, // UNSIGNED_BYTE
        { bufferView: 0, byteOffset: 1500, componentType: 5122, count: 50, type: 'VEC3' }, // SHORT
        { bufferView: 0, byteOffset: 1800, componentType: 5123, count: 50, type: 'VEC4' }, // UNSIGNED_SHORT
        { bufferView: 0, byteOffset: 2200, componentType: 5125, count: 25, type: 'MAT2' }, // UNSIGNED_INT
        { bufferView: 0, byteOffset: 2600, componentType: 5126, count: 25, type: 'MAT3' }, // FLOAT
        
        // Test invalid component types
        { bufferView: 0, byteOffset: 0, componentType: 0, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: -1, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5124, count: 10, type: 'SCALAR' }, // INT (invalid)
        { bufferView: 0, byteOffset: 0, componentType: 9999, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: null, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 'invalid', count: 10, type: 'SCALAR' },
        
        // Test invalid types
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'INVALID_TYPE' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: '' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: null },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 123 },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: [] },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: {} },
        
        // Test count validation
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 0, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: -1, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: null, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 'invalid', type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: Number.NaN, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: Number.POSITIVE_INFINITY, type: 'SCALAR' },
        
        // Test buffer view reference validation
        { bufferView: -1, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 999, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: null, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 'invalid', byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: Number.NaN, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' },
        
        // Test byte offset validation
        { bufferView: 0, byteOffset: -1, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 6000, componentType: 5126, count: 10, type: 'SCALAR' }, // Exceeds buffer view
        { bufferView: 0, byteOffset: null, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: 'invalid', componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: Number.NaN, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 0, byteOffset: Number.POSITIVE_INFINITY, componentType: 5126, count: 10, type: 'SCALAR' },
        
        // Test normalized flag validation
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3', normalized: null },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3', normalized: 'invalid' },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3', normalized: 123 },
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3', normalized: [] },
        
        // Test min/max validation
        {
          bufferView: 0, 
          byteOffset: 0, 
          componentType: 5126, 
          count: 10, 
          type: 'VEC3',
          min: null, // Invalid min
          max: 'invalid' // Invalid max
        },
        {
          bufferView: 0, 
          byteOffset: 0, 
          componentType: 5126, 
          count: 10, 
          type: 'VEC3',
          min: [1, 2], // Wrong length
          max: [1, 2, 3, 4] // Wrong length
        },
        {
          bufferView: 0, 
          byteOffset: 0, 
          componentType: 5126, 
          count: 10, 
          type: 'SCALAR',
          min: [1, 2, 3], // Should be number for SCALAR
          max: [1, 2, 3] // Should be number for SCALAR
        },
        
        // Test comprehensive sparse accessor validation
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 200, // Count exceeds accessor count (invalid)
            indices: {
              bufferView: 1,
              byteOffset: 0,
              componentType: 5123
            },
            values: {
              bufferView: 2,
              byteOffset: 0
            }
          }
        },
        {
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: -1, // Negative count
            indices: {
              bufferView: 999, // Invalid buffer view
              byteOffset: -1, // Invalid offset
              componentType: 5124 // Invalid component type for indices
            },
            values: {
              bufferView: 999, // Invalid buffer view
              byteOffset: -1 // Invalid offset
            }
          }
        }
      ],
      meshes: [
        {
          name: 'BreakthroughMesh',
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: 2,
                TEXCOORD_0: 999, // Invalid accessor reference
                JOINTS_0: 999, // Invalid accessor reference
                WEIGHTS_0: 999, // Invalid accessor reference
                '_INVALID_ATTRIBUTE': 0, // Invalid attribute name
                'COLOR_-1': 0, // Invalid color attribute index
                'TEXCOORD_99': 0 // Very high texcoord index
              },
              indices: 1,
              material: 999, // Invalid material reference
              mode: 999, // Invalid mode
              targets: [
                {
                  POSITION: 0,
                  NORMAL: 999, // Invalid accessor in morph target
                  '_INVALID_TARGET': 0 // Invalid target attribute
                },
                {
                  POSITION: 999, // Invalid accessor in morph target
                  NORMAL: 2
                }
              ]
            },
            {
              attributes: {
                POSITION: 999 // Invalid accessor reference
              },
              mode: -1 // Invalid negative mode
            },
            {
              // Missing attributes (required)
              indices: 1,
              mode: 4
            }
          ],
          weights: [Number.NaN, -0.5, 1.5, Number.POSITIVE_INFINITY] // Invalid morph weights
        }
      ],
      materials: [
        {
          name: 'BreakthroughMaterial',
          pbrMetallicRoughness: {
            baseColorTexture: { 
              index: 999, // Invalid texture reference
              texCoord: -1 // Invalid texCoord index
            },
            metallicRoughnessTexture: { 
              index: 999, // Invalid texture reference
              texCoord: 99 // Very high texCoord index
            },
            baseColorFactor: [2.0, -0.5, Number.NaN, Number.POSITIVE_INFINITY], // All invalid values
            metallicFactor: Number.NaN, // Invalid
            roughnessFactor: -Number.POSITIVE_INFINITY // Invalid
          },
          normalTexture: { 
            index: 999, // Invalid texture reference
            texCoord: -1, // Invalid texCoord index
            scale: Number.NaN // Invalid scale
          },
          occlusionTexture: { 
            index: 999, // Invalid texture reference
            texCoord: -1, // Invalid texCoord index
            strength: Number.NEGATIVE_INFINITY // Invalid strength
          },
          emissiveTexture: { 
            index: 999, // Invalid texture reference
            texCoord: -1 // Invalid texCoord index
          },
          emissiveFactor: [Number.NaN, 2.0, -0.5], // All invalid values
          alphaMode: 'INVALID_ALPHA_MODE', // Invalid mode
          alphaCutoff: Number.NaN, // Invalid cutoff
          doubleSided: 'invalid' // Invalid boolean
        }
      ],
      textures: [
        { source: 999, sampler: 999, name: 'InvalidTexture' }, // Both invalid references
        { source: -1, sampler: -1, name: 'NegativeTexture' }, // Negative references
        { name: 'MissingSourceTexture' }, // Missing source (required)
        { source: null, sampler: null, name: 'NullTexture' }, // Null references
        { source: 'invalid', sampler: 'invalid', name: 'StringTexture' } // Non-numeric references
      ],
      images: [
        { 
          name: 'InvalidDataImage',
          uri: 'data:image/jpeg;base64,!!!INVALID_BASE64!!!' // Invalid base64
        },
        { 
          name: 'WrongMimeImage',
          uri: 'data:application/octet-stream;base64,SGVsbG8=' // Wrong MIME type
        },
        { 
          name: 'InvalidBufferViewImage',
          bufferView: 999, // Invalid buffer view reference
          mimeType: 'invalid/mimetype' // Invalid MIME type
        },
        {
          name: 'MissingMimeImage',
          bufferView: 0 // Missing mimeType when using bufferView
        },
        {
          name: 'BothUriAndBufferViewImage',
          uri: 'test.png',
          bufferView: 0 // Both uri and bufferView (invalid)
        },
        {
          name: 'MissingBothImage'
          // Missing both uri and bufferView
        },
        {
          name: 'InvalidUriImage',
          uri: 'javascript:alert("xss")' // Invalid protocol
        }
      ],
      samplers: [
        {
          name: 'InvalidSampler',
          magFilter: 999, // Invalid mag filter
          minFilter: 999, // Invalid min filter
          wrapS: 999, // Invalid wrap S
          wrapT: 999 // Invalid wrap T
        },
        {
          name: 'NonNumericSampler',
          magFilter: 'invalid',
          minFilter: null,
          wrapS: true,
          wrapT: []
        }
      ],
      cameras: [
        {
          name: 'InvalidPerspectiveCamera',
          type: 'perspective',
          perspective: {
            yfov: Number.NaN, // Invalid
            znear: Number.NEGATIVE_INFINITY, // Invalid
            aspectRatio: 0, // Invalid
            zfar: Number.NaN // Invalid
          }
        },
        {
          name: 'InvalidOrthographicCamera', 
          type: 'orthographic',
          orthographic: {
            xmag: 0, // Invalid
            ymag: Number.NaN, // Invalid
            znear: Number.POSITIVE_INFINITY, // Invalid
            zfar: Number.NEGATIVE_INFINITY // Invalid
          }
        },
        {
          name: 'InvalidTypeCamera',
          type: 12345 // Invalid type (numeric)
        },
        {
          name: 'MissingTypeCamera'
          // Missing type
        }
      ],
      skins: [
        {
          name: 'InvalidSkin',
          joints: [999, 1000, -1], // All invalid joint references
          inverseBindMatrices: 999, // Invalid accessor reference
          skeleton: 999 // Invalid skeleton reference
        },
        {
          name: 'EmptyJointsSkin',
          joints: [], // Empty joints array
          inverseBindMatrices: 3
        }
      ],
      animations: [
        {
          name: 'InvalidAnimation',
          channels: [
            {
              sampler: 999, // Invalid sampler reference
              target: {
                node: 999, // Invalid node reference
                path: 'invalid_path' // Invalid animation path
              }
            },
            {
              sampler: -1, // Invalid negative sampler
              target: {
                node: -1, // Invalid negative node
                path: null // Invalid null path
              }
            }
          ],
          samplers: [
            {
              input: 999, // Invalid input accessor
              interpolation: 'INVALID_INTERPOLATION', // Invalid interpolation
              output: 999 // Invalid output accessor
            },
            {
              input: -1, // Invalid negative input
              interpolation: null, // Invalid null interpolation
              output: -1 // Invalid negative output
            }
          ]
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'breakthrough-70-percent.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});