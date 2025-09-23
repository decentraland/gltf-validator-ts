import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Precision 75% Breakthrough Tests', () => {

  it('should hit absolute hardest camera validator paths with undefined property variations', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          type: 'perspective',
          perspective: {
            // Test undefined yfov to hit specific validation path
            aspectRatio: 1.77,
            znear: 0.1
            // Missing yfov - should hit TYPE_MISMATCH or undefined check
          },
          name: 'PerspectiveNoYfov'
        },
        {
          type: 'perspective',
          perspective: {
            // Test undefined znear
            yfov: 1.0,
            aspectRatio: 1.77
            // Missing znear - should hit undefined check
          },
          name: 'PerspectiveNoZnear'
        },
        {
          type: 'perspective',
          perspective: {
            // Test undefined aspectRatio (optional)
            yfov: 1.0,
            znear: 0.1,
            zfar: 1000.0
          },
          name: 'PerspectiveNoAspect'
        },
        {
          type: 'orthographic',
          orthographic: {
            // Test undefined xmag
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
            // Missing xmag - should hit undefined check
          },
          name: 'OrthographicNoXmag'
        },
        {
          type: 'orthographic',
          orthographic: {
            // Test undefined ymag
            xmag: 1.0,
            zfar: 1000.0,
            znear: 0.1
            // Missing ymag - should hit undefined check
          },
          name: 'OrthographicNoYmag'
        },
        {
          type: 'orthographic',
          orthographic: {
            // Test undefined zfar
            xmag: 1.0,
            ymag: 1.0,
            znear: 0.1
            // Missing zfar - should hit undefined check
          },
          name: 'OrthographicNoZfar'
        },
        {
          type: 'orthographic',
          orthographic: {
            // Test undefined znear
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0
            // Missing znear - should hit undefined check
          },
          name: 'OrthographicNoZnear'
        },
        {
          // Test TYPE_MISMATCH for camera without type
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          name: 'NoTypeCamera'
        },
        {
          type: 'perspective',
          // Test TYPE_MISMATCH for perspective camera without perspective object
          name: 'NoObjectPerspective'
        },
        {
          type: 'orthographic',
          // Test TYPE_MISMATCH for orthographic camera without orthographic object
          name: 'NoObjectOrthographic'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-camera-75.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit absolute hardest accessor validator TYPE_MISMATCH paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test TYPE_MISMATCH for accessor without componentType
          count: 10,
          type: 'VEC3',
          bufferView: 0
        },
        {
          // Test TYPE_MISMATCH for accessor without count
          componentType: 5126,
          type: 'VEC3',
          bufferView: 0
        },
        {
          // Test TYPE_MISMATCH for accessor without type
          componentType: 5126,
          count: 10,
          bufferView: 0
        },
        {
          // Test accessor with invalid min/max array lengths
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          min: [1.0, 2.0], // Wrong length for VEC3 (should be 3 elements)
          max: [1.0, 2.0, 3.0, 4.0] // Wrong length for VEC3 (should be 3 elements)
        },
        {
          // Test accessor with sparse but invalid sparse structure
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          sparse: {
            // Missing count - should hit TYPE_MISMATCH
            indices: {
              bufferView: 1,
              componentType: 5123
            },
            values: {
              bufferView: 2
            }
          }
        },
        {
          // Test accessor with invalid byteOffset type
          componentType: 5126,
          count: 10,
          type: 'VEC3',
          bufferView: 0,
          byteOffset: "invalid" // Should be number, not string
        }
      ],
      bufferViews: [
        { buffer: 0, byteLength: 120 },
        { buffer: 0, byteOffset: 120, byteLength: 20 },
        { buffer: 0, byteOffset: 140, byteLength: 120 }
      ],
      buffers: [
        { byteLength: 300 }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-accessor-75.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit hardest material validator numeric boundary validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorFactor: [1.1, 0.5, 0.5, 1.0], // Red > 1.0 - should hit range validation
            metallicFactor: 1.1, // > 1.0 - should hit range validation
            roughnessFactor: -0.1 // < 0.0 - should hit range validation
          },
          normalTexture: {
            index: 0,
            scale: -1.0 // Negative scale - might hit validation
          },
          occlusionTexture: {
            index: 0,
            strength: 1.1 // > 1.0 - should hit range validation
          },
          emissiveFactor: [-0.1, 0.5, 0.5], // Negative emissive - should hit range validation
          alphaCutoff: 1.1, // > 1.0 - should hit range validation
          name: 'BoundaryTestMaterial'
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [0.5, 0.5, 0.5, -0.1], // Alpha < 0.0 - should hit range validation
            metallicFactor: -0.1, // < 0.0 - should hit range validation
            roughnessFactor: 1.1 // > 1.0 - should hit range validation
          },
          occlusionTexture: {
            index: 0,
            strength: -0.1 // < 0.0 - should hit range validation
          },
          alphaCutoff: -0.1, // < 0.0 - should hit range validation
          name: 'NegativeBoundaryMaterial'
        }
      ],
      textures: [
        { source: 0 }
      ],
      images: [
        { uri: 'test.png' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-material-75.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit animation validator hardest CUBICSPLINE and target validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1] }],
      nodes: [
        { name: 'Node0' },
        { name: 'Node1' }
      ],
      animations: [
        {
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'CUBICSPLINE'
            },
            {
              input: 0,
              output: 2, // Wrong count for CUBICSPLINE translation
              interpolation: 'CUBICSPLINE'
            },
            {
              input: 0,
              output: 3, // Wrong count for CUBICSPLINE rotation
              interpolation: 'CUBICSPLINE'
            },
            {
              input: 0,
              output: 4, // Wrong count for CUBICSPLINE scale
              interpolation: 'CUBICSPLINE'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            },
            {
              sampler: 1,
              target: { node: 0, path: 'translation' } // Duplicate target - should hit validation
            },
            {
              sampler: 2,
              target: { node: 1, path: 'rotation' }
            },
            {
              sampler: 3,
              target: { node: 1, path: 'scale' }
            },
            {
              sampler: 0,
              target: { node: 999, path: 'translation' } // Invalid node reference
            },
            {
              sampler: 0,
              target: { node: 0, path: 'invalid_path' } // Invalid animation path
            },
            {
              // Test TYPE_MISMATCH for channel without sampler
              target: { node: 0, path: 'translation' }
            },
            {
              sampler: 0
              // Test TYPE_MISMATCH for channel without target
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'SCALAR', min: [0], max: [2] }, // Input
        { componentType: 5126, count: 9, type: 'VEC3' }, // Correct CUBICSPLINE translation (3 keyframes * 3)
        { componentType: 5126, count: 7, type: 'VEC3' }, // Wrong CUBICSPLINE translation count
        { componentType: 5126, count: 8, type: 'VEC4' }, // Wrong CUBICSPLINE rotation count
        { componentType: 5126, count: 6, type: 'VEC3' }  // Wrong CUBICSPLINE scale count
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-animation-75.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit buffer view validator hardest remaining paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      bufferViews: [
        {
          // Test TYPE_MISMATCH for bufferView without buffer
          byteLength: 100,
          byteOffset: 0
        },
        {
          // Test TYPE_MISMATCH for bufferView without byteLength
          buffer: 0,
          byteOffset: 0
        },
        {
          // Test buffer view that extends beyond buffer bounds
          buffer: 0,
          byteLength: 200,
          byteOffset: 150 // 150 + 200 = 350 > 300 (buffer size)
        },
        {
          // Test buffer view with invalid byteStride
          buffer: 0,
          byteLength: 100,
          byteStride: 3 // Not multiple of 4, should hit alignment validation
        },
        {
          // Test buffer view with byteStride too large
          buffer: 0,
          byteLength: 100,
          byteStride: 252 // > 255, should hit validation if exists
        },
        {
          // Test buffer view with invalid target
          buffer: 0,
          byteLength: 100,
          target: 99999 // Invalid target value
        }
      ],
      buffers: [
        { byteLength: 300 }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-bufferview-75.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit mesh validator hardest primitive and morph target validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          primitives: [
            {
              // Test primitive without attributes - should hit TYPE_MISMATCH
              indices: 0,
              material: 0,
              mode: 4
            },
            {
              attributes: { POSITION: 1 },
              // Test primitive with invalid indices reference
              indices: 999,
              targets: [
                {
                  // Test morph target with invalid attribute reference
                  POSITION: 999,
                  NORMAL: 2
                },
                {
                  // Test morph target with incompatible accessor type
                  POSITION: 3 // VEC2 instead of VEC3
                }
              ]
            },
            {
              attributes: { 
                POSITION: 1,
                // Test invalid attribute name patterns
                '_INVALID_ATTR': 2,
                'POSITION_999': 3, // Invalid numbered position
                'TEXCOORD_999': 4 // Very high numbered texcoord
              },
              mode: 99 // Invalid primitive mode
            }
          ],
          // Test invalid weights array length
          weights: [0.5] // Should match number of morph targets if targets exist
        }
      ],
      accessors: [
        { componentType: 5123, count: 6, type: 'SCALAR' }, // 0: indices
        { componentType: 5126, count: 4, type: 'VEC3' }, // 1: POSITION
        { componentType: 5126, count: 4, type: 'VEC3' }, // 2: NORMAL
        { componentType: 5126, count: 4, type: 'VEC2' }, // 3: incompatible type
        { componentType: 5126, count: 4, type: 'VEC2' }  // 4: TEXCOORD
      ],
      materials: [
        { name: 'TestMaterial' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'precision-mesh-75.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});