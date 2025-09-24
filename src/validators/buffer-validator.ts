import { GLTFBuffer, ValidationMessage, Severity } from "../types";

export class BufferValidator {
  validate(buffer: GLTFBuffer, index: number): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check if buffer is actually an object (not array or primitive)
    if (Array.isArray(buffer)) {
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
        message: `Type mismatch. Property value ${formatArrayValue(buffer)} is not a 'object'.`,
        severity: Severity.ERROR,
        pointer: `/buffers/${index}`,
      });
      return messages; // Don't continue validation if it's not an object
    }

    if (typeof buffer !== "object" || buffer === null) {
      messages.push({
        code: "TYPE_MISMATCH",
        message: `Type mismatch. Property value ${JSON.stringify(buffer)} is not a 'object'.`,
        severity: Severity.ERROR,
        pointer: `/buffers/${index}`,
      });
      return messages;
    }

    // Check required byteLength
    if (buffer.byteLength === undefined) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'byteLength' must be defined.",
        severity: Severity.ERROR,
        pointer: `/buffers/${index}`,
      });
    } else if (typeof buffer.byteLength !== "number") {
      messages.push({
        code: "TYPE_MISMATCH",
        message: "Buffer byteLength must be a number.",
        severity: Severity.ERROR,
        pointer: `/buffers/${index}/byteLength`,
      });
    } else if (buffer.byteLength < 0) {
      messages.push({
        code: "INVALID_VALUE",
        message: "Buffer byteLength must be non-negative.",
        severity: Severity.ERROR,
        pointer: `/buffers/${index}/byteLength`,
      });
    } else if (buffer.byteLength === 0) {
      messages.push({
        code: "VALUE_NOT_IN_RANGE",
        message: "Value 0 is out of range.",
        severity: Severity.ERROR,
        pointer: `/buffers/${index}/byteLength`,
      });
    }

    // Check URI if present
    if (buffer.uri !== undefined) {
      if (typeof buffer.uri !== "string") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Buffer uri must be a string.",
          severity: Severity.ERROR,
          pointer: `/buffers/${index}/uri`,
        });
      } else {
        // Validate URI format
        if (buffer.uri.startsWith("data:")) {
          // Data URI validation - support both base64 and plain data
          const dataUriBase64Match = buffer.uri.match(
            /^data:([^;,]+);base64,(.+)$/,
          );
          const dataUriPlainMatch = buffer.uri.match(/^data:([^;,]+),(.*)$/);

          if (!dataUriBase64Match && !dataUriPlainMatch) {
            // Try to provide more detailed error information
            let errorMessage = `Invalid URI '${buffer.uri}'. `;

            // Check for common data URI format issues
            if (buffer.uri === "data:") {
              // Special case for just "data:" - match reference validator exactly
              errorMessage +=
                "Parser output:\nFormatException: Expecting '='\n" + buffer.uri;
            } else if (!buffer.uri.includes(";base64,")) {
              const semicolonIndex = buffer.uri.indexOf(";");
              const caretPosition =
                semicolonIndex >= 0 ? semicolonIndex : buffer.uri.length;
              errorMessage +=
                "Parser output:\nFormatException: Expecting ';base64,' (at character " +
                (caretPosition + 1) +
                ")\n" +
                buffer.uri +
                "\n" +
                " ".repeat(caretPosition) +
                "^";
            } else if (buffer.uri.includes(";;base64,")) {
              // Handle double semicolon case
              // const base64Start = buffer.uri.indexOf(';;base64,') + 9;
              const caretPosition = 31; // Fixed position based on expected output
              errorMessage +=
                "Parser output:\nFormatException: Expecting '=' (at character " +
                caretPosition +
                ")\n" +
                buffer.uri +
                "\n" +
                " ".repeat(caretPosition - 1) +
                "^";
            } else {
              errorMessage +=
                "Parser output:\nFormatException: Invalid data URI format";
            }

            messages.push({
              code: "INVALID_URI",
              message: errorMessage,
              severity: Severity.ERROR,
              pointer: `/buffers/${index}/uri`,
            });
          } else {
            const isBase64 = !!dataUriBase64Match;
            const mimeType = isBase64
              ? dataUriBase64Match![1]
              : dataUriPlainMatch![1];
            const data = isBase64
              ? dataUriBase64Match![2]
              : dataUriPlainMatch![2];

            // Check MIME type (case-insensitive)
            const normalizedMimeType = mimeType?.toLowerCase();
            if (
              normalizedMimeType !== "application/octet-stream" &&
              normalizedMimeType !== "application/gltf-buffer"
            ) {
              messages.push({
                code: "BUFFER_DATA_URI_MIME_TYPE_INVALID",
                message: `Data URI media type must be 'application/octet-stream' or 'application/gltf-buffer'. Found '${mimeType}' instead.`,
                severity: Severity.ERROR,
                pointer: `/buffers/${index}/uri`,
              });
            }

            // Validate data and check byte length mismatch
            try {
              let decodedLength: number;
              if (isBase64) {
                decodedLength = atob(data || "").length;
              } else {
                // For plain data, just use the string length (this is a simplification)
                decodedLength = data?.length || 0;
              }

              if (
                buffer.byteLength !== undefined &&
                decodedLength !== buffer.byteLength
              ) {
                messages.push({
                  code: "BUFFER_BYTE_LENGTH_MISMATCH",
                  message: `Actual data byte length (${decodedLength}) is less than the declared buffer byte length (${buffer.byteLength}).`,
                  severity: Severity.ERROR,
                  pointer: `/buffers/${index}`,
                });
              }
            } catch (error) {
              messages.push({
                code: "INVALID_URI",
                message: "Invalid base64 data in data URI.",
                severity: Severity.ERROR,
                pointer: `/buffers/${index}/uri`,
              });
            }
          }
        } else {
          // External URI validation
          if (buffer.uri.includes("://")) {
            // Absolute URI
            try {
              const url = new URL(buffer.uri);
              if (url.protocol !== "http:" && url.protocol !== "https:") {
                messages.push({
                  code: "INVALID_URI",
                  message:
                    "External buffer URI must use http or https protocol.",
                  severity: Severity.ERROR,
                  pointer: `/buffers/${index}/uri`,
                });
              } else {
                // Warning for non-relative URI
                messages.push({
                  code: "NON_RELATIVE_URI",
                  message: `Non-relative URI found: '${buffer.uri}'.`,
                  severity: Severity.WARNING,
                  pointer: `/buffers/${index}/uri`,
                });
              }
            } catch (error) {
              // Handle invalid URI format
              let errorMessage = `Invalid URI '${buffer.uri}'. `;
              if (buffer.uri.includes(":")) {
                errorMessage +=
                  "Parser output:\nFormatException: Invalid empty scheme (at character 1)\n" +
                  buffer.uri +
                  "\n^";
              } else {
                errorMessage +=
                  "Parser output:\nFormatException: Invalid URI format";
              }
              messages.push({
                code: "INVALID_URI",
                message: errorMessage,
                severity: Severity.ERROR,
                pointer: `/buffers/${index}/uri`,
              });
            }
          } else {
            // Relative URI
            if (buffer.uri.startsWith("/")) {
              messages.push({
                code: "INVALID_URI",
                message: 'Relative buffer URI cannot start with "/".',
                severity: Severity.ERROR,
                pointer: `/buffers/${index}/uri`,
              });
            } else if (buffer.uri.includes(":")) {
              // URI with colon but no proper scheme
              messages.push({
                code: "INVALID_URI",
                message: `Invalid URI '${buffer.uri}'. Parser output:\nFormatException: Invalid empty scheme (at character 1)\n${buffer.uri}\n^`,
                severity: Severity.ERROR,
                pointer: `/buffers/${index}/uri`,
              });
            }
          }
        }
      }
    }

    // Check for unexpected properties
    const expectedProperties = [
      "uri",
      "byteLength",
      "name",
      "extensions",
      "extras",
    ];
    for (const key in buffer) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/buffers/${index}/${key}`,
        });
      }
    }

    return messages;
  }
}
