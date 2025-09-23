import { ExtensionValidator, BaseExtensionValidator } from '../extension-validator';
import { GLTF, ValidationMessage, Severity } from '../../types';

// EXT_texture_webp validator
class EXTTextureWebPValidator extends BaseExtensionValidator {
  extensionName = 'EXT_texture_webp';

  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void {
    // Validate textures with EXT_texture_webp extension
    if (gltf.textures) {
      for (let i = 0; i < gltf.textures.length; i++) {
        const texture = gltf.textures[i];
        if (texture && texture['extensions'] && texture['extensions']['EXT_texture_webp']) {
          const webpExt = texture['extensions']['EXT_texture_webp'];

          // Validate regular texture source when EXT_texture_webp is present
          if (texture.source !== undefined && gltf.images && gltf.images[texture.source]) {
            const regularImage = gltf.images[texture.source];
            if (regularImage) {
              let isRegularFormatValid = false;

              // Check if image has valid MIME type for regular texture (JPEG/PNG)
              if (regularImage.mimeType) {
                isRegularFormatValid = regularImage.mimeType === 'image/jpeg' || regularImage.mimeType === 'image/png';
              } else if (regularImage.uri) {
                // Check data URI format
                if (regularImage.uri.startsWith('data:image/jpeg') || regularImage.uri.startsWith('data:image/png')) {
                  isRegularFormatValid = true;
                } else if (regularImage.uri.startsWith('data:')) {
                  isRegularFormatValid = false; // It's a data URI but not JPEG/PNG
                } else {
                  // Check file extension
                  const uri = regularImage.uri.toLowerCase();
                  isRegularFormatValid = uri.endsWith('.jpg') || uri.endsWith('.jpeg') || uri.endsWith('.png');
                }
              }

              if (!isRegularFormatValid) {
                let detectedFormat = 'unknown';
                if (regularImage.mimeType) {
                  detectedFormat = regularImage.mimeType;
                } else if (regularImage.uri && regularImage.uri.startsWith('data:')) {
                  const match = regularImage.uri.match(/^data:([^;]+)/);
                  if (match && match[1]) {
                    detectedFormat = match[1];
                  }
                }

                addMessage({
                  code: 'TEXTURE_INVALID_IMAGE_MIME_TYPE',
                  message: `Invalid MIME type '${detectedFormat}' for the texture source. Valid MIME types are ('image/jpeg', 'image/png').`,
                  severity: Severity.ERROR,
                  pointer: `/textures/${i}/source`
                });
              }
            }
          }

          // Validate webp source
          if (webpExt.source !== undefined) {
            if (typeof webpExt.source !== 'number' || webpExt.source < 0) {
              addMessage({
                code: 'INVALID_EXTENSION_VALUE',
                message: 'Invalid source index for EXT_texture_webp.',
                severity: Severity.ERROR,
                pointer: `/textures/${i}/extensions/EXT_texture_webp/source`
              });
            } else if (gltf.images && gltf.images[webpExt.source]) {
              const image = gltf.images[webpExt.source];
              if (image) {
                let isValidWebP = false;

                // Check if image has correct MIME type for WebP
                if (image.mimeType) {
                  isValidWebP = image.mimeType === 'image/webp';
                } else if (image.uri) {
                  // Check data URI format
                  if (image.uri.startsWith('data:image/webp')) {
                    isValidWebP = true;
                  } else if (image.uri.startsWith('data:')) {
                    isValidWebP = false; // It's a data URI but not WebP
                  } else {
                    // Check file extension
                    isValidWebP = image.uri.toLowerCase().endsWith('.webp');
                  }
                }

                if (!isValidWebP) {
                  let detectedFormat = 'unknown';
                  if (image.mimeType) {
                    detectedFormat = image.mimeType;
                  } else if (image.uri && image.uri.startsWith('data:')) {
                    const match = image.uri.match(/^data:([^;]+)/);
                    if (match && match[1]) {
                      detectedFormat = match[1];
                    }
                  }

                  addMessage({
                    code: 'TEXTURE_INVALID_IMAGE_MIME_TYPE',
                    message: `Invalid MIME type '${detectedFormat}' for the texture source. Valid MIME types are ('image/webp').`,
                    severity: Severity.ERROR,
                    pointer: `/textures/${i}/extensions/EXT_texture_webp/source`
                  });
                }
              }
            }
          }
        }
      }
    }
  }
}

// KHR_lights_punctual validator
class KHRLightsPunctualValidator extends BaseExtensionValidator {
  extensionName = 'KHR_lights_punctual';

  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void {
    // Check for extensions in incorrect locations
    if (gltf.scenes) {
      for (let i = 0; i < gltf.scenes.length; i++) {
        const scene = gltf.scenes[i];
        if (scene && scene['extensions'] && scene['extensions']['KHR_lights_punctual']) {
          addMessage({
            code: 'UNEXPECTED_EXTENSION_OBJECT',
            message: 'Unexpected location for this extension.',
            severity: Severity.ERROR,
            pointer: `/scenes/${i}/extensions/KHR_lights_punctual`
          });
        }
      }
    }

    // Validate root extension
    if (gltf.extensions && gltf.extensions['KHR_lights_punctual']) {
      const lightsExt = gltf.extensions['KHR_lights_punctual'];

      if (lightsExt.lights === undefined) {
        addMessage({
          code: 'UNDEFINED_PROPERTY',
          message: 'Property \'lights\' must be defined.',
          severity: Severity.ERROR,
          pointer: '/extensions/KHR_lights_punctual'
        });
      } else if (lightsExt.lights) {
        if (!Array.isArray(lightsExt.lights)) {
          addMessage({
            code: 'TYPE_MISMATCH',
            message: 'Property value is not a \'array\'.',
            severity: Severity.ERROR,
            pointer: '/extensions/KHR_lights_punctual/lights'
          });
        } else if (lightsExt.lights.length === 0) {
          addMessage({
            code: 'EMPTY_ENTITY',
            message: 'Entity cannot be empty.',
            severity: Severity.ERROR,
            pointer: '/extensions/KHR_lights_punctual/lights'
          });
        } else {
          for (let i = 0; i < lightsExt.lights.length; i++) {
            const light = lightsExt.lights[i];
            this.validateLight(light, i, addMessage);
          }
        }
      }
    }

    // Validate node extensions (correct location)
    if (gltf.nodes) {
      for (let i = 0; i < gltf.nodes.length; i++) {
        const node = gltf.nodes[i];
        if (node && node['extensions'] && node['extensions']['KHR_lights_punctual']) {
          const nodeExt = node['extensions']['KHR_lights_punctual'];
          const basePointer = `/nodes/${i}/extensions/KHR_lights_punctual`;

          if (nodeExt.light === undefined) {
            addMessage({
              code: 'UNDEFINED_PROPERTY',
              message: 'Property \'light\' must be defined.',
              severity: Severity.ERROR,
              pointer: `${basePointer}`
            });
          } else if (nodeExt.light !== undefined) {
            if (typeof nodeExt.light !== 'number' || nodeExt.light < 0) {
              addMessage({
                code: 'INVALID_VALUE',
                message: 'Light index must be a non-negative integer.',
                severity: Severity.ERROR,
                pointer: `${basePointer}/light`
              });
            } else {
              // Check if the light reference can be resolved (only if root extension exists)
              const rootExt = gltf.extensions && gltf.extensions['KHR_lights_punctual'];

              if (rootExt) {
                const lights = rootExt.lights;
                if (!lights || !Array.isArray(lights) || nodeExt.light >= lights.length) {
                  addMessage({
                    code: 'UNRESOLVED_REFERENCE',
                    message: `Unresolved reference: ${nodeExt.light}.`,
                    severity: Severity.ERROR,
                    pointer: `${basePointer}/light`
                  });
                }
              }
              // If rootExt doesn't exist, UNSATISFIED_DEPENDENCY will be handled below
            }
          }

          // Check for missing root extension dependency
          if (!gltf.extensions || !gltf.extensions['KHR_lights_punctual']) {
            addMessage({
              code: 'UNSATISFIED_DEPENDENCY',
              message: 'Dependency failed. \'/extensions/KHR_lights_punctual\' must be defined.',
              severity: Severity.ERROR,
              pointer: basePointer
            });
          }

          // Check for unexpected properties
          const expectedProperties = ['light'];
          for (const key in nodeExt) {
            if (!expectedProperties.includes(key)) {
              addMessage({
                code: 'UNEXPECTED_PROPERTY',
                message: 'Unexpected property.',
                severity: Severity.WARNING,
                pointer: `${basePointer}/${key}`
              });
            }
          }
        }
      }
    }
  }

