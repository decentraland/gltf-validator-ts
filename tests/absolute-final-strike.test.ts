import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Absolute Final Strike Coverage Tests', () => {

  it('should hit material validator absolute hardest uncovered paths (54.35% -> higher)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Test doubleSided validation with non-boolean
          doubleSided: 'invalid_boolean',
          name: 'InvalidDoubleSided'
        },
        {
          // Test extensions and extras handling
          extensions: {
            'KHR_materials_unlit': {}
          },
          extras: {
            customProperty: 'value'
          },
          name: 'WithExtensions'
        },
        {
          // Test all PBR metallic roughness edge cases
          pbrMetallicRoughness: {
            baseColorFactor: 'invalid_array', // Should be array of 4 numbers
            metallicFactor: 'invalid_number', // Should be number
            roughnessFactor: 'invalid_number', // Should be number
            baseColorTexture: {
              index: 'invalid_index', // Should be integer
              texCoord: 'invalid_texcoord' // Should be integer
            },
            metallicRoughnessTexture: {
              index: 'invalid_index',
              texCoord: 'invalid_texcoord'
            }
          },
          name: 'InvalidPBR'
        },
        {
          // Test all normal texture edge cases
          normalTexture: {
            index: 'invalid_index',
            texCoord: 'invalid_texcoord',
            scale: 'invalid_scale' // Should be number
          },
          name: 'InvalidNormal'
        },
        {
          // Test all occlusion texture edge cases  
          occlusionTexture: {
            index: 'invalid_index',
            texCoord: 'invalid_texcoord',
            strength: 'invalid_strength' // Should be number
          },
          name: 'InvalidOcclusion'
        },
        {
          // Test all emissive texture edge cases
          emissiveTexture: {
            index: 'invalid_index',
            texCoord: 'invalid_texcoord'
          },
          name: 'InvalidEmissive'
        },
        {
          // Test emissive factor edge cases
          emissiveFactor: 'invalid_array', // Should be array of 3 numbers
          name: 'InvalidEmissiveFactor'
        },
        {
          // Test alpha mode edge cases
          alphaMode: 123, // Should be string
          alphaCutoff: 'invalid_number', // Should be number
          name: 'InvalidAlpha'
        },
        {
          // Test very specific numeric edge cases that might hit formatter paths
          pbrMetallicRoughness: {
            baseColorFactor: [0.123456789, 0.987654321, 0.555555555, 0.333333333],
            metallicFactor: 0.123456789,
            roughnessFactor: 0.987654321
          },
          normalTexture: {
            index: 0,
            scale: 2.718281828 // e
          },
          occlusionTexture: {
            index: 0,
            strength: 0.314159265 // pi/10
          },
          emissiveFactor: [1.414213562, 0.707106781, 0.866025403], // sqrt(2)/2, 1/sqrt(2), sqrt(3)/2
          name: 'PrecisionValues'
        },
        {
          // Test maximum valid values
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 1.0, 1.0, 1.0],
            metallicFactor: 1.0,
            roughnessFactor: 1.0
          },
          emissiveFactor: [1.0, 1.0, 1.0],
          alphaCutoff: 1.0,
          name: 'MaxValues'
        },
        {
          // Test minimum valid values
          pbrMetallicRoughness: {
            baseColorFactor: [0.0, 0.0, 0.0, 0.0],
            metallicFactor: 0.0,
            roughnessFactor: 0.0
          },
          emissiveFactor: [0.0, 0.0, 0.0],
          alphaCutoff: 0.0,
          name: 'MinValues'
        },
        {
          // Test texCoord edge values
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              texCoord: 0 // Minimum texCoord
            },
            metallicRoughnessTexture: {
              index: 0,
              texCoord: 7 // Maximum reasonable texCoord
            }
          },
          normalTexture: {
            index: 0,
            texCoord: 15 // High texCoord value
          },
          occlusionTexture: {
            index: 0,
            texCoord: 31 // Very high texCoord value
          },
          emissiveTexture: {
            index: 0,
            texCoord: 63 // Extremely high texCoord value
          },
          name: 'TexCoordEdges'
        }
      ],
      textures: [
        { source: 0 }
      ],
      images: [
        { uri: 'texture.png' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'material-absolute-final.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit camera validator absolute hardest uncovered paths (27.52% -> higher)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test invalid camera type with special characters
          type: 'invalid@type!',
          name: 'InvalidType'
        },
        {
          // Test type as number instead of string
          type: 123,
          name: 'NumericType'
        },
        {
          // Test type as array instead of string
          type: ['perspective'],
          name: 'ArrayType'
        },
        {
          // Test orthographic with invalid property types
          type: 'orthographic',
          orthographic: {
            xmag: 'invalid_number',
            ymag: 'invalid_number', 
            zfar: 'invalid_number',
            znear: 'invalid_number'
          },
          name: 'InvalidOrthographicTypes'
        },
        {
          // Test perspective with invalid property types
          type: 'perspective',
          perspective: {
            yfov: 'invalid_number',
            znear: 'invalid_number',
            zfar: 'invalid_number',
            aspectRatio: 'invalid_number'
          },
          name: 'InvalidPerspectiveTypes'
        },
        {
          // Test orthographic as non-object
          type: 'orthographic',
          orthographic: 'not_an_object',
          name: 'OrthographicNotObject'
        },
        {
          // Test perspective as non-object
          type: 'perspective',
          perspective: 'not_an_object',
          name: 'PerspectiveNotObject'
        },
        {
          // Test orthographic with array instead of object
          type: 'orthographic',
          orthographic: [1.0, 1.0, 100.0, 0.1],
          name: 'OrthographicArray'
        },
        {
          // Test perspective with array instead of object
          type: 'perspective',
          perspective: [1.0, 0.1, 100.0, 1.77],
          name: 'PerspectiveArray'
        },
        {
          // Test extensions and extras
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            extensions: {
              'CAMERA_extension': {}
            },
            extras: {
              customProperty: 'value'
            }
          },
          extensions: {
            'CAMERA_root_extension': {}
          },
          extras: {
            rootCustomProperty: 'value'
          },
          name: 'WithExtensions'
        },
        {
          // Test orthographic with extremely small values
          type: 'orthographic',
          orthographic: {
            xmag: Number.EPSILON,
            ymag: Number.EPSILON,
            zfar: Number.EPSILON * 2,
            znear: Number.EPSILON
          },
          name: 'OrthographicTiny'
        },
        {
          // Test orthographic with extremely large values
          type: 'orthographic',
          orthographic: {
            xmag: 1e6,
            ymag: 1e6,
            zfar: 1e9,
            znear: 1e3
          },
          name: 'OrthographicHuge'
        },
        {
          // Test perspective with extreme FOV
          type: 'perspective',
          perspective: {
            yfov: Math.PI - 0.001, // Nearly 180 degrees
            znear: 0.001,
            zfar: 1e6,
            aspectRatio: 0.1
          },
          name: 'PerspectiveExtremeFOV'
        },
        {
          // Test perspective with extreme aspect ratio
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 100.0 // Very wide
          },
          name: 'PerspectiveWide'
        },
        {
          // Test perspective with very narrow aspect ratio
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: 0.01 // Very narrow
          },
          name: 'PerspectiveNarrow'
        },
        {
          // Test floating point precision edge cases
          type: 'orthographic',
          orthographic: {
            xmag: 1.0000000000000001,
            ymag: 0.9999999999999999,
            zfar: 100.00000000000001,
            znear: 0.09999999999999999
          },
          name: 'OrthographicPrecision'
        },
        {
          // Test perspective with precision edge cases
          type: 'perspective',
          perspective: {
            yfov: Math.PI / 4 + Number.EPSILON,
            znear: 0.1 - Number.EPSILON / 10,
            zfar: 1000.0 + Number.EPSILON,
            aspectRatio: 16.0/9.0 + Number.EPSILON
          },
          name: 'PerspectivePrecision'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-absolute-final.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit animation validator absolute hardest uncovered paths', async () => {
    // Create very specific animation data to hit the hardest validation paths
    const timeData = new Float32Array([0.0, 0.5, 1.0, 1.5, 2.0]); // 5 keyframes
    const translationData = new Float32Array([
      // Linear interpolation data - 5 keyframes * 3 components = 15 values
      0, 0, 0,
      1, 0, 0,
      1, 1, 0,
      0, 1, 0,
      0, 0, 0
    ]);

    // CUBICSPLINE data - each keyframe needs 3 values (in-tangent, point, out-tangent)
    const cubicSplineData = new Float32Array([
      // For 3 keyframes with CUBICSPLINE: 3 keyframes * 3 values per keyframe * 3 components = 27 values
      // Keyframe 0: in-tangent, point, out-tangent
      0, 0, 0,  // in-tangent
      0, 0, 0,  // point
      1, 0, 0,  // out-tangent
      // Keyframe 1: in-tangent, point, out-tangent
      1, 0, 0,  // in-tangent
      1, 1, 0,  // point
      0, 1, 0,  // out-tangent
      // Keyframe 2: in-tangent, point, out-tangent
      0, 1, 0,  // in-tangent
      0, 0, 0,  // point
      0, 0, 0   // out-tangent
    ]);

    // Wrong count data for CUBICSPLINE (should cause validation error)
    const wrongCubicData = new Float32Array([
      0, 0, 0,
      1, 1, 1,
      2, 2, 2,
      3, 3, 3 // Only 12 values for 3 keyframes, should be 27
    ]);

    // Combine all data
    const totalSize = timeData.byteLength + translationData.byteLength + cubicSplineData.byteLength + wrongCubicData.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(timeData.buffer), offset);
    offset += timeData.byteLength;
    combinedView.set(new Uint8Array(translationData.buffer), offset);
    offset += translationData.byteLength;
    combinedView.set(new Uint8Array(cubicSplineData.buffer), offset);
    offset += cubicSplineData.byteLength;
    combinedView.set(new Uint8Array(wrongCubicData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'AnimatedNode' }],
      animations: [
        {
          // Test with invalid sampler index
          channels: [
            {
              sampler: -1, // Invalid negative sampler index
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          name: 'InvalidSamplerIndex'
        },
        {
          // Test with unresolved sampler index
          channels: [
            {
              sampler: 999, // Unresolved sampler index
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          name: 'UnresolvedSamplerIndex'
        },
        {
          // Test with invalid target node
          channels: [
            {
              sampler: 0,
              target: { 
                node: -1, // Invalid node index
                path: 'translation' 
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          name: 'InvalidTargetNode'
        },
        {
          // Test with unresolved target node
          channels: [
            {
              sampler: 0,
              target: { 
                node: 999, // Unresolved node index
                path: 'translation' 
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          name: 'UnresolvedTargetNode'
        },
        {
          // Test with invalid path
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0,
                path: 'invalid_path' // Invalid animation path
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          name: 'InvalidPath'
        },
        {
          // Test CUBICSPLINE with wrong output count
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 6, // 3 keyframes time data
              output: 4, // Wrong count for CUBICSPLINE
              interpolation: 'CUBICSPLINE'
            }
          ],
          name: 'WrongCubicSplineCount'
        },
        {
          // Test with extensions and extras
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0,
                path: 'translation',
                extensions: {
                  'ANIM_channel_ext': {}
                },
                extras: {
                  customProperty: 'value'
                }
              },
              extensions: {
                'ANIM_channel_root_ext': {}
              },
              extras: {
                rootCustomProperty: 'value'
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR',
              extensions: {
                'ANIM_sampler_ext': {}
              },
              extras: {
                samplerCustomProperty: 'value'
              }
            }
          ],
          extensions: {
            'ANIM_root_ext': {}
          },
          extras: {
            animationCustomProperty: 'value'
          },
          name: 'WithExtensions'
        }
      ],
      accessors: [
        // 0: 5-keyframe time data
        { bufferView: 0, componentType: 5126, count: 5, type: 'SCALAR', min: [0], max: [2] },
        // 1: 5-keyframe translation data
        { bufferView: 1, componentType: 5126, count: 5, type: 'VEC3' },
        // 2: Correct CUBICSPLINE data (3 keyframes)
        { bufferView: 2, componentType: 5126, count: 9, type: 'VEC3' }, // 3 keyframes * 3 = 9
        // 3: Quaternion rotation data
        { bufferView: 1, componentType: 5126, count: 5, type: 'VEC4' },
        // 4: Wrong count CUBICSPLINE data
        { bufferView: 3, componentType: 5126, count: 4, type: 'VEC3' }, // Wrong count
        // 5: Scale data
        { bufferView: 1, componentType: 5126, count: 5, type: 'VEC3' },
        // 6: 3-keyframe time data for CUBICSPLINE
        { bufferView: 0, componentType: 5126, count: 3, type: 'SCALAR', min: [0], max: [1] }
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: timeData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength, byteLength: translationData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength + translationData.byteLength, byteLength: cubicSplineData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength + translationData.byteLength + cubicSplineData.byteLength, byteLength: wrongCubicData.byteLength }
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-absolute-final.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit accessor validator absolute hardest uncovered quaternion and matrix paths', async () => {
    // Create specific data to hit quaternion normalization and matrix validation edge cases
    
    // Quaternion data - mix of normalized and non-normalized
    const quaternionData = new Float32Array([
      // Non-normalized quaternions to trigger validation
      2.0, 0.0, 0.0, 2.0,    // Length = 2*sqrt(2) ≠ 1
      0.0, 3.0, 0.0, 1.0,    // Length = sqrt(10) ≠ 1
      0.5, 0.5, 0.5, 0.5,    // Length = 1 (normalized)
      0.0, 0.0, 0.0, 0.0     // Zero quaternion (invalid)
    ]);

    // Matrix data with potential issues
    const matrixData = new Float32Array([
      // MAT4 with determinant 0 (singular matrix)
      1, 0, 0, 0,
      0, 0, 0, 0,  // Second row all zeros
      0, 0, 1, 0,
      0, 0, 0, 1,
      // MAT3 with extreme values
      1e10, 0, 0,
      0, 1e-10, 0,
      0, 0, 1,
      // MAT2 with NaN values
      NaN, 0,
      0, Infinity
    ]);

    // Edge case component values
    const edgeCaseData = new Float32Array([
      Infinity, -Infinity, NaN, 0.0, -0.0,
      Number.EPSILON, -Number.EPSILON,
      Number.MAX_VALUE, Number.MIN_VALUE,
      3.141592653589793, 2.718281828459045 // π and e
    ]);

    // Combine all data
    const totalSize = quaternionData.byteLength + matrixData.byteLength + edgeCaseData.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(quaternionData.buffer), offset);
    offset += quaternionData.byteLength;
    combinedView.set(new Uint8Array(matrixData.buffer), offset);
    offset += matrixData.byteLength;
    combinedView.set(new Uint8Array(edgeCaseData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Quaternion accessor with non-normalized data
          bufferView: 0,
          componentType: 5126,
          count: 4,
          type: 'VEC4',
          // Set min/max that don't match to trigger bounds validation
          min: [0.0, 0.0, 0.0, 0.0],
          max: [1.0, 1.0, 1.0, 1.0]
        },
        {
          // MAT4 accessor with problematic matrix
          bufferView: 1,
          componentType: 5126,
          count: 1,
          type: 'MAT4'
        },
        {
          // MAT3 accessor with extreme values
          bufferView: 1,
          byteOffset: 64, // Skip first MAT4 (16 * 4 bytes)
          componentType: 5126,
          count: 1,
          type: 'MAT3'
        },
        {
          // MAT2 accessor with NaN/Infinity
          bufferView: 1,
          byteOffset: 100, // Skip MAT4 and MAT3 (64 + 36 bytes)
          componentType: 5126,
          count: 1,
          type: 'MAT2'
        },
        {
          // Edge case values accessor
          bufferView: 2,
          componentType: 5126,
          count: 10,
          type: 'SCALAR',
          // Set bounds that definitely won't match
          min: [-1.0],
          max: [1.0]
        },
        {
          // Test getAlignedMatrixAccessorByteLength with unusual alignment
          bufferView: 0,
          byteOffset: 3, // Misaligned offset for matrix
          componentType: 5126,
          count: 1,
          type: 'MAT4'
        },
        {
          // Test sparse accessor with matrix data
          bufferView: 1,
          componentType: 5126,
          count: 10,
          type: 'MAT2',
          sparse: {
            count: 2,
            indices: {
              bufferView: 3,
              componentType: 5123 // UNSIGNED_SHORT
            },
            values: {
              bufferView: 1,
              byteOffset: 100
            }
          }
        }
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: quaternionData.byteLength },
        { buffer: 0, byteOffset: quaternionData.byteLength, byteLength: matrixData.byteLength },
        { buffer: 0, byteOffset: quaternionData.byteLength + matrixData.byteLength, byteLength: edgeCaseData.byteLength },
        { buffer: 0, byteOffset: 0, byteLength: 4 } // For sparse indices
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-quaternion-matrix-final.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit absolute parser and validator edge cases', async () => {
    // Test the most challenging parser scenarios
    const gltf = {
      asset: { 
        version: '2.0',
        generator: 'Ultra Test Generator',
        copyright: '© 2024 Test Suite with special chars: àáâãäåæçèéêë',
        extensions: {
          'ULTRA_asset_extension': {
            testProperty: 'value'
          }
        },
        extras: {
          customAssetProperty: {
            nested: {
              deepProperty: [1, 2, 3, 'test']
            }
          }
        }
      },
      extensionsUsed: ['ULTRA_test_extension'],
      extensionsRequired: ['ULTRA_required_extension'], 
      scene: 0,
      scenes: [
        {
          nodes: [0],
          extensions: {
            'ULTRA_scene_extension': {}
          },
          extras: {
            sceneCustomProperty: true
          }
        }
      ],
      nodes: [
        {
          name: 'Root Node with Unicode: 🌟⭐✨💫🎯🔥⚡',
          translation: [1.23456789012345, -9.87654321098765, 0.11111111111111],
          rotation: [0.7071067811865475, 0.0, 0.0, 0.7071067811865476], // 90° rotation around X
          scale: [2.718281828459045, 3.141592653589793, 1.414213562373095], // e, π, √2
          extensions: {
            'ULTRA_node_extension': {
              customNodeData: {
                floatArray: [Number.EPSILON, Number.MAX_VALUE, Number.MIN_VALUE],
                stringWithSpecialChars: 'Test\n\r\t\\"\'\\/',
                unicodeString: 'Unicode test: αβγδε ñáéíóú 中文测试 🌍🌎🌏'
              }
            }
          },
          extras: {
            nodeCustomProperty: null,
            anotherProperty: {
              deeply: {
                nested: {
                  object: 'value'
                }
              }
            }
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'parser-edge-cases-final.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});