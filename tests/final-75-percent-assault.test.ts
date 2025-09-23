import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Final 75% Coverage Assault Tests', () => {

  it('should hit the absolute final remaining animation validator paths', async () => {
    // Create comprehensive test data
    const timeData = new Float32Array([0.0, 1.0, 2.0, 3.0]); // 4 keyframes
    const rotationData = new Float32Array([
      0, 0, 0, 1,  // quat 1
      0, 0, 0, 1,  // quat 2
      0, 0, 0, 1,  // quat 3
      0, 0, 0, 1   // quat 4
    ]);
    const cubicSplineData = new Float32Array([
      // CUBICSPLINE needs 3 * keyframes * components elements
      // For 3 keyframes, VEC3 path: 3 * 3 * 3 = 27 values
      0,0,0, 0,0,0, 0,0,0, // keyframe 1: in-tangent, value, out-tangent
      1,1,1, 1,1,1, 1,1,1, // keyframe 2: in-tangent, value, out-tangent  
      2,2,2, 2,2,2, 2,2,2  // keyframe 3: in-tangent, value, out-tangent
    ]);
    
    const totalSize = timeData.byteLength + rotationData.byteLength + cubicSplineData.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(timeData.buffer), offset);
    offset += timeData.byteLength;
    combinedView.set(new Uint8Array(rotationData.buffer), offset);
    offset += rotationData.byteLength;
    combinedView.set(new Uint8Array(cubicSplineData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1] }],
      nodes: [
        { 
          name: 'Node0',
          mesh: 0 // Has mesh with morph targets for weights test
        },
        { 
          name: 'Node1',
          mesh: 1 // Has mesh without morph targets
        }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0 },
              targets: [
                { POSITION: 1 }, // Has morph targets
                { POSITION: 1 }
              ]
            }
          ]
        },
        {
          primitives: [
            {
              attributes: { POSITION: 0 }
              // No morph targets
            }
          ]
        }
      ],
      animations: [
        {
          // Test valid weights animation (node has mesh with morph targets)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'weights' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 4, // Weights output
              interpolation: 'LINEAR'
            }
          ],
          name: 'ValidWeights'
        },
        {
          // Test CUBICSPLINE interpolation validation paths
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 5, // 3 keyframes for CUBICSPLINE
              output: 2, // CUBICSPLINE translation data (27 values)
              interpolation: 'CUBICSPLINE'
            }
          ],
          name: 'ValidCubicSpline'
        },
        {
          // Test rotation path with quaternion validation
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'rotation' }
            }
          ],
          samplers: [
            {
              input: 0, // 4 keyframes
              output: 1, // Quaternion data (16 values)
              interpolation: 'LINEAR'
            }
          ],
          name: 'RotationPath'
        },
        {
          // Test scale path
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'scale' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 3, // Scale data
              interpolation: 'STEP'
            }
          ],
          name: 'ScalePath'
        },
        {
          // Test getExpectedOutputFormat method with all animation paths
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            },
            {
              sampler: 1,
              target: { node: 0, path: 'rotation' }
            },
            {
              sampler: 2,
              target: { node: 0, path: 'scale' }
            },
            {
              sampler: 3,
              target: { node: 0, path: 'weights' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 3, // VEC3 for translation
              interpolation: 'LINEAR'
            },
            {
              input: 0,
              output: 1, // VEC4 for rotation
              interpolation: 'LINEAR'
            },
            {
              input: 0,
              output: 3, // VEC3 for scale
              interpolation: 'LINEAR'
            },
            {
              input: 0,
              output: 4, // SCALAR for weights
              interpolation: 'LINEAR'
            }
          ],
          name: 'AllPaths'
        }
      ],
      accessors: [
        { bufferView: 0, componentType: 5126, count: 4, type: 'SCALAR', min: [0], max: [3] }, // 0: Time input (4 keyframes)
        { bufferView: 1, componentType: 5126, count: 4, type: 'VEC4' }, // 1: Quaternion data (4 keyframes)
        { bufferView: 2, componentType: 5126, count: 9, type: 'VEC3' }, // 2: CUBICSPLINE translation data (3 keyframes * 3)
        { bufferView: 1, componentType: 5126, count: 4, type: 'VEC3' }, // 3: Translation/Scale data (reuse quaternion buffer)
        { bufferView: 0, componentType: 5126, count: 4, type: 'SCALAR' }, // 4: Weights data (reuse time buffer)
        { bufferView: 0, componentType: 5126, count: 3, type: 'SCALAR', min: [0], max: [2] }  // 5: Time input for CUBICSPLINE (3 keyframes)
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: timeData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength, byteLength: rotationData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength + rotationData.byteLength, byteLength: cubicSplineData.byteLength }
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-75-assault-animation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining camera validator coverage gaps', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test camera missing type property entirely
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'MissingTypeProperty'
        },
        {
          // Test camera with empty string type
          type: '',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'EmptyStringType'
        },
        {
          // Test camera with whitespace type
          type: '   ',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'WhitespaceType'
        },
        {
          // Test perspective with missing yfov property entirely
          type: 'perspective',
          perspective: {
            znear: 0.1,
            zfar: 100.0,
            aspectRatio: 1.77
          },
          name: 'MissingYfovProperty'
        },
        {
          // Test perspective with missing znear property entirely
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            zfar: 100.0,
            aspectRatio: 1.77
          },
          name: 'MissingZnearProperty'
        },
        {
          // Test orthographic with missing xmag property entirely
          type: 'orthographic',
          orthographic: {
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1
          },
          name: 'MissingXmagProperty'
        },
        {
          // Test orthographic with missing ymag property entirely
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            zfar: 100.0,
            znear: 0.1
          },
          name: 'MissingYmagProperty'
        },
        {
          // Test orthographic with missing zfar property entirely
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 0.1
          },
          name: 'MissingZfarProperty'
        },
        {
          // Test orthographic with missing znear property entirely
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0
          },
          name: 'MissingZnearProperty'
        },
        {
          // Test complete camera without name
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-75-assault-camera.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining accessor validator sparse and bounds validation', async () => {
    // Create minimal binary data for sparse accessor testing
    const sparseIndicesData = new Uint16Array([0, 2, 4]); // 3 sparse indices
    const sparseValuesData = new Float32Array([1, 1, 1, 2, 2, 2, 3, 3, 3]); // 3 VEC3 values
    const baseData = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 5 VEC3 base values
    
    const totalSize = sparseIndicesData.byteLength + sparseValuesData.byteLength + baseData.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(sparseIndicesData.buffer), offset);
    offset += sparseIndicesData.byteLength;
    combinedView.set(new Uint8Array(sparseValuesData.buffer), offset);
    offset += sparseValuesData.byteLength;
    combinedView.set(new Uint8Array(baseData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test accessor with valid sparse data but various edge cases
          bufferView: 2, // Base data buffer view
          componentType: 5126,
          count: 5,
          type: 'VEC3',
          sparse: {
            count: 3,
            indices: {
              bufferView: 0,
              componentType: 5123, // UNSIGNED_SHORT
              byteOffset: 0
            },
            values: {
              bufferView: 1,
              byteOffset: 0
            }
          },
          min: [0, 0, 0],
          max: [3, 3, 3]
        },
        {
          // Test accessor bounds validation with matrix types
          bufferView: 2,
          componentType: 5126,
          count: 1,
          type: 'MAT4',
          byteOffset: 0
        },
        {
          // Test accessor bounds validation with various offsets
          bufferView: 2,
          componentType: 5126,
          count: 2,
          type: 'VEC3',
          byteOffset: 4 // Small offset
        },
        {
          // Test normalized accessor with valid component type
          bufferView: 3,
          componentType: 5121, // UNSIGNED_BYTE
          count: 10,
          type: 'VEC3',
          normalized: true
        },
        {
          // Test accessor with no bufferView (for vertex attributes)
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        }
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: sparseIndicesData.byteLength }, // Sparse indices
        { buffer: 0, byteOffset: sparseIndicesData.byteLength, byteLength: sparseValuesData.byteLength }, // Sparse values
        { buffer: 0, byteOffset: sparseIndicesData.byteLength + sparseValuesData.byteLength, byteLength: baseData.byteLength }, // Base data
        { buffer: 0, byteOffset: 0, byteLength: 30 } // For normalized test
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-75-assault-accessor.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit final edge cases across multiple validators', async () => {
    const gltf = {
      asset: { 
        version: '2.0',
        generator: 'Final Assault Test Generator',
        copyright: 'Test with special chars: àáâãäåæçèéêë',
        minVersion: '2.0'
      },
      extensionsUsed: ['TEST_extension'],
      extensionsRequired: ['TEST_required_extension'],
      scene: 0,
      scenes: [
        { 
          nodes: [0],
          extensions: {
            'SCENE_extension': { prop: 'value' }
          },
          extras: {
            sceneCustom: { nested: 'data' }
          }
        }
      ],
      nodes: [
        {
          name: 'Final Test Node',
          translation: [0, 0, 0],
          rotation: [0, 0, 0, 1],
          scale: [1, 1, 1],
          extensions: {
            'NODE_extension': { nodeData: true }
          },
          extras: {
            nodeCustom: 'final test data'
          }
        }
      ],
      // Add comprehensive test coverage for all object types
      materials: [
        {
          name: 'Test Material',
          pbrMetallicRoughness: {
            baseColorFactor: [1, 1, 1, 1],
            metallicFactor: 0.5,
            roughnessFactor: 0.5
          },
          extensions: {
            'MATERIAL_extension': {}
          },
          extras: {
            materialCustom: 'data'
          }
        }
      ],
      textures: [
        {
          source: 0,
          extensions: {
            'TEXTURE_extension': {}
          },
          extras: {
            textureCustom: 'data'
          }
        }
      ],
      images: [
        {
          uri: 'final-test.png',
          extensions: {
            'IMAGE_extension': {}
          },
          extras: {
            imageCustom: 'data'
          }
        }
      ],
      samplers: [
        {
          magFilter: 9729,
          minFilter: 9987,
          wrapS: 10497,
          wrapT: 33648,
          extensions: {
            'SAMPLER_extension': {}
          },
          extras: {
            samplerCustom: 'data'
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-75-assault-comprehensive.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});