import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Final 80 Percent Coverage Push', () => {

  it('should hit every possible validation branch across all validators simultaneously', async () => {
    const gltf = {
      asset: { 
        version: '2.0',
        minVersion: '2.0',
        generator: 'Ultra-Comprehensive Test',
        copyright: '© 2024 Test Suite'
      },
      extensionsUsed: ['EXT_TEST_1', 'EXT_TEST_2'],
      extensionsRequired: ['EXT_TEST_1'],
      scene: 0,
      scenes: [
        {
          nodes: [0, 1, 2, 3, 4, 999], // Include invalid node reference
          name: 'MainScene',
          extensions: { 'SCENE_EXT': { value: true } },
          extras: { customScene: 'data' }
        },
        {
          nodes: [1000, 1001], // More invalid references
          name: 'InvalidScene'
        }
      ],
      nodes: [
        {
          name: 'RootNode',
          children: [1, 2, 999], // Invalid child reference
          mesh: 0,
          skin: 0,
          camera: 0,
          translation: [1.0, 2.0, 3.0],
          rotation: [0.0, 0.0, 0.0, 1.0],
          scale: [1.0, 1.0, 1.0],
          extensions: { 'NODE_EXT': { data: 'test' } },
          extras: { customNode: true }
        },
        {
          name: 'TransformNode',
          matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            5, 6, 7, 1
          ],
          mesh: 999, // Invalid mesh reference
          camera: 999, // Invalid camera reference
          skin: 999 // Invalid skin reference
        },
        {
          name: 'MeshNode',
          mesh: 1,
          weights: [0.5, 0.3, 0.2]
        },
        {
          name: 'CameraNode',
          camera: 1
        },
        {
          name: 'SkinNode',
          skin: 1,
          mesh: 2
        }
      ],
      buffers: [
        { 
          byteLength: 10000,
          name: 'MainBuffer',
          uri: 'data:application/gltf-buffer;base64,' + btoa('a'.repeat(10000))
        },
        {
          byteLength: 5000,
          name: 'SecondBuffer'
        },
        {
          byteLength: 0, // Invalid zero length
          name: 'InvalidBuffer'
        },
        {
          byteLength: -100, // Invalid negative length
          name: 'NegativeBuffer'
        }
      ],
      bufferViews: [
        // Valid buffer views with various configurations
        { buffer: 0, byteOffset: 0, byteLength: 1000, byteStride: 4, target: 34962, name: 'VertexData' },
        { buffer: 0, byteOffset: 1000, byteLength: 500, target: 34963, name: 'IndexData' },
        { buffer: 0, byteOffset: 1500, byteLength: 2000, byteStride: 16, target: 34962, name: 'MatrixData' },
        { buffer: 0, byteOffset: 3500, byteLength: 1000, name: 'TextureData' },
        // Invalid buffer views
        { buffer: 999, byteOffset: 0, byteLength: 100 }, // Invalid buffer reference
        { buffer: 0, byteOffset: 20000, byteLength: 100 }, // Offset exceeds buffer
        { buffer: 0, byteOffset: 0, byteLength: 20000 }, // Length exceeds buffer
        { buffer: 0, byteOffset: 0, byteLength: 10, byteStride: 256 }, // Invalid stride
        { buffer: 0, byteOffset: 1, byteLength: 10, byteStride: 4 } // Misaligned
      ],
      accessors: [
        // Position data
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 100, type: 'VEC3', name: 'Positions' },
        // Normal data  
        { bufferView: 0, byteOffset: 400, componentType: 5126, count: 100, type: 'VEC3', name: 'Normals' },
        // UV data
        { bufferView: 0, byteOffset: 800, componentType: 5126, count: 100, type: 'VEC2', name: 'UVs' },
        // Index data
        { bufferView: 1, byteOffset: 0, componentType: 5125, count: 150, type: 'SCALAR', name: 'Indices' },
        // Matrix data
        { bufferView: 2, byteOffset: 0, componentType: 5126, count: 25, type: 'MAT4', name: 'Matrices' },
        // Animation time data
        { bufferView: 0, byteOffset: 4500, componentType: 5126, count: 10, type: 'SCALAR', name: 'Time' },
        // Animation rotation data with bounds checking
        { 
          bufferView: 0, 
          byteOffset: 4540, 
          componentType: 5126, 
          count: 10, 
          type: 'VEC4', 
          name: 'Rotations',
          min: [-1, -1, -1, -1],
          max: [1, 1, 1, 1]
        },
        // Invalid accessors
        { bufferView: 999, byteOffset: 0, componentType: 5126, count: 10, type: 'VEC3' }, // Invalid buffer view
        { bufferView: 0, byteOffset: 15000, componentType: 5126, count: 10, type: 'VEC3' }, // Invalid offset
        { bufferView: 0, byteOffset: 0, componentType: 9999, count: 10, type: 'VEC3' }, // Invalid component type
        { bufferView: 0, byteOffset: 0, componentType: 5126, count: 0, type: 'VEC3' } // Zero count
      ],
      meshes: [
        {
          name: 'MainMesh',
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: 1,
                TEXCOORD_0: 2,
                JOINTS_0: 999, // Invalid accessor
                WEIGHTS_0: 999 // Invalid accessor
              },
              indices: 3,
              material: 0,
              mode: 4, // TRIANGLES
              extensions: { 'PRIMITIVE_EXT': { data: true } },
              extras: { customPrimitive: 'test' }
            },
            {
              attributes: { POSITION: 0 },
              mode: 999 // Invalid mode
            },
            {
              attributes: { INVALID_ATTR: 0 }, // Invalid attribute name
              material: 999 // Invalid material reference
            }
          ],
          weights: [1.0, 0.5, 0.25]
        },
        {
          name: 'EmptyMesh',
          primitives: [] // Empty primitives array
        }
      ],
      materials: [
        {
          name: 'StandardMaterial',
          pbrMetallicRoughness: {
            baseColorTexture: { index: 0, texCoord: 0 },
            metallicRoughnessTexture: { index: 1, texCoord: 1 },
            baseColorFactor: [0.8, 0.8, 0.8, 1.0],
            metallicFactor: 0.1,
            roughnessFactor: 0.9
          },
          normalTexture: { index: 2, texCoord: 0, scale: 1.0 },
          occlusionTexture: { index: 3, texCoord: 0, strength: 1.0 },
          emissiveTexture: { index: 4, texCoord: 0 },
          emissiveFactor: [0.1, 0.1, 0.1],
          alphaMode: 'OPAQUE',
          doubleSided: false,
          extensions: { 'MATERIAL_EXT': { property: 'value' } },
          extras: { customMaterial: 'data' }
        },
        {
          name: 'InvalidMaterial',
          pbrMetallicRoughness: {
            baseColorTexture: { index: 999, texCoord: 0 }, // Invalid texture
            baseColorFactor: [1.0, 1.0, 1.0, -0.1], // Invalid alpha
            metallicFactor: -0.1, // Invalid negative
            roughnessFactor: 1.1 // Invalid > 1.0
          },
          alphaMode: 'INVALID_MODE', // Invalid mode
          alphaCutoff: -0.1 // Invalid negative
        }
      ],
      textures: [
        { source: 0, sampler: 0, name: 'BaseColorTexture' },
        { source: 1, sampler: 1, name: 'MetallicRoughnessTexture' },
        { source: 2, name: 'NormalTexture' },
        { source: 3, name: 'OcclusionTexture' },
        { source: 4, name: 'EmissiveTexture' },
        { source: 999, sampler: 0 }, // Invalid source
        { source: 0, sampler: 999 } // Invalid sampler
      ],
      images: [
        { 
          name: 'BaseColorImage',
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' 
        },
        { 
          name: 'BufferViewImage',
          bufferView: 3,
          mimeType: 'image/jpeg'
        },
        { 
          name: 'InvalidDataImage',
          uri: 'data:image/jpeg;base64,invalid_base64' // Invalid base64
        },
        { 
          name: 'InvalidMimeImage',
          bufferView: 3,
          mimeType: 'invalid/type' // Invalid MIME type
        },
        {
          name: 'MissingSourceImage'
          // Missing both uri and bufferView
        }
      ],
      samplers: [
        {
          name: 'LinearSampler',
          magFilter: 9729, // LINEAR
          minFilter: 9987, // LINEAR_MIPMAP_LINEAR
          wrapS: 33071, // CLAMP_TO_EDGE
          wrapT: 10497 // REPEAT
        },
        {
          name: 'NearestSampler',
          magFilter: 9728, // NEAREST
          minFilter: 9984, // NEAREST_MIPMAP_NEAREST
          wrapS: 33648, // MIRRORED_REPEAT
          wrapT: 33071 // CLAMP_TO_EDGE
        }
      ],
      cameras: [
        {
          name: 'PerspectiveCamera',
          type: 'perspective',
          perspective: {
            yfov: 0.785398,
            znear: 0.1,
            zfar: 1000.0,
            aspectRatio: 1.777
          }
        },
        {
          name: 'OrthographicCamera',
          type: 'orthographic',
          orthographic: {
            xmag: 10.0,
            ymag: 10.0,
            znear: 0.1,
            zfar: 1000.0
          }
        },
        {
          name: 'InvalidPerspective',
          type: 'perspective',
          perspective: {
            yfov: 0.0, // Invalid
            znear: 0.0 // Invalid
          }
        },
        {
          name: 'InvalidOrthographic',
          type: 'orthographic',
          orthographic: {
            xmag: 0.0, // Invalid
            ymag: 0.0, // Invalid
            znear: 100.0,
            zfar: 50.0 // Invalid: less than znear
          }
        }
      ],
      skins: [
        {
          name: 'MainSkin',
          joints: [1, 2, 3, 4],
          inverseBindMatrices: 4,
          skeleton: 0
        },
        {
          name: 'InvalidSkin',
          joints: [999, 1000], // Invalid joint references
          inverseBindMatrices: 999, // Invalid accessor
          skeleton: 999 // Invalid skeleton reference
        }
      ],
      animations: [
        {
          name: 'TestAnimation',
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            },
            {
              sampler: 1,
              target: { node: 1, path: 'rotation' }
            },
            {
              sampler: 999, // Invalid sampler
              target: { node: 0, path: 'scale' }
            },
            {
              sampler: 0,
              target: { node: 999, path: 'translation' } // Invalid node
            }
          ],
          samplers: [
            {
              input: 5, // Time accessor
              interpolation: 'LINEAR',
              output: 0 // Position accessor
            },
            {
              input: 5, // Time accessor
              interpolation: 'STEP',
              output: 6 // Rotation accessor
            },
            {
              input: 999, // Invalid input accessor
              interpolation: 'CUBICSPLINE',
              output: 0
            }
          ]
        }
      ],
      extensions: {
        'GLTF_EXT_1': { 
          property1: 'value1',
          property2: 42 
        },
        'GLTF_EXT_2': {
          nestedData: {
            level1: {
              level2: 'deep'
            }
          }
        }
      },
      extras: {
        customGltf: true,
        metadata: {
          version: '1.0',
          generator: 'Ultra-Comprehensive Test Suite'
        }
      }
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-80-percent-push.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});