import { describe, it, expect } from 'vitest';
import { validateBytes } from '../../src/index';

describe('Comprehensive Coverage Tests', () => {
  // Test various GLTF structures to maximize code coverage
  
  it('should handle completely empty GLTF', async () => {
    const emptyGltf = {};
    const data = new TextEncoder().encode(JSON.stringify(emptyGltf));
    const result = await validateBytes(data, { uri: 'empty.gltf' });
    
    expect(result.issues.numErrors).toBeGreaterThan(0);
    expect(result.issues.messages.some(m => m.code === 'UNDEFINED_PROPERTY')).toBe(true);
  });

  it('should handle invalid JSON', async () => {
    const invalidJson = '{ "asset": { "version": "2.0" }';
    const data = new TextEncoder().encode(invalidJson);
    const result = await validateBytes(data, { uri: 'invalid.gltf' });
    
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should validate minimal valid GLTF', async () => {
    const minimalGltf = {
      asset: { version: '2.0' }
    };
    const data = new TextEncoder().encode(JSON.stringify(minimalGltf));
    const result = await validateBytes(data, { uri: 'minimal.gltf' });
    
    expect(result.issues.numErrors).toBe(0);
    expect(result.info.version).toBe('2.0');
  });

  it('should handle complex GLTF with all object types', async () => {
    const complexGltf = {
      asset: { 
        version: '2.0',
        generator: 'Test Suite',
        copyright: '© 2023'
      },
      scene: 0,
      scenes: [
        { 
          nodes: [0, 1],
          name: 'Main Scene' 
        },
        {
          nodes: [2],
          name: 'Secondary Scene'
        }
      ],
      nodes: [
        {
          name: 'Root',
          children: [2],
          translation: [1, 2, 3],
          mesh: 0
        },
        {
          name: 'Camera Node',
          camera: 0,
          rotation: [0, 0, 0, 1]
        },
        {
          name: 'Skinned Mesh',
          mesh: 1,
          skin: 0,
          scale: [2, 2, 2]
        },
        {
          name: 'Matrix Node',
          matrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 5,6,7,1]
        }
      ],
      meshes: [
        {
          name: 'Simple Mesh',
          primitives: [{
            attributes: {
              POSITION: 0,
              NORMAL: 1,
              TEXCOORD_0: 2
            },
            indices: 3,
            material: 0,
            mode: 4
          }]
        },
        {
          name: 'Morph Mesh',
          primitives: [{
            attributes: {
              POSITION: 4,
              NORMAL: 5
            },
            targets: [
              { POSITION: 6, NORMAL: 7 },
              { POSITION: 8 }
            ]
          }],
          weights: [0.5, 0.3]
        }
      ],
      materials: [
        {
          name: 'PBR Material',
          pbrMetallicRoughness: {
            baseColorFactor: [1, 0.5, 0.2, 1],
            baseColorTexture: { index: 0, texCoord: 0 },
            metallicFactor: 0.8,
            roughnessFactor: 0.2,
            metallicRoughnessTexture: { index: 1 }
          },
          normalTexture: { index: 2, scale: 1.5 },
          occlusionTexture: { index: 3, strength: 0.8 },
          emissiveTexture: { index: 0 },
          emissiveFactor: [0.1, 0.2, 0.3],
          alphaMode: 'BLEND',
          doubleSided: true
        },
        {
          name: 'Simple Material',
          alphaMode: 'MASK',
          alphaCutoff: 0.5
        }
      ],
      textures: [
        { source: 0, sampler: 0 },
        { source: 1, sampler: 1 },
        { source: 2 },
        { source: 0, sampler: 0 }
      ],
      images: [
        { uri: 'basecolor.png' },
        { uri: 'metallic.png' },
        { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }
      ],
      samplers: [
        {
          magFilter: 9729,
          minFilter: 9987,
          wrapS: 10497,
          wrapT: 33648
        },
        {
          magFilter: 9728,
          minFilter: 9728,
          wrapS: 33071,
          wrapT: 33071
        }
      ],
      cameras: [
        {
          name: 'Main Camera',
          type: 'perspective',
          perspective: {
            aspectRatio: 16/9,
            yfov: 0.785398,
            zfar: 1000,
            znear: 0.1
          }
        },
        {
          name: 'Ortho Camera',
          type: 'orthographic',
          orthographic: {
            xmag: 10,
            ymag: 10,
            zfar: 100,
            znear: 0.1
          }
        }
      ],
      skins: [
        {
          name: 'Character Skin',
          joints: [0, 2, 3],
          inverseBindMatrices: 9,
          skeleton: 0
        }
      ],
      animations: [
        {
          name: 'Walk Cycle',
          samplers: [
            {
              input: 10,
              output: 11,
              interpolation: 'LINEAR'
            },
            {
              input: 10,
              output: 12,
              interpolation: 'STEP'
            },
            {
              input: 13,
              output: 14,
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
              target: { node: 2, path: 'rotation' }
            },
            {
              sampler: 2,
              target: { node: 2, path: 'scale' }
            }
          ]
        }
      ],
      accessors: [
        // 0: positions
        {
          bufferView: 0,
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          min: [-1, -1, -1],
          max: [1, 1, 1]
        },
        // 1: normals
        {
          bufferView: 1,
          componentType: 5126,
          count: 100,
          type: 'VEC3'
        },
        // 2: texcoords
        {
          bufferView: 2,
          componentType: 5126,
          count: 100,
          type: 'VEC2'
        },
        // 3: indices
        {
          bufferView: 3,
          componentType: 5123,
          count: 300,
          type: 'SCALAR'
        },
        // 4-8: morph target data
        { bufferView: 4, componentType: 5126, count: 50, type: 'VEC3', min: [-0.5,-0.5,-0.5], max: [0.5,0.5,0.5] },
        { bufferView: 5, componentType: 5126, count: 50, type: 'VEC3' },
        { bufferView: 6, componentType: 5126, count: 50, type: 'VEC3' },
        { bufferView: 7, componentType: 5126, count: 50, type: 'VEC3' },
        { bufferView: 8, componentType: 5126, count: 50, type: 'VEC3' },
        // 9: inverse bind matrices
        {
          bufferView: 9,
          componentType: 5126,
          count: 3,
          type: 'MAT4'
        },
        // 10-14: animation data
        { bufferView: 10, componentType: 5126, count: 10, type: 'SCALAR' },
        { bufferView: 11, componentType: 5126, count: 10, type: 'VEC3' },
        { bufferView: 12, componentType: 5126, count: 10, type: 'VEC4' },
        { bufferView: 13, componentType: 5126, count: 5, type: 'SCALAR' },
        { bufferView: 14, componentType: 5126, count: 15, type: 'VEC3' } // 3x keyframes for cubic
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: 1200, target: 34962 },      // positions
        { buffer: 0, byteOffset: 1200, byteLength: 1200, target: 34962 },   // normals
        { buffer: 0, byteOffset: 2400, byteLength: 800, target: 34962 },    // texcoords
        { buffer: 0, byteOffset: 3200, byteLength: 600, target: 34963 },    // indices
        { buffer: 0, byteOffset: 3800, byteLength: 600, target: 34962 },    // morph pos 1
        { buffer: 0, byteOffset: 4400, byteLength: 600, target: 34962 },    // morph norm 1
        { buffer: 0, byteOffset: 5000, byteLength: 600, target: 34962 },    // morph pos 2
        { buffer: 0, byteOffset: 5600, byteLength: 600, target: 34962 },    // morph norm 2
        { buffer: 0, byteOffset: 6200, byteLength: 600, target: 34962 },    // morph pos 3
        { buffer: 0, byteOffset: 6800, byteLength: 192 },                   // IBM (3 * 16 * 4)
        { buffer: 0, byteOffset: 6992, byteLength: 40 },                    // anim times
        { buffer: 0, byteOffset: 7032, byteLength: 120 },                   // anim pos
        { buffer: 0, byteOffset: 7152, byteLength: 160 },                   // anim rot
        { buffer: 0, byteOffset: 7312, byteLength: 20 },                    // cubic times
        { buffer: 0, byteOffset: 7332, byteLength: 180 }                    // cubic values
      ],
      buffers: [
        { byteLength: 7512 }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(complexGltf));
    const result = await validateBytes(data, { uri: 'complex.gltf' });
    
    // Should have some statistics
    expect(result.info.animationCount).toBe(1);
    expect(result.info.materialCount).toBe(2);
    expect(result.info.hasTextures).toBe(true);
    expect(result.info.hasSkins).toBe(true);
    expect(result.info.hasMorphTargets).toBe(true);
  });

  it('should handle various error conditions', async () => {
    const errorGltf = {
      asset: { version: '1.0' }, // Unsupported version
      scenes: [{ nodes: [999] }], // Invalid node reference
      nodes: [
        { 
          mesh: 999, // Invalid mesh reference
          camera: 999, // Invalid camera reference
          skin: 999, // Invalid skin reference
          children: [0] // Self-reference
        }
      ],
      meshes: [
        {
          primitives: [] // Empty primitives
        },
        {
          primitives: [
            {
              attributes: {
                NORMAL: 0 // Missing POSITION
              },
              indices: 999, // Invalid accessor
              material: 999 // Invalid material
            }
          ]
        }
      ],
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorTexture: { index: 999 }, // Invalid texture
            metallicRoughnessTexture: { index: 999 }
          },
          normalTexture: { index: 999 },
          occlusionTexture: { index: 999 },
          emissiveTexture: { index: 999 }
        }
      ],
      textures: [
        {
          source: 999, // Invalid image
          sampler: 999 // Invalid sampler
        }
      ],
      accessors: [
        {
          bufferView: 999, // Invalid buffer view
          componentType: 12345, // Invalid component type
          count: 0, // Invalid count
          type: 'INVALID' // Invalid type
        }
      ],
      bufferViews: [
        {
          buffer: 999, // Invalid buffer
          byteLength: -1 // Invalid length
        }
      ],
      cameras: [
        {
          type: 'invalid' // Invalid type
        },
        {
          type: 'perspective'
          // Missing perspective properties
        },
        {
          type: 'orthographic'
          // Missing orthographic properties
        }
      ],
      skins: [
        {
          joints: [], // Empty joints
          inverseBindMatrices: 999 // Invalid accessor
        }
      ],
      animations: [
        {
          samplers: [], // Empty samplers
          channels: [] // Empty channels
        },
        {
          samplers: [
            {
              input: 999, // Invalid accessor
              output: 999, // Invalid accessor
              interpolation: 'INVALID' // Invalid interpolation
            }
          ],
          channels: [
            {
              sampler: 999, // Invalid sampler
              target: {
                node: 999, // Invalid node
                path: 'invalid' // Invalid path
              }
            }
          ]
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(errorGltf));
    const result = await validateBytes(data, { uri: 'errors.gltf' });
    
    expect(result.issues.numErrors).toBeGreaterThan(10);
  });

  it('should handle GLB format', async () => {
    const jsonData = JSON.stringify({ 
      asset: { version: '2.0' },
      buffers: [{ byteLength: 4 }]
    });
    const jsonChunk = new TextEncoder().encode(jsonData);
    const paddedJsonLength = Math.ceil(jsonChunk.length / 4) * 4;
    const paddedJsonChunk = new Uint8Array(paddedJsonLength);
    paddedJsonChunk.set(jsonChunk);
    for (let i = jsonChunk.length; i < paddedJsonLength; i++) {
      paddedJsonChunk[i] = 0x20;
    }

    const binData = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
    const totalLength = 12 + 8 + paddedJsonLength + 8 + 4;
    
    const buffer = new ArrayBuffer(totalLength);
    const view = new DataView(buffer);
    
    view.setUint32(0, 0x46546C67, true); // magic
    view.setUint32(4, 2, true); // version
    view.setUint32(8, totalLength, true); // length

    view.setUint32(12, paddedJsonLength, true);
    view.setUint32(16, 0x4E4F534A, true); // JSON
    new Uint8Array(buffer, 20).set(paddedJsonChunk);

    const binOffset = 20 + paddedJsonLength;
    view.setUint32(binOffset, 4, true);
    view.setUint32(binOffset + 4, 0x004E4942, true); // BIN
    new Uint8Array(buffer, binOffset + 8).set(binData);

    const result = await validateBytes(new Uint8Array(buffer), { uri: 'test.glb' });

    expect(result.mimeType).toBe('model/gltf-binary');
    expect(result.info.version).toBe('2.0');
  });

  it('should handle validation options', async () => {
    const gltf = {
      asset: { version: '1.0' }, // Will generate error
      buffers: [{ byteLength: 100 }] // Will be unused
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    
    // Test maxIssues
    const result1 = await validateBytes(data, { 
      uri: 'test.gltf',
      maxIssues: 1
    });
    expect(result1.issues.messages.length).toBeLessThanOrEqual(1);

    // Test ignoredIssues
    const result2 = await validateBytes(data, {
      uri: 'test.gltf',
      ignoredIssues: ['UNKNOWN_ASSET_MAJOR_VERSION']
    });
    expect(result2.issues.messages.every(m => m.code !== 'UNKNOWN_ASSET_MAJOR_VERSION')).toBe(true);
  });

  it('should handle data URIs and external resources', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          byteLength: 4,
          uri: 'data:application/octet-stream;base64,AAAAAA=='
        }
      ],
      images: [
        {
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'test.gltf' });
    
    expect(result.issues.numErrors).toBe(0);
  });

  it('should handle edge cases and malformed data', async () => {
    // Test various edge cases
    const edgeCases = [
      // Empty string
      '',
      // Just opening brace
      '{',
      // Null
      'null',
      // Array instead of object
      '[]',
      // Very deeply nested
      JSON.stringify({
        asset: { version: '2.0' },
        extras: {
          level1: { level2: { level3: { level4: { level5: 'deep' } } } }
        }
      })
    ];

    for (const testCase of edgeCases) {
      const data = new TextEncoder().encode(testCase);
      const result = await validateBytes(data, { uri: 'edge.gltf' });
      
      // Should not crash
      expect(result).toBeDefined();
      expect(result.uri).toBe('edge.gltf');
    }
  });
});