  private validateLight(light: any, index: number, addMessage: (message: ValidationMessage) => void): void {
    const pointer = `/extensions/KHR_lights_punctual/lights/${index}`;

    // Check for unexpected properties
    const allowedProperties = ['type', 'color', 'intensity', 'range', 'spot', 'name', 'extensions', 'extras'];
    for (const property in light) {
      if (!allowedProperties.includes(property)) {
        addMessage({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `${pointer}/${property}`
        });
      }
    }

    // Type is required
    if (light.type === undefined) {
      addMessage({
        code: 'UNDEFINED_PROPERTY',
        message: 'Property \'type\' must be defined.',
        severity: Severity.ERROR,
        pointer
      });
    } else if (!['directional', 'point', 'spot'].includes(light.type)) {
      addMessage({
        code: 'VALUE_NOT_IN_LIST',
        message: `Invalid value '${light.type}'. Valid values are ('directional', 'point', 'spot').`,
        severity: Severity.WARNING,
        pointer: `${pointer}/type`
      });
    }

    // Validate color
    if (light.color !== undefined) {
      if (!Array.isArray(light.color) || light.color.length !== 3) {
        addMessage({
          code: 'TYPE_MISMATCH',
          message: 'Property value is not a \'array\' of length 3.',
          severity: Severity.ERROR,
          pointer: `${pointer}/color`
        });
      } else {
        for (let i = 0; i < 3; i++) {
          if (typeof light.color[i] !== 'number' || light.color[i] < 0 || light.color[i] > 1) {
            addMessage({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${light.color[i]} is out of range.`,
              severity: Severity.ERROR,
              pointer: `${pointer}/color/${i}`
            });
          }
        }
      }
    }

    // Validate intensity
    if (light.intensity !== undefined) {
      if (typeof light.intensity !== 'number' || light.intensity < 0) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${light.intensity} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${pointer}/intensity`
        });
      }
    }

    // Validate range
    if (light.range !== undefined) {
      // Range is not applicable to directional lights
      if (light.type === 'directional') {
        addMessage({
          code: 'EXTRA_PROPERTY',
          message: 'This property should not be defined as it will not be used.',
          severity: Severity.INFO,
          pointer: `${pointer}/range`
        });
      } else if (typeof light.range !== 'number' || light.range <= 0) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${light.range} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${pointer}/range`
        });
      }
    }

    // Validate spot properties
    if (light.type === 'spot') {
      if (light.spot === undefined) {
        addMessage({
          code: 'UNDEFINED_PROPERTY',
          message: 'Property \'spot\' must be defined.',
          severity: Severity.ERROR,
          pointer
        });
      } else {
        this.validateSpot(light.spot, pointer, addMessage);
      }
    } else if (light.spot !== undefined) {
      addMessage({
        code: 'EXTRA_PROPERTY',
        message: 'This property should not be defined as it will not be used.',
        severity: Severity.INFO,
        pointer: `${pointer}/spot`
      });
    }
  }

  private validateSpot(spot: any, basePointer: string, addMessage: (message: ValidationMessage) => void): void {
    const pointer = `${basePointer}/spot`;

    // Validate innerConeAngle
    if (spot.innerConeAngle !== undefined) {
      if (typeof spot.innerConeAngle !== 'number' || spot.innerConeAngle < 0 || spot.innerConeAngle > Math.PI / 2) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${spot.innerConeAngle} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${pointer}/innerConeAngle`
        });
      }
    }

