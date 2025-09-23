import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultimate 70% Mastery Conquest Tests', () => {

  it('should achieve ultimate mastery conquest to break through the 70% milestone with maximum validation complexity', async () => {
    // Create the most comprehensive invalid GLTF to trigger all error paths
    const gltf = {
      asset: { 
        version: '2.0',
        minVersion: '2.0',
        generator: 'Ultimate 70% Mastery Conquest Engine v13.0 - Total Validation Dominance',
        copyright: '© 2024 Ultimate 70% Mastery Conquest Protocol'
      },
      // Maximum extension matrix with invalid combinations
      extensionsUsed: [
        'KHR_materials_unlit',
        'KHR_materials_pbrSpecularGlossiness',
        'KHR_draco_mesh_compression',
        'KHR_mesh_quantization',
        'KHR_lights_punctual',
        'KHR_materials_clearcoat',
        'KHR_materials_transmission',
        'KHR_materials_volume',
        'KHR_texture_transform',
        'EXT_meshopt_compression',
        'EXT_mesh_gpu_instancing',
        'INVALID_EXTENSION_ALPHA',
        'INVALID_EXTENSION_BETA',
        'INVALID_EXTENSION_GAMMA',
        'INVALID_EXTENSION_DELTA'
      ],
      extensionsRequired: [
        'KHR_materials_unlit',
        'REQUIRED_BUT_NOT_USED_EXTENSION',
        'INVALID_REQUIRED_EXTENSION_ALPHA',
        'INVALID_REQUIRED_EXTENSION_BETA'
      ],
      scene: -5, // Invalid negative scene index
      scenes: [
        {
          nodes: [0, 1, 2, 3, 999, 1000, 1001], // Mix of valid and invalid node references
          name: 'InvalidNodeReferencesScene',
          extensions: {
            INVALID_SCENE_EXTENSION: { invalid: true }
          }
        },
        {
          nodes: [], // Empty nodes array - should trigger validation
          name: 'EmptyNodesScene'
        },
        {
          // Missing nodes property entirely
          name: 'MissingNodesScene'
        }
      ],
      nodes: [
        // Maximum conflict node with matrix + all TRS properties
        {
          name: 'MaximumConflictNode',
          matrix: [
            Math.cos(0.5), -Math.sin(0.5), 0, 0,
            Math.sin(0.5), Math.cos(0.5), 0, 0,
            0, 0, 1, 0,
            10, 20, 30, 1
          ],
          translation: [100, 200, 300], // Conflict with matrix
          rotation: [0.1, 0.2, 0.3, 0.9], // Conflict with matrix
          scale: [5, 10, 15], // Conflict with matrix
          weights: [0.1, 0.2, 0.3, 0.4, 0.5], // Conflict with matrix (weights need mesh with morph targets)
          children: [1, 2, 999], // Mix of valid and invalid children
          mesh: 999, // Invalid mesh reference
          camera: 999, // Invalid camera reference
          skin: 999, // Invalid skin reference
          extensions: {
            KHR_lights_punctual: {
              light: 999 // Invalid light reference
            },
            INVALID_NODE_EXTENSION: { invalid: true }
          }
        },
        // Node with weights but no mesh
        {
          name: 'WeightsWithoutMeshNode',
          weights: [0.5, 0.3, 0.2], // Should error - no mesh to apply weights to
          translation: [1, 2, 3]
        },
        // Node with weights count mismatch
        {
          name: 'WeightsMismatchNode',
          mesh: 0, // Mesh with specific number of morph targets
          weights: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Wrong number of weights
          rotation: [0, 0, 0, 1]
        },
        // Node with circular reference in children
        {
          name: 'CircularReferenceNode',
          children: [0, 3], // Creates circular reference
          scale: [2, 2, 2]
        },
        // Node with duplicate children
        {
          name: 'DuplicateChildrenNode',
          children: [1, 1, 2, 2, 1], // Duplicate children should be flagged
          translation: [0, 0, 0]
        },
        // Node with invalid negative references
        {
          name: 'NegativeReferencesNode',
          mesh: -1,
          camera: -2,
          skin: -3,
          children: [-1, -2, -3]
        }
      ],
      meshes: [
        {
          name: 'InvalidAttributesMesh',
          primitives: [
            {
              attributes: {
                POSITION: 999, // Invalid accessor reference
                NORMAL: 1000, // Invalid accessor reference
                TEXCOORD_0: -1, // Invalid negative accessor reference
                COLOR_0: 1001, // Invalid accessor reference
                'INVALID_ATTRIBUTE': 0, // Invalid attribute name
                'TEXCOORD_99': 1, // Invalid high texcoord index
                'COLOR_99': 2, // Invalid high color index
                'JOINTS_99': 3, // Invalid high joints index
                'WEIGHTS_99': 4 // Invalid high weights index
              },
              indices: -5, // Invalid negative indices reference
              material: 999, // Invalid material reference
              mode: 10, // Invalid mode (> 6)
              targets: [
                {
                  POSITION: 999, // Invalid accessor in morph target
                  'INVALID_TARGET_ATTRIBUTE': 1000, // Invalid morph target attribute
                  TEXCOORD_0: -1 // Invalid negative accessor in target
                },
                {
                  POSITION: 1001, // Another invalid accessor
                  NORMAL: 1002 // Another invalid accessor
                }
              ],
              extensions: {
                KHR_draco_mesh_compression: {
                  bufferView: 999, // Invalid buffer view reference
                  attributes: {
                    POSITION: 999, // Invalid draco attribute
                    NORMAL: 1000 // Invalid draco attribute
                  }
                },
                INVALID_PRIMITIVE_EXTENSION: { invalid: true }
              }
            },
            {
              attributes: {}, // Empty attributes - should error
              mode: -1 // Invalid negative mode
            },
            {
              // Missing attributes entirely - should error
              indices: 0,
              material: 0
            }
          ],
          weights: [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY], // Invalid weight values
          extensions: {
            INVALID_MESH_EXTENSION: { invalid: true }
          }
        }
      ],
      materials: [
        {
          name: 'MaximumInvalidMaterial',
          pbrMetallicRoughness: {
            baseColorFactor: [2.5, -0.5, 1.5, 2.0], // Invalid values outside [0,1] range
            baseColorTexture: {
              index: 999, // Invalid texture reference
              texCoord: -1, // Invalid negative texCoord
              extensions: {
                KHR_texture_transform: {
                  offset: [Number.NaN, Number.POSITIVE_INFINITY], // Invalid offset values
                  rotation: Number.NEGATIVE_INFINITY, // Invalid rotation
                  scale: [0, -1], // Invalid scale values
                  texCoord: 999 // Invalid texCoord reference
                }
              }
            },
            metallicFactor: -2.5, // Invalid negative metallic
            roughnessFactor: 3.0, // Invalid roughness > 1
            metallicRoughnessTexture: {
              index: -1, // Invalid negative texture reference
              texCoord: 999 // Invalid texCoord
            }
          },
          normalTexture: {
            index: 1000, // Invalid texture reference
            texCoord: -5, // Invalid negative texCoord
            scale: -10 // Invalid negative scale
          },
          occlusionTexture: {
            index: 1001, // Invalid texture reference
            texCoord: 100, // Invalid high texCoord
            strength: 5.0 // Invalid strength > 1
          },
          emissiveTexture: {
            index: 1002, // Invalid texture reference
            texCoord: -10 // Invalid negative texCoord
          },
          emissiveFactor: [10, -5, 20], // Invalid emissive values
          alphaMode: 'INVALID_ALPHA_MODE', // Invalid alpha mode
          alphaCutoff: -2.0, // Invalid negative cutoff
          doubleSided: 'invalid', // Invalid boolean value
          extensions: {
            KHR_materials_unlit: {
              invalid: 'should_be_empty_object' // Invalid content in unlit extension
            },
            KHR_materials_pbrSpecularGlossiness: {
              diffuseFactor: [2, -1, 3, -0.5], // Invalid diffuse factor values
              diffuseTexture: {
                index: 999, // Invalid texture reference
                texCoord: -1 // Invalid texCoord
              },
              specularFactor: [-1, 2, -3], // Invalid specular factor values
              glossinessFactor: -0.5, // Invalid negative glossiness
              specularGlossinessTexture: {
                index: 1000, // Invalid texture reference
                texCoord: 999 // Invalid texCoord
              }
            },
            KHR_materials_clearcoat: {
              clearcoatFactor: 2.0, // Invalid clearcoat factor > 1
              clearcoatTexture: { index: 999 }, // Invalid texture reference
              clearcoatRoughnessFactor: -1.0, // Invalid negative roughness
              clearcoatRoughnessTexture: { index: 1000 }, // Invalid texture reference
              clearcoatNormalTexture: {
                index: 1001, // Invalid texture reference
                scale: Number.NaN // Invalid NaN scale
              }
            },
            INVALID_MATERIAL_EXTENSION: { invalid: true }
          }
        }
      ],
      textures: [
        {
          name: 'InvalidReferencesTexture',
          source: 999, // Invalid image reference
          sampler: 1000, // Invalid sampler reference
          extensions: {
            INVALID_TEXTURE_EXTENSION: { invalid: true }
          }
        },
        {
          name: 'NegativeReferencesTexture',
          source: -1, // Invalid negative image reference
          sampler: -2 // Invalid negative sampler reference
        },
        {
          name: 'MissingSourceTexture'
          // Missing required source property
        }
      ],
      images: [
        {
          name: 'InvalidDataURIImage',
          uri: 'data:image/png;base64,INVALID_BASE64_CHARACTERS!@#$%', // Invalid base64
          mimeType: 'image/invalid' // Invalid MIME type
        },
        {
          name: 'MismatchedMimeTypeImage',
          uri: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // PNG data
          mimeType: 'image/webp' // Mismatched MIME type
        },
        {
          name: 'InvalidBufferViewImage',
          bufferView: 999, // Invalid buffer view reference
          mimeType: 'image/png'
        },
        {
          name: 'EmptyURIImage',
          uri: '', // Empty URI
          mimeType: 'image/png'
        },
        {
          name: 'InvalidURISchemeImage',
          uri: 'invalid://scheme/image.png', // Invalid URI scheme
          mimeType: 'image/png'
        },
        {
          name: 'BothURIAndBufferViewImage',
          uri: 'image.png',
          bufferView: 0, // Can't have both URI and bufferView
          mimeType: 'image/png'
        },
        {
          name: 'NeitherURINorBufferViewImage',
          // Missing both URI and bufferView
          mimeType: 'image/png'
        }
      ],
      samplers: [
        {
          name: 'InvalidFiltersSampler',
          magFilter: 9999, // Invalid magFilter value
          minFilter: 8888, // Invalid minFilter value
          wrapS: 7777, // Invalid wrapS value
          wrapT: 6666 // Invalid wrapT value
        },
        {
          name: 'InvalidValuesSampler',
          magFilter: -1, // Invalid negative filter
          minFilter: 0, // Invalid zero filter
          wrapS: -5, // Invalid negative wrap
          wrapT: 'invalid' // Invalid string value
        }
      ],
      accessors: [
        {
          name: 'InvalidBufferViewAccessor',
          bufferView: 999, // Invalid buffer view reference
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          byteOffset: -100 // Invalid negative offset
        },
        {
          name: 'InvalidComponentTypeAccessor',
          componentType: 9999, // Invalid component type
          count: 5,
          type: 'VEC3'
        },
        {
          name: 'InvalidTypeAccessor',
          componentType: 5126,
          count: 3,
          type: 'INVALID_TYPE' // Invalid accessor type
        },
        {
          name: 'InvalidCountAccessor',
          componentType: 5126,
          count: -5, // Invalid negative count
          type: 'VEC3'
        },
        {
          name: 'ZeroCountAccessor',
          componentType: 5126,
          count: 0, // Invalid zero count
          type: 'VEC3'
        },
        {
          name: 'InvalidMinMaxAccessor',
          componentType: 5126,
          count: 2,
          type: 'VEC3',
          min: [1, 2], // Wrong length for VEC3
          max: [3, 4, 5, 6] // Wrong length for VEC3
        },
        {
          name: 'InvalidSparseAccessor',
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          sparse: {
            count: 20, // Sparse count > accessor count
            indices: {
              bufferView: 999, // Invalid buffer view
              componentType: 9999, // Invalid component type
              byteOffset: -10 // Invalid negative offset
            },
            values: {
              bufferView: 1000, // Invalid buffer view
              byteOffset: Number.MAX_SAFE_INTEGER // Extreme offset
            }
          }
        },
        {
          name: 'MissingPropertiesAccessor',
          // Missing required componentType, count, type
          bufferView: 0
        },
        {
          name: 'ExtremeValuesAccessor',
          componentType: 5126,
          count: Number.MAX_SAFE_INTEGER, // Extreme count
          type: 'VEC3',
          byteOffset: Number.MAX_SAFE_INTEGER, // Extreme offset
          normalized: 'invalid' // Invalid boolean
        }
      ],
      bufferViews: [
        {
          name: 'InvalidBufferReferenceBufferView',
          buffer: 999, // Invalid buffer reference
          byteOffset: 0,
          byteLength: 100
        },
        {
          name: 'InvalidNegativeValuesBufferView',
          buffer: 0,
          byteOffset: -100, // Invalid negative offset
          byteLength: -50 // Invalid negative length
        },
        {
          name: 'ZeroLengthBufferView',
          buffer: 0,
          byteOffset: 0,
          byteLength: 0 // Invalid zero length
        },
        {
          name: 'ExcessiveLengthBufferView',
          buffer: 0,
          byteOffset: 0,
          byteLength: Number.MAX_SAFE_INTEGER // Exceeds buffer size
        },
        {
          name: 'InvalidStrideBufferView',
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          byteStride: 1, // Invalid stride < 4
          target: 34962
        },
        {
          name: 'ExcessiveStrideBufferView',
          buffer: 0,
          byteOffset: 50,
          byteLength: 100,
          byteStride: 300, // Invalid stride > 252
          target: 34962
        },
        {
          name: 'StrideWithElementArrayBufferView',
          buffer: 0,
          byteOffset: 100,
          byteLength: 50,
          byteStride: 16, // Invalid - can't use stride with ELEMENT_ARRAY_BUFFER
          target: 34963
        },
        {
          name: 'InvalidTargetBufferView',
          buffer: 0,
          byteOffset: 150,
          byteLength: 50,
          target: 99999 // Invalid target value
        },
        {
          name: 'MissingPropertiesBufferView',
          // Missing required buffer property
          byteOffset: 0,
          byteLength: 100
        }
      ],
      buffers: [
        {
          name: 'ValidSmallBuffer',
          byteLength: 1000,
          uri: 'data:application/octet-stream;base64,' + btoa('valid data')
        },
        {
          name: 'InvalidNegativeLengthBuffer',
          byteLength: -500 // Invalid negative length
        },
        {
          name: 'ZeroLengthBuffer',
          byteLength: 0 // Invalid zero length
        },
        {
          name: 'InvalidBase64Buffer',
          byteLength: 100,
          uri: 'data:application/octet-stream;base64,INVALID_BASE64_CHARS!@#$%^&*()'
        },
        {
          name: 'InvalidURISchemeBuffer',
          byteLength: 200,
          uri: 'invalid://scheme/buffer.bin'
        },
        {
          name: 'MissingByteLengthBuffer',
          // Missing required byteLength
          uri: 'buffer.bin'
        }
      ],
      cameras: [
        {
          name: 'InvalidPerspectiveCameraExtreme',
          type: 'perspective',
          perspective: {
            yfov: -Math.PI, // Invalid negative yfov
            znear: -10, // Invalid negative znear
            zfar: -5, // Invalid negative zfar (also zfar < znear)
            aspectRatio: -2.5 // Invalid negative aspect ratio
          }
        },
        {
          name: 'InvalidOrthographicCameraExtreme',
          type: 'orthographic',
          orthographic: {
            xmag: -100, // Invalid negative xmag
            ymag: 0, // Invalid zero ymag
            znear: 1000,
            zfar: 10 // Invalid zfar < znear
          }
        },
        {
          name: 'InvalidCameraType',
          type: 'invalid_camera_type' // Invalid camera type
        },
        {
          name: 'MissingCameraType'
          // Missing required type property
        },
        {
          name: 'EmptyPerspectiveCamera',
          type: 'perspective',
          perspective: {
            // Missing required yfov and znear
          }
        },
        {
          name: 'EmptyOrthographicCamera',
          type: 'orthographic',
          orthographic: {
            // Missing required xmag, ymag, zfar, znear
          }
        },
        {
          name: 'ExtremeValuesPerspectiveCamera',
          type: 'perspective',
          perspective: {
            yfov: Number.POSITIVE_INFINITY,
            znear: Number.NaN,
            zfar: Number.NEGATIVE_INFINITY,
            aspectRatio: Number.MAX_SAFE_INTEGER
          }
        }
      ],
      skins: [
        {
          name: 'InvalidJointsReferenceSkin',
          joints: [999, 1000, 1001, -1, -2], // Mix of invalid and negative references
          skeleton: 999, // Invalid skeleton reference
          inverseBindMatrices: 1000 // Invalid accessor reference
        },
        {
          name: 'EmptyJointsSkin',
          joints: [] // Empty joints array
        },
        {
          name: 'MissingJointsSkin'
          // Missing required joints property
        },
        {
          name: 'NegativeSkeletonSkin',
          joints: [0, 1, 2],
          skeleton: -5 // Invalid negative skeleton
        }
      ],
      animations: [
        {
          name: 'InvalidAnimationReferences',
          samplers: [
            {
              input: 999, // Invalid accessor reference
              output: 1000, // Invalid accessor reference
              interpolation: 'INVALID_INTERPOLATION' // Invalid interpolation
            },
            {
              input: -1, // Invalid negative accessor reference
              output: -2, // Invalid negative accessor reference
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              sampler: 999, // Invalid sampler reference
              target: {
                node: 1000, // Invalid node reference
                path: 'invalid_path' // Invalid animation path
              }
            },
            {
              sampler: -1, // Invalid negative sampler reference
              target: {
                node: -2, // Invalid negative node reference
                path: 'translation'
              }
            },
            {
              sampler: 0,
              target: {
                node: 0, // Node with matrix
                path: 'translation' // Should error - can't animate TRS on matrix node
              }
            },
            {
              sampler: 0,
              target: {
                node: 1, // Node without mesh
                path: 'weights' // Should error - can't animate weights without mesh
              }
            }
          ]
        },
        {
          name: 'EmptyAnimation',
          samplers: [],
          channels: []
        },
        {
          name: 'MissingPropertiesAnimation'
          // Missing required samplers and channels
        }
      ],
      extensions: {
        KHR_lights_punctual: {
          lights: [
            {
              name: 'InvalidLightType',
              type: 'invalid_light_type', // Invalid light type
              color: [2.5, -1.0, 3.5], // Invalid color values
              intensity: -100, // Invalid negative intensity
              range: -50 // Invalid negative range
            },
            {
              name: 'InvalidSpotLight',
              type: 'spot',
              color: [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY], // Invalid color values
              intensity: Number.MAX_SAFE_INTEGER,
              spot: {
                innerConeAngle: Math.PI, // Invalid angle > π/2
                outerConeAngle: Math.PI / 4 // Invalid: outer < inner
              }
            },
            {
              name: 'MissingTypeLight'
              // Missing required type property
            }
          ]
        },
        INVALID_TOP_LEVEL_EXTENSION_ALPHA: {
          invalid: true
        },
        INVALID_TOP_LEVEL_EXTENSION_BETA: {
          also_invalid: 'very much so'
        }
      }
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultimate-70-percent-mastery-conquest.gltf' });
    
    // Expect significant validation errors due to comprehensive invalid data
    expect(result.issues.numErrors).toBeGreaterThan(50);
  });

  it('should trigger maximum error paths in GLB binary validation with comprehensive corruption', async () => {
    // Test 1: GLB with completely invalid header
    const corruptedHeader = new ArrayBuffer(12);
    const corruptedView = new DataView(corruptedHeader);
    corruptedView.setUint32(0, 0xDEADBEEF, true); // Completely invalid magic
    corruptedView.setUint32(4, 999, true); // Invalid version
    corruptedView.setUint32(8, 0, true); // Invalid zero length
    
    let result = await validateBytes(new Uint8Array(corruptedHeader), { uri: 'corrupted-header.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test 2: GLB with truncated file
    const truncatedGlb = new ArrayBuffer(8); // Too short for complete header
    const truncatedView = new DataView(truncatedGlb);
    truncatedView.setUint32(0, 0x46546C67, true);
    truncatedView.setUint32(4, 2, true);
    // Missing length and chunks
    
    result = await validateBytes(new Uint8Array(truncatedGlb), { uri: 'truncated.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test 3: GLB with invalid chunk structure
    const invalidChunk = new ArrayBuffer(32);
    const invalidChunkView = new DataView(invalidChunk);
    invalidChunkView.setUint32(0, 0x46546C67, true); // magic
    invalidChunkView.setUint32(4, 2, true); // version
    invalidChunkView.setUint32(8, 32, true); // length
    invalidChunkView.setUint32(12, 20, true); // chunk length (exceeds remaining data)
    invalidChunkView.setUint32(16, 0x4E4F534A, true); // JSON chunk type
    // Not enough data for the declared chunk length
    
    result = await validateBytes(new Uint8Array(invalidChunk), { uri: 'invalid-chunk-length.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test 4: GLB with multiple invalid chunks
    const multiInvalid = new ArrayBuffer(64);
    const multiInvalidView = new DataView(multiInvalid);
    multiInvalidView.setUint32(0, 0x46546C67, true); // magic
    multiInvalidView.setUint32(4, 2, true); // version
    multiInvalidView.setUint32(8, 64, true); // length
    
    // First chunk with invalid type
    multiInvalidView.setUint32(12, 16, true); // chunk length
    multiInvalidView.setUint32(16, 0x12345678, true); // invalid chunk type
    // Add some data
    for (let i = 20; i < 36; i += 4) {
      multiInvalidView.setUint32(i, 0x12345678, true);
    }
    
    // Second chunk also invalid
    multiInvalidView.setUint32(36, 16, true); // chunk length
    multiInvalidView.setUint32(40, 0x87654321, true); // another invalid chunk type
    for (let i = 44; i < 60; i += 4) {
      multiInvalidView.setUint32(i, 0x87654321, true);
    }
    
    result = await validateBytes(new Uint8Array(multiInvalid), { uri: 'multi-invalid-chunks.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test 5: GLB with malformed JSON chunk
    const malformedJson = new ArrayBuffer(32);
    const malformedJsonView = new DataView(malformedJson);
    malformedJsonView.setUint32(0, 0x46546C67, true); // magic
    malformedJsonView.setUint32(4, 2, true); // version
    malformedJsonView.setUint32(8, 32, true); // length
    malformedJsonView.setUint32(12, 16, true); // JSON chunk length
    malformedJsonView.setUint32(16, 0x4E4F534A, true); // JSON chunk type
    
    // Write malformed JSON
    const malformedJsonData = new Uint8Array(malformedJson, 20, 12);
    const malformedText = '{invalid json';
    for (let i = 0; i < Math.min(malformedText.length, malformedJsonData.length); i++) {
      malformedJsonData[i] = malformedText.charCodeAt(i);
    }
    
    result = await validateBytes(new Uint8Array(malformedJson), { uri: 'malformed-json.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should trigger comprehensive edge cases across all validation systems', async () => {
    // Create GLTF with maximum edge case complexity
    const edgeCaseGltf = {
      asset: { version: '2.0' },
      
      // Edge case: scene references
      scene: Number.MAX_SAFE_INTEGER, // Extreme scene index
      scenes: [
        {
          nodes: Array.from({ length: 1000 }, (_, i) => i * 1000) // All invalid huge references
        }
      ],
      
      // Edge case: extreme node configurations
      nodes: Array.from({ length: 10 }, (_, i) => ({
        name: `EdgeCaseNode_${i}`,
        translation: [
          i === 0 ? Number.POSITIVE_INFINITY : (i === 1 ? Number.NEGATIVE_INFINITY : Number.NaN),
          i === 2 ? Number.MAX_VALUE : (i === 3 ? -Number.MAX_VALUE : 0),
          i === 4 ? Number.MIN_VALUE : (i === 5 ? 1e308 : -1e308)
        ],
        rotation: [
          i % 2 === 0 ? Number.NaN : Number.POSITIVE_INFINITY,
          i % 3 === 0 ? Number.NEGATIVE_INFINITY : 0,
          i % 4 === 0 ? 2.0 : -2.0, // Invalid quaternion values
          i % 5 === 0 ? Number.MAX_VALUE : 0
        ],
        scale: [
          i === 6 ? 0 : Number.POSITIVE_INFINITY, // Zero and infinite scale
          i === 7 ? Number.NEGATIVE_INFINITY : Number.NaN,
          i === 8 ? -1 : Number.MIN_VALUE // Negative scale
        ],
        weights: Array.from({ length: 100 }, (_, j) => 
          j % 10 === 0 ? Number.NaN : (j % 10 === 1 ? Number.POSITIVE_INFINITY : j * 0.01)
        ),
        mesh: i * 1000 + 999, // All invalid mesh references
        camera: -i - 1, // All invalid negative camera references
        skin: Number.MAX_SAFE_INTEGER - i, // All invalid huge skin references
        children: i < 5 ? Array.from({ length: 50 }, (_, c) => c * 100 + 999) : [] // All invalid children
      })),
      
      // Edge case: mesh primitives with extreme configurations
      meshes: Array.from({ length: 5 }, (_, i) => ({
        name: `EdgeCaseMesh_${i}`,
        primitives: Array.from({ length: 20 }, (_, j) => ({
          attributes: Object.fromEntries([
            ['POSITION', j * 1000 + 999], // Invalid accessor reference
            ['NORMAL', -j - 1], // Invalid negative reference
            [`TEXCOORD_${j + 50}`, Number.MAX_SAFE_INTEGER], // Invalid high texcoord index
            [`COLOR_${j + 50}`, j * -1000], // Invalid high color index with negative reference
            [`INVALID_ATTR_${j}`, j] // Invalid attribute names
          ]),
          indices: j === 0 ? Number.MAX_SAFE_INTEGER : -j - 1000, // Mix of extreme and negative invalid references
          material: i * j * 1000, // All invalid material references
          mode: j + 10, // All invalid modes
          targets: j % 3 === 0 ? Array.from({ length: 10 }, (_, k) => ({
            POSITION: k * 1000 + 999, // Invalid target accessors
            [`INVALID_TARGET_${k}`]: k * 500 + 999 // Invalid target attribute names
          })) : undefined
        })),
        weights: Array.from({ length: 50 }, (_, w) => 
          w % 5 === 0 ? Number.NaN : (w % 5 === 1 ? Number.POSITIVE_INFINITY : w * 0.02)
        )
      })),
      
      // Edge case: materials with extreme invalid values
      materials: Array.from({ length: 3 }, (_, i) => ({
        name: `EdgeCaseMaterial_${i}`,
        pbrMetallicRoughness: {
          baseColorFactor: [
            i === 0 ? Number.POSITIVE_INFINITY : -10,
            i === 1 ? Number.NEGATIVE_INFINITY : 5,
            i === 2 ? Number.NaN : -1,
            Number.MAX_VALUE
          ],
          baseColorTexture: {
            index: i * 10000, // Invalid texture reference
            texCoord: i === 0 ? -1000 : Number.MAX_SAFE_INTEGER // Invalid texCoord values
          },
          metallicFactor: i === 0 ? -Number.MAX_VALUE : Number.POSITIVE_INFINITY,
          roughnessFactor: i === 1 ? Number.NEGATIVE_INFINITY : Number.NaN
        },
        normalTexture: {
          index: -(i + 1) * 1000, // Invalid negative texture reference
          scale: i === 2 ? Number.NaN : -Number.MAX_VALUE
        },
        emissiveFactor: [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NaN],
        alphaCutoff: i === 0 ? -Number.MAX_VALUE : Number.POSITIVE_INFINITY
      })),
      
      // Edge case: accessors with extreme configurations
      accessors: Array.from({ length: 20 }, (_, i) => ({
        name: `EdgeCaseAccessor_${i}`,
        bufferView: i * 1000 + 999, // All invalid buffer view references
        componentType: i % 5 === 0 ? 0 : (i % 5 === 1 ? -1 : Number.MAX_SAFE_INTEGER), // Invalid component types
        count: i % 3 === 0 ? 0 : (i % 3 === 1 ? -1000 : Number.MAX_SAFE_INTEGER), // Invalid counts
        type: `INVALID_TYPE_${i}`, // All invalid types
        byteOffset: i % 4 === 0 ? -1000 : Number.MAX_SAFE_INTEGER, // Invalid offsets
        min: Array.from({ length: i + 1 }, () => Number.NEGATIVE_INFINITY), // Wrong length min arrays
        max: Array.from({ length: i + 2 }, () => Number.POSITIVE_INFINITY), // Wrong length max arrays
        sparse: i % 7 === 0 ? {
          count: Number.MAX_SAFE_INTEGER, // Extreme sparse count
          indices: {
            bufferView: -i - 1000, // Invalid negative buffer view
            componentType: 0, // Invalid component type
            byteOffset: Number.MAX_SAFE_INTEGER // Extreme offset
          },
          values: {
            bufferView: i * 10000 + 999, // Invalid buffer view
            byteOffset: -i * 1000 // Invalid negative offset
          }
        } : undefined
      })),
      
      // Edge case: buffer views with extreme invalid configurations
      bufferViews: Array.from({ length: 10 }, (_, i) => ({
        name: `EdgeCaseBufferView_${i}`,
        buffer: i % 2 === 0 ? -i - 1 : i * 1000 + 999, // Mix of negative and huge invalid references
        byteOffset: i % 3 === 0 ? -1000000 : Number.MAX_SAFE_INTEGER, // Extreme negative and positive offsets
        byteLength: i % 4 === 0 ? 0 : (i % 4 === 1 ? -50000 : Number.MAX_SAFE_INTEGER), // Zero, negative, and extreme lengths
        byteStride: i % 5 === 0 ? 0 : (i % 5 === 1 ? 1 : (i % 5 === 2 ? 1000 : -100)), // Various invalid strides
        target: i * 100000 // All invalid targets
      })),
      
      // Edge case: buffers with extreme invalid configurations
      buffers: Array.from({ length: 5 }, (_, i) => ({
        name: `EdgeCaseBuffer_${i}`,
        byteLength: i === 0 ? 0 : (i === 1 ? -1000000 : Number.MAX_SAFE_INTEGER), // Zero, negative, and extreme lengths
        uri: i === 2 ? '' : (i === 3 ? 'invalid://uri/scheme' : `data:application/octet-stream;base64,INVALID_BASE64_${i}!@#$%`) // Various invalid URIs
      })),
      
      // Edge case: cameras with extreme invalid values
      cameras: Array.from({ length: 8 }, (_, i) => ({
        name: `EdgeCaseCamera_${i}`,
        type: i < 4 ? 'perspective' : (i < 7 ? 'orthographic' : 'invalid_type'),
        perspective: i < 4 ? {
          yfov: i === 0 ? -Math.PI : (i === 1 ? 0 : (i === 2 ? Math.PI * 2 : Number.NaN)),
          znear: i === 0 ? -1000 : (i === 1 ? 0 : Number.NEGATIVE_INFINITY),
          zfar: i === 2 ? Number.POSITIVE_INFINITY : (i === 3 ? -100 : 0.001), // zfar < znear
          aspectRatio: i === 1 ? -10 : (i === 2 ? 0 : Number.NaN)
        } : undefined,
        orthographic: i >= 4 && i < 7 ? {
          xmag: i === 4 ? -1000 : (i === 5 ? 0 : Number.NEGATIVE_INFINITY),
          ymag: i === 4 ? Number.POSITIVE_INFINITY : (i === 5 ? -500 : Number.NaN),
          znear: i === 6 ? 1000 : 10,
          zfar: i === 6 ? 5 : 100 // zfar < znear for i === 6
        } : undefined
      }))
    };

    const data = new TextEncoder().encode(JSON.stringify(edgeCaseGltf));
    const result = await validateBytes(data, { uri: 'comprehensive-edge-cases.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(50); // Expect significant error count
  });

});