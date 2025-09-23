import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Final 85% Revolution Simple Tests', () => {

  it('should hit maximum validation paths with extreme edge cases', async () => {
    // Create extremely large data arrays to stress test all validators
    const hugeFloatArray = new Float32Array(1000);
    for (let i = 0; i < hugeFloatArray.length; i++) {
      hugeFloatArray[i] = i % 100 === 0 ? NaN : (i % 50 === 0 ? Infinity : Math.sin(i) * 1000);
    }
    
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(hugeFloatArray.buffer)));

    const gltf = {
      asset: { 
        version: '2.0',
        generator: 'Final Revolution Test Engine',
        extras: { revolutionTest: true }
      },
      
      // Extreme extension combinations
      extensionsUsed: [
        'KHR_materials_unlit',
        'KHR_materials_pbrSpecularGlossiness',
        'INVALID_EXT_REVOLUTION_001',
        'INVALID_EXT_REVOLUTION_002',
        ''  // Empty extension name
      ],
      extensionsRequired: [
        'KHR_materials_unlit',
        'REQUIRED_BUT_MISSING_EXT'
      ],

      scene: -999, // Extremely invalid scene index
      
      // Many scenes with various invalid configurations
      scenes: [
        { nodes: [] }, // Empty scene
        { nodes: [0, 1, 999, -1] }, // Mix valid/invalid
        { nodes: [2, 2, 2] }, // Duplicate nodes
        { nodes: [5] } // Child node in scene (invalid)
      ],

      // Complex node hierarchy
      nodes: [
        { name: 'Root1' },
        { name: 'Root2' },
        { name: 'Root3' },
        { name: 'Parent', children: [4, 5, 999] }, // Some invalid children
        { name: 'Child1' },
        { name: 'Child2' }, // This will be in scene but is a child
        { 
          name: 'ComplexNode',
          matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
          translation: [1,2,3], // Conflicts with matrix
          rotation: [1,1,1,1], // Not normalized
          scale: [1,1,1],
          mesh: 999,
          camera: 999,
          skin: 999,
          weights: [0.5, 0.3, 0.8, 0.2] // Won't match mesh morph targets
        }
      ],

      // Meshes with extreme morph target scenarios  
      meshes: [
        {
          primitives: [{
            attributes: { 
              POSITION: 0,
              'INVALID_ATTR_NAME': 1
            },
            indices: 999, // Invalid
            material: 999, // Invalid
            mode: 999, // Invalid
            targets: [
              {
                POSITION: 2,
                'INVALID_MORPH_ATTR': 3,
                NORMAL: 999 // Invalid accessor
              }
            ]
          }],
          weights: [0.1] // Mismatch with number of morph targets
        }
      ],

      // Materials with maximum invalid configurations
      materials: [
        {
          pbrMetallicRoughness: {
            baseColorFactor: [2.0, 2.0, 2.0, 2.0], // All invalid > 1.0
            metallicFactor: 5.0, // Invalid > 1.0  
            roughnessFactor: -1.0, // Invalid negative
            baseColorTexture: { index: 999, texCoord: 999 }
          },
          normalTexture: { index: 888, scale: -10.0 },
          occlusionTexture: { index: 777, strength: 5.0 },
          emissiveTexture: { index: 666, texCoord: 999 },
          emissiveFactor: [10.0, 10.0, 10.0],
          alphaCutoff: -5.0,
          alphaMode: 'TOTALLY_INVALID',
          doubleSided: 'wrong_type',
          extensions: {
            KHR_materials_pbrSpecularGlossiness: {
              diffuseFactor: [2.0, 2.0, 2.0, 2.0]
            },
            'UNDECLARED_MAT_EXT': { value: 'test' }
          }
        }
      ],

      // Massive accessor array with all edge cases
      accessors: Array.from({ length: 100 }, (_, i) => ({
        bufferView: i < 50 ? i % 5 : 999 + i,
        componentType: [5120, 5121, 5122, 5123, 5125, 5126, 9999][i % 7],
        count: Math.max(1, i * 10),
        type: ['SCALAR', 'VEC2', 'VEC3', 'VEC4', 'MAT2', 'MAT3', 'MAT4', 'INVALID'][i % 8],
        byteOffset: i % 10 === 0 ? i * 100 : undefined,
        sparse: i % 25 === 0 ? {
          count: Math.min(10, i + 1),
          indices: { bufferView: (i + 1) % 5, componentType: 5123 },
          values: { bufferView: (i + 2) % 5 }
        } : undefined,
        min: i % 7 === 0 ? [-1000] : undefined,
        max: i % 11 === 0 ? [1000] : undefined
      })),

      bufferViews: Array.from({ length: 20 }, (_, i) => ({
        buffer: i < 15 ? 0 : 999,
        byteOffset: i * 1000,
        byteLength: i < 10 ? 500 : 999999, // Some will exceed buffer
        byteStride: i % 5 === 0 ? i * 10 + 300 : undefined, // Some invalid
        target: i % 8 === 0 ? [34962, 34963, 99999][i % 3] : undefined
      })),

      buffers: [
        {
          byteLength: hugeFloatArray.byteLength,
          uri: `data:application/octet-stream;base64,${base64Data}`
        },
        { uri: 'https://invalid-domain-12345.com/buffer.bin', byteLength: 1000 },
        { uri: 'ftp://invalid.ftp.com/buffer.bin', byteLength: 500 },
        { uri: 'data:text/plain;base64,INVALID!!!', byteLength: 100 },
        { uri: 'javascript:alert("xss")', byteLength: 50 },
        { uri: '', byteLength: 25 }
      ],

      images: Array.from({ length: 10 }, (_, i) => ({
        uri: i % 3 === 0 ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' : undefined,
        bufferView: i % 3 !== 0 ? i % 5 : undefined,
        mimeType: ['image/png', 'image/jpeg', 'invalid/type', ''][i % 4],
        customProp: 'unexpected'
      })),

      textures: Array.from({ length: 8 }, (_, i) => ({
        source: i < 6 ? i : 999,
        sampler: i < 4 ? i : 999,
        extensions: {
          KHR_texture_transform: {
            offset: [0.5, 0.5],
            scale: [2.0, 2.0],
            texCoord: 999
          }
        }
      })),

      samplers: Array.from({ length: 5 }, (_, i) => ({
        magFilter: [9728, 9729, 99999][i % 3],
        minFilter: [9728, 9729, 9984, 88888][i % 4],
        wrapS: [33071, 33648, 77777][i % 3],
        wrapT: [33071, 33648, 66666][i % 3]
      })),

      cameras: [
        {
          type: 'perspective',
          perspective: {
            yfov: -1.0, // Invalid negative
            aspectRatio: 0.0, // Invalid zero
            znear: -10.0, // Invalid negative
            zfar: -100.0 // Invalid negative
          }
        },
        {
          type: 'orthographic',
          orthographic: {
            xmag: -5.0, // Invalid negative
            ymag: 0.0, // Invalid zero
            znear: 100.0, // Greater than zfar
            zfar: 10.0
          }
        },
        {
          type: 'INVALID_TYPE' // Invalid camera type
        }
      ],

      skins: [
        {
          joints: [0, 1, 999], // Some invalid
          skeleton: 999, // Invalid
          inverseBindMatrices: 999 // Invalid accessor
        }
      ],

      animations: [
        {
          samplers: [{
            input: 999, // Invalid
            output: 999, // Invalid
            interpolation: 'INVALID_INTERP'
          }],
          channels: [{
            sampler: 999, // Invalid
            target: { node: 999, path: 'invalid_path' }
          }]
        }
      ],

      extensions: {
        'UNDECLARED_TOP_LEVEL_EXT': { data: 'test' }
      }
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'final-85-revolution-simple.gltf' });
    
    expect(result.issues.messages.length).toBeGreaterThan(50);
  });

});