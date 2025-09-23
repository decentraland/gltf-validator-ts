import { GLTF, ValidationMessage, Severity } from '../types';

export interface ExtensionValidator {
  extensionName: string;
  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void;
}

export abstract class BaseExtensionValidator implements ExtensionValidator {
  abstract extensionName: string;

  abstract validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void;

  protected validateValueInRange(
    value: any,
    min: number,
    max: number,
    pointer: string,
    addMessage: (message: ValidationMessage) => void,
    exclusive = false
  ): boolean {
    if (typeof value !== 'number') return true;

    const inRange = exclusive
      ? (value > min && value < max)
      : (value >= min && value <= max);

    if (!inRange) {
      addMessage({
        code: 'VALUE_NOT_IN_RANGE',
        message: `Value ${value} is out of range.`,
        severity: Severity.ERROR,
        pointer
      });
      return false;
    }
    return true;
  }

  protected validateValueInList(
    value: any,
    validValues: any[],
    pointer: string,
    addMessage: (message: ValidationMessage) => void
  ): boolean {
    if (!validValues.includes(value)) {
      const validValuesStr = validValues.map(v => `'${v}'`).join(', ');
      addMessage({
        code: 'VALUE_NOT_IN_LIST',
        message: `Invalid value '${value}'. Valid values are (${validValuesStr}).`,
        severity: Severity.WARNING,
        pointer
      });
      return false;
    }
    return true;
  }

  protected addIncompleteExtensionWarning(
    pointer: string,
    addMessage: (message: ValidationMessage) => void
  ): void {
    addMessage({
      code: 'INCOMPLETE_EXTENSION_SUPPORT',
      message: 'Validation support for this extension is incomplete; the asset may have undetected issues.',
      severity: Severity.INFO,
      pointer
    });
  }

  protected escapeJsonPointer(str: string): string {
    return str.replace(/~/g, '~0').replace(/\//g, '~1');
  }
}