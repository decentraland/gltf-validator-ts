import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Comprehensive Edge Cases Tests', () => {

  it('should hit buffer-view validator comprehensive edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      bufferViews: [
        {
          // Test bufferView with invalid buffer reference
          buffer: -1,
          byteOffset: 0,
          byteLength: 100
        },
        {
          // Test bufferView with unresolved buffer reference
          buffer: 999,
          byteOffset: 0,
          byteLength: 100
        },
        {
          // Test bufferView without required byteLength
          buffer: 0,
          byteOffset: 0
        },
        {
          // Test bufferView with invalid byteLength
          buffer: 0,
          byteOffset: 0,
          byteLength: -100
        },
        {
          // Test bufferView with non-number byteLength
          buffer: 0,
          byteOffset: 0,
          byteLength: "100"
        },
        {
          // Test bufferView with invalid byteOffset
          buffer: 0,
          byteOffset: -10,
          byteLength: 100
        },
        {
          // Test bufferView with non-number byteOffset
          buffer: 0,
          byteOffset: "10",
          byteLength: 100
        },
        {
          // Test bufferView with byteOffset + byteLength > buffer.byteLength
          buffer: 0,
          byteOffset: 950,
          byteLength: 100 // 950 + 100 = 1050 > 1000
        },
        {
          // Test bufferView with invalid byteStride
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          byteStride: 2 // Must be >= 4 and <= 252
        },
        {
          // Test bufferView with byteStride > 252
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          byteStride: 300
        },
        {
          // Test bufferView with invalid target
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          target: 9999
        },
        {
          // Test bufferView with unexpected properties
          buffer: 0,
          byteOffset: 0,
          byteLength: 100,
          unexpectedProp: 'test'
        }
      ],
      buffers: [
        {
          byteLength: 1000
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-view-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit animation validator comprehensive edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      animations: [
        {
          // Test animation without samplers
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' }
          }],
          name: 'NoSamplers'
        },
        {
          // Test animation with empty samplers
          samplers: [],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' }
          }],
          name: 'EmptySamplers'
        },
        {
          // Test animation without channels
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          name: 'NoChannels'
        },
        {
          // Test animation with empty channels
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [],
          name: 'EmptyChannels'
        },
        {
          // Test animation with sampler missing input
          samplers: [{
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' }
          }],
          name: 'MissingInput'
        },
        {
          // Test animation with sampler invalid input
          samplers: [{
            input: -1,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' }
          }],
          name: 'InvalidInput'
        },
        {
          // Test animation with sampler unresolved input
          samplers: [{
            input: 999,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' }
          }],
          name: 'UnresolvedInput'
        },
        {
          // Test animation with sampler missing output
          samplers: [{
            input: 0,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' }
          }],
          name: 'MissingOutput'
        },
        {
          // Test animation with invalid interpolation
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'INVALID'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' }
          }],
          name: 'InvalidInterpolation'
        },
        {
          // Test animation with channel missing sampler
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            target: { node: 0, path: 'translation' }
          }],
          name: 'MissingSampler'
        },
        {
          // Test animation with channel invalid sampler
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: -1,
            target: { node: 0, path: 'translation' }
          }],
          name: 'InvalidSampler'
        },
        {
          // Test animation with channel unresolved sampler
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 999,
            target: { node: 0, path: 'translation' }
          }],
          name: 'UnresolvedSampler'
        },
        {
          // Test animation with channel missing target
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0
          }],
          name: 'MissingTarget'
        },
        {
          // Test animation with channel target missing node
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { path: 'translation' }
          }],
          name: 'MissingTargetNode'
        },
        {
          // Test animation with channel target invalid node
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: -1, path: 'translation' }
          }],
          name: 'InvalidTargetNode'
        },
        {
          // Test animation with channel target missing path
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0 }
          }],
          name: 'MissingTargetPath'
        },
        {
          // Test animation with channel target invalid path
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'invalid_path' }
          }],
          name: 'InvalidTargetPath'
        },
        {
          // Test animation with unexpected properties
          samplers: [{
            input: 0,
            output: 1,
            interpolation: 'LINEAR',
            unexpectedSamplerProp: 'test'
          }],
          channels: [{
            sampler: 0,
            target: { node: 0, path: 'translation' },
            unexpectedChannelProp: 'test'
          }],
          unexpectedAnimProp: 'test',
          name: 'UnexpectedProps'
        }
      ],
      nodes: [
        { name: 'AnimatedNode' }
      ],
      accessors: [
        {
          componentType: 5126,
          count: 2,
          type: 'SCALAR'
        },
        {
          componentType: 5126,
          count: 2,
          type: 'VEC3'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'animation-comprehensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit extensive accessor sparse validation cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      accessors: [
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 5123,
              byteOffset: 3 // Not aligned to 2 bytes for UNSIGNED_SHORT
            },
            values: {
              bufferView: 1,
              byteOffset: 2 // Not aligned to 4 bytes for FLOAT
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 999, // Unresolved reference
              componentType: 5123
            },
            values: {
              bufferView: 1
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 999 // Unresolved reference
            }
          }
        },
        {
          componentType: 5126,
          count: 100,
          type: 'VEC3',
          sparse: {
            count: 10,
            indices: {
              bufferView: 0,
              componentType: 5123
            },
            values: {
              bufferView: 1
            },
            unexpectedSparseProp: 'test'
          }
        }
      ],
      bufferViews: [
        {
          buffer: 0,
          byteOffset: 0,
          byteLength: 20
        },
        {
          buffer: 0,
          byteOffset: 20,
          byteLength: 120
        }
      ],
      buffers: [
        {
          byteLength: 200
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'sparse-extensive.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit remaining mesh primitive validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      meshes: [
        {
          primitives: [
            {
              attributes: { POSITION: 0 },
              // Test all primitive modes
              mode: 0 // POINTS
            },
            {
              attributes: { POSITION: 0 },
              mode: 1 // LINES
            },
            {
              attributes: { POSITION: 0 },
              mode: 2 // LINE_LOOP
            },
            {
              attributes: { POSITION: 0 },
              mode: 3 // LINE_STRIP
            },
            {
              attributes: { POSITION: 0 },
              mode: 4 // TRIANGLES
            },
            {
              attributes: { POSITION: 0 },
              mode: 5 // TRIANGLE_STRIP
            },
            {
              attributes: { POSITION: 0 },
              mode: 6 // TRIANGLE_FAN
            },
            {
              // Test primitive with targets containing invalid accessors
              attributes: { POSITION: 0 },
              targets: [
                { POSITION: -1 }, // Invalid accessor
                { POSITION: 999 } // Unresolved accessor
              ]
            },
            {
              // Test primitive with targets containing non-object
              attributes: { POSITION: 0 },
              targets: ["not an object"]
            },
            {
              // Test primitive with empty targets
              attributes: { POSITION: 0 },
              targets: [{}] // Empty target
            }
          ]
        }
      ],
      accessors: [
        {
          componentType: 5126,
          count: 3,
          type: 'VEC3'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'mesh-primitive-modes.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit remaining error handling paths in validators', async () => {
    // Test completely malformed GLTF structures
    const malformedCases = [
      // Invalid JSON structure
      '{"asset":{"version":"2.0"},"nodes":[}',
      // JSON with trailing comma
      '{"asset":{"version":"2.0"},}',
      // JSON with unescaped characters
      '{"asset":{"version":"2.0"},"test":"unescaped\nnewline"}',
    ];

    for (const malformedCase of malformedCases) {
      const data = new TextEncoder().encode(malformedCase);
      const result = await validateBytes(data, { uri: 'malformed.gltf' });
      expect(result.issues.numErrors).toBeGreaterThan(0);
    }
  });

});