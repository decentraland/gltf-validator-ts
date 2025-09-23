import { GLTFBufferView, GLTF, ValidationMessage, Severity } from '../types';

export class BufferViewValidator {
  validate(bufferView: GLTFBufferView, index: number, gltf: GLTF): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check required properties
    if (bufferView.byteLength === undefined) {
      messages.push({
        code: 'UNDEFINED_PROPERTY',
        message: 'Property \'byteLength\' must be defined.',
        severity: Severity.ERROR,
        pointer: `/bufferViews/${index}`
      });
    } else if (typeof bufferView.byteLength !== 'number' || bufferView.byteLength < 0) {
      messages.push({
        code: 'INVALID_VALUE',
        message: 'BufferView byteLength must be a non-negative number.',
        severity: Severity.ERROR,
        pointer: `/bufferViews/${index}/byteLength`
      });
    } else if (bufferView.byteLength === 0) {
      messages.push({
        code: 'VALUE_NOT_IN_RANGE',
        message: 'Value 0 is out of range.',
        severity: Severity.ERROR,
        pointer: `/bufferViews/${index}/byteLength`
      });
    }

    if (bufferView.buffer === undefined) {
      messages.push({
        code: 'UNDEFINED_PROPERTY',
        message: 'Property \'buffer\' must be defined.',
        severity: Severity.ERROR,
        pointer: `/bufferViews/${index}`
      });
    } else if (typeof bufferView.buffer !== 'number' || bufferView.buffer < 0) {
      messages.push({
        code: 'INVALID_VALUE',
        message: 'BufferView buffer must be a non-negative integer.',
        severity: Severity.ERROR,
        pointer: `/bufferViews/${index}/buffer`
      });
    } else if (!gltf.buffers || bufferView.buffer >= gltf.buffers.length) {
      messages.push({
        code: 'UNRESOLVED_REFERENCE',
        message: 'Unresolved reference: ' + bufferView.buffer + '.',
        severity: Severity.ERROR,
        pointer: `/bufferViews/${index}/buffer`
      });
    }

    // Check byteOffset
    if (bufferView.byteOffset !== undefined) {
      if (typeof bufferView.byteOffset !== 'number' || bufferView.byteOffset < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'BufferView byteOffset must be a non-negative number.',
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteOffset`
        });
      }
    }

    // Check byteStride
    if (bufferView.byteStride !== undefined) {
      if (typeof bufferView.byteStride !== 'number' || bufferView.byteStride < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'BufferView byteStride must be a non-negative number.',
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteStride`
        });
      } else if (bufferView.byteStride > 252) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'BufferView byteStride must be <= 252.',
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteStride`
        });
      } else if (bufferView.byteStride % 4 !== 0) {
        messages.push({
          code: 'VALUE_MULTIPLE_OF',
          message: `Value ${bufferView.byteStride} is not a multiple of 4.`,
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteStride`
        });
      } else if (bufferView.byteLength !== undefined && bufferView.byteStride > bufferView.byteLength) {
        messages.push({
          code: 'BUFFER_VIEW_TOO_BIG_BYTE_STRIDE',
          message: `Buffer view's byteStride (${bufferView.byteStride}) is greater than byteLength (${bufferView.byteLength}).`,
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteStride`
        });
      } else if (bufferView.target !== undefined && bufferView.target !== 34962) {
        messages.push({
          code: 'BUFFER_VIEW_INVALID_BYTE_STRIDE',
          message: 'Only buffer views with raw vertex data can have byteStride.',
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteStride`
        });
      }
    }

    // Check target
    if (bufferView.target !== undefined) {
      if (typeof bufferView.target !== 'number') {
        messages.push({
          code: 'TYPE_MISMATCH',
          message: 'BufferView target must be a number.',
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/target`
        });
      } else if (bufferView.target !== 34962 && bufferView.target !== 34963) { // ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER
        messages.push({
          code: 'INVALID_VALUE',
          message: 'BufferView target must be 34962 (ARRAY_BUFFER) or 34963 (ELEMENT_ARRAY_BUFFER).',
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/target`
        });
      }
    }

    // Validate bounds against referenced buffer
    if (bufferView.buffer !== undefined && bufferView.byteLength !== undefined &&
        gltf.buffers && bufferView.buffer < gltf.buffers.length) {
      const buffer = gltf.buffers[bufferView.buffer];
      const bufferViewOffset = bufferView.byteOffset || 0;

      if (buffer && bufferViewOffset + bufferView.byteLength > buffer.byteLength) {
        // Match reference validator behavior: if byteOffset is present and > 0, blame the byteOffset
        // Otherwise, blame the byteLength
        if (bufferView.byteOffset !== undefined && bufferView.byteOffset > 0) {
          messages.push({
            code: 'BUFFER_VIEW_TOO_LONG',
            message: `BufferView does not fit buffer (${bufferView.buffer}) byteLength (${buffer.byteLength}).`,
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteOffset`
          });
        } else {
          messages.push({
            code: 'BUFFER_VIEW_TOO_LONG',
            message: `BufferView does not fit buffer (${bufferView.buffer}) byteLength (${buffer.byteLength}).`,
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteLength`
          });
        }
      }
    }

    // Check for unexpected properties
    const expectedProperties = ['buffer', 'byteOffset', 'byteLength', 'byteStride', 'target', 'name', 'extensions', 'extras'];
    for (const key in bufferView) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `/bufferViews/${index}/${key}`
        });
      }
    }

    return messages;
  }
}
