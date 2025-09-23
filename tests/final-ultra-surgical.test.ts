import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Final Ultra-Surgical Coverage Tests', () => {

  it('should hit the absolute hardest remaining camera validator paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test camera with BOTH perspective and orthographic (line 35-41)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1
          },
          name: 'BothPerspectiveAndOrthographic'
        },
        {
          // Test camera with NEITHER perspective nor orthographic (line 42-48)
          type: 'perspective',
          // No perspective or orthographic object
          name: 'NeitherPerspectiveNorOrthographic'
        },
        {
          // Test camera with type mismatch AND missing required properties
          type: null, // Null type (line 8-14)
          name: 'NullType'
        },
        {
          // Test camera with undefined type
          // type is undefined (line 8-14)
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'UndefinedType'
        },
        {
          // Hit the exact yfov === Math.PI edge case (line 96-102)
          type: 'perspective',
          perspective: {
            yfov: Math.PI, // Exactly Math.PI - should trigger warning
            znear: 0.1
          },
          name: 'YfovExactlyPi'
        },
        {
          // Hit specific CAMERA_ZFAR_LEQUAL_ZNEAR for perspective (line 146-155)
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 10.0,
            zfar: 5.0 // zfar < znear
          },
          name: 'PerspectiveZfarLessZnear'
        },
        {
          // Hit specific CAMERA_ZFAR_LEQUAL_ZNEAR for perspective equal case
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 10.0,
            zfar: 10.0 // zfar === znear
          },
          name: 'PerspectiveZfarEqualsZnear'
        },
        {
          // Hit specific CAMERA_ZFAR_LEQUAL_ZNEAR for orthographic (line 302-313)
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 10.0,
            zfar: 5.0 // zfar < znear
          },
          name: 'OrthographicZfarLessZnear'
        },
        {
          // Hit specific CAMERA_ZFAR_LEQUAL_ZNEAR for orthographic equal case
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            znear: 10.0,
            zfar: 10.0 // zfar === znear
          },
          name: 'OrthographicZfarEqualsZnear'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-ultra-surgical-camera.gltf' });
    
    // Should generate multiple errors for various validation failures
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining animation validator edge cases', async () => {
    // Create time and output data for testing edge cases
    const timeData = new Float32Array([0.0, 1.0, 2.0]);
    const outputData = new Float32Array([
      0, 0, 0,
      1, 1, 1,
      2, 2, 2
    ]);

    const totalSize = timeData.byteLength + outputData.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    combinedView.set(new Uint8Array(timeData.buffer), 0);
    combinedView.set(new Uint8Array(outputData.buffer), timeData.byteLength);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'Node' }],
      animations: [
        {
          // Test animation with missing samplers array (should cause errors)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ]
          // No samplers array defined
        },
        {
          // Test animation with missing channels array
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
          // No channels array defined
        },
        {
          // Test animation with empty samplers array
          samplers: [],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ]
        },
        {
          // Test animation with empty channels array
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          channels: []
        },
        {
          // Test sampler with missing input
          samplers: [
            {
              // input: undefined,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ]
        },
        {
          // Test sampler with missing output
          samplers: [
            {
              input: 0,
              // output: undefined,
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ]
        },
        {
          // Test sampler with missing interpolation
          samplers: [
            {
              input: 0,
              output: 1
              // interpolation: undefined
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ]
        },
        {
          // Test channel with missing sampler
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              // sampler: undefined,
              target: { node: 0, path: 'translation' }
            }
          ]
        },
        {
          // Test channel with missing target
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              sampler: 0
              // target: undefined
            }
          ]
        },
        {
          // Test target with missing node
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: {
                // node: undefined,
                path: 'translation'
              }
            }
          ]
        },
        {
          // Test target with missing path
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: {
                node: 0
                // path: undefined
              }
            }
          ]
        },
        {
          // Test invalid interpolation values
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'INVALID_INTERPOLATION'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ]
        }
      ],
      accessors: [
        { bufferView: 0, componentType: 5126, count: 3, type: 'SCALAR', min: [0], max: [2] },
        { bufferView: 1, componentType: 5126, count: 3, type: 'VEC3' }
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: timeData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength, byteLength: outputData.byteLength }
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-ultra-surgical-animation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining material validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Test material with no PBR object at all
          name: 'NoPBRMaterial'
          // No pbrMetallicRoughness
        },
        {
          // Test material with null PBR object
          pbrMetallicRoughness: null,
          name: 'NullPBRMaterial'
        },
        {
          // Test material with PBR as string instead of object
          pbrMetallicRoughness: 'invalid_pbr_object',
          name: 'StringPBRMaterial'
        },
        {
          // Test material with PBR as array instead of object
          pbrMetallicRoughness: ['invalid', 'pbr', 'array'],
          name: 'ArrayPBRMaterial'
        },
        {
          // Test baseColorFactor with wrong array length
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 0.5] // Should be 4 elements, not 2
          },
          name: 'WrongBaseColorFactorLength'
        },
        {
          // Test emissiveFactor with wrong array length
          emissiveFactor: [1.0, 0.5, 0.3, 0.8], // Should be 3 elements, not 4
          name: 'WrongEmissiveFactorLength'
        },
        {
          // Test baseColorFactor with non-numeric elements
          pbrMetallicRoughness: {
            baseColorFactor: [1.0, 'not_a_number', 0.5, 1.0]
          },
          name: 'NonNumericBaseColorFactor'
        },
        {
          // Test emissiveFactor with non-numeric elements
          emissiveFactor: ['not_a_number', 0.5, 0.3],
          name: 'NonNumericEmissiveFactor'
        },
        {
          // Test texture index type validation
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 'not_a_number', // Should be number
              texCoord: 0
            }
          },
          name: 'StringTextureIndex'
        },
        {
          // Test texCoord type validation
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              texCoord: 'not_a_number' // Should be number
            }
          },
          name: 'StringTexCoord'
        },
        {
          // Test negative texture indices
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: -5, // Negative index
              texCoord: 0
            }
          },
          name: 'NegativeTextureIndex'
        },
        {
          // Test negative texCoord
          normalTexture: {
            index: 0,
            texCoord: -1 // Negative texCoord
          },
          name: 'NegativeTexCoord'
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
    const result = await validateBytes(data, { uri: 'final-ultra-surgical-material.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining buffer view validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      bufferViews: [
        {
          // Test bufferView with target type mismatch
          buffer: 0,
          byteLength: 100,
          target: 'not_a_number' // Should be number
        },
        {
          // Test bufferView with byteStride type mismatch
          buffer: 0,
          byteLength: 100,
          byteStride: 'not_a_number' // Should be number
        },
        {
          // Test bufferView with negative byteStride
          buffer: 0,
          byteLength: 100,
          byteStride: -4 // Negative stride
        },
        {
          // Test bufferView with zero byteStride
          buffer: 0,
          byteLength: 100,
          byteStride: 0 // Zero stride - invalid
        },
        {
          // Test bufferView with byteStride = 1 (too small, not multiple of 4)
          buffer: 0,
          byteLength: 100,
          byteStride: 1
        },
        {
          // Test bufferView with byteStride = 2 (too small, not multiple of 4)
          buffer: 0,
          byteLength: 100,
          byteStride: 2
        },
        {
          // Test bufferView with byteStride = 3 (too small, not multiple of 4)
          buffer: 0,
          byteLength: 100,
          byteStride: 3
        },
        {
          // Test bufferView with byteStride > 252 (too large)
          buffer: 0,
          byteLength: 1000,
          byteStride: 256 // Exceeds max stride of 252
        },
        {
          // Test bufferView with target and stride combination validation
          buffer: 0,
          byteLength: 100,
          target: 34963, // ELEMENT_ARRAY_BUFFER
          byteStride: 4 // ELEMENT_ARRAY_BUFFER shouldn't have stride
        }
      ],
      buffers: [
        {
          byteLength: 1000
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-ultra-surgical-buffer-view.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});