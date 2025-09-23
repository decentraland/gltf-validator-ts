import { describe, it, expect } from 'vitest';
import { ImageValidator } from '../../src/validators/image-validator';
import { GLTF, Issues, ValidationOptions } from '../../src/types';

describe('ImageValidator', () => {
  let validator: ImageValidator;
  let mockIssues: Issues;
  let mockOptions: ValidationOptions;

  beforeEach(() => {
    mockIssues = {
      numErrors: 0,
      numWarnings: 0,
      numInfos: 0,
      numHints: 0,
      messages: [],
      truncated: false
    };
    mockOptions = {};
    validator = new ImageValidator();
  });

  describe('validate', () => {
    it('should validate empty images array', () => {
      const gltf: Partial<GLTF> = {
        images: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate image with URI', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: 'texture.png'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate image with buffer view', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            bufferView: 0,
            mimeType: 'image/png'
          }
        ],
        bufferViews: [
          {
            buffer: 0,
            byteLength: 1024
          }
        ],
        buffers: [
          { byteLength: 1024 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate different mime types', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            bufferView: 0,
            mimeType: 'image/png'
          },
          {
            bufferView: 1,
            mimeType: 'image/jpeg'
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 1024 },
          { buffer: 0, byteLength: 1024, byteOffset: 1024 }
        ],
        buffers: [
          { byteLength: 2048 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate data URI', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid buffer view reference', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            bufferView: 10, // Invalid reference
            mimeType: 'image/png'
          }
        ],
        bufferViews: []
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle missing mime type with buffer view', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            bufferView: 0
            // Missing mimeType
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 1024 }
        ],
        buffers: [
          { byteLength: 1024 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid mime type', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            bufferView: 0,
            mimeType: 'image/invalid'
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 1024 }
        ],
        buffers: [
          { byteLength: 1024 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle image with both URI and buffer view', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: 'texture.png',
            bufferView: 0, // Should not have both
            mimeType: 'image/png'
          }
        ],
        bufferViews: [
          { buffer: 0, byteLength: 1024 }
        ],
        buffers: [
          { byteLength: 1024 }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle image with neither URI nor buffer view', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            name: 'EmptyImage'
            // Missing both uri and bufferView
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate image with name', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            name: 'DiffuseTexture',
            uri: 'diffuse.png'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate image with extensions', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: 'texture.png',
            extensions: {
              'CUSTOM_extension': {
                value: 42
              }
            }
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should validate image with extras', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: 'texture.png',
            extras: {
              customData: 'image'
            }
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle invalid data URI', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: 'data:invalid'
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle relative URI paths', () => {
      const gltf: Partial<GLTF> = {
        images: [
          { uri: './textures/diffuse.png' },
          { uri: '../images/normal.jpg' },
          { uri: 'textures/roughness.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle absolute URI paths', () => {
      const gltf: Partial<GLTF> = {
        images: [
          { uri: 'http://example.com/texture.png' },
          { uri: 'https://cdn.example.com/image.jpg' },
          { uri: 'file:///path/to/image.png' }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle null image in array', () => {
      const gltf: any = {
        images: [
          { uri: 'texture.png' },
          null
        ]
      };

      const result = validator.validate(gltf, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle empty URI string', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: ''
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });

    it('should handle mime type with buffer view URI combination', () => {
      const gltf: Partial<GLTF> = {
        images: [
          {
            uri: 'texture.png',
            mimeType: 'image/png' // Should not have mimeType with URI
          }
        ]
      };

      const result = validator.validate(gltf as GLTF, mockIssues, mockOptions);

      expect(result).toBeDefined();
    });
  });
});