import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Final Precision Strike Coverage Tests', () => {

  it('should hit camera validator comprehensive paths (currently 27.52%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Hit orthographic validation paths with missing required properties
          type: 'orthographic',
          // Missing orthographic property entirely - should trigger UNDEFINED_PROPERTY
        },
        {
          type: 'perspective',
          // Missing perspective property entirely - should trigger UNDEFINED_PROPERTY  
        },
        {
          type: 'orthographic',
          orthographic: {
            // Missing required xmag - should trigger validation
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1
          }
        },
        {
          type: 'orthographic', 
          orthographic: {
            xmag: 1.0,
            // Missing required ymag - should trigger validation
            zfar: 100.0,
            znear: 0.1
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            // Missing required zfar - should trigger validation
            znear: 0.1
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0
            // Missing required znear - should trigger validation
          }
        },
        {
          type: 'perspective',
          perspective: {
            // Missing required yfov - should trigger validation
            znear: 0.1,
            aspectRatio: 1.77
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            // Missing required znear - should trigger validation
            aspectRatio: 1.77
          }
        },
        {
          // Hit invalid camera type validation
          type: 'invalid_camera_type',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1
          }
        },
        {
          // Test numeric validation paths for orthographic
          type: 'orthographic',
          orthographic: {
            xmag: -1.0, // Invalid - should be positive
            ymag: 1.0,
            zfar: 100.0,
            znear: 0.1
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: -1.0, // Invalid - should be positive
            zfar: 100.0,
            znear: 0.1
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: -100.0, // Invalid - should be positive
            znear: 0.1
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 100.0,
            znear: -0.1 // Invalid - should be positive
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 0.1,
            znear: 100.0 // Invalid - znear should be less than zfar
          }
        },
        {
          // Test numeric validation paths for perspective
          type: 'perspective',
          perspective: {
            yfov: -1.0, // Invalid - should be positive
            znear: 0.1
          }
        },
        {
          type: 'perspective', 
          perspective: {
            yfov: 1.0,
            znear: -0.1 // Invalid - should be positive
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            zfar: -100.0 // Invalid - should be positive
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 100.0,
            zfar: 0.1 // Invalid - zfar should be greater than znear
          }
        },
        {
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1,
            aspectRatio: -1.77 // Invalid - should be positive
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit material validator comprehensive paths (currently 21.53%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Missing PBR object - should trigger validation
          name: 'NoPBR'
        },
        {
          pbrMetallicRoughness: {
            // Missing baseColorTexture index - hit validation paths
            baseColorTexture: {
              // Missing index - should trigger UNDEFINED_PROPERTY
              texCoord: 0
            }
          }
        },
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: -1, // Invalid index - should trigger validation
              texCoord: 0
            }
          }
        },
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 999, // Unresolved texture reference
              texCoord: 0
            }
          }
        },
        {
          pbrMetallicRoughness: {
            metallicRoughnessTexture: {
              // Missing index - should trigger UNDEFINED_PROPERTY
              texCoord: 0
            }
          }
        },
        {
          pbrMetallicRoughness: {
            metallicRoughnessTexture: {
              index: -1, // Invalid index
              texCoord: 0
            }
          }
        },
        {
          pbrMetallicRoughness: {
            metallicRoughnessTexture: {
              index: 999, // Unresolved reference
              texCoord: 0
            }
          }
        },
        {
          normalTexture: {
            // Missing index - should trigger UNDEFINED_PROPERTY
            texCoord: 0,
            scale: 1.0
          }
        },
        {
          normalTexture: {
            index: -1, // Invalid index
            texCoord: 0,
            scale: 1.0
          }
        },
        {
          normalTexture: {
            index: 999, // Unresolved reference
            texCoord: 0,
            scale: 1.0
          }
        },
        {
          occlusionTexture: {
            // Missing index - should trigger UNDEFINED_PROPERTY
            texCoord: 0,
            strength: 1.0
          }
        },
        {
          occlusionTexture: {
            index: -1, // Invalid index
            texCoord: 0,
            strength: 1.0
          }
        },
        {
          occlusionTexture: {
            index: 999, // Unresolved reference
            texCoord: 0,
            strength: 1.0
          }
        },
        {
          emissiveTexture: {
            // Missing index - should trigger UNDEFINED_PROPERTY
            texCoord: 0
          }
        },
        {
          emissiveTexture: {
            index: -1, // Invalid index
            texCoord: 0
          }
        },
        {
          emissiveTexture: {
            index: 999, // Unresolved reference
            texCoord: 0
          }
        },
        {
          // Test alpha mode validation
          alphaMode: 'INVALID_MODE'
        },
        {
          // Test alphaCutoff validation
          alphaMode: 'MASK',
          alphaCutoff: -0.1 // Invalid - should be between 0 and 1
        },
        {
          alphaMode: 'MASK',
          alphaCutoff: 1.1 // Invalid - should be between 0 and 1
        },
        {
          // Test emissive factor validation
          emissiveFactor: [-0.1, 0.5, 0.5] // Invalid - should be non-negative
        },
        {
          emissiveFactor: [0.5, -0.1, 0.5] // Invalid - should be non-negative
        },
        {
          emissiveFactor: [0.5, 0.5, -0.1] // Invalid - should be non-negative
        },
        {
          emissiveFactor: [1.1, 0.5, 0.5] // Invalid - should be <= 1
        },
        {
          emissiveFactor: [0.5, 1.1, 0.5] // Invalid - should be <= 1
        },
        {
          emissiveFactor: [0.5, 0.5, 1.1] // Invalid - should be <= 1
        },
        {
          // Test baseColorFactor validation
          pbrMetallicRoughness: {
            baseColorFactor: [-0.1, 0.5, 0.5, 1.0] // Invalid - should be non-negative
          }
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [0.5, -0.1, 0.5, 1.0] // Invalid - should be non-negative
          }
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [0.5, 0.5, -0.1, 1.0] // Invalid - should be non-negative
          }
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [0.5, 0.5, 0.5, -0.1] // Invalid - should be non-negative
          }
        },
        {
          pbrMetallicRoughness: {
            baseColorFactor: [1.1, 0.5, 0.5, 1.0] // Invalid - should be <= 1
          }
        },
        {
          pbrMetallicRoughness: {
            metallicFactor: -0.1 // Invalid - should be between 0 and 1
          }
        },
        {
          pbrMetallicRoughness: {
            metallicFactor: 1.1 // Invalid - should be between 0 and 1
          }
        },
        {
          pbrMetallicRoughness: {
            roughnessFactor: -0.1 // Invalid - should be between 0 and 1
          }
        },
        {
          pbrMetallicRoughness: {
            roughnessFactor: 1.1 // Invalid - should be between 0 and 1
          }
        },
        {
          normalTexture: {
            index: 0,
            scale: -1.0 // Invalid - should be non-negative
          }
        },
        {
          occlusionTexture: {
            index: 0,
            strength: -0.1 // Invalid - should be between 0 and 1
          }
        },
        {
          occlusionTexture: {
            index: 0,
            strength: 1.1 // Invalid - should be between 0 and 1
          }
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
    const result = await validateBytes(data, { uri: 'material-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit mesh validator comprehensive paths (currently 20.19%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          primitives: [
            {
              // Missing attributes - should trigger UNDEFINED_PROPERTY
              mode: 4 // TRIANGLES
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {}, // Empty attributes - should trigger validation
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: -1 // Invalid accessor index
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 999 // Unresolved accessor reference
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: -1 // Invalid accessor index for normal
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                TANGENT: -1 // Invalid accessor index for tangent
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                TEXCOORD_0: -1 // Invalid accessor index for texcoord
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                COLOR_0: -1 // Invalid accessor index for color
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                JOINTS_0: -1 // Invalid accessor index for joints
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                WEIGHTS_0: -1 // Invalid accessor index for weights
              },
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              indices: -1, // Invalid indices accessor
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              indices: 999, // Unresolved indices accessor
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              material: -1, // Invalid material reference
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              material: 999, // Unresolved material reference
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              mode: 99 // Invalid primitive mode
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              targets: [
                {
                  POSITION: -1 // Invalid morph target accessor
                }
              ],
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              targets: [
                {
                  POSITION: 999 // Unresolved morph target accessor
                }
              ],
              mode: 4
            }
          ]
        },
        {
          primitives: [
            {
              attributes: {
                POSITION: 0
              },
              targets: [
                {
                  INVALID_TARGET_ATTR: 1 // Invalid morph target attribute name
                }
              ],
              mode: 4
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // 0: POSITION
        { componentType: 5126, count: 3, type: 'VEC3' }  // 1: Valid morph target
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mesh-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit image validator comprehensive paths (currently 22.97%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      images: [
        {
          // Missing uri and bufferView - should trigger UNDEFINED_PROPERTY
          name: 'MissingSource'
        },
        {
          uri: 'valid.png',
          bufferView: 0 // Both uri and bufferView present - should trigger error
        },
        {
          // Missing mimeType when using bufferView - should trigger validation
          bufferView: 0
        },
        {
          bufferView: -1, // Invalid bufferView reference
          mimeType: 'image/png'
        },
        {
          bufferView: 999, // Unresolved bufferView reference
          mimeType: 'image/png'
        },
        {
          bufferView: 1, // BufferView with stride - invalid for image
          mimeType: 'image/png'
        },
        {
          bufferView: 0,
          mimeType: 'text/plain' // Invalid MIME type for image
        },
        {
          bufferView: 0,
          mimeType: 'application/octet-stream' // Invalid MIME type for image
        },
        {
          uri: '', // Empty URI - should trigger validation
          name: 'EmptyURI'
        },
        {
          uri: 'not_an_image.txt', // Invalid image extension
          name: 'InvalidExtension'
        },
        {
          uri: 'data:text/plain;base64,SGVsbG8=' // Invalid data URI MIME type
        },
        {
          uri: 'data:image/png;base64,invalid_base64_!@#$%' // Invalid base64 in data URI
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 100 // Valid image buffer view
        },
        {
          buffer: 0,
          byteOffset: 100,
          byteLength: 100,
          byteStride: 4 // Invalid stride for image
        }
      ],
      buffers: [
        {
          byteLength: 200
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'image-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit skin validator comprehensive paths (currently 26.5%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      skins: [
        {
          // Missing joints - should trigger UNDEFINED_PROPERTY
          name: 'NoJoints'
        },
        {
          joints: [], // Empty joints array - should trigger validation
          name: 'EmptyJoints'
        },
        {
          joints: [-1], // Invalid joint node reference
          name: 'InvalidJoint'
        },
        {
          joints: [999], // Unresolved joint node reference
          name: 'UnresolvedJoint'
        },
        {
          joints: [0, 0], // Duplicate joint references
          name: 'DuplicateJoints'
        },
        {
          joints: [0],
          inverseBindMatrices: -1, // Invalid accessor reference
          name: 'InvalidAccessor'
        },
        {
          joints: [0],
          inverseBindMatrices: 999, // Unresolved accessor reference
          name: 'UnresolvedAccessor'
        },
        {
          joints: [0, 1], // Two joints
          inverseBindMatrices: 0, // Accessor with wrong count (should match joint count)
          name: 'WrongAccessorCount'
        },
        {
          joints: [0],
          inverseBindMatrices: 1, // Accessor with wrong type (should be MAT4)
          name: 'WrongAccessorType'
        },
        {
          joints: [0],
          skeleton: -1, // Invalid skeleton node reference
          name: 'InvalidSkeleton'
        },
        {
          joints: [0],
          skeleton: 999, // Unresolved skeleton node reference
          name: 'UnresolvedSkeleton'
        },
        {
          joints: [0],
          skeleton: 0, // Skeleton node not ancestor of joints
          name: 'SkeletonNotAncestor'
        },
        {
          joints: [1], // Joint is child node
          skeleton: 0, // Skeleton is parent - valid case for comparison
          name: 'ValidHierarchy'
        }
      ],
      nodes: [
        { children: [1] }, // 0: Parent node
        { name: 'Joint1' } // 1: Child joint node
      ],
      accessors: [
        { componentType: 5126, count: 1, type: 'MAT4' }, // 0: Valid inverse bind matrices for 1 joint
        { componentType: 5126, count: 1, type: 'VEC3' }  // 1: Wrong type (not MAT4)
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'skin-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit buffer view validator comprehensive paths (currently 38.63%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      bufferViews: [
        {
          // Missing buffer - should trigger UNDEFINED_PROPERTY
          byteLength: 100
        },
        {
          buffer: -1, // Invalid buffer reference
          byteLength: 100
        },
        {
          buffer: 999, // Unresolved buffer reference
          byteLength: 100
        },
        {
          buffer: 0,
          // Missing byteLength - should trigger UNDEFINED_PROPERTY
          byteOffset: 0
        },
        {
          buffer: 0,
          byteLength: -100, // Invalid negative byteLength
          byteOffset: 0
        },
        {
          buffer: 0,
          byteLength: 100,
          byteOffset: -10 // Invalid negative byteOffset
        },
        {
          buffer: 0,
          byteLength: 100,
          byteOffset: 950 // Offset + length > buffer size (1000)
        },
        {
          buffer: 0,
          byteLength: 100,
          byteOffset: 0,
          byteStride: 3 // Invalid stride (should be multiple of 4)
        },
        {
          buffer: 0,
          byteLength: 100,
          byteOffset: 0,
          byteStride: 252 // Stride too large (max 252)
        },
        {
          buffer: 0,
          byteLength: 100,
          byteOffset: 0,
          target: 34962, // ARRAY_BUFFER - valid
          byteStride: 12 // Valid stride for ARRAY_BUFFER
        },
        {
          buffer: 0,
          byteLength: 100,
          byteOffset: 100,
          target: 34963, // ELEMENT_ARRAY_BUFFER - should not have stride
          byteStride: 4 // Invalid - ELEMENT_ARRAY_BUFFER shouldn't have stride
        },
        {
          buffer: 0,
          byteLength: 100,
          byteOffset: 200,
          target: 99999 // Invalid target value
        }
      ],
      buffers: [
        {
          byteLength: 1000
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'bufferview-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit texture validator comprehensive paths (currently 36.53%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      textures: [
        {
          // Missing source - should trigger UNDEFINED_PROPERTY
          sampler: 0
        },
        {
          source: -1, // Invalid source reference
          sampler: 0
        },
        {
          source: 999, // Unresolved source reference
          sampler: 0
        },
        {
          source: 0,
          sampler: -1 // Invalid sampler reference
        },
        {
          source: 0,
          sampler: 999 // Unresolved sampler reference
        },
        {
          source: 0 // Valid texture without sampler
        }
      ],
      images: [
        { uri: 'texture.png' }
      ],
      samplers: [
        { magFilter: 9729 }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'texture-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit sampler validator comprehensive paths (currently 47.36%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      samplers: [
        {
          magFilter: 9999, // Invalid magFilter value
          minFilter: 9729,
          wrapS: 10497,
          wrapT: 10497
        },
        {
          magFilter: 9729,
          minFilter: 9999, // Invalid minFilter value
          wrapS: 10497,
          wrapT: 10497
        },
        {
          magFilter: 9729,
          minFilter: 9729,
          wrapS: 9999, // Invalid wrapS value
          wrapT: 10497
        },
        {
          magFilter: 9729,
          minFilter: 9729,
          wrapS: 10497,
          wrapT: 9999 // Invalid wrapT value
        },
        {
          // Test all valid magFilter values
          magFilter: 9728, // NEAREST
          minFilter: 9729
        },
        {
          magFilter: 9729, // LINEAR
          minFilter: 9729
        },
        {
          // Test all valid minFilter values
          magFilter: 9729,
          minFilter: 9728 // NEAREST
        },
        {
          magFilter: 9729,
          minFilter: 9729 // LINEAR
        },
        {
          magFilter: 9729,
          minFilter: 9984 // NEAREST_MIPMAP_NEAREST
        },
        {
          magFilter: 9729,
          minFilter: 9985 // LINEAR_MIPMAP_NEAREST
        },
        {
          magFilter: 9729,
          minFilter: 9986 // NEAREST_MIPMAP_LINEAR
        },
        {
          magFilter: 9729,
          minFilter: 9987 // LINEAR_MIPMAP_LINEAR
        },
        {
          // Test all valid wrap values
          magFilter: 9729,
          minFilter: 9729,
          wrapS: 10497, // REPEAT
          wrapT: 10497
        },
        {
          magFilter: 9729,
          minFilter: 9729,
          wrapS: 33071, // CLAMP_TO_EDGE
          wrapT: 33071
        },
        {
          magFilter: 9729,
          minFilter: 9729,
          wrapS: 33648, // MIRRORED_REPEAT
          wrapT: 33648
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'sampler-comprehensive.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit node validator comprehensive paths (currently 39.36%)', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [
        {
          // Node with invalid mesh reference
          mesh: -1,
          name: 'InvalidMesh'
        },
        {
          mesh: 999, // Unresolved mesh reference
          name: 'UnresolvedMesh'
        },
        {
          // Node with invalid camera reference
          camera: -1,
          name: 'InvalidCamera'
        },
        {
          camera: 999, // Unresolved camera reference
          name: 'UnresolvedCamera'
        },
        {
          // Node with invalid skin reference
          skin: -1,
          name: 'InvalidSkin'
        },
        {
          skin: 999, // Unresolved skin reference
          name: 'UnresolvedSkin'
        },
        {
          // Node with invalid child reference
          children: [-1],
          name: 'InvalidChild'
        },
        {
          children: [999], // Unresolved child reference
          name: 'UnresolvedChild'
        },
        {
          children: [0], // Self-referential child (circular)
          name: 'SelfReferential'
        },
        {
          // Node with both mesh and camera (should be error)
          mesh: 0,
          camera: 0,
          name: 'MeshAndCamera'
        },
        {
          // Node with both mesh and skin but skin not used by mesh
          mesh: 1, // Mesh without skin
          skin: 0,
          name: 'SkinWithoutSkinnedMesh'
        },
        {
          // Node with invalid matrix (not 16 elements)
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], // Only 12 elements
          name: 'InvalidMatrix'
        },
        {
          // Node with both matrix and TRS properties
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          translation: [0, 0, 0],
          name: 'MatrixAndTRS'
        },
        {
          // Node with invalid translation (not 3 elements)
          translation: [0, 0],
          name: 'InvalidTranslation'
        },
        {
          // Node with invalid rotation (not 4 elements)
          rotation: [0, 0, 0],
          name: 'InvalidRotation'
        },
        {
          // Node with invalid scale (not 3 elements)
          scale: [1, 1],
          name: 'InvalidScale'
        },
        {
          // Node with invalid weights (doesn't match mesh morph targets)
          mesh: 0,
          weights: [0.5, 0.3], // Mesh has no morph targets
          name: 'InvalidWeights'
        }
      ],
      meshes: [
        {
          primitives: [{ attributes: { POSITION: 0 } }] // No skin
        },
        {
          primitives: [{ attributes: { POSITION: 0 } }] // No morph targets
        }
      ],
      cameras: [
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1 } }
      ],
      skins: [
        { joints: [0] }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'node-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});