    // Validate outerConeAngle
    if (spot.outerConeAngle !== undefined) {
      if (typeof spot.outerConeAngle !== 'number' || spot.outerConeAngle < 0 || spot.outerConeAngle > Math.PI / 2) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${spot.outerConeAngle} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${pointer}/outerConeAngle`
        });
      }
    }

    // Validate cone angle relationship
    if (spot.innerConeAngle !== undefined && spot.outerConeAngle !== undefined) {
      if (spot.outerConeAngle <= spot.innerConeAngle) {
        addMessage({
          code: 'KHR_LIGHTS_PUNCTUAL_LIGHT_SPOT_ANGLES',
          message: `outerConeAngle (${spot.outerConeAngle}) is less than or equal to innerConeAngle (${spot.innerConeAngle}).`,
          severity: Severity.ERROR,
          pointer: `${pointer}/outerConeAngle`
        });
      }
    }
  }
}

// KHR_materials_* validators
class KHRMaterialsValidator extends BaseExtensionValidator {
  constructor(public extensionName: string) {
    super();
  }

  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void {
    // Check for extensions in incorrect locations (like pbrMetallicRoughness/extensions)
    if (gltf.materials) {
      for (let i = 0; i < gltf.materials.length; i++) {
        const material = gltf.materials[i];
        if (material) {
          // Check for extension in pbrMetallicRoughness (incorrect location)
          if (material.pbrMetallicRoughness && material.pbrMetallicRoughness['extensions'] &&
              material.pbrMetallicRoughness['extensions'][this.extensionName]) {
            addMessage({
              code: 'UNEXPECTED_EXTENSION_OBJECT',
              message: 'Unexpected location for this extension.',
              severity: Severity.ERROR,
              pointer: `/materials/${i}/pbrMetallicRoughness/extensions/${this.extensionName}`
            });
          }

          // Check for extension in normalTexture (incorrect location)
          if (material.normalTexture && material.normalTexture['extensions'] &&
              material.normalTexture['extensions'][this.extensionName]) {
            addMessage({
              code: 'UNEXPECTED_EXTENSION_OBJECT',
              message: 'Unexpected location for this extension.',
              severity: Severity.ERROR,
              pointer: `/materials/${i}/normalTexture/extensions/${this.extensionName}`
            });
          }

          // Check for extension in occlusionTexture (incorrect location)
          if (material.occlusionTexture && material.occlusionTexture['extensions'] &&
              material.occlusionTexture['extensions'][this.extensionName]) {
            addMessage({
              code: 'UNEXPECTED_EXTENSION_OBJECT',
              message: 'Unexpected location for this extension.',
              severity: Severity.ERROR,
              pointer: `/materials/${i}/occlusionTexture/extensions/${this.extensionName}`
            });
          }

          // Check for extension in emissiveTexture (incorrect location)
          if (material.emissiveTexture && material.emissiveTexture['extensions'] &&
              material.emissiveTexture['extensions'][this.extensionName]) {
            addMessage({
              code: 'UNEXPECTED_EXTENSION_OBJECT',
              message: 'Unexpected location for this extension.',
              severity: Severity.ERROR,
              pointer: `/materials/${i}/emissiveTexture/extensions/${this.extensionName}`
            });
          }

          // Validate materials with this extension in the correct location
          if (material['extensions'] && material['extensions'][this.extensionName]) {
            this.validateMaterialExtension(material['extensions'][this.extensionName], i, material, addMessage);

            // Special volume transmission dependency check
            if (this.extensionName === 'KHR_materials_volume') {
              this.validateVolumeTransmissionDependencyWithMaterial(material, i, addMessage);
            }
          }
        }
      }
    }
  }

  private validateMaterialExtension(ext: any, materialIndex: number, material: any, addMessage: (message: ValidationMessage) => void): void {
    const basePointer = `/materials/${materialIndex}/extensions/${this.extensionName}`;

    // Validate extension-specific properties
    switch (this.extensionName) {
      case 'KHR_materials_anisotropy':
        this.validateAnisotropy(ext, basePointer, material, addMessage);
        break;
      case 'KHR_materials_clearcoat':
        this.validateClearcoat(ext, basePointer, material, addMessage);
        break;
      case 'KHR_materials_dispersion':
        this.validateDispersion(ext, basePointer, material, addMessage);
        break;
      case 'KHR_materials_emissive_strength':
        this.validateEmissiveStrength(ext, basePointer, material, addMessage);
        break;
      case 'KHR_materials_ior':
        this.validateIOR(ext, basePointer, addMessage);
        break;
      case 'KHR_materials_iridescence':
        this.validateIridescence(ext, basePointer, addMessage);
        break;
      case 'KHR_materials_pbrSpecularGlossiness':
        this.validatePbrSpecularGlossiness(ext, basePointer, addMessage);
        break;
      case 'KHR_materials_sheen':
        this.validateSheen(ext, basePointer, addMessage);
        break;
      case 'KHR_materials_specular':
        this.validateSpecular(ext, basePointer, addMessage);
        break;
      case 'KHR_materials_transmission':
        this.validateTransmission(ext, basePointer, addMessage);
        break;
      case 'KHR_materials_unlit':
        // Unlit extension has no properties to validate
        break;
      case 'KHR_materials_volume':
        this.validateVolume(ext, basePointer, material, addMessage);
        break;
    }
  }

  private validateAnisotropy(ext: any, basePointer: string, material: any, addMessage: (message: ValidationMessage) => void): void {
    if (ext.anisotropyStrength !== undefined) {
      this.validateValueInRange(ext.anisotropyStrength, 0, 1, `${basePointer}/anisotropyStrength`, addMessage);
    }
    if (ext.anisotropyRotation !== undefined) {
      this.validateValueInRange(ext.anisotropyRotation, 0, Infinity, `${basePointer}/anisotropyRotation`, addMessage);
    }

    // Validate texture coordinate consistency
    if (ext.anisotropyTexture && material.normalTexture) {
      const anisotropyTexCoord = ext.anisotropyTexture.texCoord || 0;
      const normalTexCoord = material.normalTexture.texCoord || 0;

      if (anisotropyTexCoord !== normalTexCoord) {
        addMessage({
          code: 'KHR_MATERIALS_ANISOTROPY_ANISOTROPY_TEXTURE_TEXCOORD',
          message: 'Normal and anisotropy textures should use the same texture coords.',
          severity: Severity.WARNING,
          pointer: `${basePointer}/anisotropyTexture`
        });
      }
    }
  }

  private validateClearcoat(ext: any, basePointer: string, material: any, addMessage: (message: ValidationMessage) => void): void {
    if (ext.clearcoatFactor !== undefined) {
      this.validateValueInRange(ext.clearcoatFactor, 0, 1, `${basePointer}/clearcoatFactor`, addMessage);
    }
    if (ext.clearcoatRoughnessFactor !== undefined) {
      this.validateValueInRange(ext.clearcoatRoughnessFactor, 0, 1, `${basePointer}/clearcoatRoughnessFactor`, addMessage);
    }

    // Validate texture coordinate consistency between normal texture and clearcoat normal texture
    if (ext.clearcoatNormalTexture && material.normalTexture) {
      const clearcoatNormalTexCoord = ext.clearcoatNormalTexture.texCoord || 0;
      const normalTexCoord = material.normalTexture.texCoord || 0;

      if (clearcoatNormalTexCoord !== normalTexCoord) {
        addMessage({
          code: 'KHR_MATERIALS_CLEARCOAT_CLEARCOAT_NORMAL_TEXTURE_TEXCOORD',
          message: 'Normal and clearcoat normal textures should use the same texture coords.',
          severity: Severity.WARNING,
          pointer: `${basePointer}/clearcoatNormalTexture`
        });
      }
    }
  }

  private validateDispersion(ext: any, basePointer: string, material: any, addMessage: (message: ValidationMessage) => void): void {
    if (ext.dispersion !== undefined) {
      this.validateValueInRange(ext.dispersion, 0, 1, `${basePointer}/dispersion`, addMessage);
    }

    // Check if dispersion extension is combined with volume extension
    const hasVolume = material['extensions'] && material['extensions']['KHR_materials_volume'];
    if (!hasVolume) {
      addMessage({
        code: 'KHR_MATERIALS_DISPERSION_NO_VOLUME',
        message: 'The dispersion extension needs to be combined with the volume extension.',
        severity: Severity.WARNING,
        pointer: basePointer
      });
    }
  }

  private validateEmissiveStrength(ext: any, basePointer: string, material: any, addMessage: (message: ValidationMessage) => void): void {
    if (ext.emissiveStrength !== undefined) {
      // Validate range first (should be >= 0)
      const isValidRange = !(typeof ext.emissiveStrength === 'number' && ext.emissiveStrength < 0);

      if (!isValidRange) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${ext.emissiveStrength} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${basePointer}/emissiveStrength`
        });
      } else {
        // Only check zero factor when emissive strength value is valid
        const emissiveFactor = material.emissiveFactor;
        const isEmissiveFactorZero = !emissiveFactor ||
          (Array.isArray(emissiveFactor) && emissiveFactor.length === 3 &&
           emissiveFactor[0] === 0 && emissiveFactor[1] === 0 && emissiveFactor[2] === 0);

        if (isEmissiveFactorZero) {
          addMessage({
            code: 'KHR_MATERIALS_EMISSIVE_STRENGTH_ZERO_FACTOR',
            message: 'Emissive strength has no effect when the emissive factor is zero or undefined.',
            severity: Severity.WARNING,
            pointer: basePointer
          });
        }
      }
    }
  }

  private validateIOR(ext: any, basePointer: string, addMessage: (message: ValidationMessage) => void): void {
    if (ext.ior !== undefined) {
      // IOR must be 0 (disabled) or >= 1 (physical values)
      if (typeof ext.ior === 'number' && ext.ior !== 0 && ext.ior < 1) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${ext.ior} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${basePointer}/ior`
        });
      } else if (typeof ext.ior === 'number' && ext.ior < 0) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${ext.ior} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${basePointer}/ior`
        });
      }
    }
  }

  private validateIridescence(ext: any, basePointer: string, addMessage: (message: ValidationMessage) => void): void {
    if (ext.iridescenceFactor !== undefined) {
      this.validateValueInRange(ext.iridescenceFactor, 0, 1, `${basePointer}/iridescenceFactor`, addMessage);
    }
    if (ext.iridescenceIor !== undefined) {
      this.validateValueInRange(ext.iridescenceIor, 1, Infinity, `${basePointer}/iridescenceIor`, addMessage);
    }
    if (ext.iridescenceThicknessMinimum !== undefined) {
      this.validateValueInRange(ext.iridescenceThicknessMinimum, 0, Infinity, `${basePointer}/iridescenceThicknessMinimum`, addMessage);

      // Check if thickness minimum is used without texture
      if (ext.iridescenceThicknessTexture === undefined) {
        addMessage({
          code: 'KHR_MATERIALS_IRIDESCENCE_THICKNESS_RANGE_WITHOUT_TEXTURE',
          message: 'Thickness minimum has no effect when a thickness texture is not defined.',
          severity: Severity.INFO,
          pointer: `${basePointer}/iridescenceThicknessMinimum`
        });
      }
    }
    if (ext.iridescenceThicknessMaximum !== undefined) {
      this.validateValueInRange(ext.iridescenceThicknessMaximum, 0, Infinity, `${basePointer}/iridescenceThicknessMaximum`, addMessage);

      // Check if thickness maximum is used without texture
      if (ext.iridescenceThicknessTexture === undefined) {
        addMessage({
          code: 'KHR_MATERIALS_IRIDESCENCE_THICKNESS_RANGE_WITHOUT_TEXTURE',
          message: 'Thickness maximum has no effect when a thickness texture is not defined.',
          severity: Severity.INFO,
          pointer: `${basePointer}/iridescenceThicknessMaximum`
        });
      }
    }

    // Validate thickness texture usage
    if (ext.iridescenceThicknessTexture !== undefined &&
        ext.iridescenceThicknessMinimum !== undefined &&
        ext.iridescenceThicknessMaximum !== undefined) {
      if (ext.iridescenceThicknessMinimum === ext.iridescenceThicknessMaximum) {
        addMessage({
          code: 'KHR_MATERIALS_IRIDESCENCE_THICKNESS_TEXTURE_UNUSED',
          message: 'Thickness texture has no effect when the thickness minimum is equal to the thickness maximum.',
          severity: Severity.INFO,
          pointer: `${basePointer}/iridescenceThicknessTexture`
        });
      }
    }
  }

  private validatePbrSpecularGlossiness(ext: any, basePointer: string, addMessage: (message: ValidationMessage) => void): void {
    if (ext.diffuseFactor !== undefined) {
      if (!Array.isArray(ext.diffuseFactor) || ext.diffuseFactor.length !== 4) {
        addMessage({
          code: 'TYPE_MISMATCH',
          message: 'Property value is not a \'array\' of length 4.',
          severity: Severity.ERROR,
          pointer: `${basePointer}/diffuseFactor`
        });
      }
    }
    if (ext.specularFactor !== undefined) {
      if (!Array.isArray(ext.specularFactor) || ext.specularFactor.length !== 3) {
        addMessage({
          code: 'TYPE_MISMATCH',
          message: 'Property value is not a \'array\' of length 3.',
          severity: Severity.ERROR,
          pointer: `${basePointer}/specularFactor`
        });
      }
    }
    if (ext.glossinessFactor !== undefined) {
      this.validateValueInRange(ext.glossinessFactor, 0, 1, `${basePointer}/glossinessFactor`, addMessage);
    }
  }

  private validateSheen(ext: any, basePointer: string, addMessage: (message: ValidationMessage) => void): void {
    if (ext.sheenColorFactor !== undefined) {
      if (!Array.isArray(ext.sheenColorFactor) || ext.sheenColorFactor.length !== 3) {
        addMessage({
          code: 'TYPE_MISMATCH',
          message: 'Property value is not a \'array\' of length 3.',
          severity: Severity.ERROR,
          pointer: `${basePointer}/sheenColorFactor`
        });
      }
    }
    if (ext.sheenRoughnessFactor !== undefined) {
      this.validateValueInRange(ext.sheenRoughnessFactor, 0, 1, `${basePointer}/sheenRoughnessFactor`, addMessage);
    }
  }

  private validateSpecular(ext: any, basePointer: string, addMessage: (message: ValidationMessage) => void): void {
    if (ext.specularFactor !== undefined) {
      this.validateValueInRange(ext.specularFactor, 0, 1, `${basePointer}/specularFactor`, addMessage);
    }
    if (ext.specularColorFactor !== undefined) {
      if (!Array.isArray(ext.specularColorFactor) || ext.specularColorFactor.length !== 3) {
        addMessage({
          code: 'TYPE_MISMATCH',
          message: 'Property value is not a \'array\' of length 3.',
          severity: Severity.ERROR,
          pointer: `${basePointer}/specularColorFactor`
        });
      } else {
        // Validate each component of the color factor (specular color can be > 1)
        for (let i = 0; i < ext.specularColorFactor.length; i++) {
          this.validateValueInRange(ext.specularColorFactor[i], 0, Infinity, `${basePointer}/specularColorFactor/${i}`, addMessage);
        }
      }
    }
  }

  private validateTransmission(ext: any, basePointer: string, addMessage: (message: ValidationMessage) => void): void {
    if (ext.transmissionFactor !== undefined) {
      this.validateValueInRange(ext.transmissionFactor, 0, 1, `${basePointer}/transmissionFactor`, addMessage);
    }
  }

  private validateVolume(ext: any, basePointer: string, material: any, addMessage: (message: ValidationMessage) => void): void {
    // Validate attenuationColor first (to match expected message order)
    if (ext.attenuationColor !== undefined) {
      if (!Array.isArray(ext.attenuationColor) || ext.attenuationColor.length !== 3) {
        addMessage({
          code: 'TYPE_MISMATCH',
          message: 'Property value is not a \'array\' of length 3.',
          severity: Severity.ERROR,
          pointer: `${basePointer}/attenuationColor`
        });
      } else {
        // Validate each component of the attenuation color (0-1 range)
        for (let i = 0; i < ext.attenuationColor.length; i++) {
          this.validateValueInRange(ext.attenuationColor[i], 0, 1, `${basePointer}/attenuationColor/${i}`, addMessage);
        }
      }
    }

    if (ext.attenuationDistance !== undefined) {
      // attenuationDistance must be > 0, not >= 0
      if (typeof ext.attenuationDistance === 'number' && ext.attenuationDistance <= 0) {
        addMessage({
          code: 'VALUE_NOT_IN_RANGE',
          message: `Value ${ext.attenuationDistance} is out of range.`,
          severity: Severity.ERROR,
          pointer: `${basePointer}/attenuationDistance`
        });
      } else {
        this.validateValueInRange(ext.attenuationDistance, 0, Infinity, `${basePointer}/attenuationDistance`, addMessage, true);
      }
    }

    if (ext.thicknessFactor !== undefined) {
      this.validateValueInRange(ext.thicknessFactor, 0, Infinity, `${basePointer}/thicknessFactor`, addMessage);
    }

    // Check if volume extension is used with double-sided material
    // Only trigger warning if volume extension has actual properties
    const hasVolumeProperties = ext.thicknessFactor !== undefined ||
                               ext.attenuationDistance !== undefined ||
                               ext.attenuationColor !== undefined;

    if (material.doubleSided === true && hasVolumeProperties) {
      addMessage({
        code: 'KHR_MATERIALS_VOLUME_DOUBLE_SIDED',
        message: 'The volume extension should not be used with double-sided materials.',
        severity: Severity.WARNING,
        pointer: basePointer
      });
    }
  }

  private validateVolumeTransmissionDependencyWithMaterial(material: any, materialIndex: number, addMessage: (message: ValidationMessage) => void): void {
    // Check if material has transmission-enabling extensions
    let hasTransmission = false;
    if (material['extensions']) {
      for (const extensionName in material['extensions']) {
        if (extensionName.includes('transmission') || extensionName.includes('translucency')) {
          hasTransmission = true;
          break;
        }
      }
    }

    if (!hasTransmission) {
      addMessage({
        code: 'KHR_MATERIALS_VOLUME_NO_TRANSMISSION',
        message: 'The volume extension needs to be combined with an extension that allows light to transmit through the surface.',
        severity: Severity.WARNING,
        pointer: `/materials/${materialIndex}/extensions/KHR_materials_volume`
      });
    }
  }

}

