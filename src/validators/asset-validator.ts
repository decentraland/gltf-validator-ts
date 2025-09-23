import { GLTFAsset, ValidationMessage, Severity } from '../types';

export class AssetValidator {
  validate(asset: GLTFAsset): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check required version
    if (!asset.version) {
      messages.push({
        code: 'UNDEFINED_PROPERTY',
        message: "Property 'version' must be defined.",
        severity: Severity.ERROR,
        pointer: '/asset'
      });
      return messages;
    }

    if (typeof asset.version !== 'string') {
      messages.push({
        code: 'TYPE_MISMATCH',
        message: 'Asset version must be a string.',
        severity: Severity.ERROR,
        pointer: '/asset/version'
      });
    } else {
      // Validate version format
      const versionMatch = asset.version.match(/^(\d+)\.(\d+)$/);
      if (!versionMatch) {
        messages.push({
          code: 'PATTERN_MISMATCH',
          message: `Value '${asset.version}' does not match regexp pattern '^([0-9]+)\\.([0-9]+)$'.`,
          severity: Severity.ERROR,
          pointer: '/asset/version'
        });
      } else {
        const major = parseInt(versionMatch[1] || '0');
        const minor = parseInt(versionMatch[2] || '0');

        if (major !== 2) {
          messages.push({
            code: 'UNKNOWN_ASSET_MAJOR_VERSION',
            message: `Unknown glTF major asset version: ${major}.`,
            severity: Severity.ERROR,
            pointer: '/asset/version'
          });
        } else if (minor !== 0) {
          messages.push({
            code: 'UNKNOWN_ASSET_MINOR_VERSION',
            message: `Unknown glTF minor asset version: ${minor}.`,
            severity: Severity.WARNING,
            pointer: '/asset/version'
          });
        }
      }
    }

    // Check minVersion if present
    if (asset.minVersion !== undefined) {
      if (typeof asset.minVersion !== 'string') {
        messages.push({
          code: 'TYPE_MISMATCH',
          message: 'Asset minVersion must be a string.',
          severity: Severity.ERROR,
          pointer: '/asset/minVersion'
        });
      } else {
        const minVersionMatch = asset.minVersion.match(/^(\d+)\.(\d+)$/);
        if (!minVersionMatch) {
          messages.push({
            code: 'INVALID_VERSION',
            message: 'Asset minVersion must be in format "major.minor".',
            severity: Severity.ERROR,
            pointer: '/asset/minVersion'
          });
        } else {
          const minMajor = parseInt(minVersionMatch[1] || '0');
          const minMinor = parseInt(minVersionMatch[2] || '0');

          if (minMajor !== 2) {
            messages.push({
              code: 'INVALID_VERSION',
              message: 'Asset minVersion major must be 2.',
              severity: Severity.ERROR,
              pointer: '/asset/minVersion'
            });
          }

          // Check if minVersion is greater than version
          if (asset.version && typeof asset.version === 'string') {
            const versionMatch = asset.version.match(/^(\d+)\.(\d+)$/);
            if (versionMatch) {
              const major = parseInt(versionMatch[1] || '0');
              const minor = parseInt(versionMatch[2] || '0');

              if (minMajor > major || (minMajor === major && minMinor > minor)) {
                messages.push({
                  code: 'ASSET_MIN_VERSION_GREATER_THAN_VERSION',
                  message: `Asset minVersion '${asset.minVersion}' is greater than version '${asset.version}'.`,
                  severity: Severity.ERROR,
                  pointer: '/asset/minVersion'
                });
              }
            }
          }
        }
      }
    }

    // Check for unexpected properties
    const expectedProperties = ['version', 'minVersion', 'generator', 'copyright'];
    for (const key in asset) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `/asset/${key}`
        });
      }
    }

    return messages;
  }
}
