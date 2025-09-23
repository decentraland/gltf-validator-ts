import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { validateBytes } from '../src/index';

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
      // Fallback: try relative to extension test directory
      try {
        const extensionMatch = gltfPath.match(/test[\/\\]ext[\/\\]([^\/\\]+)/);
        if (extensionMatch) {
          const extensionDir = `test/ext/${extensionMatch[1]}`;
          const resourcePath = join(extensionDir, uri);
          return new Uint8Array(readFileSync(resourcePath));
        }
        throw error;
      } catch (fallbackError) {
        throw new Error(`Failed to load external resource: ${uri}`);
      }
    }
  };
}

describe('GLTF Extensions Validator', () => {
  const testDir = 'test/ext';
  const gltfFiles = findGLTFFiles(testDir);

  console.log(`Found ${gltfFiles.length} GLTF/GLB extension files to test`);

  // Group tests by extension for better organization
  const extensionGroups: { [key: string]: string[] } = {};

  for (const gltfPath of gltfFiles) {
    const extensionMatch = gltfPath.match(/test[\/\\]ext[\/\\]([^\/\\]+)/);
    if (extensionMatch) {
      const extensionName = extensionMatch[1];
      if (!extensionGroups[extensionName]) {
        extensionGroups[extensionName] = [];
      }
      extensionGroups[extensionName].push(gltfPath);
    }
  }

  // Create test suites for each extension
  for (const [extensionName, extensionFiles] of Object.entries(extensionGroups)) {
    describe(`${extensionName}`, () => {
      for (const gltfPath of extensionFiles) {
        const relativePath = gltfPath.replace(/\\/g, '/'); // Normalize path separators
        const expectedResult = loadExpectedResult(gltfPath);

        it(`should validate ${relativePath}`, async () => {
          console.log(`Performing strict reference validation for ${relativePath}`);

          try {
            // Read the GLTF/GLB file
            const data = readFileSync(gltfPath);

            // Validate using our validator
            const result = await validateBytes(new Uint8Array(data), {
              uri: relativePath,
              externalResourceFunction: createExternalResourceLoader(gltfPath)
            });

            // If we have expected results, do strict comparison
            if (expectedResult) {
              // Exact matching of issue counts
              expect(result.issues.numErrors).toBe(expectedResult.issues.numErrors);
              expect(result.issues.numWarnings).toBe(expectedResult.issues.numWarnings);
              expect(result.issues.numInfos).toBe(expectedResult.issues.numInfos);
              expect(result.issues.numHints).toBe(expectedResult.issues.numHints);

              // Check that we have the same number of messages
              expect(result.issues.messages.length).toBe(expectedResult.issues.messages.length);

              // Strict validation of each message
              for (let i = 0; i < result.issues.messages.length; i++) {
                const actualMessage = result.issues.messages[i];
                const expectedMessage = expectedResult.issues.messages[i];

                expect(actualMessage.code).toBe(expectedMessage.code);
                expect(actualMessage.message).toBe(expectedMessage.message);
                expect(actualMessage.severity).toBe(expectedMessage.severity);
                expect(actualMessage.pointer).toBe(expectedMessage.pointer);
              }
            } else {
              // If no expected results file, just ensure validation completes without crashing
              expect(result).toBeDefined();
              expect(result.issues).toBeDefined();
              expect(typeof result.issues.numErrors).toBe('number');
              expect(typeof result.issues.numWarnings).toBe('number');
              expect(typeof result.issues.numInfos).toBe('number');
              expect(typeof result.issues.numHints).toBe('number');
              expect(Array.isArray(result.issues.messages)).toBe(true);

              // Log the results for manual review
              console.log(`No expected results for ${relativePath}`);
              console.log(`Errors: ${result.issues.numErrors}, Warnings: ${result.issues.numWarnings}, Infos: ${result.issues.numInfos}, Hints: ${result.issues.numHints}`);
            }

          } catch (error) {
            console.log(`Validation completed for ${relativePath} with error: ${error}`);

            // If we have expected results, verify the error is expected
            if (expectedResult) {
              // Some tests might expect validation to fail in a specific way
              // For now, we'll allow the error to bubble up for manual review
              throw error;
            } else {
              // Without expected results, we can't determine if this error is expected
              console.log(`No expected results to compare error against for ${relativePath}`);
              throw error;
            }
          }
        });
      }
    });
  }
});