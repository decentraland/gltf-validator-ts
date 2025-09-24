import {
  ValidationResult,
  ValidationOptions,
  GLTF,
  PrimitiveMode,
  ResourceReference,
  ValidationMessage
} from './types';
import { GLTFParser } from './parser';
import { GLTFValidator } from './validators/gltf-validator';
import { GLBValidator } from './validators/glb-validator';

const VALIDATOR_VERSION = '2.0.0-dev.3.0';

export async function validateBytes(
  data: Uint8Array,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const {
    uri = 'unknown',
    format,
    maxIssues = 100,
    ignoredIssues = [],
    onlyIssues = [],
    severityOverrides = {},
    externalResourceFunction
  } = options;

  // Detect format if not specified
  let detectedFormat = format;
  if (!detectedFormat) {
    // Try URI-based detection first
    if (uri.toLowerCase().endsWith('.glb')) {
      detectedFormat = 'glb';
    } else if (uri.toLowerCase().endsWith('.gltf')) {
      detectedFormat = 'gltf';
    } else {
      // Fall back to content-based detection
      detectedFormat = detectFormat(data) || undefined;
    }
  }

  // If format detection fails, try GLB first (most GLB parsing errors should be caught and converted)
  if (!detectedFormat) {
    // Try GLB parsing first since many "undetectable" files are malformed GLB files
    try {
      await GLBValidator.parseGLB(data);
      detectedFormat = 'glb';
    } catch {
      // If GLB parsing fails completely, try GLTF parsing
      try {
        const parser = new GLTFParser();
        parser.parse(data);
        detectedFormat = 'gltf';
      } catch {
        // If both fail, we'll handle this as a GLB parsing error to get proper error messages
        detectedFormat = 'glb';
      }
    }
  }

  // Parse the data with proper exception handling
  let gltf: GLTF;
  let resources: ResourceReference[] = [];
  let parsingErrors: ValidationMessage[] = [];

  if (detectedFormat === 'glb') {
    try {
      const glbResult = await GLBValidator.parseGLB(data);
      gltf = glbResult.gltf;
      resources = glbResult.resources as ResourceReference[];
      // Convert GLB warnings to validation messages
      if (glbResult.warnings && glbResult.warnings.length > 0) {
        for (const warning of glbResult.warnings) {
          parsingErrors.push(...convertGLBExceptionToValidationMessages(new Error(warning), data));
        }
      }
    } catch (error) {
      // Convert GLB parsing exceptions to validation errors
      parsingErrors = convertGLBExceptionToValidationMessages(error as Error, data);
      // Create a minimal GLTF object so validation can continue
      gltf = { asset: { version: '2.0' } };
    }
  } else {
    try {
      const parser = new GLTFParser();
      gltf = parser.parse(data);
    } catch (error) {
      // Convert JSON parsing exceptions to validation errors
      parsingErrors = convertGLTFExceptionToValidationMessages(error as Error);
      // Create a minimal GLTF object so validation can continue
      gltf = { asset: { version: '2.0' } };
    }

    // Track all buffer resources
    if (gltf.buffers) {
      for (let i = 0; i < gltf.buffers.length; i++) {
        const buffer = gltf.buffers[i];
        if (buffer) {
          let mimeType = 'application/gltf-buffer';
          let storage: 'external' | 'data-uri' | 'glb' = 'external';
          let uri: string | undefined = undefined;
          let byteLength = buffer.byteLength;

          if (buffer.uri) {
            if (buffer.uri.startsWith('data:')) {
              storage = 'data-uri';
              // For GLTF buffers, always use application/gltf-buffer as the MIME type
              mimeType = 'application/gltf-buffer';
            } else {
              uri = buffer.uri;
              // Load external resource if function provided
              if (externalResourceFunction) {
                try {
                  const bufferData = await externalResourceFunction(buffer.uri);
                  byteLength = bufferData.length;
                } catch (error) {
                  // Handle external resource loading errors
                }
              }
            }
          } else {
            // For GLTF buffers without URI, use application/gltf-buffer as the MIME type
            mimeType = 'application/gltf-buffer';
          }

          const resource: ResourceReference = {
            pointer: `/buffers/${i}`,
            mimeType,
            storage,
            byteLength
          };
          if (uri) {
            resource.uri = uri;
          }
          resources.push(resource);
        }
      }
    }

    // Track all image resources
    if (gltf.images) {
      for (let i = 0; i < gltf.images.length; i++) {
        const image = gltf.images[i];
        if (image) {
          let mimeType: string | undefined = undefined;
          let storage: 'external' | 'data-uri' | 'glb' = 'external';
          let uri: string | undefined = undefined;

          if (image.uri) {
            if (image.uri.startsWith('data:')) {
              storage = 'data-uri';
              // Extract MIME type from data URI
              const match = image.uri.match(/^data:([^;]+)/);
              if (match) {
                mimeType = match[1];
              }
            } else {
              uri = image.uri;
              // Try to determine MIME type from file extension
              const extension = image.uri.split('.').pop()?.toLowerCase();
              if (extension === 'png') {
                mimeType = 'image/png';
              } else if (extension === 'jpg' || extension === 'jpeg') {
                mimeType = 'image/jpeg';
              } else if (extension === 'ktx2') {
                mimeType = 'image/ktx2';
              }
            }
          } else if (image.bufferView !== undefined) {
            // Image data is in a buffer view
            if (image.mimeType) {
              mimeType = image.mimeType;
            }
          }

          const resource: ResourceReference = {
            pointer: `/images/${i}`,
            storage
          };
          if (mimeType) {
            resource.mimeType = mimeType;
          }
          if (uri) {
            resource.uri = uri;
          }
          resources.push(resource);
        }
      }
    }
  }

  // Validate the GLTF structure
  const validatorOptions: ValidationOptions = {
    maxIssues: maxIssues ?? 100,
    ignoredIssues,
    onlyIssues,
    severityOverrides
  };
  if (externalResourceFunction) {
    validatorOptions.externalResourceFunction = externalResourceFunction;
  }
  const validator = new GLTFValidator(validatorOptions as any);

  // Load buffer data for validation if external resource function is provided
  if (gltf.buffers && externalResourceFunction) {
    for (let i = 0; i < gltf.buffers.length; i++) {
      const buffer = gltf.buffers[i];
      if (buffer && buffer.uri && !buffer.uri.startsWith('data:')) {
        // Skip loading for clearly invalid URIs or absolute URIs
        let shouldLoadData = true;
        try {
          if (buffer.uri.includes('://')) {
            // Skip loading absolute URIs
            shouldLoadData = false;
          } else {
            if (buffer.uri.includes(':') && !buffer.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
              shouldLoadData = false;
            }
            if (buffer.uri === ':' || buffer.uri.startsWith(':/')) {
              shouldLoadData = false;
            }
          }
        } catch {
          shouldLoadData = false;
        }

        if (shouldLoadData) {
          try {
            const bufferData = await externalResourceFunction(buffer.uri);
            validator.setBufferData(i, bufferData);
          } catch (error) {
            // Buffer data loading failed, will be handled later in IO error checking
          }
        }
      }
    }
  }

  const validationResult = await validator.validate(gltf, detectedFormat === 'glb', resources);

  // Add parsing errors FIRST (GLB errors should come before GLTF validation messages)
  for (let i = parsingErrors.length - 1; i >= 0; i--) {
    const error = parsingErrors[i];
    validationResult.issues.messages.unshift(error);
    if (error.severity === 0) {
      validationResult.issues.numErrors++;
    } else if (error.severity === 1) {
      validationResult.issues.numWarnings++;
    } else if (error.severity === 2) {
      validationResult.issues.numInfos++;
    } else if (error.severity === 3) {
      validationResult.issues.numHints++;
    }
  }

  // Add IO errors for missing external resources
  if (gltf.buffers) {
    for (let i = 0; i < gltf.buffers.length; i++) {
      const buffer = gltf.buffers[i];
      if (buffer && buffer.uri && !buffer.uri.startsWith('data:') && externalResourceFunction) {
        // Skip IO error check for clearly invalid URIs - let buffer validator handle them
        // Also skip for absolute URIs (http/https) to match reference validator behavior
        let shouldCheckIO = true;
        try {
          if (buffer.uri.includes('://')) {
            // Skip IO check for absolute URIs
            shouldCheckIO = false;
          } else {
            // For relative URIs, check basic validity
            if (buffer.uri.includes(':') && !buffer.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
              shouldCheckIO = false;
            }
            if (buffer.uri === ':' || buffer.uri.startsWith(':/')) {
              shouldCheckIO = false;
            }
          }
        } catch {
          shouldCheckIO = false;
        }

        if (shouldCheckIO) {
          try {
            await externalResourceFunction(buffer.uri);
          } catch (error) {
            // Add IO error for missing external resource
            validationResult.issues.messages.push({
              code: 'IO_ERROR',
              message: `Resource not found (${buffer.uri}).`,
              severity: 0, // ERROR
              pointer: `/buffers/${i}/uri`
            });
            validationResult.issues.numErrors++;
          }
        }
      }
    }
  }

  // Add IO errors for missing external image resources
  if (gltf.images && externalResourceFunction) {
    for (let i = 0; i < gltf.images.length; i++) {
      const image = gltf.images[i];
      if (image && image.uri && !image.uri.startsWith('data:')) {
        // Skip IO error check for clearly invalid URIs and absolute URIs
        let shouldCheckIO = true;
        try {
          if (image.uri.includes('://')) {
            // Skip IO check for absolute URIs
            shouldCheckIO = false;
          } else {
            // For relative URIs, check basic validity
            if (image.uri.includes(':') && !image.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
              shouldCheckIO = false;
            }
            if (image.uri === ':' || image.uri.startsWith(':/')) {
              shouldCheckIO = false;
            }
          }
        } catch {
          shouldCheckIO = false;
        }

        if (shouldCheckIO) {
          try {
            await externalResourceFunction(image.uri);
          } catch (error) {
            // Add IO error for missing external resource
            validationResult.issues.messages.push({
              code: 'IO_ERROR',
              message: `Resource not found (${image.uri}).`,
              severity: 0, // ERROR
              pointer: `/images/${i}/uri`
            });
            validationResult.issues.numErrors++;
          }
        }
      }
    }
  }

  // Build the result
  const result: ValidationResult = {
    uri,
    mimeType: detectedFormat === 'glb' ? 'model/gltf-binary' : 'model/gltf+json',
    validatorVersion: VALIDATOR_VERSION,
    issues: validationResult.issues,
    info: {
      version: gltf.asset?.version || 'unknown',
      resources: resources.map(r => ({
        ...r,
        mimeType: r.mimeType || 'application/octet-stream'
      })),
      animationCount: gltf.animations?.length || 0,
      materialCount: gltf.materials?.length || 0,
      hasMorphTargets: hasMorphTargets(gltf),
      hasSkins: !!(gltf.skins && gltf.skins.length > 0),
      hasTextures: !!(gltf.textures && gltf.textures.length > 0),
      hasDefaultScene: gltf.scene !== undefined && gltf.scenes !== undefined && gltf.scene < gltf.scenes.length,
      drawCallCount: calculateDrawCallCount(gltf),
      totalVertexCount: calculateTotalVertexCount(gltf),
      totalTriangleCount: calculateTotalTriangleCount(gltf),
      maxUVs: calculateMaxUVs(gltf),
      maxInfluences: calculateMaxInfluences(gltf),
      maxAttributes: calculateMaxAttributes(gltf)
    }
  };

  return result;
}

