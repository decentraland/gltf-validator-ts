import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Advanced Coverage Tests', () => {
  
  it('should hit asset validator edge cases', async () => {
    // Test missing asset
    let gltf = {};
    let data = new TextEncoder().encode(JSON.stringify(gltf));
    let result = await validateBytes(data, { uri: 'no-asset.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test asset with non-string version
    gltf = { asset: { version: 2.0 } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'non-string-version.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test asset with invalid version format  
    gltf = { asset: { version: "2" } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'invalid-version.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test asset with unknown minor version
    gltf = { asset: { version: "2.1" } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'unknown-minor.gltf' });
    expect(result.issues.messages.length).toBeGreaterThan(0);

    // Test asset with non-string minVersion
    gltf = { asset: { version: "2.0", minVersion: 1.9 } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'non-string-minversion.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test asset with invalid minVersion format
    gltf = { asset: { version: "2.0", minVersion: "2" } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'invalid-minversion.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test asset with minVersion major != 2
    gltf = { asset: { version: "2.0", minVersion: "1.0" } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'minversion-major-not-2.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test asset with minVersion > version
    gltf = { asset: { version: "2.0", minVersion: "2.1" } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'minversion-greater.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test asset with unexpected property
    gltf = { asset: { version: "2.0", unexpectedProp: "test" } };
    data = new TextEncoder().encode(JSON.stringify(gltf));
    result = await validateBytes(data, { uri: 'unexpected-prop.gltf' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit material validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Test non-string alphaMode
          alphaMode: 123,
          // Test invalid alphaMode value
          name: 'InvalidAlphaMaterial'
        },
        {
          // Test invalid alphaCutoff
          alphaCutoff: -0.5,
          name: 'InvalidAlphaCutoffMaterial'
        },
        {
          // Test missing baseColorTexture index
          pbrMetallicRoughness: {
            baseColorTexture: {}
          },
          name: 'MissingBaseColorIndexMaterial'
        },
        {
          // Test unresolved baseColorTexture reference
          pbrMetallicRoughness: {
            baseColorTexture: { index: 999 }
          },
          name: 'UnresolvedBaseColorMaterial'
        },
        {
          // Test missing metallicRoughnessTexture index
          pbrMetallicRoughness: {
            metallicRoughnessTexture: {}
          },
          name: 'MissingMetallicRoughnessIndexMaterial'
        },
        {
          // Test unresolved metallicRoughnessTexture reference
          pbrMetallicRoughness: {
            metallicRoughnessTexture: { index: 999 }
          },
          name: 'UnresolvedMetallicRoughnessMaterial'
        },
        {
          // Test missing normalTexture index
          normalTexture: {},
          name: 'MissingNormalIndexMaterial'
        },
        {
          // Test unresolved normalTexture reference
          normalTexture: { index: 999 },
          name: 'UnresolvedNormalMaterial'
        },
        {
          // Test missing occlusionTexture index
          occlusionTexture: {},
          name: 'MissingOcclusionIndexMaterial'
        },
        {
          // Test unresolved occlusionTexture reference
          occlusionTexture: { index: 999 },
          name: 'UnresolvedOcclusionMaterial'
        },
        {
          // Test missing emissiveTexture index
          emissiveTexture: {},
          name: 'MissingEmissiveIndexMaterial'
        },
        {
          // Test unresolved emissiveTexture reference
          emissiveTexture: { index: 999 },
          name: 'UnresolvedEmissiveMaterial'
        },
        {
          // Test unexpected properties at various levels
          unexpectedProp: 'test',
          pbrMetallicRoughness: {
            baseColorFactor: [1, 1, 1, 1],
            unexpectedPbrProp: 'test',
            baseColorTexture: {
              index: 0,
              unexpectedTexProp: 'test'
            },
            metallicRoughnessTexture: {
              index: 0,
              unexpectedMetallicProp: 'test'
            }
          },
          normalTexture: {
            index: 0,
            unexpectedNormalProp: 'test'
          },
          occlusionTexture: {
            index: 0,
            unexpectedOcclusionProp: 'test'
          },
          emissiveTexture: {
            index: 0,
            unexpectedEmissiveProp: 'test'
          },
          name: 'UnexpectedPropsMaterial'
        }
      ],
      // Add a texture to avoid some unresolved references
      textures: [{ source: 0 }],
      images: [{ uri: 'test.png' }]
    };

    // Also test with second alphaMode case
    const gltf2 = {
      asset: { version: '2.0' },
      materials: [{
        alphaMode: 'INVALID_MODE'
      }]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'material-edge-cases.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    const data2 = new TextEncoder().encode(JSON.stringify(gltf2));
    const result2 = await validateBytes(data2, { uri: 'invalid-alpha-mode.gltf' });
    expect(result2.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit error conversion paths', async () => {
    // Test invalid JSON
    const invalidJson = new TextEncoder().encode('{ invalid json }');
    let result = await validateBytes(invalidJson, { uri: 'invalid.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test completely malformed GLB
    const malformedGlb = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    result = await validateBytes(malformedGlb, { uri: 'malformed.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test GLB with wrong magic
    const wrongMagic = new ArrayBuffer(20);
    const view = new DataView(wrongMagic);
    view.setUint32(0, 0x12345678, true); // wrong magic
    view.setUint32(4, 2, true); // version
    view.setUint32(8, 20, true); // length
    result = await validateBytes(new Uint8Array(wrongMagic), { uri: 'wrong-magic.glb' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit buffer validator array edge case', async () => {
    // Create GLTF with buffer as array instead of object
    const invalidGltf = {
      asset: { version: '2.0' },
      buffers: [
        ["invalid", "array", "buffer"] // This should trigger the array handling code
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(invalidGltf));
    const result = await validateBytes(data, { uri: 'buffer-array.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test buffer as primitive
    const primitiveBufferGltf = {
      asset: { version: '2.0' },
      buffers: ["string buffer"]
    };

    const primitiveData = new TextEncoder().encode(JSON.stringify(primitiveBufferGltf));
    const primitiveResult = await validateBytes(primitiveData, { uri: 'buffer-primitive.gltf' });
    expect(primitiveResult.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit camera validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test camera with no type
          name: 'NoType'
        },
        {
          // Test camera with invalid type
          type: 'invalid',
          name: 'InvalidType'
        },
        {
          // Test orthographic camera missing properties
          type: 'orthographic',
          name: 'IncompleteOrtho'
        },
        {
          // Test perspective camera missing properties  
          type: 'perspective',
          name: 'IncompletePerspective'
        },
        {
          // Test orthographic camera with invalid properties
          type: 'orthographic',
          orthographic: {
            xmag: "invalid",
            ymag: -1,
            zfar: -1,
            znear: "invalid"
          },
          name: 'InvalidOrtho'
        },
        {
          // Test perspective camera with invalid properties
          type: 'perspective',
          perspective: {
            aspectRatio: -1,
            yfov: "invalid",
            zfar: -1,
            znear: "invalid"
          },
          name: 'InvalidPerspective'
        },
        {
          // Test unexpected properties
          type: 'perspective',
          perspective: {
            yfov: 1.0,
            znear: 0.1
          },
          unexpectedProp: 'test',
          name: 'UnexpectedProps'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-edge-cases.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit additional buffer validation edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          // Test buffer with negative byteLength
          byteLength: -100
        },
        {
          // Test buffer with zero byteLength
          byteLength: 0
        },
        {
          // Test buffer with non-number byteLength
          byteLength: "100"
        },
        {
          // Test buffer with missing byteLength
          uri: 'test.bin'
        },
        {
          // Test buffer with invalid data URI - missing base64
          byteLength: 10,
          uri: 'data:application/octet-stream,somedata'
        },
        {
          // Test buffer with invalid data URI - double semicolon
          byteLength: 10,
          uri: 'data:application/octet-stream;;base64,dGVzdA=='
        },
        {
          // Test buffer with wrong MIME type
          byteLength: 4,
          uri: 'data:text/plain;base64,dGVzdA=='
        },
        {
          // Test buffer with byte length mismatch
          byteLength: 10,
          uri: 'data:application/octet-stream;base64,dGVzdA==' // "test" = 4 bytes
        },
        {
          // Test buffer with invalid base64
          byteLength: 4,
          uri: 'data:application/octet-stream;base64,invalid!base64!'
        },
        {
          // Test buffer with absolute URI wrong protocol
          byteLength: 100,
          uri: 'ftp://example.com/buffer.bin'
        },
        {
          // Test buffer with relative URI starting with /
          byteLength: 100,
          uri: '/absolute/path/buffer.bin'
        },
        {
          // Test buffer with URI containing colon but no scheme
          byteLength: 100,
          uri: 'invalid:uri'
        },
        {
          // Test buffer with unexpected properties
          byteLength: 100,
          uri: 'buffer.bin',
          unexpectedProp: 'test'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-validation-edge-cases.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });
  
});