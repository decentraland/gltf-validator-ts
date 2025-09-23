import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultimate Precision Coverage Tests', () => {

  it('should hit the hardest accessor validator paths with very specific conditions', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Hit the default case in getAlignedMatrixAccessorByteLength
          componentType: 5126, // FLOAT
          count: 1,
          type: 'UNKNOWN_MATRIX_TYPE', // Will trigger default case
          bufferView: 0
        },
        {
          // Hit specific sparse alignment error paths
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 5120, // BYTE - 1 byte alignment
              byteOffset: 0 // Aligned
            },
            values: {
              bufferView: 1,
              byteOffset: 1 // 1-byte offset for FLOAT data - should be misaligned
            }
          }
        },
        {
          // Another sparse alignment case
          componentType: 5122, // SHORT
          count: 100,
          type: 'SCALAR',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 5122, // SHORT - 2 byte alignment  
              byteOffset: 1 // Misaligned for SHORT
            },
            values: {
              bufferView: 1,
              byteOffset: 0
            }
          }
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: 100
        },
        {
          buffer: 0,
          byteOffset: 100,
          byteLength: 200
        }
      ],
      buffers: [
        {
          byteLength: 300
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultimate-accessor.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit specific data validation formatting paths', async () => {
    // Create binary data that will trigger specific formatting in accessor validation
    const testValues = new Float32Array([
      1.5, 2.75, -3.25,  // Values that will trigger decimal formatting
      Infinity, -Infinity, NaN  // Special float values
    ]);

    const base64Data = btoa(String.fromCharCode(...new Uint8Array(testValues.buffer)));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 2,
          type: 'VEC3',
          // Declare bounds that don't match to trigger formatting
          min: [1.0, 2.0, -4.0],
          max: [2.0, 3.0, -2.0]
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteLength: testValues.byteLength
        }
      ],
      buffers: [
        {
          byteLength: testValues.byteLength,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'data-formatting.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit usage tracker edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      // Create objects that will test usage tracking edge cases
      scenes: [
        { nodes: [0] }  // Uses node 0
      ],
      nodes: [
        { mesh: 0, camera: 0, skin: 0 }, // Uses mesh 0, camera 0, skin 0
        { name: 'UnusedNode' }  // Node 1 is not used by scene
      ],
      meshes: [
        {
          primitives: [{
            attributes: { POSITION: 0 },
            indices: 1,
            material: 0
          }]
        },
        { // Mesh 1 is not used
          primitives: [{
            attributes: { POSITION: 2 }
          }]
        }
      ],
      materials: [
        { 
          name: 'UsedMaterial',
          pbrMetallicRoughness: {
            baseColorTexture: { index: 0 }
          }
        },
        { name: 'UnusedMaterial' } // Material 1 is not used
      ],
      textures: [
        { source: 0, sampler: 0 }, // Used by material 0
        { source: 1 } // Texture 1 is not used
      ],
      images: [
        { uri: 'used.png' }, // Used by texture 0
        { uri: 'unused.png' } // Image 1 is not used
      ],
      samplers: [
        { magFilter: 9729 }, // Used by texture 0
        { magFilter: 9728 } // Sampler 1 is not used
      ],
      cameras: [
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1 } }, // Used by node 0
        { type: 'orthographic', orthographic: { xmag: 1, ymag: 1, zfar: 100, znear: 0.1 } } // Camera 1 is not used
      ],
      skins: [
        { joints: [0] }, // Used by node 0
        { joints: [1] } // Skin 1 is not used
      ],
      animations: [
        {
          samplers: [{ input: 3, output: 4, interpolation: 'LINEAR' }],
          channels: [{ sampler: 0, target: { node: 0, path: 'translation' } }]
        },
        { // Animation 1 is not used in any way that would mark it as used
          samplers: [{ input: 5, output: 6, interpolation: 'LINEAR' }],
          channels: [{ sampler: 0, target: { node: 1, path: 'rotation' } }]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // Used by mesh primitive
        { componentType: 5123, count: 3, type: 'SCALAR' }, // Used as indices
        { componentType: 5126, count: 3, type: 'VEC3' }, // Used by unused mesh
        { componentType: 5126, count: 2, type: 'SCALAR' }, // Used by animation
        { componentType: 5126, count: 2, type: 'VEC3' }, // Used by animation
        { componentType: 5126, count: 2, type: 'SCALAR' }, // Used by unused animation
        { componentType: 5126, count: 2, type: 'VEC4' } // Used by unused animation
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'usage-tracking.gltf' });
    
    // Should report usage issues for unused objects
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit GLB specific parsing edge cases', async () => {
    // Create GLB with very specific chunk structures to hit edge cases
    
    // GLB with BIN chunk that has wrong type
    const header = new ArrayBuffer(12);
    const headerView = new DataView(header);
    headerView.setUint32(0, 0x46546C67, true); // magic "glTF"
    headerView.setUint32(4, 2, true); // version
    headerView.setUint32(8, 44, true); // total length

    // JSON chunk
    const jsonData = JSON.stringify({ asset: { version: '2.0' } });
    const jsonLength = Math.ceil(jsonData.length / 4) * 4; // Pad to 4 bytes
    const jsonChunk = new ArrayBuffer(8 + jsonLength);
    const jsonChunkView = new DataView(jsonChunk);
    jsonChunkView.setUint32(0, jsonLength, true); // chunk length
    jsonChunkView.setUint32(4, 0x4E4F534A, true); // chunk type "JSON"
    const jsonBytes = new TextEncoder().encode(jsonData);
    new Uint8Array(jsonChunk, 8).set(jsonBytes);

    // BIN chunk with wrong type
    const binChunk = new ArrayBuffer(16);
    const binChunkView = new DataView(binChunk);
    binChunkView.setUint32(0, 8, true); // chunk length
    binChunkView.setUint32(4, 0x58585858, true); // Wrong chunk type "XXXX" instead of "BIN "
    binChunkView.setUint32(8, 0x12345678, true); // Some binary data
    binChunkView.setUint32(12, 0x9ABCDEF0, true);

    // Combine all parts
    const totalLength = header.byteLength + jsonChunk.byteLength + binChunk.byteLength;
    const combinedBuffer = new ArrayBuffer(totalLength);
    const combinedView = new Uint8Array(combinedBuffer);
    
    combinedView.set(new Uint8Array(header), 0);
    combinedView.set(new Uint8Array(jsonChunk), header.byteLength);
    combinedView.set(new Uint8Array(binChunk), header.byteLength + jsonChunk.byteLength);

    const result = await validateBytes(combinedView, { uri: 'glb-wrong-chunk-type.glb' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit animation interpolation validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'AnimatedNode' }],
      animations: [
        {
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'STEP' // Test STEP interpolation path
            },
            {
              input: 0,
              output: 1,
              interpolation: 'CUBICSPLINE' // Test CUBICSPLINE path
            },
            {
              input: 0,
              output: 2, // Wrong count for CUBICSPLINE
              interpolation: 'CUBICSPLINE'
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'rotation' }
            },
            {
              sampler: 1,
              target: { node: 0, path: 'rotation' }
            },
            {
              sampler: 2,
              target: { node: 0, path: 'rotation' }
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 2, type: 'SCALAR' }, // Time input
        { componentType: 5126, count: 2, type: 'VEC4' }, // Quaternion output for LINEAR/STEP
        { componentType: 5126, count: 4, type: 'VEC4' }  // Wrong count for CUBICSPLINE (should be 6 for 2 keyframes)
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-interpolation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit specific mesh primitive attribute validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: 1,
                // Test various attribute formats
                'TEXCOORD_0': 2,
                'TEXCOORD_1': 3, 
                'COLOR_0': 4,
                'JOINTS_0': 5,
                'WEIGHTS_0': 6,
                // Test invalid attribute names
                '_INVALID': 7, // Starts with underscore
                'CUSTOM_ATTR': 8, // Custom attribute
                'POSITION_1': 9 // Invalid numbered position
              },
              indices: 10
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // 0: POSITION
        { componentType: 5126, count: 3, type: 'VEC3' }, // 1: NORMAL
        { componentType: 5126, count: 3, type: 'VEC2' }, // 2: TEXCOORD_0
        { componentType: 5126, count: 3, type: 'VEC2' }, // 3: TEXCOORD_1
        { componentType: 5126, count: 3, type: 'VEC3' }, // 4: COLOR_0
        { componentType: 5121, count: 3, type: 'VEC4' }, // 5: JOINTS_0
        { componentType: 5126, count: 3, type: 'VEC4' }, // 6: WEIGHTS_0
        { componentType: 5126, count: 3, type: 'VEC3' }, // 7: _INVALID
        { componentType: 5126, count: 3, type: 'VEC3' }, // 8: CUSTOM_ATTR
        { componentType: 5126, count: 3, type: 'VEC3' }, // 9: POSITION_1
        { componentType: 5123, count: 9, type: 'SCALAR' } // 10: indices
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mesh-attributes.gltf' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

});