// KHR_animation_pointer validator
class KHRAnimationPointerValidator extends BaseExtensionValidator {
  extensionName = 'KHR_animation_pointer';

  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void {
    // Validate animation channels with KHR_animation_pointer extension
    if (gltf.animations) {
      for (let i = 0; i < gltf.animations.length; i++) {
        const animation = gltf.animations[i];
        if (animation && animation.channels) {
          for (let j = 0; j < animation.channels.length; j++) {
            const channel = animation.channels[j];

            // Check for extension in wrong location (on channel instead of target)
            if (channel && channel['extensions'] && channel['extensions']['KHR_animation_pointer']) {
              addMessage({
                code: 'UNEXPECTED_EXTENSION_OBJECT',
                message: 'Unexpected location for this extension.',
                severity: Severity.ERROR,
                pointer: `/animations/${i}/channels/${j}/extensions/KHR_animation_pointer`
              });
            }

            if (channel && channel.target && channel.target['extensions'] &&
                channel.target['extensions']['KHR_animation_pointer']) {
              const ext = channel.target['extensions']['KHR_animation_pointer'];
              const basePointer = `/animations/${i}/channels/${j}/target/extensions/KHR_animation_pointer`;

              // Validate pointer property (required)
              if (ext.pointer === undefined) {
                addMessage({
                  code: 'UNDEFINED_PROPERTY',
                  message: 'Property \'pointer\' must be defined.',
                  severity: Severity.ERROR,
                  pointer: basePointer
                });
              } else if (typeof ext.pointer !== 'string') {
                addMessage({
                  code: 'TYPE_MISMATCH',
                  message: 'Property value is not a \'string\'.',
                  severity: Severity.ERROR,
                  pointer: `${basePointer}/pointer`
                });
              } else {
                // Validate pointer syntax (JSON pointer regex pattern)
                const jsonPointerPattern = /^(?:\/(?:[^/~]|~0|~1)*)*$/;
                if (!jsonPointerPattern.test(ext.pointer)) {
                  addMessage({
                    code: 'PATTERN_MISMATCH',
                    message: `Value '${ext.pointer}' does not match regexp pattern '^(?:\\/(?:[^/~]|~0|~1)*)*$'.`,
                    severity: Severity.ERROR,
                    pointer: `${basePointer}/pointer`
                  });
                }
              }

              // Check for unexpected properties
              const expectedProperties = ['pointer'];
              for (const key in ext) {
                if (!expectedProperties.includes(key)) {
                  addMessage({
                    code: 'UNEXPECTED_PROPERTY',
                    message: 'Unexpected property.',
                    severity: Severity.WARNING,
                    pointer: `${basePointer}/${key}`
                  });
                }
              }

              // Validate that target node is undefined when using KHR_animation_pointer
              if (channel.target && channel.target.node !== undefined) {
                addMessage({
                  code: 'KHR_ANIMATION_POINTER_ANIMATION_CHANNEL_TARGET_NODE',
                  message: 'This extension requires the animation channel target node to be undefined.',
                  severity: Severity.ERROR,
                  pointer: basePointer
                });
              }

              // Validate that target path is "pointer" when using KHR_animation_pointer
              if (channel.target && channel.target.path !== 'pointer') {
                addMessage({
                  code: 'KHR_ANIMATION_POINTER_ANIMATION_CHANNEL_TARGET_PATH',
                  message: `This extension requires the animation channel target path to be 'pointer'. Found '${channel.target.path}' instead.`,
                  severity: Severity.ERROR,
                  pointer: basePointer
                });
              }

              // Add incomplete extension warning (as expected by tests)
              this.addIncompleteExtensionWarning(basePointer, addMessage);
            }
          }
        }
      }
    }
  }
}

