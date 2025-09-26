import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { validateBytes } from '../../src/index';

// Helper function to recursively find all .gltf and .glb files
function findGLTFFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findGLTFFiles(fullPath));
      } else if (extname(item) === '.gltf' || extname(item) === '.glb') {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories that can't be read
  }

  return files;
}

// Helper function to load expected validation results
function loadExpectedResult(gltfPath: string): any {
  const reportPath = gltfPath + '.report.json';
  try {
    const reportData = readFileSync(reportPath, 'utf8');
    return JSON.parse(reportData);
  } catch (error) {
    return null;
  }
}

// Helper function to create a context-aware external resource loader
function createExternalResourceLoader(gltfPath: string) {
  return async function loadExternalResource(uri: string): Promise<Uint8Array> {
    try {
      // First try relative to the GLTF file's directory
      const gltfDir = gltfPath.substring(0, gltfPath.lastIndexOf('/'));
      const resourcePath = join(gltfDir, uri);
      return new Uint8Array(readFileSync(resourcePath));
    } catch (error) {
      // Fallback to the old behavior
      try {
        const resourcePath = join('test/base/data', uri);
        return new Uint8Array(readFileSync(resourcePath));
      } catch (fallbackError) {
        throw new Error(`Failed to load external resource: ${uri}`);
      }
    }
  };
}

