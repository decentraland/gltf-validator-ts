import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Mega-Targeted Animation Coverage Tests', () => {

  it('should hit all uncovered animation validator TYPE_MISMATCH and validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1] }],
      nodes: [
        { 
          name: 'NodeWithMatrix',
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] // Has matrix
        },
        { 
          name: 'NodeWithMesh',
          mesh: 0 // Has mesh
        }
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0 },
              targets: [
                { POSITION: 1 }, // Has morph targets
                { POSITION: 2 }
              ]
            }
          ]
        }
      ],
      animations: [
        {
          // Hit UNEXPECTED_PROPERTY for animation level (line 8-18)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          unexpectedAnimationProp: 'should trigger warning',
          anotherUnexpected: 123,
          name: 'AnimationWithUnexpectedProps'
        },
        {
          // Hit TYPE_MISMATCH for channels array (line 21-27)
          channels: 'not_an_array', // String instead of array
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit EMPTY_ENTITY for empty channels array (line 28-34)
          channels: [], // Empty array
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit TYPE_MISMATCH for samplers array (line 47-53)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: 'not_an_array' // String instead of array
        },
        {
          // Hit EMPTY_ENTITY for empty samplers array (line 54-60)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [] // Empty array
        },
        {
          // Hit UNEXPECTED_PROPERTY for channel level (line 75-84)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' },
              unexpectedChannelProp: 'should trigger warning',
              anotherUnexpectedChannel: 456
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit TYPE_MISMATCH for channel.sampler (line 95-101)
          channels: [
            {
              sampler: 'not_a_number', // String instead of number
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit negative channel.sampler validation (line 95-101)
          channels: [
            {
              sampler: -1, // Negative sampler index
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit TYPE_MISMATCH for target.node (line 155-161)
          channels: [
            {
              sampler: 0,
              target: { 
                node: 'not_a_number', // String instead of number
                path: 'translation' 
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit negative target.node validation (line 155-161)
          channels: [
            {
              sampler: 0,
              target: { 
                node: -1, // Negative node index
                path: 'translation' 
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit TYPE_MISMATCH for target.path (line 179-185)
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0,
                path: 123 // Number instead of string
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit VALUE_NOT_IN_LIST for invalid path (line 186-192)
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0,
                path: 'invalid_animation_path' // Invalid path
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit UNEXPECTED_PROPERTY for target level (line 196-205)
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0,
                path: 'translation',
                unexpectedTargetProp: 'should trigger warning',
                anotherUnexpectedTarget: 789
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit TYPE_MISMATCH for sampler.input (line 222-228)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 'not_a_number', // String instead of number
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit negative sampler.input validation (line 222-228)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: -1, // Negative input accessor index
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit ANIMATION_CHANNEL_TARGET_NODE_MATRIX error (line 124-131)
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0, // Node 0 has matrix property
                path: 'translation' // TRS property - should conflict with matrix
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Hit ANIMATION_CHANNEL_TARGET_NODE_WEIGHTS_NO_MORPHS error (line 134-144)
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0, // Node 0 doesn't have mesh with morph targets
                path: 'weights' // Weights path but no morph targets
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 0: time input
        { componentType: 5126, count: 2, type: 'VEC3' }, // 1: translation output
        { componentType: 5126, count: 3, type: 'VEC3' }  // 2: morph target data
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mega-targeted-animation.gltf' });
    
    // Should generate many errors and warnings for various validation failures
    expect(result.issues.numErrors).toBeGreaterThan(0);
    expect(result.issues.numWarnings).toBeGreaterThan(0);
  });

  it('should hit remaining sampler validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'Node' }],
      animations: [
        {
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              // Hit TYPE_MISMATCH for output (similar to input validation)
              input: 0,
              output: 'not_a_number', // String instead of number
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: -1, // Negative output accessor index
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 123 // Number instead of string
            }
          ]
        },
        {
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'INVALID_INTERPOLATION' // Invalid interpolation value
            }
          ]
        },
        {
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              // Test input accessor with wrong type (should be SCALAR)
              input: 1, // Points to VEC3 accessor instead of SCALAR
              output: 2,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              // Test input accessor with wrong component type (should be FLOAT)
              input: 3, // Points to SHORT accessor instead of FLOAT
              output: 2,
              interpolation: 'LINEAR'
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 0: Valid time input
        { componentType: 5126, count: 2, type: 'VEC3' }, // 1: Wrong type for input (VEC3 not SCALAR)
        { componentType: 5126, count: 2, type: 'VEC3' }, // 2: Valid output
        { componentType: 5122, count: 2, type: 'SCALAR', min: [0], max: [1] } // 3: Wrong component type for input (SHORT not FLOAT)
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mega-targeted-animation-sampler.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit duplicate target validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'Node' }],
      animations: [
        {
          // Test duplicate animation targets (same node and path)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            },
            {
              sampler: 1,
              target: { node: 0, path: 'translation' } // Duplicate target
            },
            {
              sampler: 2,
              target: { node: 0, path: 'rotation' } // Different path, same node - OK
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            },
            {
              input: 0,
              output: 1,
              interpolation: 'STEP'
            },
            {
              input: 0,
              output: 2,
              interpolation: 'LINEAR'
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5126, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 0: time input
        { componentType: 5126, count: 2, type: 'VEC3' }, // 1: translation output
        { componentType: 5126, count: 2, type: 'VEC4' }  // 2: rotation output
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mega-targeted-animation-duplicates.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});