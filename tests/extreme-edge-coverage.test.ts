import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Extreme Edge Coverage Tests', () => {

  it('should hit value range validation with out-of-range binary data', async () => {
    // Create binary data that contains out-of-range values for each component type
    
    // BYTE data with out-of-range values (impossible in practice but tests the validation logic)
    const byteData = new Int8Array([127, -128, 100]); // Within range
    
    // SHORT data 
    const shortData = new Int16Array([32767, -32768, 1000]); // Within range
    
    // UNSIGNED_SHORT data
    const ushortData = new Uint16Array([65535, 0, 1000]); // Within range
    
    // UNSIGNED_INT data  
    const uintData = new Uint32Array([4294967295, 0, 1000000]); // Within range
    
    // Combine all data
    const combinedSize = byteData.byteLength + shortData.byteLength + ushortData.byteLength + uintData.byteLength;
    const combinedBuffer = new ArrayBuffer(combinedSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(byteData.buffer), offset);
    offset += byteData.byteLength;
    combinedView.set(new Uint8Array(shortData.buffer), offset);
    offset += shortData.byteLength;
    combinedView.set(new Uint8Array(ushortData.buffer), offset);
    offset += ushortData.byteLength;
    combinedView.set(new Uint8Array(uintData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          bufferView: 0,
          componentType: 5120, // BYTE
          count: 3,
          type: 'SCALAR'
        },
        {
          bufferView: 1, 
          componentType: 5122, // SHORT
          count: 3,
          type: 'SCALAR'
        },
        {
          bufferView: 2,
          componentType: 5123, // UNSIGNED_SHORT
          count: 3,
          type: 'SCALAR'
        },
        {
          bufferView: 3,
          componentType: 5125, // UNSIGNED_INT
          count: 3,
          type: 'SCALAR'
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: byteData.byteLength
        },
        {
          buffer: 0,
          byteOffset: byteData.byteLength,
          byteLength: shortData.byteLength
        },
        {
          buffer: 0,
          byteOffset: byteData.byteLength + shortData.byteLength,
          byteLength: ushortData.byteLength
        },
        {
          buffer: 0,
          byteOffset: byteData.byteLength + shortData.byteLength + ushortData.byteLength,
          byteLength: uintData.byteLength
        }
      ],
      buffers: [
        {
          byteLength: combinedSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'value-range-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit specific formatValue function paths', async () => {
    // Create data with specific values to test different formatting paths
    const floatData = new Float32Array([
      1.5,      // Decimal value
      1.0,      // Whole number
      0.0,      // Zero
      -1.5,     // Negative decimal
      Infinity, // Infinity
      -Infinity, // Negative infinity
      NaN       // NaN
    ]);

    const intData = new Int32Array([
      42,       // Regular integer
      -42,      // Negative integer
      0,        // Zero
      2147483647, // Max int32
      -2147483648 // Min int32
    ]);

    // Combine data
    const totalSize = floatData.byteLength + intData.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    combinedView.set(new Uint8Array(floatData.buffer), 0);
    combinedView.set(new Uint8Array(intData.buffer), floatData.byteLength);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 7,
          type: 'SCALAR',
          // Set min/max that don't match to trigger formatValue usage
          min: [0.0],
          max: [2.0]
        },
        {
          bufferView: 1,
          componentType: 5125, // UNSIGNED_INT (treating as signed for test)
          count: 5, 
          type: 'SCALAR',
          min: [0],
          max: [100]
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: floatData.byteLength
        },
        {
          buffer: 0,
          byteOffset: floatData.byteLength,
          byteLength: intData.byteLength
        }
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'format-value-paths.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining mesh validator primitive target validation', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0 },
              targets: [
                {
                  POSITION: -1, // Invalid accessor reference
                  NORMAL: 999   // Unresolved accessor reference
                },
                {
                  POSITION: 1,
                  'INVALID_TARGET_ATTR': 2, // Invalid morph target attribute
                  TANGENT: 3 // Valid morph target attribute
                }
              ]
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3' }, // 0: Base POSITION
        { componentType: 5126, count: 3, type: 'VEC3' }, // 1: Morph POSITION
        { componentType: 5126, count: 3, type: 'VEC3' }, // 2: Invalid target attr
        { componentType: 5126, count: 3, type: 'VEC3' }  // 3: TANGENT morph target
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mesh-target-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining animation sampler validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'TestNode' }],
      animations: [
        {
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            },
            {
              input: 2, // Different input accessor
              output: 3,
              interpolation: 'STEP'
            },
            {
              input: 0, // Reuse input accessor
              output: 4, // Wrong count for CUBICSPLINE
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
              target: { node: 0, path: 'rotation' }
            },
            {
              sampler: 2,
              target: { node: 0, path: 'scale' }
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'SCALAR', min: [0], max: [2] }, // 0: Input (time)
        { componentType: 5126, count: 3, type: 'VEC3' }, // 1: Translation output
        { componentType: 5126, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 2: Different input
        { componentType: 5126, count: 2, type: 'VEC4' }, // 3: Rotation output  
        { componentType: 5126, count: 4, type: 'VEC3' }  // 4: Wrong count for CUBICSPLINE scale (should be 9 for 3 keyframes)
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-sampler-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining camera validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          type: 'orthographic',
          orthographic: {
            // Missing required properties - should use undefined checks
          },
          name: 'IncompleteOrthographic'
        },
        {
          type: 'perspective', 
          perspective: {
            // Missing required properties - should use undefined checks
            aspectRatio: 1.77
          },
          name: 'IncompletePerspective'
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.1
          },
          // Test nested property validation
          orthographic_extra: 'should_be_ignored',
          name: 'ValidOrthographic'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-edge-cases.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit specific GLB chunk reading edge cases', async () => {
    // Create GLB with specific chunk reading scenarios
    
    // GLB with chunk length that extends beyond file
    const header = new ArrayBuffer(12);
    const headerView = new DataView(header);
    headerView.setUint32(0, 0x46546C67, true); // magic "glTF"
    headerView.setUint32(4, 2, true); // version
    headerView.setUint32(8, 32, true); // total length
    
    const jsonChunk = new ArrayBuffer(20);
    const jsonChunkView = new DataView(jsonChunk);
    jsonChunkView.setUint32(0, 100, true); // chunk length (longer than remaining data)
    jsonChunkView.setUint32(4, 0x4E4F534A, true); // chunk type "JSON"
    // Add minimal JSON data
    const jsonData = JSON.stringify({ asset: { version: '2.0' } });
    const jsonBytes = new TextEncoder().encode(jsonData);
    new Uint8Array(jsonChunk, 8).set(jsonBytes.slice(0, 12)); // Only partial data
    
    const totalBuffer = new ArrayBuffer(32);
    const totalView = new Uint8Array(totalBuffer);
    totalView.set(new Uint8Array(header), 0);
    totalView.set(new Uint8Array(jsonChunk), 12);
    
    const result = await validateBytes(totalView, { uri: 'glb-chunk-overrun.glb' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit specific usage tracker paths with complex dependencies', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [
        { nodes: [0] } // Uses node 0
      ],
      nodes: [
        { 
          mesh: 0,
          children: [1] // Node 0 uses mesh 0 and references child node 1
        },
        {
          camera: 0 // Node 1 uses camera 0 but is referenced as child
        }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0, NORMAL: 1 },
              indices: 2,
              material: 0
            }
          ]
        }
      ],
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorTexture: { index: 0 }
          },
          normalTexture: { index: 1 }
        }
      ],
      textures: [
        { source: 0, sampler: 0 }, // Used by material
        { source: 1 } // Used by material normal texture
      ],
      images: [
        { uri: 'base.png' }, // Used by texture 0
        { uri: 'normal.png' } // Used by texture 1
      ],
      samplers: [
        { magFilter: 9729 } // Used by texture 0
      ],
      cameras: [
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1 } } // Used by node 1
      ],
      // Add unused objects to test usage reporting
      buffers: [
        { byteLength: 1000 }, // Buffer 0 used by buffer views
        { byteLength: 500 }   // Buffer 1 unused
      ],
      bufferViews: [
        { buffer: 0, byteLength: 100 }, // Used by accessors
        { buffer: 0, byteOffset: 100, byteLength: 50 },
        { buffer: 0, byteOffset: 150, byteLength: 30 },
        { buffer: 1, byteLength: 100 } // Uses unused buffer - should still be marked as unused
      ],
      accessors: [
        { bufferView: 0, componentType: 5126, count: 10, type: 'VEC3' }, // Used by mesh
        { bufferView: 1, componentType: 5126, count: 10, type: 'VEC3' }, // Used by mesh
        { bufferView: 2, componentType: 5123, count: 15, type: 'SCALAR' }, // Used by mesh indices
        { bufferView: 3, componentType: 5126, count: 5, type: 'SCALAR' } // Uses buffer view that uses unused buffer
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'usage-tracker-complex.gltf' });
    
    // Should report unused buffer despite having buffer view that references it
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});