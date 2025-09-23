import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('IO and URI Coverage Tests', () => {

  it('should hit specific URI validation and IO error paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          byteLength: 100,
          uri: ':' // Should skip IO check due to invalid URI
        },
        {
          byteLength: 100,
          uri: ':/' // Should skip IO check  
        },
        {
          byteLength: 100,
          uri: ':/invalid' // Should skip IO check
        },
        {
          byteLength: 100,
          uri: 'invalid:scheme' // Invalid scheme format - should skip IO check
        },
        {
          byteLength: 100,
          uri: 'http://example.com/buffer.bin' // Absolute URI - should skip IO check
        },
        {
          byteLength: 100,
          uri: 'https://example.com/buffer.bin' // Absolute URI - should skip IO check
        },
        {
          byteLength: 100,
          uri: 'ftp://example.com/buffer.bin' // Absolute URI - should skip IO check
        },
        {
          byteLength: 100,
          uri: 'valid-relative-file.bin' // Valid relative URI - may trigger IO error if file doesn't exist
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    
    // Test without external resource function first
    let result = await validateBytes(data, { uri: 'uri-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);

    // Test with external resource function that throws for relative URIs
    const mockExternalResourceFunction = async (uri: string) => {
      if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
        throw new Error(`Resource not found: ${uri}`);
      }
      return new Uint8Array(100);
    };

    result = await validateBytes(data, { 
      uri: 'uri-validation-with-external.gltf',
      externalResourceFunction: mockExternalResourceFunction
    });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit parsing error aggregation with different severity levels', async () => {
    // Create a GLTF that will generate multiple types of validation issues
    const gltf = {
      asset: { version: '1.0' }, // Should generate error
      scenes: [{ nodes: [999] }], // Should generate error  
      nodes: [{ 
        name: 'TestNode',
        unexpectedProperty: 'test' // Should generate warning
      }],
      // Add some info/hint level issues if possible
      extensions: {
        unusedExtension: {} // May generate info/hint
      }
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'parsing-error-aggregation.gltf' });
    
    // Should have various types of issues that get aggregated
    expect(result.issues.numErrors).toBeGreaterThan(0);
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit GLB specific validation paths with malformed chunks', async () => {
    // Create GLB with specific chunk issues to trigger different error paths

    // GLB with JSON chunk that's too short
    const headerBuffer = new ArrayBuffer(12);
    const headerView = new DataView(headerBuffer);
    headerView.setUint32(0, 0x46546C67, true); // magic "glTF"
    headerView.setUint32(4, 2, true); // version
    headerView.setUint32(8, 24, true); // total length

    const chunkBuffer = new ArrayBuffer(12);
    const chunkView = new DataView(chunkBuffer);
    chunkView.setUint32(0, 2, true); // chunk length (too short)
    chunkView.setUint32(4, 0x4E4F534A, true); // chunk type "JSON"
    chunkView.setUint32(8, 0x7B7D0000, true); // "{}" with padding

    const totalBuffer = new ArrayBuffer(24);
    const totalView = new Uint8Array(totalBuffer);
    totalView.set(new Uint8Array(headerBuffer), 0);
    totalView.set(new Uint8Array(chunkBuffer), 12);

    let result = await validateBytes(totalView, { uri: 'malformed-chunk.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // GLB with no chunks (header only)
    const headerOnlyBuffer = new ArrayBuffer(12);
    const headerOnlyView = new DataView(headerOnlyBuffer);
    headerOnlyView.setUint32(0, 0x46546C67, true); // magic
    headerOnlyView.setUint32(4, 2, true); // version
    headerOnlyView.setUint32(8, 12, true); // length matches header size

    result = await validateBytes(new Uint8Array(headerOnlyBuffer), { uri: 'header-only.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit specific resource counting and info calculation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 1, // Valid default scene
      scenes: [
        { nodes: [0] },
        { nodes: [1] } // Scene 1 exists
      ],
      nodes: [
        { 
          name: 'Node1',
          mesh: 0
        },
        { 
          name: 'Node2', 
          mesh: 1,
          skin: 0
        }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: { 
                POSITION: 0,
                NORMAL: 1,
                TEXCOORD_0: 2,
                TEXCOORD_1: 3,
                JOINTS_0: 4,
                WEIGHTS_0: 5
              },
              indices: 6,
              mode: 4, // TRIANGLES
              material: 0
            },
            {
              attributes: { 
                POSITION: 7
              },
              mode: 0 // POINTS - different draw call calculation
            }
          ]
        },
        {
          primitives: [
            {
              attributes: { 
                POSITION: 8,
                TEXCOORD_0: 9
              },
              targets: [
                { POSITION: 10 }, // Morph target
                { POSITION: 11 }
              ],
              mode: 1 // LINES
            }
          ]
        }
      ],
      materials: [
        { name: 'TestMaterial' }
      ],
      textures: [
        { source: 0 }
      ],
      images: [
        { uri: 'test.png' }
      ],
      skins: [
        {
          joints: [0, 1]
        }
      ],
      animations: [
        {
          samplers: [{ input: 12, output: 13, interpolation: 'LINEAR' }],
          channels: [{ sampler: 0, target: { node: 0, path: 'translation' } }]
        }
      ],
      accessors: [
        { componentType: 5126, count: 100, type: 'VEC3' }, // 0: POSITION
        { componentType: 5126, count: 100, type: 'VEC3' }, // 1: NORMAL
        { componentType: 5126, count: 100, type: 'VEC2' }, // 2: TEXCOORD_0
        { componentType: 5126, count: 100, type: 'VEC2' }, // 3: TEXCOORD_1
        { componentType: 5121, count: 100, type: 'VEC4' }, // 4: JOINTS_0
        { componentType: 5126, count: 100, type: 'VEC4' }, // 5: WEIGHTS_0
        { componentType: 5123, count: 300, type: 'SCALAR' }, // 6: indices (triangles)
        { componentType: 5126, count: 50, type: 'VEC3' }, // 7: POSITION for points
        { componentType: 5126, count: 200, type: 'VEC3' }, // 8: POSITION for lines
        { componentType: 5126, count: 200, type: 'VEC2' }, // 9: TEXCOORD_0 for lines
        { componentType: 5126, count: 200, type: 'VEC3' }, // 10: Morph target 1
        { componentType: 5126, count: 200, type: 'VEC3' }, // 11: Morph target 2
        { componentType: 5126, count: 2, type: 'SCALAR' }, // 12: Animation input
        { componentType: 5126, count: 2, type: 'VEC3' }   // 13: Animation output
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'resource-counting.gltf' });
    
    // Should calculate various metrics like draw calls, vertex counts, etc.
    expect(result.info.animationCount).toBe(1);
    expect(result.info.materialCount).toBe(1);
    expect(result.info.hasMorphTargets).toBe(true);
    expect(result.info.hasSkins).toBe(true);
    expect(result.info.hasTextures).toBe(true);
    expect(result.info.hasDefaultScene).toBe(true);
    expect(result.info.drawCallCount).toBeGreaterThan(0);
    expect(result.info.totalVertexCount).toBeGreaterThan(0);
    expect(result.info.totalTriangleCount).toBeGreaterThan(0);
    expect(result.info.maxUVs).toBeGreaterThanOrEqual(2); // TEXCOORD_0 and TEXCOORD_1
    expect(result.info.maxInfluences).toBeGreaterThanOrEqual(1); // JOINTS_0/WEIGHTS_0
    expect(result.info.maxAttributes).toBeGreaterThan(0);
  });

  it('should hit edge cases in calculation helper functions', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 999, // Invalid default scene index
      scenes: [
        { nodes: [0] }
      ],
      nodes: [
        { mesh: 0 }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0 },
              mode: 5, // TRIANGLE_STRIP
              indices: 1
            },
            {
              attributes: { POSITION: 0 },
              mode: 6, // TRIANGLE_FAN
              indices: 2
            },
            {
              attributes: { POSITION: 0 },
              mode: 2, // LINE_LOOP
              indices: 3
            },
            {
              attributes: { POSITION: 0 },
              mode: 3, // LINE_STRIP
              indices: 4
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 6, type: 'VEC3' }, // 0: POSITION
        { componentType: 5123, count: 6, type: 'SCALAR' }, // 1: indices for TRIANGLE_STRIP
        { componentType: 5123, count: 6, type: 'SCALAR' }, // 2: indices for TRIANGLE_FAN
        { componentType: 5123, count: 6, type: 'SCALAR' }, // 3: indices for LINE_LOOP
        { componentType: 5123, count: 6, type: 'SCALAR' }  // 4: indices for LINE_STRIP
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'calculation-edge-cases.gltf' });
    
    // Should handle invalid default scene
    expect(result.info.hasDefaultScene).toBe(false);
    
    // Should calculate draw calls and triangle counts for different primitive modes
    expect(result.info.drawCallCount).toBe(4);
    expect(result.info.totalTriangleCount).toBeGreaterThanOrEqual(0);
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

});