function detectFormat(data: Uint8Array): 'gltf' | 'glb' | null {
  // Check for GLB magic number
  if (data.length >= 4) {
    const magic = new DataView(data.buffer, data.byteOffset, 4).getUint32(0, true); // little-endian
    if (magic === 0x46546C67) { // 'glTF'
      return 'glb';
    }
  }

  // Check for JSON (GLTF)
  try {
    const text = new TextDecoder().decode(data);
    const json = JSON.parse(text);
    if (json.asset && json.asset.version) {
      return 'gltf';
    }
  } catch {
    // Not valid JSON
  }

  return null;
}

function hasMorphTargets(gltf: GLTF): boolean {
  if (!gltf.meshes) return false;
  return gltf.meshes.some(mesh =>
    mesh && mesh.primitives && Array.isArray(mesh.primitives) &&
    mesh.primitives.some(primitive =>
      primitive && primitive.targets && primitive.targets.length > 0
    )
  );
}

function calculateDrawCallCount(gltf: GLTF): number {
  if (!gltf.meshes) return 0;
  return gltf.meshes.reduce((count, mesh) =>
    count + (mesh && mesh.primitives && Array.isArray(mesh.primitives) ? mesh.primitives.length : 0), 0
  );
}

function calculateTotalVertexCount(gltf: GLTF): number {
  if (!gltf.meshes || !gltf.accessors) return 0;

  let total = 0;
  for (const mesh of gltf.meshes) {
    if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
      for (const primitive of mesh.primitives) {
        if (primitive && primitive.attributes && primitive.attributes['POSITION'] !== undefined) {
          const accessor = gltf.accessors[primitive.attributes['POSITION']];
          if (accessor) {
            total += accessor.count;
          }
        }
      }
    }
  }
  return total;
}

