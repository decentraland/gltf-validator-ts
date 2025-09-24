import { describe, it, expect } from 'vitest';
import { AssetValidator } from '../../../src/validators/asset-validator';
import { Severity } from '../../../src/types';

describe('AssetValidator', () => {
  let validator: AssetValidator;

  beforeEach(() => {
    validator = new AssetValidator();
  });

  describe('validate', () => {
    it('should validate valid asset object', () => {
      const asset = {
        version: '2.0',
        generator: 'Test Generator',
        copyright: 'Test Copyright'
      };

      const messages = validator.validate(asset);
      
      expect(messages).toHaveLength(0);
    });

    it('should error on missing version', () => {
      const asset = {};

      const messages = validator.validate(asset);
      
      expect(messages).toHaveLength(1);
      expect(messages[0].code).toBe('UNDEFINED_PROPERTY');
      expect(messages[0].severity).toBe(Severity.ERROR);
      expect(messages[0].pointer).toBe('/asset');
    });

    it('should error on invalid version format', () => {
      const asset = {
        version: 'invalid'
      };

      const messages = validator.validate(asset);
      
      expect(messages.length).toBeGreaterThan(0);
      const versionError = messages.find(m => m.code === 'PATTERN_MISMATCH');
      expect(versionError).toBeDefined();
      expect(versionError?.severity).toBe(Severity.ERROR);
    });

    it('should error on unsupported version', () => {
      const asset = {
        version: '1.0'
      };

      const messages = validator.validate(asset);
      
      expect(messages.length).toBeGreaterThan(0);
      const unsupportedError = messages.find(m => m.code === 'UNKNOWN_ASSET_MAJOR_VERSION');
      expect(unsupportedError).toBeDefined();
      expect(unsupportedError?.severity).toBe(Severity.ERROR);
      expect(unsupportedError?.message).toBe('Unknown glTF major asset version: 1.');
    });

    it('should warn on future version', () => {
      const asset = {
        version: '3.0'
      };

      const messages = validator.validate(asset);
      
      expect(messages.length).toBeGreaterThan(0);
      const futureError = messages.find(m => m.code === 'UNKNOWN_ASSET_MAJOR_VERSION');
      expect(futureError).toBeDefined();
      expect(futureError?.severity).toBe(Severity.ERROR);
      expect(futureError?.message).toBe('Unknown glTF major asset version: 3.');
    });

    it('should validate minVersion if present', () => {
      const asset = {
        version: '2.0',
        minVersion: '2.0'
      };

      const messages = validator.validate(asset);
      
      expect(messages).toHaveLength(0);
    });

    it('should error on invalid minVersion', () => {
      const asset = {
        version: '2.0',
        minVersion: 'invalid'
      };

      const messages = validator.validate(asset);
      
      expect(messages.length).toBeGreaterThan(0);
      const minVersionError = messages.find(m => m.pointer?.includes('minVersion'));
      expect(minVersionError).toBeDefined();
    });

    it('should validate optional properties', () => {
      const asset = {
        version: '2.0',
        generator: 'Test Generator',
        copyright: 'Test Copyright'
      };

      const messages = validator.validate(asset);
      
      expect(messages).toHaveLength(0);
    });

    it('should handle empty asset object', () => {
      const asset = {};

      const messages = validator.validate(asset);
      
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].code).toBe('UNDEFINED_PROPERTY');
    });

    it('should validate with additional properties', () => {
      const asset = {
        version: '2.0',
        generator: 'Test Generator',
        customProperty: 'Custom Value',
        extensions: {},
        extras: {}
      };

      const messages = validator.validate(asset);
      
      // Should warn on unexpected properties but not error
      expect(messages.length).toBe(3); // customProperty, extensions, extras
      expect(messages.every(m => m.severity === Severity.WARNING)).toBe(true);
      expect(messages.every(m => m.code === 'UNEXPECTED_PROPERTY')).toBe(true);
    });
  });
});