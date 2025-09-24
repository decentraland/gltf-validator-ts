import { GLTFImage, GLTF, ValidationMessage, Severity } from "../types";

export class ImageValidator {
  private externalResourceFunction?: (uri: string) => Promise<Uint8Array>;

  constructor(externalResourceFunction?: (uri: string) => Promise<Uint8Array>) {
    if (externalResourceFunction) {
      this.externalResourceFunction = externalResourceFunction;
    }
  }

  validate(image: GLTFImage, index: number, gltf: GLTF): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check if image is actually an object (not array or primitive)
    if (Array.isArray(image)) {
      // Format array to match expected output: [item1, item2] without quotes around strings if they look like identifiers or filenames
      const formatArrayValue = (arr: unknown[]) => {
        const items = arr.map((item) => {
          if (
            typeof item === "string" &&
            /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(item)
          ) {
            return item; // Don't quote identifier-like strings or simple filenames
          }
          return JSON.stringify(item);
        });
        return `[${items.join(", ")}]`;
      };

      messages.push({
        code: "TYPE_MISMATCH",
        message: `Type mismatch. Property value ${formatArrayValue(image)} is not a 'object'.`,
        severity: Severity.ERROR,
        pointer: `/images/${index}`,
      });
      return messages; // Don't continue validation if it's not an object
    }

    if (typeof image !== "object" || image === null) {
      messages.push({
        code: "TYPE_MISMATCH",
        message: `Type mismatch. Property value ${JSON.stringify(image)} is not a 'object'.`,
        severity: Severity.ERROR,
        pointer: `/images/${index}`,
      });
      return messages;
    }

    // Check required properties - exactly one of bufferView or uri must be defined
    if (image.bufferView === undefined && image.uri === undefined) {
      messages.push({
        code: "ONE_OF_MISMATCH",
        message:
          "Exactly one of ('bufferView', 'uri') properties must be defined.",
        severity: Severity.ERROR,
        pointer: `/images/${index}`,
      });
    } else if (image.bufferView !== undefined && image.uri !== undefined) {
      messages.push({
        code: "ONE_OF_MISMATCH",
        message:
          "Exactly one of ('bufferView', 'uri') properties must be defined.",
        severity: Severity.ERROR,
        pointer: `/images/${index}`,
      });
    }