function calculateTotalTriangleCount(gltf: GLTF): number {
  if (!gltf.meshes || !gltf.accessors) return 0;

  let total = 0;
  for (const mesh of gltf.meshes) {
    if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
      for (const primitive of mesh.primitives) {
        if (primitive) {
          if (primitive.indices !== undefined) {
            const accessor = gltf.accessors[primitive.indices];
            if (accessor && primitive.mode === PrimitiveMode.TRIANGLES) {
              total += Math.floor(accessor.count / 3);
            }
          } else {
            // No indices, use position count
            if (primitive.attributes && primitive.attributes['POSITION'] !== undefined) {
              const accessor = gltf.accessors[primitive.attributes['POSITION']];
              if (accessor && (primitive.mode === PrimitiveMode.TRIANGLES || primitive.mode === undefined)) {
                total += Math.floor(accessor.count / 3);
              }
            }
          }
        }
      }
    }
  }
  return total;
}

function calculateMaxUVs(gltf: GLTF): number {
  if (!gltf.meshes) return 0;

  let maxUVs = 0;
  for (const mesh of gltf.meshes) {
    if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
      for (const primitive of mesh.primitives) {
        if (primitive && primitive.attributes && typeof primitive.attributes === 'object') {
          const uvCount = Object.keys(primitive.attributes).filter(key =>
            key.startsWith('TEXCOORD_')
          ).length;
          maxUVs = Math.max(maxUVs, uvCount);
        }
      }
    }
  }
  return maxUVs;
}

