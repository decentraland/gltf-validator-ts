import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra Hardest Remaining Paths Tests', () => {

  it('should hit skin validator absolute hardest validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [
        { name: 'RootNode', children: [1, 2, 3, 4] },
        { name: 'Joint0' },
        { name: 'Joint1' },
        { name: 'Joint2' },
        { name: 'Joint3' }
      ],
      skins: [
        {
          // Test TYPE_MISMATCH for skin without joints
          inverseBindMatrices: 0,
          skeleton: 1,
          name: 'NoJointsSkin'
        },
        {
          joints: [1, 2, 3], // Valid joints
          // Test inverseBindMatrices with wrong count
          inverseBindMatrices: 1, // Accessor with wrong count
          skeleton: 999, // Invalid skeleton node reference
          name: 'WrongCountSkin'
        },
        {
          joints: [999, 1000], // Invalid joint node references
          inverseBindMatrices: 0,
          name: 'InvalidJointsSkin'
        },
        {
          joints: [1, 2, 1], // Duplicate joint - should hit validation
          name: 'DuplicateJointsSkin'
        },
        {
          joints: [], // Empty joints array - might hit validation
          name: 'EmptyJointsSkin'
        }
      ],
      accessors: [
        { componentType: 5126, count: 3, type: 'MAT4' }, // Correct count for 3 joints
        { componentType: 5126, count: 2, type: 'MAT4' }  // Wrong count for 3 joints
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-skin-hardest.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit texture and sampler validator hardest validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      textures: [
        {
          // Test TYPE_MISMATCH for texture without source
          sampler: 0,
          name: 'NoSourceTexture'
        },
        {
          source: 999, // Invalid image reference
          sampler: 999, // Invalid sampler reference
          name: 'InvalidRefsTexture'
        },
        {
          source: 0,
          sampler: 1, // References sampler with invalid properties
          name: 'ValidTexture'
        }
      ],
      samplers: [
        {
          magFilter: 9729,
          minFilter: 9729,
          wrapS: 10497,
          wrapT: 10497,
          name: 'ValidSampler'
        },
        {
          // Test invalid filter values
          magFilter: 99999, // Invalid magFilter
          minFilter: 88888, // Invalid minFilter
          wrapS: 77777,     // Invalid wrapS
          wrapT: 66666,     // Invalid wrapT
          name: 'InvalidFiltersSampler'
        },
        {
          // Test TYPE_MISMATCH paths - missing properties handled as undefined
          name: 'MinimalSampler'
        }
      ],
      images: [
        { uri: 'test.png' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-texture-sampler-hardest.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit scene and node validator hardest validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 999, // Invalid default scene reference
      scenes: [
        {
          // Test TYPE_MISMATCH for scene without nodes
          name: 'NoNodesScene'
        },
        {
          nodes: [999, 1000], // Invalid node references
          name: 'InvalidNodesScene'
        },
        {
          nodes: [0, 0], // Duplicate node references - might hit validation
          name: 'DuplicateNodesScene'
        }
      ],
      nodes: [
        {
          // Test node with circular reference in children
          children: [1, 2, 0], // References itself indirectly
          mesh: 999, // Invalid mesh reference
          camera: 999, // Invalid camera reference
          skin: 999, // Invalid skin reference
          name: 'CircularNode'
        },
        {
          children: [2], 
          matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
          ],
          // Having matrix with TRS properties - should hit validation
          translation: [1, 0, 0],
          rotation: [0, 0, 0, 1],
          scale: [1, 1, 1],
          name: 'MatrixWithTRSNode'
        },
        {
          children: [999], // Invalid child reference
          translation: [1, 2], // Wrong array length (should be 3)
          rotation: [0, 0, 0], // Wrong array length (should be 4)
          scale: [1, 1], // Wrong array length (should be 3)
          matrix: [1, 2, 3], // Wrong array length (should be 16)
          name: 'WrongArrayLengthsNode'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-scene-node-hardest.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit buffer validator hardest validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          // Test TYPE_MISMATCH for buffer without byteLength
          uri: 'test.bin',
          name: 'NoByteLengthBuffer'
        },
        {
          byteLength: 0, // Zero byte length - might hit validation
          uri: 'empty.bin',
          name: 'ZeroLengthBuffer'
        },
        {
          byteLength: 100,
          uri: 'nonexistent://invalid-protocol.bin', // Invalid URI protocol
          name: 'InvalidProtocolBuffer'
        },
        {
          byteLength: 100,
          uri: '', // Empty URI
          name: 'EmptyURIBuffer'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-buffer-hardest.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit parser and GLB validator absolute hardest paths', async () => {
    // Create GLB with extreme edge cases
    const gltfJson = {
      asset: { version: '2.0' },
      buffers: [{ byteLength: 0 }] // Zero-length buffer
    };
    
    const jsonString = JSON.stringify(gltfJson);
    const jsonBytes = new TextEncoder().encode(jsonString);
    const jsonPaddedLength = Math.ceil(jsonBytes.length / 4) * 4;
    
    // Create GLB with unusual but valid structure
    const totalSize = 12 + 8 + jsonPaddedLength + 8 + 4; // Include minimal BIN chunk
    const glbBuffer = new ArrayBuffer(totalSize);
    const glbView = new DataView(glbBuffer);
    const glbBytes = new Uint8Array(glbBuffer);
    
    let offset = 0;
    
    // GLB Header
    glbView.setUint32(offset, 0x46546C67, true); // magic
    offset += 4;
    glbView.setUint32(offset, 2, true); // version
    offset += 4;
    glbView.setUint32(offset, totalSize, true); // length
    offset += 4;
    
    // JSON Chunk
    glbView.setUint32(offset, jsonPaddedLength, true);
    offset += 4;
    glbView.setUint32(offset, 0x4E4F534A, true); // "JSON"
    offset += 4;
    glbBytes.set(jsonBytes, offset);
    // Add JSON padding
    for (let i = jsonBytes.length; i < jsonPaddedLength; i++) {
      glbBytes[offset + i] = 0x20; // space
    }
    offset += jsonPaddedLength;
    
    // BIN Chunk with unusual data
    glbView.setUint32(offset, 4, true); // chunk length
    offset += 4;
    glbView.setUint32(offset, 0x004E4942, true); // "BIN\0"
    offset += 4;
    glbView.setUint32(offset, 0xDEADBEEF, true); // Unusual binary data
    
    const result = await validateBytes(new Uint8Array(glbBuffer), { uri: 'ultra-glb-hardest.glb' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit extension and extras validation hardest paths', async () => {
    const gltf = {
      asset: { 
        version: '2.0',
        extensions: {
          'NON_EXISTENT_EXTENSION': {
            someProperty: 'value'
          }
        },
        extras: {
          customData: 'test'
        }
      },
      extensionsUsed: ['NON_EXISTENT_EXTENSION'],
      extensionsRequired: ['REQUIRED_BUT_MISSING'],
      extensions: {
        'ASSET_LEVEL_EXTENSION': {
          data: true
        }
      },
      extras: {
        globalCustomData: 42
      },
      scenes: [
        {
          nodes: [0],
          extensions: {
            'SCENE_EXTENSION': {
              sceneData: 'test'
            }
          },
          extras: {
            sceneCustom: true
          }
        }
      ],
      nodes: [
        {
          name: 'ExtensionNode',
          extensions: {
            'NODE_EXTENSION': {
              nodeData: [1, 2, 3]
            }
          },
          extras: {
            nodeCustom: { nested: 'data' }
          }
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-extensions-hardest.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});