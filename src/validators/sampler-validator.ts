import { GLTFSampler, ValidationMessage, Severity } from '../types';

export class SamplerValidator {
  validate(sampler: GLTFSampler, index: number): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check for unexpected properties
    const expectedProperties = ['magFilter', 'minFilter', 'wrapS', 'wrapT', 'name', 'extensions', 'extras'];
    for (const key in sampler) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `/samplers/${index}/${key}`
        });
      }
    }

    // Validate extensions on samplers
    if (sampler['extensions']) {
      for (const extensionName in sampler['extensions']) {
        if (!this.isExtensionAllowedOnSamplers(extensionName)) {
          messages.push({
            code: 'UNEXPECTED_EXTENSION_OBJECT',
            message: 'Unexpected location for this extension.',
            severity: Severity.ERROR,
            pointer: `/samplers/${index}/extensions/${extensionName}`
          });
        }
      }
    }

    return messages;
  }

  private isExtensionAllowedOnSamplers(extensionName: string): boolean {
    // Only certain extensions are allowed on samplers
    const allowedOnSamplers: string[] = [
      // Add extensions that are allowed on samplers here
      // For now, no extensions are allowed on samplers
    ];
    return allowedOnSamplers.includes(extensionName);
  }
}
