import { describe, it, expect } from 'vitest';
import { BufferValidator } from '../../src/validators/buffer-validator';
import { Severity } from '../../src/types';

describe('BufferValidator', () => {
  let validator: BufferValidator;

  beforeEach(() => {
    validator = new BufferValidator();
  });

  describe('validate', () => {
    it('should validate valid buffer with data URI', () => {
      const buffer = {
        byteLength: 3,
        uri: 'data:application/octet-stream;base64,AAAA' // 3 bytes when decoded
      };

      const messages = validator.validate(buffer, 0);
      
      if (messages.length > 0) {
        console.log('Unexpected messages:', messages);
      }
      expect(messages).toHaveLength(0);
    });

    it('should error on missing byteLength', () => {
      const buffer = {
        uri: 'test.bin'
      };

      const messages = validator.validate(buffer, 0);
      
      expect(messages.length).toBeGreaterThan(0);
      const byteLengthError = messages.find(m => m.code === 'UNDEFINED_PROPERTY');
      expect(byteLengthError).toBeDefined();
      expect(byteLengthError?.message).toBe("Property 'byteLength' must be defined.");
    });

    it('should error on negative byteLength', () => {
      const buffer = {
        byteLength: -1,
        uri: 'test.bin'
      };

      const messages = validator.validate(buffer, 0);
      
      expect(messages.length).toBeGreaterThan(0);
      const negativeError = messages.find(m => m.message?.includes('negative') || m.message?.includes('positive'));
      expect(negativeError).toBeDefined();
    });

    it('should validate buffer with data URI', () => {
      const buffer = {
        byteLength: 6,
        uri: 'data:application/octet-stream;base64,AAAAAAAA' // 6 bytes when decoded
      };

      const messages = validator.validate(buffer, 0);
      
      if (messages.length > 0) {
        console.log('Test 2 messages:', messages);
      }
      expect(messages).toHaveLength(0);
    });

    it('should error on invalid data URI', () => {
      const buffer = {
        byteLength: 16,
        uri: 'data:application/octet-stream;base64,invalid!'
      };

      const messages = validator.validate(buffer, 0);
      
      expect(messages.length).toBeGreaterThan(0);
      const dataUriError = messages.find(m => m.message?.includes('data URI') || m.message?.includes('base64'));
      expect(dataUriError).toBeDefined();
    });

    it('should error on data URI with wrong mime type', () => {
      const buffer = {
        byteLength: 8,
        uri: 'data:text/plain;base64,AAAAAAAA'
      };

      const messages = validator.validate(buffer, 0);
      
      expect(messages.length).toBeGreaterThan(0);
      const mimeError = messages.find(m => m.code === 'BUFFER_DATA_URI_MIME_TYPE_INVALID');
      expect(mimeError).toBeDefined();
      expect(mimeError?.message).toContain("Data URI media type must be 'application/octet-stream'");
    });

    it('should error on data URI with wrong byte length', () => {
      const buffer = {
        byteLength: 100, // Much larger than actual data
        uri: 'data:application/octet-stream;base64,AAAA' // Only 4 bytes when decoded
      };

      const messages = validator.validate(buffer, 0);
      
      expect(messages.length).toBeGreaterThan(0);
      const lengthError = messages.find(m => m.message?.includes('length') || m.message?.includes('size'));
      expect(lengthError).toBeDefined();
    });

    it('should error on non-relative external URI', () => {
      const buffer = {
        byteLength: 100,
        uri: 'http://example.com/buffer.bin'
      };

      const messages = validator.validate(buffer, 0);
      
      expect(messages.length).toBeGreaterThan(0);
      const uriError = messages.find(m => m.message?.includes('relative') || m.message?.includes('external'));
      expect(uriError).toBeDefined();
    });

    it('should validate external file URI', () => {
      const buffer = {
        byteLength: 100,
        uri: 'buffer.bin'
      };

      const messages = validator.validate(buffer, 0);
      
      // Should not error on relative URI (though file may not exist)
      const uriError = messages.find(m => m.message?.includes('relative') && m.severity === Severity.ERROR);
      expect(uriError).toBeUndefined();
    });

    it('should handle empty buffer array', () => {
      const buffer: any = [];

      const messages = validator.validate(buffer, 0);
      
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].code).toBe('TYPE_MISMATCH');
    });

    it('should validate buffer with extensions and extras', () => {
      const buffer = {
        byteLength: 3,
        uri: 'data:application/octet-stream;base64,AAAA', // 3 bytes when decoded  
        extensions: {},
        extras: {}
      };

      const messages = validator.validate(buffer, 0);
      
      if (messages.length > 0) {
        console.log('Test 3 messages:', messages);
      }
      expect(messages).toHaveLength(0);
    });
  });
});