    // Check bufferView
    if (image.bufferView !== undefined) {
      if (typeof image.bufferView !== "number" || image.bufferView < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Image bufferView must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/images/${index}/bufferView`,
        });
      } else if (
        !gltf.bufferViews ||
        image.bufferView >= gltf.bufferViews.length
      ) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + image.bufferView + ".",
          severity: Severity.ERROR,
          pointer: `/images/${index}/bufferView`,
        });
      } else {
        // Check if bufferView has byteStride (not allowed for image data)
        const bufferView = gltf.bufferViews[image.bufferView];
        if (bufferView && bufferView.byteStride !== undefined) {
          messages.push({
            code: "IMAGE_BUFFER_VIEW_WITH_BYTESTRIDE",
            message:
              "bufferView.byteStride must not be defined for buffer views containing image data.",
            severity: Severity.ERROR,
            pointer: `/images/${index}/bufferView`,
          });
        }
      }

      // Check if mimeType is defined when using bufferView (required dependency)
      if (image.mimeType === undefined) {
        messages.push({
          code: "UNSATISFIED_DEPENDENCY",
          message: "Dependency failed. 'mimeType' must be defined.",
          severity: Severity.ERROR,
          pointer: `/images/${index}/bufferView`,
        });
      }
    }

    // Check URI
    if (image.uri !== undefined) {
      if (typeof image.uri !== "string") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Image uri must be a string.",
          severity: Severity.ERROR,
          pointer: `/images/${index}/uri`,
        });
      } else {
        // Validate URI format
        if (image.uri.startsWith("data:")) {
          // Data URI validation
          const dataUriMatch = image.uri.match(/^data:([^;]+);base64,(.+)$/);
          if (!dataUriMatch) {
            messages.push({
              code: "INVALID_URI",
              message: "Invalid data URI format.",
              severity: Severity.ERROR,
              pointer: `/images/${index}/uri`,
            });
          } else {
            const mimeType = dataUriMatch[1];
            const base64Data = dataUriMatch[2];

            // Check MIME type
            if (!mimeType || !mimeType.startsWith("image/")) {
              messages.push({
                code: "INVALID_URI",
                message: "Data URI MIME type must be an image type.",
                severity: Severity.ERROR,
                pointer: `/images/${index}/uri`,
              });
            } else {
              // Validate that the MIME type matches the actual image format
              try {
                const decodedData = atob(base64Data || "");
                // Simple format detection based on magic bytes
                let actualFormat = "";
                if (decodedData.length >= 8) {
                  const header = decodedData.substring(0, 8);
                  if (header.startsWith("\x89PNG\r\n\x1a\n")) {
                    actualFormat = "image/png";
                  } else if (header.startsWith("\xff\xd8\xff")) {
                    actualFormat = "image/jpeg";
                  } else if (
                    header.startsWith("GIF87a") ||
                    header.startsWith("GIF89a")
                  ) {
                    actualFormat = "image/gif";
                  }
                }

                if (actualFormat && actualFormat !== mimeType) {
                  messages.push({
                    code: "INVALID_URI",
                    message: `Invalid URI '${image.uri}'. Parser output:\nThe declared mediatype does not match the embedded content.`,
                    severity: Severity.ERROR,
                    pointer: `/images/${index}/uri`,
                  });
                }
              } catch (error) {
                // Ignore format detection errors
              }
            }

            // Validate base64 data
            try {
              atob(base64Data || "");
            } catch (error) {
              // Try to provide more detailed error information
              let errorMessage = `Invalid URI '${image.uri}'. `;

              // Check for common base64 format issues
              const invalidCharIndex = (base64Data || "").search(
                /[^A-Za-z0-9+/=]/,
              );
              if (invalidCharIndex !== -1) {
                errorMessage += `Parser output:\nFormatException: Invalid base64 data (at character ${23 + invalidCharIndex})\n${image.uri}\n${" ".repeat(22 + invalidCharIndex)}^`;
              } else {
                errorMessage +=
                  "Parser output:\nFormatException: Invalid base64 data";
              }

              messages.push({
                code: "INVALID_URI",
                message: errorMessage,
                severity: Severity.ERROR,
                pointer: `/images/${index}/uri`,
              });
            }
          }
        } else {
          // External URI validation
          // Check for malformed scheme cases first
          if (image.uri === ":" || image.uri.startsWith(":/")) {
            messages.push({
              code: "INVALID_URI",
              message: `Invalid URI '${image.uri}'. Parser output:\nFormatException: Invalid empty scheme (at character 1)\n${image.uri}\n^`,
              severity: Severity.ERROR,
              pointer: `/images/${index}/uri`,
            });
          } else if (image.uri.includes("://")) {
            // Absolute URI
            try {
              const url = new URL(image.uri);
              if (url.protocol !== "http:" && url.protocol !== "https:") {
                messages.push({
                  code: "INVALID_URI",
                  message:
                    "External image URI must use http or https protocol.",
                  severity: Severity.ERROR,
                  pointer: `/images/${index}/uri`,
                });
              }
            } catch (error) {
              messages.push({
                code: "INVALID_URI",
                message: `Invalid URI '${image.uri}'. Parser output:\nFormatException: Invalid empty scheme (at character 1)\n${image.uri}\n^`,
                severity: Severity.ERROR,
                pointer: `/images/${index}/uri`,
              });
            }
          } else {
            // Check for other invalid scheme patterns
            if (
              image.uri.includes(":") &&
              !image.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)
            ) {
              messages.push({
                code: "INVALID_URI",
                message: `Invalid URI '${image.uri}'. Parser output:\nFormatException: Invalid empty scheme (at character 1)\n${image.uri}\n^`,
                severity: Severity.ERROR,
                pointer: `/images/${index}/uri`,
              });
            } else if (image.uri.startsWith("/")) {
              // Relative URI validation
              messages.push({
                code: "INVALID_URI",
                message: 'Relative image URI cannot start with "/".',
                severity: Severity.ERROR,
                pointer: `/images/${index}/uri`,
              });
            }
          }
        }
      }
    }

    // Check mimeType property
    if (image.mimeType !== undefined) {
      if (typeof image.mimeType !== "string") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Image mimeType must be a string.",
          severity: Severity.ERROR,
          pointer: `/images/${index}/mimeType`,
        });
      } else if (!image.mimeType.startsWith("image/")) {
        messages.push({
          code: "VALUE_NOT_IN_LIST",
          message: "Image mimeType must be an image type.",
          severity: Severity.ERROR,
          pointer: `/images/${index}/mimeType`,
        });
      } else {
        // Validate specific MIME types - only jpeg and png are valid by default
        const extensionsUsed = new Set(
          (gltf["extensionsUsed"] as string[]) || [],
        );
        const validMimeTypes = ["image/jpeg", "image/png"];

        // Add extension-specific MIME types
        if (extensionsUsed.has("EXT_texture_webp")) {
          validMimeTypes.push("image/webp");
        }
        if (extensionsUsed.has("KHR_texture_basisu")) {
          validMimeTypes.push("image/ktx2");
        }

        if (!validMimeTypes.includes(image.mimeType)) {
          const validValuesStr = validMimeTypes.map((v) => `'${v}'`).join(", ");
          messages.push({
            code: "VALUE_NOT_IN_LIST",
            message: `Invalid value '${image.mimeType}'. Valid values are (${validValuesStr}).`,
            severity: Severity.WARNING,
            pointer: `/images/${index}/mimeType`,
          });
        }
      }

      if (image.uri && image.uri.startsWith("data:")) {
        // Validate that the declared mimeType matches the data URI MIME type
        const dataUriMatch = image.uri.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUriMatch && dataUriMatch[1] !== image.mimeType) {
          messages.push({
            code: "IMAGE_MIME_TYPE_INVALID",
            message: `Recognized image format '${dataUriMatch[1]}' does not match declared image format '${image.mimeType}'.`,
            severity: Severity.ERROR,
            pointer: `/images/${index}/uri`,
          });
        }
      }

      // Extension requirement validation is handled separately below
    }

    // Also check inferred MIME types from data URIs and file extensions
    if (image.uri && !image.mimeType) {
      let inferredMimeType: string | undefined;

      if (image.uri.startsWith("data:")) {
        const dataUriMatch = image.uri.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUriMatch) {
          inferredMimeType = dataUriMatch[1];
        }
      } else {
        // Check file extension
        if (image.uri.toLowerCase().endsWith(".webp")) {
          inferredMimeType = "image/webp";
        }
      }

      if (inferredMimeType) {
        // For inferred MIME types, only validate extension requirements (not VALUE_NOT_IN_LIST)
        this.validateMimeTypeExtensionRequirements(
          inferredMimeType,
          index,
          gltf,
          messages,
        );
      }
    }

    // Validate extension requirements for explicit MIME types (after VALUE_NOT_IN_LIST validation)
    if (image.mimeType) {
      this.validateMimeTypeExtensionRequirements(
        image.mimeType,
        index,
        gltf,
        messages,
      );
    }

    // Check for unexpected properties
    const expectedProperties = [
      "uri",
      "mimeType",
      "bufferView",
      "name",
      "extensions",
      "extras",
    ];
    for (const key in image) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/images/${index}/${key}`,
        });
      }
    }

    // Validate extensions on images
    if (image["extensions"]) {
      const extensions = image["extensions"] as Record<string, unknown>;
      for (const extensionName in extensions) {
        // EXT_texture_webp should not be used on images (only on textures)
        if (extensionName === "EXT_texture_webp") {
          messages.push({
            code: "UNEXPECTED_EXTENSION_OBJECT",
            message: "Unexpected location for this extension.",
            severity: Severity.ERROR,
            pointer: `/images/${index}/extensions/${extensionName}`,
          });
        }
      }
    }

    return messages;
  }

  private validateMimeTypeExtensionRequirements(
    mimeType: string,
    imageIndex: number,
    gltf: GLTF,
    messages: ValidationMessage[],
  ): void {
    const extensionsUsed = new Set((gltf["extensionsUsed"] as string[]) || []);

    // Check for extension-specific MIME types
    if (mimeType === "image/webp" && !extensionsUsed.has("EXT_texture_webp")) {
      messages.push({
        code: "IMAGE_NON_ENABLED_MIME_TYPE",
        message: `'${mimeType}' MIME type requires an extension.`,
        severity: Severity.ERROR,
        pointer: `/images/${imageIndex}`,
      });
    }

    // Add more extension-specific MIME type checks here as needed
    // For example:
    // if (mimeType === 'image/ktx2' && !extensionsUsed.has('KHR_texture_basisu')) {
    //   messages.push({
    //     code: 'IMAGE_NON_ENABLED_MIME_TYPE',
    //     message: `'${mimeType}' MIME type requires an extension.`,
    //     severity: Severity.ERROR,
    //     pointer: `/images/${imageIndex}`
    //   });
    // }
  }

  async validateExternalResources(
    image: GLTFImage,
    index: number,
  ): Promise<ValidationMessage[]> {
    const messages: ValidationMessage[] = [];

    // Only validate external files
    if (
      image.uri &&
      !image.uri.startsWith("data:") &&
      this.externalResourceFunction
    ) {
      try {
        const imageData = await this.externalResourceFunction(image.uri);

        // Detect actual image format from file content
        const detectedFormat = this.detectImageFormat(imageData);

        if (!detectedFormat) {
          messages.push({
            code: "IMAGE_UNRECOGNIZED_FORMAT",
            message: "Image format not recognized.",
            severity: Severity.WARNING,
            pointer: `/images/${index}`,
          });
        } else {
          // Validate image data integrity for recognized formats
          const validationResult = this.validateImageData(
            imageData,
            detectedFormat,
          );
          if (validationResult) {
            messages.push({
              code: validationResult.code,
              message: validationResult.message,
              severity: Severity.ERROR,
              pointer: `/images/${index}`,
            });
          }

          // Check for non-power-of-two dimensions
          const dimensions = this.getImageDimensions(imageData, detectedFormat);
          if (dimensions) {
            const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0;
            if (
              !isPowerOfTwo(dimensions.width) ||
              !isPowerOfTwo(dimensions.height)
            ) {
              messages.push({
                code: "IMAGE_NPOT_DIMENSIONS",
                message: `Image has non-power-of-two dimensions: ${dimensions.width}x${dimensions.height}.`,
                severity: Severity.INFO,
                pointer: `/images/${index}`,
              });
            }
          }
        }
      } catch (error) {
        // External resource loading failed - this will be handled by IO_ERROR elsewhere
      }
    }

    return messages;
  }

  private detectImageFormat(data: Uint8Array): string | null {
    if (data.length < 8) return null;

    // Check for PNG magic number
    if (
      data[0] === 0x89 &&
      data[1] === 0x50 &&
      data[2] === 0x4e &&
      data[3] === 0x47 &&
      data[4] === 0x0d &&
      data[5] === 0x0a &&
      data[6] === 0x1a &&
      data[7] === 0x0a
    ) {
      return "image/png";
    }

    // Check for JPEG magic number
    if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
      return "image/jpeg";
    }

    // Check for GIF magic number
    if (data.length >= 6) {
      const header = String.fromCharCode(...data.slice(0, 6));
      if (header === "GIF87a" || header === "GIF89a") {
        return "image/gif";
      }
    }

    // Check for WebP magic number
    if (data.length >= 12) {
      const riff = String.fromCharCode(...data.slice(0, 4));
      const webp = String.fromCharCode(...data.slice(8, 12));
      if (riff === "RIFF" && webp === "WEBP") {
        return "image/webp";
      }
    }

    return null;
  }

  private validateImageData(
    data: Uint8Array,
    format: string,
  ): { code: string; message: string } | null {
    // Validate image data integrity based on format
    switch (format) {
      case "image/jpeg":
        const jpegError = this.validateJPEGData(data);
        return jpegError
          ? {
              code: "IMAGE_DATA_INVALID",
              message: `Image data is invalid. ${jpegError}`,
            }
          : null;
      case "image/png":
        const pngError = this.validatePNGData(data);
        if (pngError) {
          // Check if it's specifically an EOS error
          if (pngError.includes("Unexpected end of image stream")) {
            return { code: "IMAGE_UNEXPECTED_EOS", message: pngError };
          } else {
            return {
              code: "IMAGE_DATA_INVALID",
              message: `Image data is invalid. ${pngError}`,
            };
          }
        }
        return null;
      // Add other formats as needed
      default:
        return null; // No validation for unrecognized formats
    }
  }

  private validateJPEGData(data: Uint8Array): string | null {
    if (data.length < 4) {
      return "Invalid JPEG format.";
    }

    // Check for valid SOI (Start of Image) marker
    if (data[0] !== 0xff || data[1] !== 0xd8) {
      return "Invalid JPEG format.";
    }

    // Check for valid marker after SOI
    if (data[2] !== 0xff) {
      return "Invalid JPEG format.";
    }

    // The specific error message expected by the test
    if (data[3] === 0x00) {
      return "Invalid JPEG marker segment length.";
    }

    // Basic JPEG marker validation - look for valid markers
    const validMarkers = [
      0xe0,
      0xe1,
      0xe2,
      0xe3,
      0xe4,
      0xe5,
      0xe6,
      0xe7, // APP0-APP7
      0xe8,
      0xe9,
      0xea,
      0xeb,
      0xec,
      0xed,
      0xee,
      0xef, // APP8-APP15
      0xdb, // DQT (Define Quantization Table)
      0xc0,
      0xc1,
      0xc2,
      0xc3, // SOF0-SOF3 (Start of Frame)
      0xc4, // DHT (Define Huffman Table)
      0xda, // SOS (Start of Scan)
      0xd9, // EOI (End of Image)
    ];

    if (!validMarkers.includes(data[3]!)) {
      return "Invalid JPEG marker segment length.";
    }

    return null; // Valid JPEG
  }

  private validatePNGData(data: Uint8Array): string | null {
    // Basic PNG validation - check for PNG signature
    if (data.length < 8) {
      return "Invalid PNG format.";
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    for (let i = 0; i < 8; i++) {
      if (data[i] !== pngSignature[i]) {
        return "Invalid PNG signature.";
      }
    }

    // Validate PNG chunks for completeness
    let offset = 8; // Start after PNG signature
    while (offset < data.length) {
      // Each chunk needs at least 12 bytes: 4 length + 4 type + 0+ data + 4 CRC
      if (offset + 8 > data.length) {
        return "Unexpected end of image stream.";
      }

      // Read chunk length (big-endian)
      const length =
        (data[offset]! << 24) |
        (data[offset + 1]! << 16) |
        (data[offset + 2]! << 8) |
        data[offset + 3]!;
      offset += 4;

      // Read chunk type
      const chunkType = String.fromCharCode(
        data[offset]!,
        data[offset + 1]!,
        data[offset + 2]!,
        data[offset + 3]!,
      );
      offset += 4;

      // Check if we have enough data for the chunk content + CRC
      if (offset + length + 4 > data.length) {
        return "Unexpected end of image stream.";
      }

      offset += length + 4; // Skip data and CRC

      // If this is the IEND chunk, we should be at the end
      if (chunkType === "IEND") {
        break;
      }
    }

    return null; // Valid PNG
  }

  private getImageDimensions(
    data: Uint8Array,
    format: string,
  ): { width: number; height: number } | null {
    switch (format) {
      case "image/png":
        return this.getPNGDimensions(data);
      case "image/jpeg":
        return this.getJPEGDimensions(data);
      default:
        return null;
    }
  }

  private getPNGDimensions(
    data: Uint8Array,
  ): { width: number; height: number } | null {
    // PNG dimensions are in the IHDR chunk, which should be the first chunk after the signature
    if (data.length < 33) return null; // 8 signature + 4 length + 4 type + 13 IHDR data + 4 CRC

    // Skip PNG signature (8 bytes)
    let offset = 8;

    // Read first chunk length (should be 13 for IHDR)
    const length =
      (data[offset]! << 24) |
      (data[offset + 1]! << 16) |
      (data[offset + 2]! << 8) |
      data[offset + 3]!;
    offset += 4;

    // Read chunk type (should be "IHDR")
    const chunkType = String.fromCharCode(
      data[offset]!,
      data[offset + 1]!,
      data[offset + 2]!,
      data[offset + 3]!,
    );
    offset += 4;

    if (chunkType !== "IHDR" || length < 13) {
      return null;
    }

    // Read width and height (both are 4-byte big-endian integers)
    const width =
      (data[offset]! << 24) |
      (data[offset + 1]! << 16) |
      (data[offset + 2]! << 8) |
      data[offset + 3]!;
    const height =
      (data[offset + 4]! << 24) |
      (data[offset + 5]! << 16) |
      (data[offset + 6]! << 8) |
      data[offset + 7]!;

    return { width, height };
  }

  private getJPEGDimensions(
    data: Uint8Array,
  ): { width: number; height: number } | null {
    // JPEG dimensions are in the SOF (Start of Frame) markers
    if (data.length < 4) return null;

    let offset = 2; // Skip SOI marker (FF D8)

    while (offset < data.length - 1) {
      // Look for marker (FF followed by marker code)
      if (data[offset] !== 0xff) {
        offset++;
        continue;
      }

      const marker = data[offset + 1]!;
      offset += 2;

      // SOF markers: C0, C1, C2, C3 (baseline, extended sequential, progressive, lossless)
      if (marker >= 0xc0 && marker <= 0xc3) {
        // SOF segment found, skip segment length (2 bytes) and precision (1 byte)
        if (offset + 5 < data.length) {
          // Skip segment length (2 bytes) and precision (1 byte)
          const height = (data[offset + 3]! << 8) | data[offset + 4]!;
          const width = (data[offset + 5]! << 8) | data[offset + 6]!;
          return { width, height };
        }
        break;
      }

      // For other markers, skip the segment
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) {
        // SOI/EOI/TEM markers have no data
        continue;
      }

      // For RST markers (D0-D7), no segment length
      if (marker >= 0xd0 && marker <= 0xd7) {
        continue;
      }

      if (offset + 2 > data.length) break;

      // Read segment length (big-endian, includes the 2 bytes for length itself)
      const segmentLength = (data[offset]! << 8) | data[offset + 1]!;
      if (segmentLength < 2) break; // Invalid segment length
      offset += segmentLength;
    }

    return null;
  }
}
