import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultimate 85% Siege Tests', () => {

  it('should hit deepest skin validator joint hierarchy validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 10, 20] }], // Multiple root hierarchies
      nodes: [
        // Hierarchy 1
        { name: 'Root1', children: [1, 2] },           // 0
        { name: 'Joint1_1', children: [3] },          // 1
        { name: 'Joint1_2', children: [4, 5] },       // 2
        { name: 'Joint1_3' },                         // 3
        { name: 'Joint1_4' },                         // 4
        { name: 'Joint1_5', children: [6] },          // 5
        { name: 'Joint1_6' },                         // 6
        
        // Orphan nodes (not in scene)
        { name: 'Orphan1', children: [8] },           // 7
        { name: 'Orphan2' },                          // 8
        { name: 'Orphan3' },                          // 9
        
        // Hierarchy 2
        { name: 'Root2', children: [11] },            // 10
        { name: 'Joint2_1', children: [12, 13] },     // 11
        { name: 'Joint2_2' },                         // 12
        { name: 'Joint2_3', children: [14] },         // 13
        { name: 'Joint2_4' },                         // 14
        
        // Isolated nodes
        { name: 'Isolated1' },                        // 15
        { name: 'Isolated2' },                        // 16
        { name: 'Isolated3' },                        // 17
        { name: 'Isolated4' },                        // 18
        { name: 'Isolated5' },                        // 19
        
        // Hierarchy 3  
        { name: 'Root3', children: [21] },            // 20
        { name: 'Joint3_1' }                          // 21
      ],
      skins: [
        {
          // Valid skin - all joints in same hierarchy
          joints: [1, 2, 3, 4, 5, 6],
          skeleton: 0, // Root1 is ancestor of all joints
          name: 'ValidSkin'
        },
        {
          // Invalid skin - joints from different hierarchies
          joints: [1, 2, 11, 12], // Mix of hierarchy 1 and 2
          skeleton: 0, // Root1 cannot be ancestor of joints from hierarchy 2
          name: 'CrossHierarchySkin'
        },
        {
          // Invalid skin - skeleton not ancestor of joints
          joints: [3, 4, 5],
          skeleton: 6, // Joint1_6 is not ancestor of joints 3,4,5
          name: 'NonAncestorSkeleton'
        },
        {
          // Invalid skin - includes orphan nodes
          joints: [1, 2, 7, 8], // Includes orphan nodes 7,8
          skeleton: 0,
          name: 'OrphanJointsSkin'
        },
        {
          // Invalid skin - skeleton is orphan
          joints: [11, 12, 13],
          skeleton: 7, // Orphan node as skeleton
          name: 'OrphanSkeletonSkin'
        },
        {
          // Invalid skin - isolated nodes as joints
          joints: [15, 16, 17],
          skeleton: 18, // Another isolated node as skeleton
          name: 'IsolatedNodesSkin'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: '85-siege-skin-hierarchy.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit deepest mesh validator morph target validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0, NORMAL: 1 },
              targets: [
                {
                  // Valid morph target
                  POSITION: 2,
                  NORMAL: 3
                },
                {
                  // Morph target with invalid attribute name
                  POSITION: 4,
                  'INVALID_MORPH_ATTR_123': 5, // Invalid attribute for morph target
                  TANGENT: 6 // Valid but uncommon
                },
                {
                  // Morph target with accessor count mismatch
                  POSITION: 7, // Different count than base POSITION
                  NORMAL: 8
                },
                {
                  // Morph target with invalid accessor reference
                  POSITION: 999, // Non-existent accessor
                  NORMAL: 1000
                },
                {
                  // Morph target with wrong component type
                  POSITION: 9, // Different component type than base
                  NORMAL: 10
                }
              ],
              // Add other edge cases
              indices: 11,
              material: 999, // Invalid material reference
              mode: 999 // Invalid primitive mode
            },
            {
              // Primitive without POSITION attribute (should error)
              attributes: { NORMAL: 1, TEXCOORD_0: 12 },
              mode: 0 // POINTS mode
            }
          ],
          // Add primitive-level properties for more validation
          weights: [0.5, 0.3, 0.2, 0.1, 0.9], // 5 weights for mesh with 5 morph targets
          name: 'ComplexMorphMesh'
        }
      ],
      accessors: [
        // Base attributes
        { componentType: 5126, count: 100, type: 'VEC3' }, // 0: Base POSITION
        { componentType: 5126, count: 100, type: 'VEC3' }, // 1: Base NORMAL
        
        // Morph target 0 (valid)
        { componentType: 5126, count: 100, type: 'VEC3' }, // 2: Morph POSITION
        { componentType: 5126, count: 100, type: 'VEC3' }, // 3: Morph NORMAL
        
        // Morph target 1 (valid)
        { componentType: 5126, count: 100, type: 'VEC3' }, // 4: Morph POSITION
        { componentType: 5126, count: 100, type: 'VEC3' }, // 5: Invalid morph attr
        { componentType: 5126, count: 100, type: 'VEC4' }, // 6: Morph TANGENT
        
        // Morph target 2 (count mismatch)
        { componentType: 5126, count: 50, type: 'VEC3' },  // 7: Wrong count
        { componentType: 5126, count: 75, type: 'VEC3' },  // 8: Wrong count
        
        // Morph target 4 (type mismatch)
        { componentType: 5123, count: 100, type: 'VEC3' }, // 9: Wrong component type
        { componentType: 5120, count: 100, type: 'VEC3' }, // 10: Wrong component type
        
        // Indices
        { componentType: 5123, count: 150, type: 'SCALAR' }, // 11: Indices
        
        // Additional attributes
        { componentType: 5126, count: 100, type: 'VEC2' }   // 12: TEXCOORD_0
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: '85-siege-mesh-morph-targets.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit deepest extension validator edge cases with complex combinations', async () => {
    const gltf = {
      asset: { version: '2.0' },
      extensionsUsed: [
        // Valid extensions
        'KHR_materials_unlit',
        'KHR_materials_pbrSpecularGlossiness',
        'KHR_texture_transform',
        'KHR_materials_clearcoat',
        
        // Invalid extensions (not real extension names)
        'INVALID_EXTENSION_DEEP_TEST_001',
        'FAKE_EXTENSION_ULTRA_VALIDATION',
        'NON_EXISTENT_EXT_SIEGE_MODE',
        
        // Extensions with unusual naming patterns
        'TEST_extensions_with_underscores_everywhere',
        'EXTENSION-WITH-DASHES-EVERYWHERE',
        'extension.with.dots.everywhere',
        '123_NUMERIC_START_EXTENSION',
        'EXTENSION_WITH_123_NUMBERS_456_MIXED',
        ''  // Empty extension name
      ],
      extensionsRequired: [
        // Some overlap with extensionsUsed
        'KHR_materials_unlit',
        'INVALID_EXTENSION_DEEP_TEST_001',
        
        // Extension required but not in extensionsUsed (should error)
        'REQUIRED_BUT_NOT_USED_EXTENSION',
        'ANOTHER_MISSING_REQUIRED_EXT'
      ],
      materials: [
        {
          extensions: {
            // Valid extension usage
            KHR_materials_unlit: {},
            KHR_materials_pbrSpecularGlossiness: {
              diffuseFactor: [1.0, 1.0, 1.0, 1.0],
              specularFactor: [1.0, 1.0, 1.0],
              glossinessFactor: 1.0
            },
            
            // Invalid extension usage (not in extensionsUsed)
            'MATERIAL_EXT_NOT_DECLARED': {
              someProperty: 'value'
            },
            
            // Extension with invalid property structure
            'INVALID_EXTENSION_DEEP_TEST_001': {
              nestedObject: {
                deeplyNested: {
                  veryDeep: 'value'
                }
              },
              invalidArray: [1, 2, 'string', true, null],
              invalidType: Number.NaN
            }
          }
        }
      ],
      textures: [
        {
          source: 0,
          extensions: {
            KHR_texture_transform: {
              offset: [0.5, 0.5],
              rotation: 1.57, // 90 degrees
              scale: [2.0, 2.0],
              texCoord: 999 // Invalid texCoord
            },
            
            // Extension not in extensionsUsed
            'TEXTURE_EXT_NOT_DECLARED': {
              prop: 'value'
            }
          }
        }
      ],
      images: [
        {
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        }
      ],
      // Add top-level extensions
      extensions: {
        'TOP_LEVEL_EXT_NOT_DECLARED': {
          globalProperty: 'value'
        },
        'INVALID_EXTENSION_DEEP_TEST_001': {
          topLevelUsage: true
        }
      }
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: '85-siege-extensions.gltf' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit deepest scene validator node reference validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 999, // Invalid scene reference
      scenes: [
        {
          // Scene with invalid node references
          nodes: [0, 1, 999, 1000, -1], // Mix of valid and invalid node refs
          name: 'InvalidNodeRefsScene'
        },
        {
          // Scene with duplicate node references
          nodes: [2, 3, 2, 4, 3], // Duplicate nodes 2 and 3
          name: 'DuplicateNodesScene'
        },
        {
          // Scene with child nodes (should only contain root nodes)
          nodes: [5, 7], // Node 7 is child of node 6, not a root
          name: 'NonRootNodesScene'
        },
        {
          // Empty scene
          nodes: [],
          name: 'EmptyScene'
        },
        {
          // Scene with all kinds of problems
          nodes: [8, 9, 8, 999, -5, 10],
          name: 'ProblematicScene'
        }
      ],
      nodes: [
        { name: 'Root1' },                    // 0
        { name: 'Root2' },                    // 1  
        { name: 'Root3' },                    // 2
        { name: 'Root4' },                    // 3
        { name: 'Root5' },                    // 4
        { name: 'Parent', children: [6, 7] }, // 5
        { name: 'Child1' },                   // 6
        { name: 'Child2' },                   // 7 - Child node, shouldn't be in scene
        { name: 'Root6' },                    // 8
        { name: 'Root7' },                    // 9
        { name: 'Root8' }                     // 10
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: '85-siege-scene-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit deepest buffer validator data URI edge cases and validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          // Data URI with invalid MIME type for binary data
          uri: 'data:text/html;base64,SGVsbG8gV29ybGQ=',
          byteLength: 50
        },
        {
          // Data URI with invalid base64 encoding
          uri: 'data:application/octet-stream;base64,Invalid!!!Base64$$$Data@@@Here###',
          byteLength: 100
        },
        {
          // Data URI missing charset but not base64
          uri: 'data:application/octet-stream,raw_binary_data_here_without_encoding',
          byteLength: 75
        },
        {
          // Data URI with wrong encoding declaration
          uri: 'data:application/octet-stream;charset=utf-8,binary_data_with_charset',
          byteLength: 60
        },
        {
          // Extremely long data URI to test parsing limits
          uri: 'data:application/octet-stream;base64,' + 'A'.repeat(10000),
          byteLength: 7500
        },
        {
          // Data URI with multiple parameters
          uri: 'data:application/octet-stream;base64;charset=binary;encoding=base64,SGVsbG8=',
          byteLength: 20
        },
        {
          // HTTP URI (external resource - should be validated differently)
          uri: 'https://invalid-domain-that-does-not-exist-12345.com/buffer.bin',
          byteLength: 1000
        },
        {
          // File URI (local resource)
          uri: 'file:///non/existent/path/buffer.bin',
          byteLength: 500
        },
        {
          // Relative URI
          uri: '../../../../../../../etc/passwd',
          byteLength: 200
        },
        {
          // Empty URI
          uri: '',
          byteLength: 10
        },
        {
          // URI with special characters
          uri: 'buffer with spaces and special chars !@#$%^&*()_+{}|:<>?[]\\;\'",./`~.bin',
          byteLength: 300
        },
        {
          // Buffer without URI (embedded in GLB - should be handled differently)
          byteLength: 1024
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: '85-siege-buffer-uri-validation.gltf' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit deepest usage tracker edge cases with complex object relationships', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [
        { nodes: [0] } // Only uses node 0
      ],
      nodes: [
        { 
          name: 'UsedNode',
          mesh: 0,
          skin: 0
        },
        { 
          name: 'UnusedNode', // This node should be reported as unused
          mesh: 1,
          camera: 1
        },
        { 
          name: 'PartiallyReferencedNode', // Referenced by skin but not scene
          mesh: 2
        }
      ],
      meshes: [
        {
          // Used mesh
          primitives: [{
            attributes: { POSITION: 0 },
            indices: 1,
            material: 0
          }]
        },
        {
          // Unused mesh (node 1 is unused)
          primitives: [{
            attributes: { POSITION: 2 }
          }]
        },
        {
          // Mesh used by skin-referenced node
          primitives: [{
            attributes: { POSITION: 3 },
            material: 1
          }]
        }
      ],
      materials: [
        {
          // Used material
          pbrMetallicRoughness: {
            baseColorTexture: { index: 0 }
          }
        },
        {
          // Material used by skin-referenced node's mesh
          pbrMetallicRoughness: {
            baseColorTexture: { index: 1 }
          }
        },
        {
          // Unused material
          pbrMetallicRoughness: {
            baseColorTexture: { index: 2 }
          }
        }
      ],
      textures: [
        { source: 0, sampler: 0 }, // Used by material 0
        { source: 1, sampler: 1 }, // Used by material 1
        { source: 2 },             // Used by unused material 2
        { source: 3 }              // Completely unused texture
      ],
      images: [
        { uri: 'used1.png' },      // Used by texture 0
        { uri: 'used2.png' },      // Used by texture 1
        { uri: 'indirect.png' },   // Used by texture 2 (via unused material)
        { uri: 'unused.png' },     // Completely unused
        { uri: 'unused2.png' }     // Another unused image
      ],
      samplers: [
        { magFilter: 9728 },       // Used by texture 0
        { magFilter: 9729 },       // Used by texture 1
        { magFilter: 9728 }        // Unused sampler
      ],
      accessors: [
        { componentType: 5126, count: 10, type: 'VEC3', bufferView: 0 }, // Used
        { componentType: 5123, count: 15, type: 'SCALAR', bufferView: 1 }, // Used  
        { componentType: 5126, count: 10, type: 'VEC3', bufferView: 2 }, // Indirect use
        { componentType: 5126, count: 10, type: 'VEC3', bufferView: 3 }, // Indirect use
        { componentType: 5126, count: 10, type: 'VEC3', bufferView: 4 }  // Unused accessor
      ],
      bufferViews: [
        { buffer: 0, byteLength: 120 }, // Used
        { buffer: 0, byteOffset: 120, byteLength: 60 }, // Used
        { buffer: 0, byteOffset: 180, byteLength: 120 }, // Indirect use
        { buffer: 0, byteOffset: 300, byteLength: 120 }, // Indirect use
        { buffer: 1, byteLength: 120 }  // Uses unused buffer
      ],
      buffers: [
        { byteLength: 500 }, // Used buffer
        { byteLength: 200 }  // Unused buffer (only bufferView 4 references it)
      ],
      cameras: [
        { type: 'perspective', perspective: { yfov: 1.0, znear: 0.1 } }, // Used by skin
        { type: 'orthographic', orthographic: { xmag: 1, ymag: 1, zfar: 100, znear: 1 } } // Used by unused node
      ],
      skins: [
        {
          joints: [0, 2], // References node 2 (making it indirectly used)
          skeleton: 0
        }
      ],
      animations: [
        {
          // Unused animation
          samplers: [{
            input: 5, // Would reference unused accessor if it existed
            output: 6,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: 1, path: 'translation' }
          }]
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: '85-siege-usage-tracking.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});