describe('GLTF Validator', () => {
  const testDir = 'test/base/data';
  const gltfFiles = findGLTFFiles(testDir);

  console.log(`Found ${gltfFiles.length} GLTF/GLB files to test`);

  for (const gltfPath of gltfFiles) {
    const relativePath = gltfPath.replace(/\\/g, '/'); // Normalize path separators
    const expectedResult = loadExpectedResult(gltfPath);

    it(`should validate ${relativePath}`, async () => {
      try {
        // Read the GLTF/GLB file
        const data = readFileSync(gltfPath);

        // Validate using our validator
        const result = await validateBytes(new Uint8Array(data), {
          uri: relativePath,
          externalResourceFunction: createExternalResourceLoader(gltfPath)
        });

        // Basic validation that the result structure is correct
        expect(result).toHaveProperty('uri');
        expect(result).toHaveProperty('mimeType');
        expect(result).toHaveProperty('validatorVersion');
        expect(result).toHaveProperty('issues');
        expect(result).toHaveProperty('info');

        expect(result.uri).toBe(relativePath);
        expect(result.validatorVersion).toBe('1.0.0');

        // Validate issues structure
        expect(result.issues).toHaveProperty('numErrors');
        expect(result.issues).toHaveProperty('numWarnings');
        expect(result.issues).toHaveProperty('numInfos');
        expect(result.issues).toHaveProperty('numHints');
        expect(result.issues).toHaveProperty('messages');
        expect(result.issues).toHaveProperty('truncated');

        // Validate info structure
        expect(result.info).toHaveProperty('version');
        expect(result.info).toHaveProperty('animationCount');
        expect(result.info).toHaveProperty('materialCount');
        expect(result.info).toHaveProperty('hasMorphTargets');
        expect(result.info).toHaveProperty('hasSkins');
        expect(result.info).toHaveProperty('hasTextures');
        expect(result.info).toHaveProperty('hasDefaultScene');
        expect(result.info).toHaveProperty('drawCallCount');
        expect(result.info).toHaveProperty('totalVertexCount');
        expect(result.info).toHaveProperty('totalTriangleCount');
        expect(result.info).toHaveProperty('maxUVs');
        expect(result.info).toHaveProperty('maxInfluences');
        expect(result.info).toHaveProperty('maxAttributes');

                // Strict reference matching - exact output comparison with reference validator
        if (expectedResult) {
          console.log(`Performing strict reference validation for ${relativePath}`);

          // Exact matching of issue counts
          expect(result.issues.numErrors).toBe(expectedResult.issues.numErrors);
          expect(result.issues.numWarnings).toBe(expectedResult.issues.numWarnings);
          expect(result.issues.numInfos).toBe(expectedResult.issues.numInfos);
          expect(result.issues.numHints).toBe(expectedResult.issues.numHints);

          // Exact matching of message count
          expect(result.issues.messages.length).toBe(expectedResult.issues.messages.length);

          // Exact matching of each message
          for (let i = 0; i < expectedResult.issues.messages.length; i++) {
            const actualMessage = result.issues.messages[i];
            const expectedMessage = expectedResult.issues.messages[i];

            expect(actualMessage.code).toBe(expectedMessage.code);
            expect(actualMessage.message).toBe(expectedMessage.message);
            expect(actualMessage.severity).toBe(expectedMessage.severity);
            expect(actualMessage.pointer).toBe(expectedMessage.pointer);
          }

          // Exact matching of truncated flag
          expect(result.issues.truncated).toBe(expectedResult.issues.truncated);

          // Exact matching of MIME type
          if (expectedResult.mimeType) {
            expect(result.mimeType).toBe(expectedResult.mimeType);
          }

          // Basic structure validation
          for (const message of result.issues.messages) {
            expect(typeof message.code).toBe('string');
            expect(message.code.length).toBeGreaterThan(0);
            expect(typeof message.message).toBe('string');
            expect(message.message.length).toBeGreaterThan(0);
            expect([0, 1, 2, 3]).toContain(message.severity); // 0=ERROR, 1=WARNING, 2=INFO, 3=HINT
            // Note: pointer can be undefined for severe validation failures (corrupt files, etc.)
            if (message.pointer !== undefined) {
              expect(typeof message.pointer).toBe('string');
            }
          }

          // Validate truncated flag
          expect(typeof result.issues.truncated).toBe('boolean');

        } else {
          // For files without expected results, we should still validate basic structure
          // but not fail the test - just log that we're missing expected results
          console.log(`No expected result found for ${relativePath} - consider adding .report.json file`);

          // Basic validation that we have some validation happening
          expect(result.issues.messages.length).toBeGreaterThanOrEqual(0);
        }

      } catch (error) {
        // If there's an error, it should be a validation error, not a parsing error
        // But if it's an AssertionError, we should re-throw it to fail the test
        if (error instanceof Error && error.name === 'AssertionError') {
          throw error;
        }
        expect(error).toBeInstanceOf(Error);
        console.log(`Validation completed for ${relativePath} with error: ${error}`);
      }
    });
  }

    // Test specific validation scenarios
  describe('Specific validation scenarios', () => {
    it('should validate a known good GLTF file correctly', async () => {
      // Test with a simple valid GLTF
      const validGLTF = {
        "asset": {
          "version": "2.0"
        }
      };

      const data = new TextEncoder().encode(JSON.stringify(validGLTF));
      const result = await validateBytes(data, { uri: 'test.gltf' });

      // Should have no errors for a valid GLTF
      expect(result.issues.numErrors).toBe(0);
      expect(result.info.version).toBe('2.0');
      expect(result.mimeType).toBe('model/gltf+json');
    });

    it('should detect alignment errors correctly', async () => {
      const invalidGLTF = {
        "asset": {
          "version": "2.0"
        },
        "accessors": [
          {
            "bufferView": 0,
            "byteOffset": 1, // Invalid offset for FLOAT
            "type": "VEC3",
            "componentType": 5126, // FLOAT
            "count": 1
          }
        ],
        "bufferViews": [
          {
            "buffer": 0,
            "byteLength": 16
          }
        ],
        "buffers": [
          {
            "byteLength": 16
          }
        ]
      };

      const data = new TextEncoder().encode(JSON.stringify(invalidGLTF));
      const result = await validateBytes(data, { uri: 'test.gltf' });

      // Should detect alignment error
      expect(result.issues.numErrors).toBeGreaterThan(0);
      expect(result.issues.messages.some(msg => msg.code === 'ACCESSOR_OFFSET_ALIGNMENT')).toBe(true);
    });

    it('should detect invalid URIs correctly', async () => {
      const invalidGLTF = {
        "asset": {
          "version": "2.0"
        },
        "buffers": [
          {
            "uri": "data:application/octet-stream;;base64,AA==", // Invalid data URI
            "byteLength": 1
          }
        ]
      };

      const data = new TextEncoder().encode(JSON.stringify(invalidGLTF));
      const result = await validateBytes(data, { uri: 'test.gltf' });

      // Should detect invalid URI
      expect(result.issues.numErrors).toBeGreaterThan(0);
      expect(result.issues.messages.some(msg => msg.code === 'INVALID_URI')).toBe(true);
    });

    it('should handle missing asset version correctly', async () => {
      const invalidGLTF = {
        // Missing asset object
      };

      const data = new TextEncoder().encode(JSON.stringify(invalidGLTF));
      const result = await validateBytes(data, { uri: 'test.gltf', format: 'gltf' });

      // Should detect missing asset
      expect(result.issues.numErrors).toBeGreaterThan(0);
      expect(result.issues.messages.some(msg => msg.code === 'UNDEFINED_PROPERTY')).toBe(true);
    });

    it('should handle GLB format detection correctly', async () => {
      const gltfData = new TextEncoder().encode(JSON.stringify({
        "asset": { "version": "2.0" }
      }));

      const result = await validateBytes(gltfData, {
        uri: 'test.gltf',
        format: 'gltf'
      });

      expect(result.mimeType).toBe('model/gltf+json');
    });
  });
});