// KHR_materials_variants validator
class KHRMaterialsVariantsValidator extends BaseExtensionValidator {
  extensionName = 'KHR_materials_variants';

  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void {
    // Check if extension is used in primitives but not defined in root extensions
    const hasRootExtension = gltf.extensions && gltf.extensions[this.extensionName];
    const hasPrimitiveUsage = this.hasPrimitiveUsage(gltf);

    if (hasPrimitiveUsage && !hasRootExtension) {
      // Find the first primitive that uses this extension to report the error
      if (gltf.meshes) {
        for (let i = 0; i < gltf.meshes.length; i++) {
          const mesh = gltf.meshes[i];
          if (mesh && mesh.primitives) {
            for (let j = 0; j < mesh.primitives.length; j++) {
              const primitive = mesh.primitives[j];
              if (primitive && primitive['extensions'] && primitive['extensions'][this.extensionName]) {
                const ext = primitive['extensions'][this.extensionName];
                if (ext.mappings && Array.isArray(ext.mappings) && ext.mappings.length > 0) {
                  addMessage({
                    code: 'UNSATISFIED_DEPENDENCY',
                    message: 'Dependency failed. \'/extensions/KHR_materials_variants\' must be defined.',
                    severity: Severity.ERROR,
                    pointer: `/meshes/${i}/primitives/${j}/extensions/${this.extensionName}/mappings/0`
                  });
                  return; // Only report the first occurrence
                }
              }
            }
          }
        }
      }
    }

    // Validate root extension for variants definition
    if (gltf.extensions && gltf.extensions[this.extensionName]) {
      const rootExt = gltf.extensions[this.extensionName];
      const basePointer = `/extensions/${this.extensionName}`;

      if (rootExt.variants === undefined) {
        addMessage({
          code: 'UNDEFINED_PROPERTY',
          message: 'Property \'variants\' must be defined.',
          severity: Severity.ERROR,
          pointer: basePointer
        });
      } else if (rootExt.variants !== undefined) {
        if (!Array.isArray(rootExt.variants)) {
          addMessage({
            code: 'TYPE_MISMATCH',
            message: 'Property value is not a \'array\'.',
            severity: Severity.ERROR,
            pointer: `${basePointer}/variants`
          });
        } else if (rootExt.variants.length === 0) {
          addMessage({
            code: 'EMPTY_ENTITY',
            message: 'Entity cannot be empty.',
            severity: Severity.ERROR,
            pointer: `${basePointer}/variants`
          });
        } else {
          // Check for unexpected properties on the root extension object first
          const expectedRootProperties = ['variants', 'extras'];
          for (const key in rootExt) {
            if (!expectedRootProperties.includes(key)) {
              addMessage({
                code: 'UNEXPECTED_PROPERTY',
                message: 'Unexpected property.',
                severity: Severity.WARNING,
                pointer: `${basePointer}/${key}`
              });
            }
          }

          // Validate individual variant objects
          for (let i = 0; i < rootExt.variants.length; i++) {
            const variant = rootExt.variants[i];
            const variantPointer = `${basePointer}/variants/${i}`;

            if (variant === null || typeof variant !== 'object' || Array.isArray(variant)) {
              addMessage({
                code: 'TYPE_MISMATCH',
                message: 'Property value is not a \'object\'.',
                severity: Severity.ERROR,
                pointer: variantPointer
              });
            } else {
              // Validate name property if present
              if (variant.name !== undefined) {
                if (typeof variant.name !== 'string') {
                  addMessage({
                    code: 'TYPE_MISMATCH',
                    message: `Type mismatch. Property value ${JSON.stringify(variant.name)} is not a 'string'.`,
                    severity: Severity.ERROR,
                    pointer: `${variantPointer}/name`
                  });
                } else if (variant.name.length === 0) {
                  addMessage({
                    code: 'INVALID_VALUE',
                    message: 'Empty variant name is not allowed.',
                    severity: Severity.ERROR,
                    pointer: `${variantPointer}/name`
                  });
                }
              }

              // Check for unexpected properties
              const expectedProperties = ['name', 'extras'];
              for (const key in variant) {
                if (!expectedProperties.includes(key)) {
                  addMessage({
                    code: 'UNEXPECTED_PROPERTY',
                    message: 'Unexpected property.',
                    severity: Severity.WARNING,
                    pointer: `${variantPointer}/${key}`
                  });
                }
              }
            }
          }
        }
      }
    }

    // Validate materials with KHR_materials_variants extension
    if (gltf.materials) {
      for (let i = 0; i < gltf.materials.length; i++) {
        const material = gltf.materials[i];
        if (material && material['extensions'] && material['extensions'][this.extensionName]) {
          const ext = material['extensions'][this.extensionName];
          const basePointer = `/materials/${i}/extensions/${this.extensionName}`;

          // Validate variants array
          if (ext.variants !== undefined) {
            if (!Array.isArray(ext.variants)) {
              addMessage({
                code: 'TYPE_MISMATCH',
                message: 'Property value is not a \'array\'.',
                severity: Severity.ERROR,
                pointer: `${basePointer}/variants`
              });
            } else {
              for (let j = 0; j < ext.variants.length; j++) {
                const variant = ext.variants[j];
                if (typeof variant !== 'number' || variant < 0) {
                  addMessage({
                    code: 'INVALID_VALUE',
                    message: 'Variant index must be a non-negative integer.',
                    severity: Severity.ERROR,
                    pointer: `${basePointer}/variants/${j}`
                  });
                }
              }
            }
          }
        }
      }
    }

    // Validate meshes with KHR_materials_variants extension
    if (gltf.meshes) {
      for (let i = 0; i < gltf.meshes.length; i++) {
        const mesh = gltf.meshes[i];
        if (mesh && mesh.primitives) {
          for (let j = 0; j < mesh.primitives.length; j++) {
            const primitive = mesh.primitives[j];
            if (primitive && primitive['extensions'] && primitive['extensions'][this.extensionName]) {
              const ext = primitive['extensions'][this.extensionName];
              const basePointer = `/meshes/${i}/primitives/${j}/extensions/${this.extensionName}`;

              // Check for unexpected properties on the extension object itself first
              const expectedExtensionProperties = ['mappings', 'extras'];
              for (const key in ext) {
                if (!expectedExtensionProperties.includes(key)) {
                  addMessage({
                    code: 'UNEXPECTED_PROPERTY',
                    message: 'Unexpected property.',
                    severity: Severity.WARNING,
                    pointer: `${basePointer}/${key}`
                  });
                }
              }

              // Validate mappings array
              if (ext.mappings === undefined) {
                addMessage({
                  code: 'UNDEFINED_PROPERTY',
                  message: 'Property \'mappings\' must be defined.',
                  severity: Severity.ERROR,
                  pointer: basePointer
                });
              } else if (!Array.isArray(ext.mappings)) {
                addMessage({
                  code: 'TYPE_MISMATCH',
                  message: 'Property value is not a \'array\'.',
                  severity: Severity.ERROR,
                  pointer: `${basePointer}/mappings`
                });
              } else if (ext.mappings.length === 0) {
                addMessage({
                  code: 'EMPTY_ENTITY',
                  message: 'Entity cannot be empty.',
                  severity: Severity.ERROR,
                  pointer: `${basePointer}/mappings`
                });
              } else {
                // Check for non-unique variants across all mappings in this primitive
                const usedVariants = new Set<number>();
                for (let k = 0; k < ext.mappings.length; k++) {
                  const mapping = ext.mappings[k];
                  if (mapping && mapping.variants && Array.isArray(mapping.variants)) {
                    for (const variantIndex of mapping.variants) {
                      if (typeof variantIndex === 'number') {
                        if (usedVariants.has(variantIndex)) {
                          addMessage({
                            code: 'KHR_MATERIALS_VARIANTS_NON_UNIQUE_VARIANT',
                            message: 'This variant is used more than once for this mesh primitive.',
                            severity: Severity.ERROR,
                            pointer: `${basePointer}/mappings/${k}/variants/${mapping.variants.indexOf(variantIndex)}`
                          });
                        } else {
                          usedVariants.add(variantIndex);
                        }
                      }
                    }
                  }
                }

                for (let k = 0; k < ext.mappings.length; k++) {
                  const mapping = ext.mappings[k];
                  const mappingPointer = `${basePointer}/mappings/${k}`;

                  if (mapping && typeof mapping === 'object') {
                    // Validate variants property (required) - check first for proper ordering
                    if (mapping.variants === undefined) {
                      addMessage({
                        code: 'UNDEFINED_PROPERTY',
                        message: 'Property \'variants\' must be defined.',
                        severity: Severity.ERROR,
                        pointer: mappingPointer
                      });
                    } else if (!Array.isArray(mapping.variants)) {
                      addMessage({
                        code: 'TYPE_MISMATCH',
                        message: 'Property value is not a \'array\'.',
                        severity: Severity.ERROR,
                        pointer: `${mappingPointer}/variants`
                      });
                    } else if (mapping.variants.length === 0) {
                      addMessage({
                        code: 'EMPTY_ENTITY',
                        message: 'Entity cannot be empty.',
                        severity: Severity.ERROR,
                        pointer: `${mappingPointer}/variants`
                      });
                    } else {
                      // Check if variant references are valid
                      const rootExt = gltf.extensions && gltf.extensions[this.extensionName];
                      if (rootExt && rootExt.variants && Array.isArray(rootExt.variants)) {
                        for (let v = 0; v < mapping.variants.length; v++) {
                          const variantIndex = mapping.variants[v];
                          if (typeof variantIndex === 'number' && variantIndex >= rootExt.variants.length) {
                            addMessage({
                              code: 'UNRESOLVED_REFERENCE',
                              message: `Unresolved reference: ${variantIndex}.`,
                              severity: Severity.ERROR,
                              pointer: `${mappingPointer}/variants/${v}`
                            });
                          }
                        }
                      }
                    }

                    // Validate material property (required)
                    if (mapping.material === undefined) {
                      addMessage({
                        code: 'UNDEFINED_PROPERTY',
                        message: 'Property \'material\' must be defined.',
                        severity: Severity.ERROR,
                        pointer: mappingPointer
                      });
                    } else if (typeof mapping.material !== 'number' || mapping.material < 0) {
                      addMessage({
                        code: 'INVALID_VALUE',
                        message: 'Material index must be a non-negative integer.',
                        severity: Severity.ERROR,
                        pointer: `${mappingPointer}/material`
                      });
                    } else {
                      // Check if material reference is valid
                      if (!gltf.materials || mapping.material >= gltf.materials.length) {
                        addMessage({
                          code: 'UNRESOLVED_REFERENCE',
                          message: `Unresolved reference: ${mapping.material}.`,
                          severity: Severity.ERROR,
                          pointer: `${mappingPointer}/material`
                        });
                      }
                    }

                    // Check for unexpected properties
                    const expectedProperties = ['material', 'variants', 'extras'];
                    for (const key in mapping) {
                      if (!expectedProperties.includes(key)) {
                        addMessage({
                          code: 'UNEXPECTED_PROPERTY',
                          message: 'Unexpected property.',
                          severity: Severity.WARNING,
                          pointer: `${mappingPointer}/${key}`
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private hasPrimitiveUsage(gltf: GLTF): boolean {
    if (gltf.meshes) {
      for (const mesh of gltf.meshes) {
        if (mesh && mesh.primitives) {
          for (const primitive of mesh.primitives) {
            if (primitive && primitive['extensions'] && primitive['extensions'][this.extensionName]) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}

// KHR_mesh_quantization validator
class KHRMeshQuantizationValidator extends BaseExtensionValidator {
  extensionName = 'KHR_mesh_quantization';

  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void {
    // Validate meshes with KHR_mesh_quantization extension
    if (gltf.meshes) {
      for (let i = 0; i < gltf.meshes.length; i++) {
        const mesh = gltf.meshes[i];
        if (mesh && mesh.primitives) {
          for (let j = 0; j < mesh.primitives.length; j++) {
            const primitive = mesh.primitives[j];
            if (primitive && primitive['extensions'] && primitive['extensions'][this.extensionName]) {
              const ext = primitive['extensions'][this.extensionName];
              const basePointer = `/meshes/${i}/primitives/${j}/extensions/${this.extensionName}`;

              // Validate quantization properties
              const validProperties = ['POSITION', 'NORMAL', 'TANGENT', 'TEXCOORD_0', 'TEXCOORD_1', 'COLOR_0', 'JOINTS_0', 'WEIGHTS_0'];
              for (const prop in ext) {
                if (!validProperties.includes(prop)) {
                  addMessage({
                    code: 'UNEXPECTED_PROPERTY',
                    message: 'Unexpected property.',
                    severity: Severity.WARNING,
                    pointer: `${basePointer}/${prop}`
                  });
                } else {
                  const quant = ext[prop];
                  if (quant && typeof quant === 'object') {
                    if (quant.quantized !== undefined && typeof quant.quantized !== 'number') {
                      addMessage({
                        code: 'TYPE_MISMATCH',
                        message: 'Property value is not a \'number\'.',
                        severity: Severity.ERROR,
                        pointer: `${basePointer}/${prop}/quantized`
                      });
                    }
                    if (quant.offset !== undefined && typeof quant.offset !== 'number') {
                      addMessage({
                        code: 'TYPE_MISMATCH',
                        message: 'Property value is not a \'number\'.',
                        severity: Severity.ERROR,
                        pointer: `${basePointer}/${prop}/offset`
                      });
                    }
                    if (quant.scale !== undefined && typeof quant.scale !== 'number') {
                      addMessage({
                        code: 'TYPE_MISMATCH',
                        message: 'Property value is not a \'number\'.',
                        severity: Severity.ERROR,
                        pointer: `${basePointer}/${prop}/scale`
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// KHR_texture_transform validator
class KHRTextureTransformValidator extends BaseExtensionValidator {
  extensionName = 'KHR_texture_transform';

  validate(gltf: GLTF, addMessage: (message: ValidationMessage) => void): void {
    // Check for texture transform extensions in incorrect locations (texture objects)
    if (gltf.textures) {
      for (let i = 0; i < gltf.textures.length; i++) {
        const texture = gltf.textures[i];
        if (texture && texture['extensions'] && texture['extensions'][this.extensionName]) {
          addMessage({
            code: 'UNEXPECTED_EXTENSION_OBJECT',
            message: 'Unexpected location for this extension.',
            severity: Severity.ERROR,
            pointer: `/textures/${i}/extensions/${this.extensionName}`
          });
        }
      }
    }

    // Validate materials with KHR_texture_transform extension
    if (gltf.materials) {
      for (let i = 0; i < gltf.materials.length; i++) {
        const material = gltf.materials[i];
        if (material) {
          this.validateTextureInfoExtensions(material.pbrMetallicRoughness?.baseColorTexture, i, 'pbrMetallicRoughness/baseColorTexture', addMessage);
          this.validateTextureInfoExtensions(material.pbrMetallicRoughness?.metallicRoughnessTexture, i, 'pbrMetallicRoughness/metallicRoughnessTexture', addMessage);
          this.validateTextureInfoExtensions(material.normalTexture, i, 'normalTexture', addMessage);
          this.validateTextureInfoExtensions(material.occlusionTexture, i, 'occlusionTexture', addMessage);
          this.validateTextureInfoExtensions(material.emissiveTexture, i, 'emissiveTexture', addMessage);
        }
      }
    }
  }

  private validateTextureInfoExtensions(textureInfo: any, materialIndex: number, path: string, addMessage: (message: ValidationMessage) => void): void {
    if (textureInfo && textureInfo['extensions'] && textureInfo['extensions'][this.extensionName]) {
      const ext = textureInfo['extensions'][this.extensionName];
      const basePointer = `/materials/${materialIndex}/${path}/extensions/${this.extensionName}`;

      // Validate offset
      if (ext.offset !== undefined) {
        if (!Array.isArray(ext.offset) || ext.offset.length !== 2) {
          addMessage({
            code: 'TYPE_MISMATCH',
            message: 'Property value is not a \'array\' of length 2.',
            severity: Severity.ERROR,
            pointer: `${basePointer}/offset`
          });
        }
      }

      // Validate rotation
      if (ext.rotation !== undefined) {
        if (typeof ext.rotation !== 'number') {
          addMessage({
            code: 'TYPE_MISMATCH',
            message: 'Property value is not a \'number\'.',
            severity: Severity.ERROR,
            pointer: `${basePointer}/rotation`
          });
        }
      }

      // Validate scale
      if (ext.scale !== undefined) {
        if (!Array.isArray(ext.scale) || ext.scale.length !== 2) {
          addMessage({
            code: 'TYPE_MISMATCH',
            message: 'Property value is not a \'array\' of length 2.',
            severity: Severity.ERROR,
            pointer: `${basePointer}/scale`
          });
        }
      }

      // Validate texCoord
      if (ext.texCoord !== undefined) {
        if (typeof ext.texCoord !== 'number' || ext.texCoord < 0) {
          addMessage({
            code: 'INVALID_VALUE',
            message: 'TexCoord must be a non-negative integer.',
            severity: Severity.ERROR,
            pointer: `${basePointer}/texCoord`
          });
        }
      }

      // Check for unexpected properties
      const expectedProperties = ['offset', 'rotation', 'scale', 'texCoord'];
      for (const key in ext) {
        if (!expectedProperties.includes(key)) {
          addMessage({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }
  }
}


export const extensionValidators: Map<string, ExtensionValidator> = new Map([
  ['EXT_texture_webp', new EXTTextureWebPValidator()],
  ['KHR_lights_punctual', new KHRLightsPunctualValidator()],
  ['KHR_animation_pointer', new KHRAnimationPointerValidator()],
  ['KHR_materials_anisotropy', new KHRMaterialsValidator('KHR_materials_anisotropy')],
  ['KHR_materials_clearcoat', new KHRMaterialsValidator('KHR_materials_clearcoat')],
  ['KHR_materials_dispersion', new KHRMaterialsValidator('KHR_materials_dispersion')],
  ['KHR_materials_emissive_strength', new KHRMaterialsValidator('KHR_materials_emissive_strength')],
  ['KHR_materials_ior', new KHRMaterialsValidator('KHR_materials_ior')],
  ['KHR_materials_iridescence', new KHRMaterialsValidator('KHR_materials_iridescence')],
  ['KHR_materials_pbrSpecularGlossiness', new KHRMaterialsValidator('KHR_materials_pbrSpecularGlossiness')],
  ['KHR_materials_sheen', new KHRMaterialsValidator('KHR_materials_sheen')],
  ['KHR_materials_specular', new KHRMaterialsValidator('KHR_materials_specular')],
  ['KHR_materials_transmission', new KHRMaterialsValidator('KHR_materials_transmission')],
  ['KHR_materials_unlit', new KHRMaterialsValidator('KHR_materials_unlit')],
  ['KHR_materials_variants', new KHRMaterialsVariantsValidator()],
  ['KHR_materials_volume', new KHRMaterialsValidator('KHR_materials_volume')],
  ['KHR_mesh_quantization', new KHRMeshQuantizationValidator()],
  ['KHR_texture_transform', new KHRTextureTransformValidator()],
]);