function calculateMaxInfluences(gltf: GLTF): number {
  if (!gltf.meshes) return 0;

  let maxInfluences = 0;
  for (const mesh of gltf.meshes) {
    if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
      for (const primitive of mesh.primitives) {
        if (primitive && primitive.attributes && typeof primitive.attributes === 'object') {
          const influenceCount = Object.keys(primitive.attributes).filter(key =>
            key.startsWith('JOINTS_') || key.startsWith('WEIGHTS_')
          ).length / 2;
          maxInfluences = Math.max(maxInfluences, influenceCount);
        }
      }
    }
  }
  return maxInfluences;
}

function calculateMaxAttributes(gltf: GLTF): number {
  if (!gltf.meshes) return 0;

  let maxAttributes = 0;
  for (const mesh of gltf.meshes) {
    if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
      for (const primitive of mesh.primitives) {
        if (primitive && primitive.attributes && typeof primitive.attributes === 'object') {
          maxAttributes = Math.max(maxAttributes, Object.keys(primitive.attributes).length);
        }
      }
    }
  }
  return maxAttributes;
}

function convertGLBExceptionToValidationMessages(error: Error, _data: Uint8Array): ValidationMessage[] {
  const message = error.message;

  // Handle combined errors (multiple errors separated by |NEXT_ERROR|)
  if (message.includes('|NEXT_ERROR|')) {
    const errorParts = message.split('|NEXT_ERROR|');
    const allMessages: ValidationMessage[] = [];
    for (const errorPart of errorParts) {
      // Recursively process each error part
      allMessages.push(...convertGLBExceptionToValidationMessages(new Error(errorPart), _data));
    }
    return allMessages;
  }

  // Handle JSON parsing errors - should be INVALID_JSON not GLB_PARSE_ERROR
  if (message.includes('Invalid JSON data. Parser output:')) {
    return [{
      code: 'INVALID_JSON',
      message: message,
      severity: 0,
      pointer: ''
    }];
  }

  // Handle BOM error specifically first - should be INVALID_JSON not GLB_PARSE_ERROR
  if (message.includes('BOM found at the beginning of UTF-8 stream')) {
    return [{
      code: 'INVALID_JSON',
      message: 'Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.',
      severity: 0,
      pointer: ''
    }];
  }

  // Handle structured error messages (CODE:MESSAGE:OFFSET/VALUE format)
  // Extract from wrapped errors like "Failed to parse GLTF JSON: TYPE_MISMATCH:..."
  let messageToCheck = message;
  if (message.includes('Failed to parse GLTF JSON: ') && message.includes('TYPE_MISMATCH')) {
    messageToCheck = message.substring(message.indexOf('TYPE_MISMATCH'));
  }

  if (messageToCheck.includes(':')) {
    const parts = messageToCheck.split(':');
    if (parts.length >= 3) {
      const code = parts[0];
      // The message could contain colons, so take everything except first and last part
      const msg = parts.slice(1, -1).join(':');
      const offsetOrValue = parts[parts.length - 1];

      // Map our codes to reference codes with exact messages
      switch (code) {
        case 'GLB_UNEXPECTED_END_OF_HEADER':
          return [{
            code: 'GLB_UNEXPECTED_END_OF_HEADER',
            message: 'Unexpected end of header.',
            severity: 0,
            offset: parseInt(offsetOrValue || '0') || 0
          }];

        case 'GLB_INVALID_MAGIC':
          return [{
            code: 'GLB_INVALID_MAGIC',
            message: msg,
            severity: 0,
            offset: 0
          }];

        case 'GLB_INVALID_VERSION':
          return [{
            code: 'GLB_INVALID_VERSION',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '4') || 4
          }];

        case 'GLB_LENGTH_MISMATCH':
          return [{
            code: 'GLB_LENGTH_MISMATCH',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '8') || 8
          }];

        case 'GLB_EXTRA_DATA':
          return [{
            code: 'GLB_EXTRA_DATA',
            message: msg,
            severity: 1, // Warning
            offset: parseInt(offsetOrValue || '0') || 0
          }];

        case 'GLB_UNEXPECTED_END_OF_CHUNK_DATA':
          return [{
            code: 'GLB_UNEXPECTED_END_OF_CHUNK_DATA',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '0') || 0
          }];

        case 'GLB_CHUNK_TOO_BIG':
          return [{
            code: 'GLB_CHUNK_TOO_BIG',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '0') || 0
          }];

        case 'GLB_UNEXPECTED_END_OF_CHUNK_HEADER':
          return [{
            code: 'GLB_UNEXPECTED_END_OF_CHUNK_HEADER',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '0') || 0
          }];

        case 'GLB_EMPTY_CHUNK':
          return [{
            code: 'GLB_EMPTY_CHUNK',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '0') || 0
          }];

        case 'GLB_DUPLICATE_CHUNK':
          return [{
            code: 'GLB_DUPLICATE_CHUNK',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '0') || 0
          }];

        case 'GLB_LENGTH_TOO_SMALL':
          return [{
            code: 'GLB_LENGTH_TOO_SMALL',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '8') || 8
          }];

        case 'GLB_UNEXPECTED_FIRST_CHUNK':
          return [{
            code: 'GLB_UNEXPECTED_FIRST_CHUNK',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '12') || 12
          }];

        case 'GLB_UNEXPECTED_BIN_CHUNK':
          return [{
            code: 'GLB_UNEXPECTED_BIN_CHUNK',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '12') || 12
          }];

        case 'GLB_CHUNK_LENGTH_UNALIGNED':
          return [{
            code: 'GLB_CHUNK_LENGTH_UNALIGNED',
            message: msg,
            severity: 0,
            offset: parseInt(offsetOrValue || '12') || 12
          }];

        case 'GLB_UNKNOWN_CHUNK_TYPE':
          return [{
            code: 'GLB_UNKNOWN_CHUNK_TYPE',
            message: msg,
            severity: 1, // Warning
            offset: parseInt(offsetOrValue || '12') || 12
          }];

        case 'GLB_EMPTY_BIN_CHUNK':
          return [{
            code: 'GLB_EMPTY_BIN_CHUNK',
            message: msg,
            severity: 2, // Info
            offset: parseInt(offsetOrValue || '12') || 12
          }];

        case 'TYPE_MISMATCH':
          return [{
            code: 'TYPE_MISMATCH',
            message: msg,
            severity: 0,
            pointer: '/'
          }];
      }
    }
  }


  // Legacy error handling for backwards compatibility
  if (message === 'Invalid GLB magic number') {
    return [{
      code: 'GLB_INVALID_MAGIC',
      message: `Invalid magic.`,
      severity: 0,
      offset: 0
    }];
  }

  if (message.startsWith('Unsupported GLB version:')) {
    const version = message.split(':')[1]?.trim() || 'unknown';
    return [{
      code: 'GLB_INVALID_VERSION',
      message: `Invalid version ${version}.`,
      severity: 0,
      offset: 4
    }];
  }

  if (message.includes('Declared length') && message.includes('does not match GLB length')) {
    return [{
      code: 'GLB_LENGTH_MISMATCH',
      message: message,
      severity: 0,
      offset: 8
    }];
  }

  if (message === 'GLB file too small') {
    return [{
      code: 'GLB_UNEXPECTED_END_OF_HEADER',
      message: 'Unexpected end of header.',
      severity: 0,
      offset: 0
    }];
  }

  if (message === 'Invalid GLB chunk header') {
    return [{
      code: 'GLB_UNEXPECTED_END_OF_CHUNK_HEADER',
      message: 'Unexpected end of chunk header.',
      severity: 0
    }];
  }

  if (message === 'GLB chunk extends beyond file') {
    return [{
      code: 'GLB_UNEXPECTED_END_OF_CHUNK_DATA',
      message: 'Unexpected end of chunk data.',
      severity: 0
    }];
  }

  if (message === 'GLB missing JSON chunk') {
    return [{
      code: 'GLB_UNEXPECTED_FIRST_CHUNK',
      message: 'First chunk must be JSON.',
      severity: 0
    }];
  }

  if (message.startsWith('Failed to parse GLB JSON:')) {
    const jsonError = message.replace('Failed to parse GLB JSON: ', '');

    if (jsonError === 'SyntaxError: Unexpected end of JSON input') {
      return [{
        code: 'GLB_EMPTY_CHUNK',
        message: 'Chunk (0x4e4f534a) cannot have zero length.',
        severity: 0
      }];
    }

    if (jsonError.includes('SyntaxError:')) {
      // Extract more specific error information to match reference validator
      let detailedError = jsonError.replace('SyntaxError: ', '');

      // Convert specific error patterns to match reference format
      if (detailedError.includes('Unexpected token') || detailedError.includes('Expected property name')) {
        const match = detailedError.match(/position (\d+)/);
        const offset = match ? match[1] : '1';
        detailedError = `FormatException: Unexpected character (at offset ${offset})`;
      } else if (detailedError.includes('Unexpected end')) {
        detailedError = `FormatException: Unexpected end of JSON input (at offset 0)`;
      } else {
        detailedError = `FormatException: ${detailedError}`;
      }

      return [{
        code: 'INVALID_JSON',
        message: `Invalid JSON data. Parser output: ${detailedError}`,
        severity: 0,
        pointer: ''
      }];
    }

    if (jsonError === 'Error: GLTF must have an asset object with version') {
      return [{
        code: 'UNDEFINED_PROPERTY',
        message: 'Property \'asset\' must be defined.',
        severity: 0,
        pointer: '/'
      }];
    }
  }

  // Default fallback for unknown GLB errors
  return [{
    code: 'GLB_PARSE_ERROR',
    message: `GLB parsing error: ${message}`,
    severity: 0
  }];
}

