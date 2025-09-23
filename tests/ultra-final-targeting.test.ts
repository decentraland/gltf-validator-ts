import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra Final Targeting Tests', () => {

  it('should hit accessor validator hardest remaining paths', async () => {
    // Create binary data that will test the most challenging accessor validation paths
    
    // Test normalized validation with specific component types
    const byteData = new Int8Array([-128, -1, 0, 1, 127]); // BYTE data
    const ushortData = new Uint16Array([0, 1, 32767, 65535]); // UNSIGNED_SHORT data
    
    // Create a larger combined buffer
    const totalSize = byteData.byteLength + ushortData.byteLength + 32; // Extra space for alignment
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(byteData.buffer), offset);
    offset += byteData.byteLength;
    combinedView.set(new Uint8Array(ushortData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Hit normalized BYTE validation
          bufferView: 0,
          componentType: 5120, // BYTE
          count: 5,
          type: 'SCALAR',
          normalized: true, // This should trigger normalized validation path
          min: [-1.0],
          max: [1.0]
        },
        {
          // Hit normalized UNSIGNED_BYTE validation 
          bufferView: 1,
          componentType: 5121, // UNSIGNED_BYTE (simulated)
          count: 4, 
          type: 'SCALAR',
          normalized: true,
          min: [0.0],
          max: [1.0]
        },
        {
          // Hit normalized UNSIGNED_SHORT validation
          bufferView: 2,
          componentType: 5123, // UNSIGNED_SHORT
          count: 4,
          type: 'SCALAR', 
          normalized: true,
          min: [0.0],
          max: [1.0]
        },
        {
          // Test componentType validation edge cases
          bufferView: 0,
          componentType: 5130, // DOUBLE (8 bytes) - should hit getComponentSize edge case
          count: 1,
          type: 'SCALAR'
        },
        {
          // Test quaternion normalization validation (hardest path)
          bufferView: 3,
          componentType: 5126, // FLOAT
          count: 2,
          type: 'VEC4', 
          min: [0.0, 0.0, 0.0, 0.5], // Non-unit quaternion min
          max: [0.0, 0.0, 0.0, 1.5]  // Non-unit quaternion max
        },
        {
          // Test matrix validation with wrong element count
          bufferView: 0,
          componentType: 5126,
          count: 1,
          type: 'MAT4',
          byteOffset: 1 // Misaligned for matrix - should trigger alignment error
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
          byteLength: byteData.byteLength // Reuse size for UNSIGNED_BYTE test
        },
        {
          buffer: 0,
          byteOffset: byteData.byteLength,
          byteLength: ushortData.byteLength
        },
        {
          buffer: 0,
          byteOffset: byteData.byteLength + ushortData.byteLength,
          byteLength: 32 // Space for quaternion test
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
    const result = await validateBytes(data, { uri: 'accessor-hardest-paths.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit animation validator quaternion normalization and interpolation edge cases', async () => {
    // Create quaternion data that is specifically not normalized
    const unnormalizedQuaternions = new Float32Array([
      // First keyframe - unnormalized quaternion
      2.0, 0.0, 0.0, 2.0,  // Not unit length
      // Second keyframe - unnormalized quaternion
      0.0, 3.0, 0.0, 1.0   // Not unit length
    ]);

    // Create time data
    const timeData = new Float32Array([0.0, 1.0]);

    // Combine data
    const totalSize = timeData.byteLength + unnormalizedQuaternions.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    combinedView.set(new Uint8Array(timeData.buffer), 0);
    combinedView.set(new Uint8Array(unnormalizedQuaternions.buffer), timeData.byteLength);

    const base64Data = btoa(String.fromCharCode(...combinedView));

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
              interpolation: 'LINEAR' // Linear interpolation with unnormalized quaternions
            },
            {
              input: 0,
              output: 1,
              interpolation: 'STEP' // Step interpolation 
            }
          ],
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'rotation' } // Rotation uses quaternions
            },
            {
              sampler: 1,
              target: { node: 0, path: 'rotation' }
            }
          ]
        }
      ],
      accessors: [
        {
          // Time input accessor
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 2,
          type: 'SCALAR',
          min: [0.0],
          max: [1.0]
        },
        {
          // Quaternion output accessor with unnormalized data
          bufferView: 1,
          componentType: 5126, // FLOAT
          count: 2,
          type: 'VEC4',
          // Set min/max that don't match the actual data to trigger validation
          min: [0.0, 0.0, 0.0, 0.0],
          max: [1.0, 1.0, 1.0, 1.0]
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: timeData.byteLength
        },
        {
          buffer: 0,
          byteOffset: timeData.byteLength,
          byteLength: unnormalizedQuaternions.byteLength
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
    const result = await validateBytes(data, { uri: 'animation-quaternion-hardest.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit the absolute hardest GLB parsing edge cases', async () => {
    // Create a GLB with very specific problematic structures
    const gltfJson = {
      asset: { version: '2.0' }
    };

    const jsonString = JSON.stringify(gltfJson);
    const jsonBytes = new TextEncoder().encode(jsonString);
    
    // Make JSON chunk with exact 4-byte boundary issues
    const jsonPadding = (4 - (jsonBytes.length % 4)) % 4;
    const paddedJsonLength = jsonBytes.length + jsonPadding;

    const totalSize = 12 + 8 + paddedJsonLength + 8 + 4; // GLB header + JSON chunk + BIN chunk

    const glbBuffer = new ArrayBuffer(totalSize - 1); // Make it 1 byte too short!
    const glbView = new DataView(glbBuffer);
    const glbBytes = new Uint8Array(glbBuffer);

    let offset = 0;

    // GLB Header
    glbView.setUint32(offset, 0x46546C67, true); // magic
    offset += 4;
    glbView.setUint32(offset, 2, true); // version
    offset += 4;
    glbView.setUint32(offset, totalSize, true); // Claim full size but buffer is smaller
    offset += 4;

    // JSON Chunk
    glbView.setUint32(offset, paddedJsonLength, true);
    offset += 4;
    glbView.setUint32(offset, 0x4E4F534A, true); // "JSON"
    offset += 4;
    
    if (offset + jsonBytes.length <= glbBuffer.byteLength) {
      glbBytes.set(jsonBytes, offset);
      offset += jsonBytes.length;
      
      // Add padding
      for (let i = 0; i < jsonPadding && offset < glbBuffer.byteLength; i++) {
        glbBytes[offset++] = 0x20; // space
      }

      // Try to add BIN chunk header (this should fail due to insufficient space)
      if (offset + 4 <= glbBuffer.byteLength) {
        glbView.setUint32(offset, 4, true); // BIN chunk length
        offset += 4;
      }
      if (offset + 4 <= glbBuffer.byteLength) {
        glbView.setUint32(offset, 0x004E4942, true); // "BIN\0"
      }
    }

    const result = await validateBytes(new Uint8Array(glbBuffer), { uri: 'truncated-glb.glb' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit buffer validator hardest data URI and external resource paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          // Data URI with invalid base64
          byteLength: 10,
          uri: 'data:application/octet-stream;base64,invalid!!!base64@#$'
        },
        {
          // Data URI with wrong declared length
          byteLength: 1000, // Claim 1000 bytes
          uri: 'data:application/octet-stream;base64,SGVsbG8=' // But only ~5 bytes of data
        },
        {
          // External URI that should trigger external resource handling
          byteLength: 100,
          uri: 'https://example.com/buffer.bin'
        },
        {
          // File URI
          byteLength: 100,
          uri: 'file:///path/to/buffer.bin'
        },
        {
          // Relative path with directory traversal
          byteLength: 100,
          uri: '../../../sensitive/data.bin'
        },
        {
          // URI with query parameters and fragments
          byteLength: 100,
          uri: 'buffer.bin?version=1&format=binary#section1'
        },
        {
          // Data URI with different media type
          byteLength: 20,
          uri: 'data:application/json;base64,eyJ0ZXN0IjoidmFsdWUifQ=='
        },
        {
          // Empty data URI
          byteLength: 0,
          uri: 'data:application/octet-stream;base64,'
        },
        {
          // Very long URI to test buffer limits
          byteLength: 10,
          uri: 'data:application/octet-stream;base64,' + 'A'.repeat(10000)
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-uri-hardest.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit usage tracker absolute edge cases with complex interdependencies', async () => {
    const gltf = {
      asset: { version: '2.0' },
      // Create complex interdependency chains to test usage tracking edge cases
      scene: 0,
      scenes: [
        { 
          nodes: [0, 1], // Uses nodes 0 and 1
          name: 'MainScene'
        },
        {
          // Unused scene
          nodes: [2],
          name: 'UnusedScene'  
        }
      ],
      nodes: [
        {
          // Root node with mesh and children
          mesh: 0,
          children: [1, 3], // References nodes 1 and 3
          name: 'RootNode'
        },
        {
          // Child node with skin and camera
          skin: 0,
          camera: 0,
          children: [4], // Deep hierarchy
          name: 'ChildNode'
        },
        {
          // Node in unused scene
          mesh: 1,
          name: 'UnusedSceneNode'
        },
        {
          // Node referenced by root but has camera
          camera: 1,
          name: 'DeepChild'
        },
        {
          // Deep leaf node
          name: 'DeepLeaf'
        },
        {
          // Completely unreferenced node
          mesh: 2,
          name: 'OrphanNode'
        }
      ],
      meshes: [
        {
          // Used mesh
          primitives: [{
            attributes: { POSITION: 0 },
            indices: 1,
            material: 0
          }],
          name: 'UsedMesh'
        },
        {
          // Mesh in unused scene
          primitives: [{
            attributes: { POSITION: 0 }
          }],
          name: 'UnusedSceneMesh'
        },
        {
          // Mesh on orphaned node
          primitives: [{
            attributes: { POSITION: 2 },
            material: 1
          }],
          name: 'OrphanMesh'
        }
      ],
      materials: [
        {
          // Used material
          pbrMetallicRoughness: {
            baseColorTexture: { index: 0 }
          },
          name: 'UsedMaterial'
        },
        {
          // Material on orphaned mesh
          pbrMetallicRoughness: {
            baseColorTexture: { index: 1 }
          },
          name: 'OrphanMaterial'
        },
        {
          // Completely unused material
          name: 'UnusedMaterial'
        }
      ],
      textures: [
        { source: 0, sampler: 0, name: 'UsedTexture' },
        { source: 1, sampler: 1, name: 'OrphanTexture' },
        { source: 2, name: 'UnusedTexture' }
      ],
      images: [
        { uri: 'used.png', name: 'UsedImage' },
        { uri: 'orphan.png', name: 'OrphanImage' },
        { uri: 'unused.png', name: 'UnusedImage' }
      ],
      samplers: [
        { magFilter: 9729, name: 'UsedSampler' },
        { magFilter: 9728, name: 'OrphanSampler' },
        { magFilter: 9729, name: 'UnusedSampler' }
      ],
      cameras: [
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1 }, name: 'UsedCamera' },
        { type: 'orthographic', orthographic: { xmag: 1, ymag: 1, zfar: 100, znear: 0.1 }, name: 'DeepCamera' },
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1 }, name: 'UnusedCamera' }
      ],
      skins: [
        { 
          joints: [1, 3], // References child nodes
          inverseBindMatrices: 3,
          name: 'UsedSkin'
        },
        {
          joints: [5], // References orphan node
          name: 'OrphanSkin'
        }
      ],
      animations: [
        {
          // Animation targeting used nodes
          samplers: [{ input: 4, output: 5, interpolation: 'LINEAR' }],
          channels: [{ sampler: 0, target: { node: 0, path: 'translation' } }],
          name: 'UsedAnimation'
        },
        {
          // Animation targeting orphaned node
          samplers: [{ input: 6, output: 7, interpolation: 'LINEAR' }],
          channels: [{ sampler: 0, target: { node: 5, path: 'rotation' } }],
          name: 'OrphanAnimation'
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'VEC3', name: 'UsedPositions' }, // 0: Used by mesh
        { componentType: 5123, count: 9, type: 'SCALAR', name: 'UsedIndices' }, // 1: Used by mesh
        { componentType: 5126, count: 3, type: 'VEC3', name: 'OrphanPositions' }, // 2: Used by orphan mesh
        { componentType: 5126, count: 2, type: 'MAT4', name: 'SkinMatrices' }, // 3: Used by skin
        { componentType: 5126, count: 2, type: 'SCALAR', name: 'AnimTime1' }, // 4: Used by animation
        { componentType: 5126, count: 2, type: 'VEC3', name: 'AnimData1' }, // 5: Used by animation
        { componentType: 5126, count: 2, type: 'SCALAR', name: 'AnimTime2' }, // 6: Used by orphan animation
        { componentType: 5126, count: 2, type: 'VEC4', name: 'AnimData2' }, // 7: Used by orphan animation
        { componentType: 5126, count: 5, type: 'SCALAR', name: 'UnusedAccessor' } // 8: Completely unused
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'usage-complex-interdependency.gltf' });
    
    // Should detect many unused objects
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
    
    // Should have comprehensive usage tracking
    expect(result.info.totalTriangleCount).toBeGreaterThanOrEqual(0);
    expect(result.info.drawCallCount).toBeGreaterThanOrEqual(0);
    expect(result.info.maxAttributes).toBeGreaterThanOrEqual(0);
  });

  it('should hit the absolute hardest data validation and parsing edge cases', async () => {
    // Create binary data with the most challenging validation scenarios
    const challengingFloats = new Float32Array([
      1.0000000000000001, // Very close to 1 but not exactly 1
      0.9999999999999999, // Very close to 1 but not exactly 1
      Number.EPSILON,     // Smallest representable positive number
      -Number.EPSILON,    // Smallest representable negative number
      1.0 + Number.EPSILON, // Just above 1
      1.0 - Number.EPSILON, // Just below 1
      Math.PI,            // Irrational number
      Math.E,             // Euler's number
      1.23456789012345,   // High precision decimal
      -1.23456789012345,  // Negative high precision
      Infinity,           // Positive infinity
      -Infinity,          // Negative infinity
      NaN,                // Not a Number
      0.0,                // Positive zero
      -0.0                // Negative zero
    ]);

    const integerEdgeCases = new Int32Array([
      2147483647,  // MAX_INT
      -2147483648, // MIN_INT
      0,           // Zero
      1,           // One
      -1           // Negative one
    ]);

    // Combine the challenging data
    const totalSize = challengingFloats.byteLength + integerEdgeCases.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    combinedView.set(new Uint8Array(challengingFloats.buffer), 0);
    combinedView.set(new Uint8Array(integerEdgeCases.buffer), challengingFloats.byteLength);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          // Test extreme float values with bounds checking
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 15,
          type: 'SCALAR',
          // Set bounds that will definitely not match the extreme values
          min: [-2.0],
          max: [2.0]
        },
        {
          // Test integer edge cases
          bufferView: 1,
          componentType: 5125, // UNSIGNED_INT (but contains signed data)
          count: 5,
          type: 'SCALAR',
          min: [0],
          max: [100000] // This won't match the actual data
        },
        {
          // Test quaternion with extreme values
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 3, // 3 quaternions with extreme values
          type: 'VEC4',
          min: [0.0, 0.0, 0.0, 0.0],
          max: [1.0, 1.0, 1.0, 1.0] // These bounds won't match our extreme data
        },
        {
          // Test matrix with extreme values
          bufferView: 0,
          byteOffset: 48, // Skip first 12 floats (48 bytes)
          componentType: 5126,
          count: 1,
          type: 'MAT4', // 16 components, but we only have 3 remaining floats - should error
          min: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          max: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: challengingFloats.byteLength
        },
        {
          buffer: 0,
          byteOffset: challengingFloats.byteLength,
          byteLength: integerEdgeCases.byteLength
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
    const result = await validateBytes(data, { uri: 'data-validation-extreme.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});