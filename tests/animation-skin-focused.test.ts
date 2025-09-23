import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Animation and Skin Validator Focus', () => {

  it('should target animation-validator error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      nodes: [
        { name: 'Node0' },
        { name: 'Node1' },
        { name: 'Node2' }
      ],
      buffers: [{ byteLength: 1000 }],
      bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 1000 }],
      accessors: [
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 10, type: 'SCALAR' }, // Time
        { bufferView: 0, byteOffset: 40, componentType: 5126, count: 10, type: 'VEC3' }, // Translation
        { bufferView: 0, byteOffset: 160, componentType: 5126, count: 10, type: 'VEC4' }, // Rotation (quaternion)
        { bufferView: 0, byteOffset: 320, componentType: 5126, count: 10, type: 'VEC3' } // Scale
      ],
      animations: [
        {
          channels: [
            {
              sampler: 0,
              target: {
                node: 0,
                path: 'translation'
              }
            },
            {
              sampler: 1,
              target: {
                node: 1,
                path: 'rotation'
              }
            },
            {
              sampler: 2,
              target: {
                node: 2,
                path: 'scale'
              }
            },
            {
              sampler: 999, // Invalid sampler reference
              target: {
                node: 0,
                path: 'translation'
              }
            },
            {
              sampler: 0,
              target: {
                node: 999, // Invalid node reference
                path: 'translation'
              }
            },
            {
              sampler: 0,
              target: {
                node: 0,
                path: 'invalid_path' // Invalid animation path
              }
            },
            {
              sampler: 0,
              target: {
                // Missing node and path
              }
            }
          ],
          samplers: [
            {
              input: 0, // Time accessor
              interpolation: 'LINEAR',
              output: 1 // Translation accessor
            },
            {
              input: 0, // Time accessor
              interpolation: 'STEP',
              output: 2 // Rotation accessor
            },
            {
              input: 0, // Time accessor
              interpolation: 'CUBICSPLINE',
              output: 3 // Scale accessor
            },
            {
              input: 999, // Invalid input accessor
              interpolation: 'LINEAR',
              output: 1
            },
            {
              input: 0,
              interpolation: 'LINEAR',
              output: 999 // Invalid output accessor
            },
            {
              input: 0,
              interpolation: 'INVALID_INTERPOLATION', // Invalid interpolation
              output: 1
            },
            {
              // Missing required properties
            }
          ]
        },
        {
          // Missing channels and samplers
        },
        {
          channels: [],
          samplers: [] // Empty arrays
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target skin-validator error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      nodes: [
        { name: 'Root' },
        { name: 'Joint1' },
        { name: 'Joint2' },
        { name: 'Joint3' },
        { name: 'SkinMesh' }
      ],
      buffers: [{ byteLength: 1000 }],
      bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 1000 }],
      accessors: [
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 16, type: 'MAT4' } // Inverse bind matrices
      ],
      skins: [
        {
          joints: [1, 2, 3],
          inverseBindMatrices: 0,
          skeleton: 0, // Root joint
          name: 'TestSkin'
        },
        {
          joints: [999, 1000], // Invalid joint references
          inverseBindMatrices: 0,
          skeleton: 999 // Invalid skeleton reference
        },
        {
          joints: [1, 2, 3],
          inverseBindMatrices: 999, // Invalid accessor reference
          skeleton: 0
        },
        {
          // Missing joints (required)
          inverseBindMatrices: 0
        },
        {
          joints: [], // Empty joints array
          inverseBindMatrices: 0
        },
        {
          joints: [1, 2, 3],
          // Test with mismatched count between joints and inverse bind matrices
          inverseBindMatrices: 0 // Accessor has count=16, but only 3 joints
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'skin-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target scene-validator error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      nodes: [
        { name: 'Node0' },
        { name: 'Node1' },
        { name: 'Node2' }
      ],
      scenes: [
        {
          nodes: [0, 1, 2],
          name: 'MainScene'
        },
        {
          nodes: [999, 1000], // Invalid node references
          name: 'InvalidScene'
        },
        {
          // Missing nodes (optional but test validation)
          name: 'EmptyScene'
        },
        {
          nodes: [], // Empty nodes array
          name: 'ActuallyEmptyScene'
        }
      ],
      scene: 0 // Default scene
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'scene-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target texture-validator error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      images: [
        { name: 'ValidImage' },
        { name: 'AnotherImage' }
      ],
      samplers: [
        {
          magFilter: 9729, // LINEAR
          minFilter: 9987, // LINEAR_MIPMAP_LINEAR
          wrapS: 33071, // CLAMP_TO_EDGE
          wrapT: 10497 // REPEAT
        }
      ],
      textures: [
        {
          source: 0,
          sampler: 0,
          name: 'ValidTexture'
        },
        {
          source: 999, // Invalid image reference
          sampler: 0,
          name: 'InvalidImageTexture'
        },
        {
          source: 0,
          sampler: 999, // Invalid sampler reference
          name: 'InvalidSamplerTexture'
        },
        {
          source: 999, // Invalid image reference
          sampler: 999, // Invalid sampler reference
          name: 'InvalidBothTexture'
        },
        {
          // Missing source (required)
          sampler: 0,
          name: 'MissingSourceTexture'
        },
        {
          source: 0,
          // Missing sampler is optional
          name: 'NoSamplerTexture'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'texture-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should target image-validator error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 1000 }],
      bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 1000 }],
      images: [
        {
          uri: 'data:image/jpeg;base64,invalid_base64_data',
          name: 'InvalidDataURI'
        },
        {
          uri: 'data:application/octet-stream;base64,SGVsbG8gV29ybGQ=',
          name: 'WrongMimeType'
        },
        {
          uri: 'nonexistent-image.png',
          name: 'NonExistentFile'
        },
        {
          uri: 'javascript:alert("xss")',
          name: 'InvalidProtocol'
        },
        {
          bufferView: 999, // Invalid buffer view reference
          mimeType: 'image/png',
          name: 'InvalidBufferView'
        },
        {
          bufferView: 0,
          mimeType: 'invalid/mimetype', // Invalid MIME type
          name: 'InvalidMimeType'
        },
        {
          bufferView: 0,
          // Missing mimeType when using bufferView
          name: 'MissingMimeType'
        },
        {
          // Missing both uri and bufferView
          name: 'MissingBoth'
        },
        {
          uri: 'valid-image.png',
          bufferView: 0, // Both uri and bufferView (invalid)
          name: 'BothUriAndBufferView'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'image-focused.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});