function convertGLTFExceptionToValidationMessages(error: Error): ValidationMessage[] {
  const message = error.message;

  // Handle BOM error specifically first - should be INVALID_JSON not GLB_PARSE_ERROR
  if (message.includes('BOM found at the beginning of UTF-8 stream')) {
    return [{
      code: 'INVALID_JSON',
      message: 'Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.',
      severity: 0,
      pointer: ''
    }];
  }

  // Handle structured error messages first (CODE:MESSAGE:OFFSET/VALUE format)
  // Extract from wrapped errors like "Failed to parse GLTF JSON: TYPE_MISMATCH:..."
  let messageToCheck = message;
  if (message.includes('Failed to parse GLTF JSON: ') && message.includes('TYPE_MISMATCH')) {
    messageToCheck = message.substring(message.indexOf('TYPE_MISMATCH'));
  }

  if (messageToCheck.includes(':') && messageToCheck.includes('TYPE_MISMATCH')) {
    const parts = messageToCheck.split(':');
    if (parts.length >= 3) {
      const code = parts[0];
      const msg = parts[1];

      if (code === 'TYPE_MISMATCH') {
        return [{
          code: 'TYPE_MISMATCH',
          message: msg,
          severity: 0,
          pointer: ''
        }];
      }
    }
  }

  // Convert common GLTF JSON parsing exceptions to proper validation messages
  if (message.includes('SyntaxError') || (message.includes('JSON') && !message.includes('TYPE_MISMATCH') && !message.includes('BOM found'))) {
    // Extract more detailed error information similar to reference validator
    let errorDetail = message.replace('SyntaxError: ', '').replace('JSON.parse: ', '');

    // Clean up common error prefixes that aren't in reference validator output
    errorDetail = errorDetail.replace('Failed to parse GLTF JSON: ', '');

    // Convert specific error patterns to match reference validator format
    if (errorDetail.includes('Unexpected end of JSON input')) {
      errorDetail = 'Unexpected end of input (at offset 0)';
    } else if (errorDetail.includes('Expected property name or \'}\' in JSON at position')) {
      // Extract position number from the error
      const match = errorDetail.match(/at position (\d+)/);
      const position = match ? match[1] : '1';
      errorDetail = `Unexpected character (at offset ${position})`;
    }

    return [{
      code: 'INVALID_JSON',
      message: `Invalid JSON data. Parser output: FormatException: ${errorDetail}`,
      severity: 0,
      pointer: ''
    }];
  }

  if (message.includes('asset') && message.includes('version')) {
    return [{
      code: 'UNDEFINED_PROPERTY',
      message: 'Property \'asset\' must be defined.',
      severity: 0,
      pointer: ''
    }];
  }

  // Default fallback for unknown GLTF errors
  return [{
    code: 'GLTF_PARSE_ERROR',
    message: `GLTF parsing error: ${message}`,
    severity: 0
  }];
}
