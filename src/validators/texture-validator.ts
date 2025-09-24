import { GLTFTexture, GLTF, ValidationMessage, Severity } from "../types";

export class TextureValidator {
  validate(
    texture: GLTFTexture,
    index: number,
    gltf: GLTF,
  ): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check source
    if (texture.source !== undefined) {
      if (typeof texture.source !== "number" || texture.source < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Texture source must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/textures/${index}/source`,
        });
      } else if (!gltf.images || texture.source >= gltf.images.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + texture.source + ".",
          severity: Severity.ERROR,
          pointer: `/textures/${index}/source`,
        });
      }
    }

    // Check sampler
    if (texture.sampler !== undefined) {
      if (typeof texture.sampler !== "number" || texture.sampler < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Texture sampler must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/textures/${index}/sampler`,
        });
      } else if (!gltf.samplers || texture.sampler >= gltf.samplers.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + texture.sampler + ".",
          severity: Severity.ERROR,
          pointer: `/textures/${index}/sampler`,
        });
      }
    }

    // Check for unexpected properties
    const expectedProperties = [
      "source",
      "sampler",
      "name",
      "extensions",
      "extras",
    ];
    for (const key in texture) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/textures/${index}/${key}`,
        });
      }
    }

    // Validate extensions
    if (texture["extensions"]) {
      const extensions = texture["extensions"] as Record<string, unknown>;
      for (const extensionName in extensions) {
        const extension = extensions[extensionName];
        this.validateExtension(extensionName, extension, index, gltf, messages);
      }
    }

    return messages;
  }

  private validateExtension(
    extensionName: string,
    extension: unknown,
    textureIndex: number,
    gltf: GLTF,
    messages: ValidationMessage[],
  ): void {
    const basePointer = `/textures/${textureIndex}/extensions/${extensionName}`;

    // Validate EXT_texture_webp
    if (
      extensionName === "EXT_texture_webp" &&
      extension &&
      typeof extension === "object" &&
      !Array.isArray(extension)
    ) {
      const extObj = extension as Record<string, unknown>;
      const expectedProperties = ["source"];
      for (const key in extObj) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`,
          });
        }
      }

      // Validate source property if present
      if (extObj.source !== undefined) {
        if (typeof extObj.source !== "number" || extObj.source < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Extension source must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `${basePointer}/source`,
          });
        } else if (!gltf.images || extObj.source >= gltf.images.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: `Unresolved reference: ${extObj.source}.`,
            severity: Severity.ERROR,
            pointer: `${basePointer}/source`,
          });
        }
      }
    }

    // Add validation for other texture extensions here as needed
  }
}
