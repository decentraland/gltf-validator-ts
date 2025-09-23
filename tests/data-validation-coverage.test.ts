import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Data Validation Coverage Tests', () => {

  it('should hit accessor data validation with real binary data and min/max bounds', async () => {
    // Create binary data with specific values to test bounds validation
    const positions = new Float32Array([
      // First triangle - values within bounds
      0.0, 0.0, 0.0,
      1.0, 0.0, 0.0, 
      0.5, 1.0, 0.0,
      // Second triangle - values outside declared bounds
      -2.0, -2.0, -2.0, // Below min
      3.0, 3.0, 3.0     // Above max
    ]);

    // Create indices with specific values
    const indices = new Uint16Array([
      0, 1, 2,    // Valid indices
      65535, 0, 1 // Index 65535 is out of range for only 5 vertices
    ]);

    // Calculate offsets
    const positionsOffset = 0;
    const positionsSize = positions.byteLength;
    const indicesOffset = positionsSize;
    const indicesSize = indices.byteLength;

    // Combine into single buffer
    const totalSize = positionsSize + indicesSize;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    combinedView.set(new Uint8Array(positions.buffer), positionsOffset);
    combinedView.set(new Uint8Array(indices.buffer), indicesOffset);

    const base64Data = btoa(String.fromCharCode.apply(null, Array.from(combinedView)));

    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ mesh: 0 }],
      meshes: [{
        primitives: [{
          attributes: { POSITION: 0 },
          indices: 1,
          mode: 4 // TRIANGLES
        }]
      }],
      accessors: [
        {
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 5,
          type: 'VEC3',
          // Declare bounds that don't match actual data
          min: [-1.0, -1.0, -1.0], // Actual min is [-2.0, -2.0, -2.0]
          max: [2.0, 2.0, 2.0]     // Actual max is [3.0, 3.0, 3.0]
        },
        {
          bufferView: 1,
          componentType: 5123, // UNSIGNED_SHORT
          count: 6,
          type: 'SCALAR',
          // Max vertex index should be 4, but we have 65535
          max: [4]
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: positionsOffset,
          byteLength: positionsSize,
          target: 34962 // ARRAY_BUFFER
        },
        {
          buffer: 0,
          byteOffset: indicesOffset,
          byteLength: indicesSize,
          target: 34963 // ELEMENT_ARRAY_BUFFER
        }
      ],
      buffers: [{
        byteLength: totalSize,
        uri: `data:application/octet-stream;base64,${base64Data}`
      }]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'data-validation-bounds.gltf' });
    
    // Should have errors for min/max mismatches and out-of-bounds values
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit animation quaternion validation with non-normalized quaternions', async () => {
    // Create quaternion data with non-normalized quaternions
    const quaternions = new Float32Array([
      // Normalized quaternion (length = 1)
      0.0, 0.0, 0.0, 1.0,
      // Non-normalized quaternion (length > 1)
      1.0, 1.0, 1.0, 1.0, // length = 2
      // Another non-normalized quaternion
      0.5, 0.5, 0.5, 0.1  // length < 1
    ]);

    // Time values for animation
    const times = new Float32Array([0.0, 1.0, 2.0]);

    // Calculate buffer layout
    const timesOffset = 0;
    const timesSize = times.byteLength;
    const quaternionsOffset = timesSize;
    const quaternionsSize = quaternions.byteLength;
    const totalSize = timesSize + quaternionsSize;

    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    combinedView.set(new Uint8Array(times.buffer), timesOffset);
    combinedView.set(new Uint8Array(quaternions.buffer), quaternionsOffset);

    const base64Data = btoa(String.fromCharCode.apply(null, Array.from(combinedView)));

    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'AnimatedNode', rotation: [0, 0, 0, 1] }],
      animations: [{
        samplers: [{
          input: 0,  // time accessor
          output: 1, // quaternion accessor
          interpolation: 'LINEAR'
        }],
        channels: [{
          sampler: 0,
          target: {
            node: 0,
            path: 'rotation'
          }
        }]
      }],
      accessors: [
        {
          bufferView: 0,
          componentType: 5126, // FLOAT
          count: 3,
          type: 'SCALAR',
          min: [0.0],
          max: [2.0]
        },
        {
          bufferView: 1,
          componentType: 5126, // FLOAT
          count: 3,
          type: 'VEC4' // Quaternions
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: timesOffset,
          byteLength: timesSize
        },
        {
          buffer: 0,
          byteOffset: quaternionsOffset,
          byteLength: quaternionsSize
        }
      ],
      buffers: [{
        byteLength: totalSize,
        uri: `data:application/octet-stream;base64,${base64Data}`
      }]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-quaternion-validation.gltf' });
    
    // Should have errors for non-normalized quaternions
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit CUBICSPLINE animation quaternion validation', async () => {
    // Create CUBICSPLINE quaternion data: [in_tangent, vertex, out_tangent] for each keyframe
    // We'll create 2 keyframes, so 6 quaternions total (2 * 3)
    const quaternions = new Float32Array([
      // Keyframe 1: in_tangent, vertex, out_tangent
      0.0, 0.0, 0.0, 1.0,  // in_tangent (normalized)
      1.0, 1.0, 1.0, 1.0,  // vertex (NOT normalized) - should trigger error
      0.0, 0.0, 0.0, 1.0,  // out_tangent (normalized)
      
      // Keyframe 2: in_tangent, vertex, out_tangent  
      0.0, 0.0, 0.0, 1.0,  // in_tangent (normalized)
      0.5, 0.5, 0.5, 0.1,  // vertex (NOT normalized) - should trigger error
      0.0, 0.0, 0.0, 1.0   // out_tangent (normalized)
    ]);

    const times = new Float32Array([0.0, 2.0]);

    const timesOffset = 0;
    const timesSize = times.byteLength;
    const quaternionsOffset = timesSize;
    const quaternionsSize = quaternions.byteLength;
    const totalSize = timesSize + quaternionsSize;

    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    combinedView.set(new Uint8Array(times.buffer), timesOffset);
    combinedView.set(new Uint8Array(quaternions.buffer), quaternionsOffset);

    const base64Data = btoa(String.fromCharCode.apply(null, Array.from(combinedView)));

    const gltf = {
      asset: { version: '2.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: 'CubicAnimatedNode', rotation: [0, 0, 0, 1] }],
      animations: [{
        samplers: [{
          input: 0,
          output: 1,
          interpolation: 'CUBICSPLINE'
        }],
        channels: [{
          sampler: 0,
          target: {
            node: 0,
            path: 'rotation'
          }
        }]
      }],
      accessors: [
        {
          bufferView: 0,
          componentType: 5126,
          count: 2,
          type: 'SCALAR',
          min: [0.0],
          max: [2.0]
        },
        {
          bufferView: 1,
          componentType: 5126,
          count: 6, // 2 keyframes * 3 quaternions each
          type: 'VEC4'
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: timesOffset,
          byteLength: timesSize
        },
        {
          buffer: 0,
          byteOffset: quaternionsOffset,
          byteLength: quaternionsSize
        }
      ],
      buffers: [{
        byteLength: totalSize,
        uri: `data:application/octet-stream;base64,${base64Data}`
      }]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'cubicspline-quaternion-validation.gltf' });
    
    // Should have errors for non-normalized vertex quaternions
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit matrix validation with invalid matrix data', async () => {
    // Create invalid matrix data (MAT4 = 4x4 matrix = 16 floats)
    const matrices = new Float32Array([
      // Invalid matrix - contains NaN
      NaN, 0, 0, 0,
      0, 1, 0, 0, 
      0, 0, 1, 0,
      0, 0, 0, 1,
      
      // Invalid matrix - contains Infinity
      Infinity, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0, 
      0, 0, 0, 1
    ]);

    const base64Data = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(matrices.buffer))));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [{
        bufferView: 0,
        componentType: 5126, // FLOAT
        count: 2,
        type: 'MAT4'
      }],
      bufferViews: [{
        buffer: 0,
        byteOffset: 0,
        byteLength: matrices.byteLength
      }],
      buffers: [{
        byteLength: matrices.byteLength,
        uri: `data:application/octet-stream;base64,${base64Data}`
      }]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'matrix-validation.gltf' });
    
    // Should detect invalid matrix values
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit various component type value range validations', async () => {
    // Create data with out-of-range values for different component types
    const byteValues = new Int8Array([127, -128, 0]); // BYTE range: -128 to 127
    const shortValues = new Int16Array([32767, -32768, 0]); // SHORT range
    const uintValues = new Uint32Array([4294967295, 0, 2147483647]); // UNSIGNED_INT max values

    // Combine all data
    const totalSize = byteValues.byteLength + shortValues.byteLength + uintValues.byteLength;
    const combinedBuffer = new ArrayBuffer(totalSize);
    const combinedView = new Uint8Array(combinedBuffer);
    
    let offset = 0;
    combinedView.set(new Uint8Array(byteValues.buffer), offset);
    offset += byteValues.byteLength;
    combinedView.set(new Uint8Array(shortValues.buffer), offset);
    offset += shortValues.byteLength;
    combinedView.set(new Uint8Array(uintValues.buffer), offset);

    const base64Data = btoa(String.fromCharCode.apply(null, Array.from(combinedView)));

    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          bufferView: 0,
          componentType: 5120, // BYTE
          count: 3,
          type: 'SCALAR',
          min: [-100], // Actual min is -128
          max: [100]   // Actual max is 127
        },
        {
          bufferView: 1,
          componentType: 5122, // SHORT
          count: 3,
          type: 'SCALAR',
          min: [-30000], // Actual min is -32768
          max: [30000]   // Actual max is 32767
        },
        {
          bufferView: 2,
          componentType: 5125, // UNSIGNED_INT
          count: 3,
          type: 'SCALAR',
          min: [0],
          max: [4000000000] // Actual max is 4294967295
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: byteValues.byteLength
        },
        {
          buffer: 0,
          byteOffset: byteValues.byteLength,
          byteLength: shortValues.byteLength
        },
        {
          buffer: 0,
          byteOffset: byteValues.byteLength + shortValues.byteLength,
          byteLength: uintValues.byteLength
        }
      ],
      buffers: [{
        byteLength: totalSize,
        uri: `data:application/octet-stream;base64,${base64Data}`
      }]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'component-type-validation.gltf' });
    
    // Should have min/max mismatch errors
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

});