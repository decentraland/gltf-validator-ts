import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra Animation Precision Coverage Tests', () => {

  it('should hit specific animation sampler input/output accessor validation paths', async () => {
    // Create test data for various scenarios
    const timeData = new Float32Array([0.0, 1.0, 2.0]); // 3 keyframes
    const shortTimeData = new Int16Array([0, 100]); // Wrong component type for input
    const vecTimeData = new Float32Array([0, 0, 0, 1, 1, 1]); // VEC3 instead of SCALAR for input
    const outputData = new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2]); // 3 VEC3 values
    const mismatchOutputData = new Float32Array([0, 0, 0, 1, 1, 1]); // Only 2 VEC3 values - count mismatch
    
    const totalSize = timeData.byteLength + shortTimeData.byteLength + vecTimeData.byteLength + outputData.byteLength + mismatchOutputData.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(timeData.buffer), offset);
    offset += timeData.byteLength;
    combinedView.set(new Uint8Array(shortTimeData.buffer), offset);
    offset += shortTimeData.byteLength;
    combinedView.set(new Uint8Array(vecTimeData.buffer), offset);
    offset += vecTimeData.byteLength;
    combinedView.set(new Uint8Array(outputData.buffer), offset);
    offset += outputData.byteLength;
    combinedView.set(new Uint8Array(mismatchOutputData.buffer), offset);

    const base64Data = btoa(String.fromCharCode(...combinedView));

    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'Node' }],
      animations: [
        {
          // Test input accessor with wrong component type (should be FLOAT)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 1, // Points to SHORT accessor - should trigger INVALID_FORMAT
              output: 3,
              interpolation: 'LINEAR'
            }
          ],
          name: 'InputWrongComponentType'
        },
        {
          // Test input accessor with wrong type (should be SCALAR)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 2, // Points to VEC3 accessor - should trigger INVALID_FORMAT
              output: 3,
              interpolation: 'LINEAR'
            }
          ],
          name: 'InputWrongType'
        },
        {
          // Test input accessor without bounds (min/max undefined)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 5, // Points to accessor without min/max - should trigger WITHOUT_BOUNDS
              output: 3,
              interpolation: 'LINEAR'
            }
          ],
          name: 'InputWithoutBounds'
        },
        {
          // Test input accessor with bufferView that has byteStride
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 6, // Points to accessor using bufferView with byteStride
              output: 3,
              interpolation: 'LINEAR'
            }
          ],
          name: 'InputWithByteStride'
        },
        {
          // Test output accessor with bufferView that has byteStride
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 7, // Points to accessor using bufferView with byteStride
              interpolation: 'LINEAR'
            }
          ],
          name: 'OutputWithByteStride'
        },
        {
          // Test CUBICSPLINE with input accessor having too few elements
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 8, // Points to single element accessor - CUBICSPLINE needs >= 2
              output: 3,
              interpolation: 'CUBICSPLINE'
            }
          ],
          name: 'CubicSplineTooFewElements'
        },
        {
          // Test input/output count mismatch for non-CUBICSPLINE
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0, // 3 keyframes
              output: 4, // 2 keyframes - count mismatch
              interpolation: 'LINEAR'
            }
          ],
          name: 'CountMismatch'
        },
        {
          // Test sampler with unexpected properties
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 3,
              interpolation: 'LINEAR',
              unexpectedSamplerProp: 'should trigger warning',
              anotherUnexpectedSampler: 123
            }
          ],
          name: 'UnexpectedSamplerProps'
        },
        {
          // Test invalid interpolation value
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 3,
              interpolation: 'INVALID_INTERPOLATION' // Invalid value
            }
          ],
          name: 'InvalidInterpolation'
        },
        {
          // Test output accessor with wrong format for translation path
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' } // Expects VEC3
            }
          ],
          samplers: [
            {
              input: 0,
              output: 9, // Points to VEC4 accessor - wrong for translation
              interpolation: 'LINEAR'
            }
          ],
          name: 'OutputWrongFormat'
        },
        {
          // Test output accessor with wrong component type
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 10, // Points to SHORT accessor - should be FLOAT
              interpolation: 'LINEAR'
            }
          ],
          name: 'OutputWrongComponentType'
        }
      ],
      accessors: [
        { bufferView: 0, componentType: 5126, count: 3, type: 'SCALAR', min: [0], max: [2] }, // 0: Valid time input
        { bufferView: 1, componentType: 5122, count: 2, type: 'SCALAR', min: [0], max: [100] }, // 1: Wrong component type for input
        { bufferView: 2, componentType: 5126, count: 2, type: 'VEC3' }, // 2: Wrong type for input (VEC3 not SCALAR)
        { bufferView: 3, componentType: 5126, count: 3, type: 'VEC3' }, // 3: Valid translation output
        { bufferView: 4, componentType: 5126, count: 2, type: 'VEC3' }, // 4: Wrong count output
        { bufferView: 0, componentType: 5126, count: 3, type: 'SCALAR' }, // 5: No min/max bounds
        { bufferView: 5, componentType: 5126, count: 3, type: 'SCALAR', min: [0], max: [2] }, // 6: Input with byteStride bufferView
        { bufferView: 6, componentType: 5126, count: 3, type: 'VEC3' }, // 7: Output with byteStride bufferView
        { bufferView: 0, componentType: 5126, count: 1, type: 'SCALAR', min: [0], max: [0] }, // 8: Single element for CUBICSPLINE test
        { bufferView: 3, componentType: 5126, count: 3, type: 'VEC4' }, // 9: Wrong type for translation (VEC4 not VEC3)
        { bufferView: 3, componentType: 5122, count: 3, type: 'VEC3' } // 10: Wrong component type (SHORT not FLOAT)
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: timeData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength, byteLength: shortTimeData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength + shortTimeData.byteLength, byteLength: vecTimeData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength + shortTimeData.byteLength + vecTimeData.byteLength, byteLength: outputData.byteLength },
        { buffer: 0, byteOffset: timeData.byteLength + shortTimeData.byteLength + vecTimeData.byteLength + outputData.byteLength, byteLength: mismatchOutputData.byteLength },
        { buffer: 0, byteOffset: 0, byteLength: timeData.byteLength, byteStride: 4 }, // Has byteStride - invalid for animation
        { buffer: 0, byteOffset: timeData.byteLength + shortTimeData.byteLength + vecTimeData.byteLength, byteLength: outputData.byteLength, byteStride: 12 } // Has byteStride - invalid for animation
      ],
      buffers: [
        {
          byteLength: totalSize,
          uri: `data:application/octet-stream;base64,${base64Data}`
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-animation-precision.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining animation channel target validation paths', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0, 1] }],
      nodes: [
        { 
          name: 'NodeWithMatrix',
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          mesh: 0
        },
        { 
          name: 'NodeWithoutMesh',
          mesh: 1 // References mesh without morph targets
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
        },
        {
          primitives: [
            {
              attributes: { POSITION: 0 }
              // No morph targets
            }
          ]
        }
      ],
      animations: [
        {
          // Test animation targeting TRS properties of node with matrix
          channels: [
            {
              sampler: 0,
              target: { 
                node: 0, // Node 0 has matrix property
                path: 'translation' // TRS property - should conflict
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 1,
              interpolation: 'LINEAR'
            }
          ],
          name: 'MatrixTRSConflict'
        },
        {
          // Test animation targeting weights of node without morph targets
          channels: [
            {
              sampler: 0,
              target: { 
                node: 1, // Node 1 has mesh without morph targets
                path: 'weights' // Weights path but no morph targets
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 2,
              interpolation: 'LINEAR'
            }
          ],
          name: 'WeightsNoMorphs'
        },
        {
          // Test animation targeting weights of node without mesh
          channels: [
            {
              sampler: 0,
              target: { 
                node: 2, // Node that doesn't exist, but let's test the logic
                path: 'weights'
              }
            }
          ],
          samplers: [
            {
              input: 0,
              output: 2,
              interpolation: 'LINEAR'
            }
          ],
          name: 'WeightsNoNode'
        },
        {
          // Test duplicate targets - same node and path
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'rotation' }
            },
            {
              sampler: 1,
              target: { node: 0, path: 'rotation' } // Duplicate target
            }
          ],
          samplers: [
            {
              input: 0,
              output: 3,
              interpolation: 'LINEAR'
            },
            {
              input: 0,
              output: 3,
              interpolation: 'STEP'
            }
          ],
          name: 'DuplicateTargets'
        }
      ],
      accessors: [
        { componentType: 5126, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 0: Time input
        { componentType: 5126, count: 2, type: 'VEC3' }, // 1: Translation output
        { componentType: 5126, count: 2, type: 'SCALAR' }, // 2: Weights output  
        { componentType: 5126, count: 2, type: 'VEC4' }  // 3: Rotation output
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-animation-targets.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit getComponentTypeName method for different component types', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'Node' }],
      animations: [
        {
          // Test with BYTE component type to hit getComponentTypeName
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 0, // BYTE accessor - should trigger format error and use getComponentTypeName
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Test with UNSIGNED_BYTE component type
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 2, // UNSIGNED_BYTE accessor
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Test with SHORT component type  
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 3, // SHORT accessor
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Test with UNSIGNED_SHORT component type
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 4, // UNSIGNED_SHORT accessor
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Test with UNSIGNED_INT component type
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 5, // UNSIGNED_INT accessor
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        },
        {
          // Test with unknown component type (default case)
          channels: [
            {
              sampler: 0,
              target: { node: 0, path: 'translation' }
            }
          ],
          samplers: [
            {
              input: 6, // Unknown component type
              output: 1,
              interpolation: 'LINEAR'
            }
          ]
        }
      ],
      accessors: [
        { componentType: 5120, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 0: BYTE
        { componentType: 5126, count: 2, type: 'VEC3' }, // 1: Valid output
        { componentType: 5121, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 2: UNSIGNED_BYTE
        { componentType: 5122, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 3: SHORT
        { componentType: 5123, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 4: UNSIGNED_SHORT
        { componentType: 5125, count: 2, type: 'SCALAR', min: [0], max: [1] }, // 5: UNSIGNED_INT
        { componentType: 9999, count: 2, type: 'SCALAR', min: [0], max: [1] }  // 6: Unknown component type
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'ultra-animation-component-types.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});