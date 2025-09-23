import { GLTFMaterial, ValidationMessage, Severity, AlphaMode } from '../types';

export class MaterialValidator {
  validate(material: GLTFMaterial, index: number, gltf: any): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check alphaMode
    if (material.alphaMode !== undefined) {
      if (typeof material.alphaMode !== 'string') {
        messages.push({
          code: 'TYPE_MISMATCH',
          message: 'Material alphaMode must be a string.',
          severity: Severity.ERROR,
          pointer: `/materials/${index}/alphaMode`
        });
      } else if (!Object.values(AlphaMode).includes(material.alphaMode as any)) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'Material alphaMode must be one of: OPAQUE, MASK, BLEND.',
          severity: Severity.ERROR,
          pointer: `/materials/${index}/alphaMode`
        });
      }
    }

    // Check alphaCutoff
    if (material.alphaCutoff !== undefined) {
      if (typeof material.alphaCutoff !== 'number' || material.alphaCutoff < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'Material alphaCutoff must be a non-negative number.',
          severity: Severity.ERROR,
          pointer: `/materials/${index}/alphaCutoff`
        });
      }
      // alphaCutoff is only valid with MASK alpha mode
      if (material.alphaMode !== 'MASK') {
        messages.push({
          code: 'MATERIAL_ALPHA_CUTOFF_INVALID_MODE',
          message: 'Alpha cutoff is supported only for \'MASK\' alpha mode.',
          severity: Severity.WARNING,
          pointer: `/materials/${index}/alphaCutoff`
        });
      }
    }

    // Validate PBR Metallic Roughness
    if (material.pbrMetallicRoughness) {
      const pbr = material.pbrMetallicRoughness;

      // Validate base color texture
      if (pbr.baseColorTexture) {
        if (pbr.baseColorTexture.index === undefined) {
          messages.push({
            code: 'INVALID_MATERIAL_BASECOLOR_TEXTURE',
            message: 'Base color texture must have an index',
            severity: Severity.ERROR,
            pointer: `/materials/${index}/pbrMetallicRoughness/baseColorTexture`
          });
        } else {
          // Validate texture reference
          if (!gltf.textures || pbr.baseColorTexture.index >= gltf.textures.length) {
            messages.push({
              code: 'UNRESOLVED_REFERENCE',
              message: 'Unresolved reference: ' + pbr.baseColorTexture.index + '.',
              severity: Severity.ERROR,
              pointer: `/materials/${index}/pbrMetallicRoughness/baseColorTexture/index`
            });
          }
        }
      }

      // Validate metallic roughness texture
      if (pbr.metallicRoughnessTexture) {
        if (pbr.metallicRoughnessTexture.index === undefined) {
          messages.push({
            code: 'INVALID_MATERIAL_METALLIC_ROUGHNESS_TEXTURE',
            message: 'Metallic roughness texture must have an index',
            severity: Severity.ERROR,
            pointer: `/materials/${index}/pbrMetallicRoughness/metallicRoughnessTexture`
          });
        } else {
          // Validate texture reference
          if (!gltf.textures || pbr.metallicRoughnessTexture.index >= gltf.textures.length) {
            messages.push({
              code: 'UNRESOLVED_REFERENCE',
              message: 'Unresolved reference: ' + pbr.metallicRoughnessTexture.index + '.',
              severity: Severity.ERROR,
              pointer: `/materials/${index}/pbrMetallicRoughness/metallicRoughnessTexture/index`
            });
          }
        }
      }
    }

    // Validate normal texture
    if (material.normalTexture) {
      if (material.normalTexture.index === undefined) {
        messages.push({
          code: 'INVALID_MATERIAL_NORMAL_TEXTURE',
          message: 'Normal texture must have an index',
          severity: Severity.ERROR,
          pointer: `/materials/${index}/normalTexture`
        });
      } else {
        // Validate texture reference
        if (!gltf.textures || material.normalTexture.index >= gltf.textures.length) {
          messages.push({
            code: 'UNRESOLVED_REFERENCE',
            message: 'Unresolved reference: ' + material.normalTexture.index + '.',
            severity: Severity.ERROR,
            pointer: `/materials/${index}/normalTexture/index`
          });
        }
      }
    }

    // Validate occlusion texture
    if (material.occlusionTexture) {
      if (material.occlusionTexture.index === undefined) {
        messages.push({
          code: 'INVALID_MATERIAL_OCCLUSION_TEXTURE',
          message: 'Occlusion texture must have an index',
          severity: Severity.ERROR,
          pointer: `/materials/${index}/occlusionTexture`
        });
      } else {
        // Validate texture reference
        if (!gltf.textures || material.occlusionTexture.index >= gltf.textures.length) {
          messages.push({
            code: 'UNRESOLVED_REFERENCE',
            message: 'Unresolved reference: ' + material.occlusionTexture.index + '.',
            severity: Severity.ERROR,
            pointer: `/materials/${index}/occlusionTexture/index`
          });
        }
      }
    }

    // Validate emissive texture
    if (material.emissiveTexture) {
      if (material.emissiveTexture.index === undefined) {
        messages.push({
          code: 'INVALID_MATERIAL_EMISSIVE_TEXTURE',
          message: 'Emissive texture must have an index',
          severity: Severity.ERROR,
          pointer: `/materials/${index}/emissiveTexture`
        });
      } else {
        // Validate texture reference
        if (!gltf.textures || material.emissiveTexture.index >= gltf.textures.length) {
          messages.push({
            code: 'UNRESOLVED_REFERENCE',
            message: 'Unresolved reference: ' + material.emissiveTexture.index + '.',
            severity: Severity.ERROR,
            pointer: `/materials/${index}/emissiveTexture/index`
          });
        }
      }
    }

    // Check for unexpected properties at material level first
    const expectedProperties = ['name', 'doubleSided', 'alphaMode', 'alphaCutoff', 'pbrMetallicRoughness', 'normalTexture', 'occlusionTexture', 'emissiveTexture', 'emissiveFactor', 'extensions', 'extras'];
    for (const key in material) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `/materials/${index}/${key}`
        });
      }
    }

    // Check pbrMetallicRoughness nested properties
    if (material.pbrMetallicRoughness) {
      const expectedPbrProperties = ['baseColorFactor', 'baseColorTexture', 'metallicFactor', 'roughnessFactor', 'metallicRoughnessTexture'];

      // Allow 'extensions' property if it contains any extensions (even if they're in wrong location)
      // The specific extension location validation will be handled by extension validators
      if (material.pbrMetallicRoughness['extensions']) {
        expectedPbrProperties.push('extensions');
      }

      for (const key in material.pbrMetallicRoughness) {
        if (!expectedPbrProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `/materials/${index}/pbrMetallicRoughness/${key}`
          });
        }
      }

      // Check baseColorTexture properties
      if (material.pbrMetallicRoughness.baseColorTexture) {
        const expectedTextureProperties = ['index', 'texCoord'];
        // Allow extensions when KHR_texture_transform is used
        if (material.pbrMetallicRoughness.baseColorTexture['extensions'] && material.pbrMetallicRoughness.baseColorTexture['extensions']['KHR_texture_transform']) {
          expectedTextureProperties.push('extensions');
        }
        for (const key in material.pbrMetallicRoughness.baseColorTexture) {
          if (!expectedTextureProperties.includes(key)) {
            messages.push({
              code: 'UNEXPECTED_PROPERTY',
              message: 'Unexpected property.',
              severity: Severity.WARNING,
              pointer: `/materials/${index}/pbrMetallicRoughness/baseColorTexture/${key}`
            });
          }
        }
      }

      // Check metallicRoughnessTexture properties
      if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
        const expectedTextureProperties = ['index', 'texCoord'];
        // Allow extensions when KHR_texture_transform is used
        if (material.pbrMetallicRoughness.metallicRoughnessTexture['extensions'] && material.pbrMetallicRoughness.metallicRoughnessTexture['extensions']['KHR_texture_transform']) {
          expectedTextureProperties.push('extensions');
        }
        for (const key in material.pbrMetallicRoughness.metallicRoughnessTexture) {
          if (!expectedTextureProperties.includes(key)) {
            messages.push({
              code: 'UNEXPECTED_PROPERTY',
              message: 'Unexpected property.',
              severity: Severity.WARNING,
              pointer: `/materials/${index}/pbrMetallicRoughness/metallicRoughnessTexture/${key}`
            });
          }
        }
      }
    }

    // Check normalTexture properties
    if (material.normalTexture) {
      const expectedNormalTextureProperties = ['index', 'texCoord', 'scale'];
      // Allow extensions when KHR_texture_transform is used
      if (material.normalTexture['extensions'] && material.normalTexture['extensions']['KHR_texture_transform']) {
        expectedNormalTextureProperties.push('extensions');
      }
      for (const key in material.normalTexture) {
        if (!expectedNormalTextureProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `/materials/${index}/normalTexture/${key}`
          });
        }
      }
    }

    // Check occlusionTexture properties
    if (material.occlusionTexture) {
      const expectedOcclusionTextureProperties = ['index', 'texCoord', 'strength'];
      // Allow extensions when KHR_texture_transform is used
      if (material.occlusionTexture['extensions'] && material.occlusionTexture['extensions']['KHR_texture_transform']) {
        expectedOcclusionTextureProperties.push('extensions');
      }
      for (const key in material.occlusionTexture) {
        if (!expectedOcclusionTextureProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `/materials/${index}/occlusionTexture/${key}`
          });
        }
      }
    }

    // Check emissiveTexture properties
    if (material.emissiveTexture) {
      const expectedEmissiveTextureProperties = ['index', 'texCoord'];
      // Allow extensions when KHR_texture_transform is used
      if (material.emissiveTexture['extensions'] && material.emissiveTexture['extensions']['KHR_texture_transform']) {
        expectedEmissiveTextureProperties.push('extensions');
      }
      for (const key in material.emissiveTexture) {
        if (!expectedEmissiveTextureProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `/materials/${index}/emissiveTexture/${key}`
          });
        }
      }
    }

    // Validate material extensions
    if (material['extensions']) {
      for (const extensionName in material['extensions']) {
        const extension = material['extensions'][extensionName];
        this.validateMaterialExtension(extensionName, extension, index, messages);
      }
    }

    // Check for incompatible material extensions
    if (material['extensions']) {
      const extensions = Object.keys(material['extensions']);

      // Check for extensions incompatible with unlit
      if (extensions.includes('KHR_materials_unlit')) {
        const incompatibleWithUnlit = extensions.filter(ext =>
          ext !== 'KHR_materials_unlit' &&
          (ext.startsWith('KHR_materials_') || ext === 'KHR_materials_clearcoat')
        );

        if (incompatibleWithUnlit.length > 0) {
          messages.push({
            code: 'MULTIPLE_EXTENSIONS',
            message: 'This extension may be incompatible with other extensions for the object.',
            severity: Severity.WARNING,
            pointer: `/materials/${index}/extensions/KHR_materials_unlit`
          });
        }
      }

      // Check for pbrSpecularGlossiness incompatibilities
      if (extensions.includes('KHR_materials_pbrSpecularGlossiness')) {
        const incompatibleWithPbrSG = extensions.filter(ext =>
          ext !== 'KHR_materials_pbrSpecularGlossiness' &&
          (ext === 'KHR_materials_transmission' || ext === 'KHR_materials_clearcoat' || ext === 'KHR_materials_unlit')
        );

        if (incompatibleWithPbrSG.length > 0) {
          messages.push({
            code: 'MULTIPLE_EXTENSIONS',
            message: 'This extension may be incompatible with other extensions for the object.',
            severity: Severity.WARNING,
            pointer: `/materials/${index}/extensions/KHR_materials_pbrSpecularGlossiness`
          });
        }
      }
    }

    return messages;
  }

  private validateMaterialExtension(extensionName: string, extension: any, materialIndex: number, messages: ValidationMessage[]): void {
    const basePointer = `/materials/${materialIndex}/extensions/${extensionName}`;

    // Validate KHR_materials_anisotropy
    if (extensionName === 'KHR_materials_anisotropy') {
      const expectedProperties = ['anisotropyStrength', 'anisotropyRotation', 'anisotropyTexture'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_clearcoat
    else if (extensionName === 'KHR_materials_clearcoat') {
      const expectedProperties = ['clearcoatFactor', 'clearcoatTexture', 'clearcoatRoughnessFactor', 'clearcoatRoughnessTexture', 'clearcoatNormalTexture'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_dispersion
    else if (extensionName === 'KHR_materials_dispersion') {
      const expectedProperties = ['dispersion'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_emissive_strength
    else if (extensionName === 'KHR_materials_emissive_strength') {
      const expectedProperties = ['emissiveStrength'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_ior
    else if (extensionName === 'KHR_materials_ior') {
      const expectedProperties = ['ior'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_iridescence
    else if (extensionName === 'KHR_materials_iridescence') {
      const expectedProperties = ['iridescenceFactor', 'iridescenceTexture', 'iridescenceIor', 'iridescenceThicknessMinimum', 'iridescenceThicknessMaximum', 'iridescenceThicknessTexture'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_sheen
    else if (extensionName === 'KHR_materials_sheen') {
      const expectedProperties = ['sheenColorFactor', 'sheenColorTexture', 'sheenRoughnessFactor', 'sheenRoughnessTexture'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_specular
    else if (extensionName === 'KHR_materials_specular') {
      const expectedProperties = ['specularFactor', 'specularTexture', 'specularColorFactor', 'specularColorTexture'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_transmission
    else if (extensionName === 'KHR_materials_transmission') {
      const expectedProperties = ['transmissionFactor', 'transmissionTexture'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }
    }

    // Validate KHR_materials_unlit (no properties expected)
    else if (extensionName === 'KHR_materials_unlit') {
      for (const key in extension) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `${basePointer}/${key}`
        });
      }
    }

    // Validate KHR_materials_volume
    else if (extensionName === 'KHR_materials_volume') {
      const expectedProperties = ['thicknessFactor', 'thicknessTexture', 'attenuationDistance', 'attenuationColor'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: 'UNEXPECTED_PROPERTY',
            message: 'Unexpected property.',
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      }

      // Note: Volume-transmission dependency is validated in the extensions validator
    }

    // Validate KHR_materials_pbrSpecularGlossiness
    else if (extensionName === 'KHR_materials_pbrSpecularGlossiness') {
      const expectedProperties = ['diffuseFactor', 'diffuseTexture', 'specularFactor', 'glossinessFactor', 'specularGlossinessTexture'];
      for (const key in extension) {
        if (!expectedProperties.includes(key)) {
          messages.push({
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
