// Backup of working camera validator
import { GLTFCamera, ValidationMessage, Severity, CameraType } from '../types';

export class CameraValidator {
  validate(camera: GLTFCamera, index: number): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check required type
    if (!camera.type) {
      messages.push({
        code: 'UNDEFINED_PROPERTY',
        message: 'Property \'type\' must be defined.',
        severity: Severity.ERROR,
        pointer: `/cameras/${index}`
      });
    } else if (typeof camera.type !== 'string') {
      messages.push({
        code: 'TYPE_MISMATCH',
        message: 'Camera type must be a string.',
        severity: Severity.ERROR,
        pointer: `/cameras/${index}/type`
      });
    } else if (!Object.values(CameraType).includes(camera.type as any)) {
      messages.push({
        code: 'VALUE_NOT_IN_LIST',
        message: 'Invalid value \'' + camera.type + '\'. Valid values are (\'orthographic\', \'perspective\').',
        severity: Severity.WARNING,
        pointer: `/cameras/${index}/type`
      });
    }

    return messages;
  }
}