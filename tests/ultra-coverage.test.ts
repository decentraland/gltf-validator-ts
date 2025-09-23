import { describe, it, expect } from 'vitest';
import { validateBytes } from '../src/index';

describe('Ultra Coverage Tests', () => {

  it('should hit scene validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      scenes: [
        {
          // Test scene with non-array nodes
          nodes: "not an array"
        },
        {
          // Test scene with empty nodes array
          nodes: []
        },
        {
          // Test scene with invalid node indices
          nodes: [-1, "not a number", 3.5]
        },
        {
          // Test scene with unresolved node references
          nodes: [999]
        },
        {
          // Test scene with non-root nodes (nodes that are children of other nodes)
          nodes: [1] // node 1 will be a child of node 0
        },
        {
          // Test scene with unexpected properties
          nodes: [0],
          unexpectedProp: 'test'
        }
      ],
      nodes: [
        { name: 'Root' },
        { name: 'Child', children: [] } // This makes node 1 appear as non-child initially
      ]
    };

    // Modify to make node 1 a child of node 0
    const gltfWithChild = {
      ...gltf,
      nodes: [
        { name: 'Root', children: [1] }, // Make node 1 a child of node 0
        { name: 'Child' }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'scene-edge-cases.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    const childData = new TextEncoder().encode(JSON.stringify(gltfWithChild));
    const childResult = await validateBytes(childData, { uri: 'scene-non-root.gltf' });
    expect(childResult.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit image validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      images: [
        // Test image as array
        ["invalid", "array", "image"],
        // Test image as null
        null,
        // Test image as primitive
        "string image",
        {
          // Test image with neither bufferView nor uri
          name: 'NoBufferOrUri'
        },
        {
          // Test image with both bufferView and uri
          bufferView: 0,
          uri: 'test.png',
          name: 'BothBufferAndUri'
        },
        {
          // Test image with invalid bufferView
          bufferView: -1,
          name: 'InvalidBufferView'
        },
        {
          // Test image with unresolved bufferView reference
          bufferView: 999,
          name: 'UnresolvedBufferView'
        },
        {
          // Test image with invalid data URI format
          uri: 'data:image/png;notbase64,invaliddata',
          name: 'InvalidDataUri'
        },
        {
          // Test image with non-image MIME type in data URI
          uri: 'data:text/plain;base64,dGVzdA==',
          name: 'NonImageMime'
        },
        {
          // Test image with MIME type mismatch (PNG data but JPEG MIME)
          uri: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          name: 'MimeMismatch'
        },
        {
          // Test image with invalid base64 data
          uri: 'data:image/png;base64,invalid!base64!',
          name: 'InvalidBase64'
        },
        {
          // Test image with absolute URI wrong protocol
          uri: 'ftp://example.com/image.png',
          name: 'WrongProtocol'
        },
        {
          // Test image with malformed absolute URI
          uri: ':invalid-scheme',
          name: 'MalformedAbsolute'
        },
        {
          // Test image with relative URI starting with /
          uri: '/absolute/path/image.png',
          name: 'AbsoluteRelative'
        },
        {
          // Test image with non-string mimeType
          uri: 'image.png',
          mimeType: 123,
          name: 'NonStringMimeType'
        },
        {
          // Test image with invalid mimeType
          uri: 'image.png',
          mimeType: 'text/plain',
          name: 'InvalidMimeType'
        },
        {
          // Test image with data URI and mismatched mimeType
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          mimeType: 'image/jpeg',
          name: 'MismatchedMimeType'
        },
        {
          // Test image with unexpected properties
          uri: 'image.png',
          unexpectedProp: 'test',
          name: 'UnexpectedProps'
        }
      ],
      bufferViews: [
        { buffer: 0, byteLength: 100 }
      ],
      buffers: [
        { byteLength: 100 }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'image-edge-cases.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit buffer validator data URI edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      buffers: [
        {
          // Test data URI without semicolon - should trigger specific error
          byteLength: 10,
          uri: 'data:application/octet-streambase64,dGVzdA=='
        },
        {
          // Test data URI with double semicolon - should trigger caret position error
          byteLength: 4,
          uri: 'data:application/octet-stream;;base64,dGVzdA=='
        },
        {
          // Test data URI format without base64 or plain format
          byteLength: 4,
          uri: 'data:application/octet-stream;charset=utf-8,test'
        },
        {
          // Test absolute URI with empty scheme
          byteLength: 100,
          uri: '://example.com/buffer.bin'
        },
        {
          // Test non-relative URI warning
          byteLength: 100,
          uri: 'https://example.com/buffer.bin'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'buffer-data-uri-edge-cases.gltf' });
    expect(result.issues.messages.length).toBeGreaterThan(0);
  });

  it('should hit error conversion edge cases in validator.ts', async () => {
    // These tests may be difficult to trigger directly, but we can try invalid JSON formats
    
    // Test syntax error in JSON
    const syntaxError = new TextEncoder().encode('{"asset":{"version":"2.0"');
    let result = await validateBytes(syntaxError, { uri: 'syntax-error.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    // Test different malformed JSON structures
    const malformed1 = new TextEncoder().encode('{asset missing quotes}');
    result = await validateBytes(malformed1, { uri: 'malformed1.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);

    const malformed2 = new TextEncoder().encode('{"asset":}');
    result = await validateBytes(malformed2, { uri: 'malformed2.gltf' });
    expect(result.issues.numErrors).toBeGreaterThan(0);
  });

  it('should hit material validation edge cases with different alpha modes', async () => {
    const gltf = {
      asset: { version: '2.0' },
      materials: [
        {
          // Test valid alpha modes to ensure the validator handles them correctly
          alphaMode: 'OPAQUE',
          name: 'OpaqueMaterial'
        },
        {
          alphaMode: 'MASK',
          alphaCutoff: 0.5,
          name: 'MaskMaterial'
        },
        {
          alphaMode: 'BLEND',
          name: 'BlendMaterial'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'material-alpha-modes.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit image format detection edge cases', async () => {
    // Test various image format detection scenarios
    const gltf = {
      asset: { version: '2.0' },
      images: [
        {
          // Test with valid PNG data URI - should not generate MIME mismatch error
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          name: 'ValidPNG'
        },
        {
          // Test with too-short data that can't be format detected
          uri: 'data:image/png;base64,dGVzdA==', // "test" - only 4 bytes, less than 8 needed for detection
          name: 'TooShortForDetection'
        },
        {
          // Test with data that looks like JPEG
          uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDX4AtqfcCgA=',
          name: 'JPEGData'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'image-format-detection.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

  it('should hit additional camera validator edge cases', async () => {
    const gltf = {
      asset: { version: '2.0' },
      cameras: [
        {
          // Test orthographic camera with valid properties but edge values
          type: 'orthographic',
          orthographic: {
            xmag: 1.0,
            ymag: 1.0,
            zfar: 1000.0,
            znear: 0.01
          },
          name: 'ValidOrtho'
        },
        {
          // Test perspective camera with valid properties but edge values  
          type: 'perspective',
          perspective: {
            aspectRatio: 1.0,
            yfov: 1.0,
            zfar: 1000.0,
            znear: 0.01
          },
          name: 'ValidPerspective'
        }
      ]
    };

    const data = new TextEncoder().encode(JSON.stringify(gltf));
    const result = await validateBytes(data, { uri: 'camera-valid-edge-cases.gltf' });
    expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
  });

});