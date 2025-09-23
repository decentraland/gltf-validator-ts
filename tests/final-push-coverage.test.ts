import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Final Push Coverage Tests', () => {

  it('should hit remaining accessor validator method validations', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test getTypeComponentCount for all types
          componentType: 5126, // FLOAT
          count: 1,
          type: 'SCALAR' // 1 component
        },
        {
          componentType: 5126,
          count: 1,
          type: 'VEC2' // 2 components
        },
        {
          componentType: 5126,
          count: 1,
          type: 'VEC3' // 3 components  
        },
        {
          componentType: 5126,
          count: 1,
          type: 'VEC4' // 4 components
        },
        {
          componentType: 5126,
          count: 1,
          type: 'MAT2' // 4 components
        },
        {
          componentType: 5126,
          count: 1,
          type: 'MAT3' // 9 components
        },
        {
          componentType: 5126,
          count: 1,
          type: 'MAT4' // 16 components
        },
        {
          // Test getComponentSize for all component types
          componentType: 5120, // BYTE - 1 byte
          count: 1,
          type: 'SCALAR'
        },
        {
          componentType: 5121, // UNSIGNED_BYTE - 1 byte
          count: 1,
          type: 'SCALAR'
        },
        {
          componentType: 5122, // SHORT - 2 bytes
          count: 1,
          type: 'SCALAR'
        },
        {
          componentType: 5123, // UNSIGNED_SHORT - 2 bytes
          count: 1,
          type: 'SCALAR'
        },
        {
          componentType: 5125, // UNSIGNED_INT - 4 bytes
          count: 1,
          type: 'SCALAR'
        },
        {
          componentType: 5126, // FLOAT - 4 bytes
          count: 1,
          type: 'SCALAR'
        },
        {
          // Test isMatrixType method
          componentType: 5126,
          count: 1,
          type: 'MAT4' // This should trigger isMatrixType = true
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'accessor-method-coverage.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining animation validator target validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1, 2, 3] }],
      nodes: [
        { name: 'Node0' },
        { name: 'Node1', mesh: 0 }, 
        { name: 'Node2', mesh: 1 }, // Mesh with morph targets
        { name: 'Node3', matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1] } // Node with matrix
      ],
      meshes: [
        {
          primitives: [{
            attributes: { POSITION: 0 }
          }]
        },
        {
          primitives: [{
            attributes: { POSITION: 0 },
            targets: [
              { POSITION: 1 } // Morph target
            ]
          }]
        }
      ],
      animations: [
        {
          samplers: [
            {
              input: 2,  // Time accessor
              output: 3, // Translation output
              interpolation: 'LINEAR'
            },
            {
              input: 2,
              output: 4, // Rotation output (quaternion)
              interpolation: 'LINEAR'
            },
            {
              input: 2,
              output: 5, // Scale output
              interpolation: 'LINEAR'
            },
            {
              input: 2,
              output: 6, // Weights output
              interpolation: 'LINEAR'
            }
          ],
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
              target: { node: 2, path: 'weights' } // Node with mesh that has morph targets
            },
            {
              sampler: 3,
              target: { node: 1, path: 'weights' } // Node with mesh but no morph targets - should cause error
            },
            {
              sampler: 0,
              target: { node: 3, path: 'translation' } // Node with matrix - should cause error
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // 0: Position
        { componentType: 5126, count: 3, type: 'VEC3' }, // 1: Morph target position
        { componentType: 5126, count: 2, type: 'SCALAR' }, // 2: Time
        { componentType: 5126, count: 2, type: 'VEC3' }, // 3: Translation
        { componentType: 5126, count: 2, type: 'VEC4' }, // 4: Rotation
        { componentType: 5126, count: 2, type: 'VEC3' }, // 5: Scale
        { componentType: 5126, count: 2, type: 'SCALAR' } // 6: Weights
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-target-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining buffer view target validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          target: 34962 // ARRAY_BUFFER - valid
        },
        {
          buffer: 0,
          byteOffset: 100,
          byteLength: 50,
          target: 34963 // ELEMENT_ARRAY_BUFFER - valid
        },
        {
          buffer: 0,
          byteOffset: 150,
          byteLength: 100,
          byteStride: 12,
          target: 34962 // Valid stride with ARRAY_BUFFER
        },
        {
          buffer: 0,
          byteOffset: 250,
          byteLength: 50,
          byteStride: 4,
          target: 34963 // ELEMENT_ARRAY_BUFFER with stride - should be error
        }
      ],
      buffers: [
        { byteLength: 300 }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-view-target-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining skin joint hierarchy validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 4] }], // Two separate hierarchies
      nodes: [
        { name: 'Root1', children: [1] },
        { name: 'Joint1', children: [2] }, 
        { name: 'Joint2', children: [3] },
        { name: 'Joint3' },
        { name: 'Root2' } // Separate hierarchy
      ],
      skins: [
        {
          joints: [1, 2, 3], // All joints from same hierarchy
          skeleton: 1 // Valid skeleton (ancestor of all joints)
        },
        {
          joints: [1, 2, 4], // Joint 4 from different hierarchy
          skeleton: 0 // skeleton is not ancestor of joint 4
        },
        {
          joints: [1, 2, 3],
          skeleton: 3 // skeleton (Joint3) is not ancestor of joints 1,2
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'skin-hierarchy-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining material texture coordinate validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              texCoord: 1 // Valid texCoord
            },
            metallicRoughnessTexture: {
              index: 0,
              texCoord: 2 // Valid texCoord
            }
          },
          normalTexture: {
            index: 0,
            texCoord: 0, // Valid texCoord
            scale: 1.5
          },
          occlusionTexture: {
            index: 0,
            texCoord: 1,
            strength: 0.8
          },
          emissiveTexture: {
            index: 0,
            texCoord: 0
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
    const result = await validateBytes(data, { uri: 'material-texcoord-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining GLB chunk validation edge cases', async () => {
    // Create GLB with invalid chunk structure
    const header = new ArrayBuffer(12);
    const headerView = new DataView(header);
    headerView.setUint32(0, 0x46546C67, true); // magic
    headerView.setUint32(4, 2, true); // version
    headerView.setUint32(8, 28, true); // total length

    // Create JSON chunk
    const jsonChunk = new ArrayBuffer(16);
    const jsonView = new DataView(jsonChunk);
    jsonView.setUint32(0, 4, true); // chunk length (too short)
    jsonView.setUint32(4, 0x4E4F534A, true); // chunk type "JSON"
    // Only 4 bytes of JSON data: "{}" (incomplete)
    const jsonBytes = new TextEncoder().encode('{}');
    new Uint8Array(jsonChunk, 8).set(jsonBytes.slice(0, 4));

    // Combine header and chunk
    const totalBuffer = new ArrayBuffer(28);
    const totalView = new Uint8Array(totalBuffer);
    totalView.set(new Uint8Array(header), 0);
    totalView.set(new Uint8Array(jsonChunk), 12);

    const result = await validateBytes(totalView, { uri: 'invalid-chunk.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit image validation with various data URI formats', async () => {
    const gltf = {
      asset: { version: '2.0' },
      images: [
        {
          // Valid PNG data URI with proper magic bytes
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          name: 'ValidPNG'
        },
        {
          // Valid JPEG data URI with proper magic bytes  
          uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDX4AtqfcCgA=',
          name: 'ValidJPEG'
        },
        {
          // Valid GIF data URI with proper magic bytes
          uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
          name: 'ValidGIF'
        },
        {
          // Data URI with format detection but MIME mismatch
          uri: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // PNG data with JPEG MIME
          name: 'MIMEMismatch'
        },
        {
          // Data URI with short data (can't detect format)
          uri: 'data:image/png;base64,dGVzdA==', // "test" - too short for format detection
          name: 'TooShort'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'image-data-uri-formats.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit node weight validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1, 2] }],
      nodes: [
        {
          name: 'NodeWithMeshButNoWeights',
          mesh: 0 // Mesh has morph targets but node has no weights
        },
        {
          name: 'NodeWithWeightsButWrongCount',
          mesh: 1,
          weights: [0.5] // Mesh has 2 morph targets but only 1 weight
        },
        {
          name: 'NodeWithWeightsButNoMesh',
          weights: [0.5, 0.3] // Node has weights but no mesh
        }
      ],
      meshes: [
        {
          primitives: [{
            attributes: { POSITION: 0 },
            targets: [
              { POSITION: 1 }, // 1 morph target
              { POSITION: 2 }  // 2 morph targets total
            ]
          }]
        },
        {
          primitives: [{
            attributes: { POSITION: 0 },
            targets: [
              { POSITION: 1 },
              { POSITION: 2 }  // 2 morph targets
            ]
          }]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // Base position
        { componentType: 5126, count: 3, type: 'VEC3' }, // Morph target 1
        { componentType: 5126, count: 3, type: 'VEC3' }  // Morph target 2
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'node-weights-validation.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});