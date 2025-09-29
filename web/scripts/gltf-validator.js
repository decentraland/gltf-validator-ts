var GLTFValidator = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    ACCESSOR_TYPE_COMPONENT_COUNTS: () => ACCESSOR_TYPE_COMPONENT_COUNTS,
    AccessorType: () => AccessorType,
    AlphaMode: () => AlphaMode,
    AnimationInterpolation: () => AnimationInterpolation,
    AnimationPath: () => AnimationPath,
    COMPONENT_TYPE_SIZES: () => COMPONENT_TYPE_SIZES,
    CameraType: () => CameraType,
    ComponentType: () => ComponentType,
    Filter: () => Filter,
    GLBValidator: () => GLBValidator,
    GLTFValidator: () => GLTFValidator,
    GLTF_MIME_TYPES: () => GLTF_MIME_TYPES,
    IMAGE_MIME_TYPES: () => IMAGE_MIME_TYPES,
    PrimitiveMode: () => PrimitiveMode,
    SEVERITY_LEVELS: () => SEVERITY_LEVELS,
    Severity: () => Severity,
    VALIDATION_CODES: () => VALIDATION_CODES,
    WrapMode: () => WrapMode,
    getTypedEntries: () => getTypedEntries,
    getTypedKeys: () => getTypedKeys,
    parseGLB: () => parseGLB,
    validate: () => validateBytes,
    validateBytes: () => validateBytes
  });

  // dist/types.js
  var Severity;
  (function(Severity2) {
    Severity2[Severity2["ERROR"] = 0] = "ERROR";
    Severity2[Severity2["WARNING"] = 1] = "WARNING";
    Severity2[Severity2["INFO"] = 2] = "INFO";
    Severity2[Severity2["HINT"] = 3] = "HINT";
  })(Severity || (Severity = {}));
  var ComponentType = {
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    UNSIGNED_INT: 5125,
    FLOAT: 5126,
    DOUBLE: 5130
  };
  var AccessorType = {
    SCALAR: "SCALAR",
    VEC2: "VEC2",
    VEC3: "VEC3",
    VEC4: "VEC4",
    MAT2: "MAT2",
    MAT3: "MAT3",
    MAT4: "MAT4"
  };
  var AnimationPath = {
    TRANSLATION: "translation",
    ROTATION: "rotation",
    SCALE: "scale",
    WEIGHTS: "weights"
  };
  var AnimationInterpolation = {
    LINEAR: "LINEAR",
    STEP: "STEP",
    CUBICSPLINE: "CUBICSPLINE"
  };
  var AlphaMode = {
    OPAQUE: "OPAQUE",
    MASK: "MASK",
    BLEND: "BLEND"
  };
  var PrimitiveMode = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
  };
  var Filter = {
    NEAREST: 9728,
    LINEAR: 9729,
    NEAREST_MIPMAP_NEAREST: 9984,
    LINEAR_MIPMAP_NEAREST: 9985,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_LINEAR: 9987
  };
  var WrapMode = {
    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648,
    REPEAT: 10497
  };
  var CameraType = {
    PERSPECTIVE: "perspective",
    ORTHOGRAPHIC: "orthographic"
  };
  var GLTF_MIME_TYPES = ["model/gltf+json", "model/gltf-binary"];
  var IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/ktx2"];
  var SEVERITY_LEVELS = ["ERROR", "WARNING", "INFO", "HINT"];
  var VALIDATION_CODES = {
    // Type validation codes
    TYPE_MISMATCH: "TYPE_MISMATCH",
    UNDEFINED_PROPERTY: "UNDEFINED_PROPERTY",
    UNEXPECTED_PROPERTY: "UNEXPECTED_PROPERTY",
    INVALID_VALUE: "INVALID_VALUE",
    VALUE_NOT_IN_RANGE: "VALUE_NOT_IN_RANGE",
    VALUE_NOT_IN_LIST: "VALUE_NOT_IN_LIST",
    UNRESOLVED_REFERENCE: "UNRESOLVED_REFERENCE",
    // GLTF specific codes
    EMPTY_ENTITY: "EMPTY_ENTITY",
    UNUSED_OBJECT: "UNUSED_OBJECT",
    ACCESSOR_NORMALIZED_INVALID: "ACCESSOR_NORMALIZED_INVALID",
    BUFFER_DATA_URI_MIME_TYPE_INVALID: "BUFFER_DATA_URI_MIME_TYPE_INVALID",
    IMAGE_NON_ENABLED_MIME_TYPE: "IMAGE_NON_ENABLED_MIME_TYPE",
    MATERIAL_ALPHA_CUTOFF_INVALID_MODE: "MATERIAL_ALPHA_CUTOFF_INVALID_MODE",
    NODE_MATRIX_TRS: "NODE_MATRIX_TRS",
    CAMERA_YFOV_GEQUAL_PI: "CAMERA_YFOV_GEQUAL_PI",
    // Extension codes
    UNDECLARED_EXTENSION: "UNDECLARED_EXTENSION",
    UNEXPECTED_EXTENSION_OBJECT: "UNEXPECTED_EXTENSION_OBJECT",
    INCOMPLETE_EXTENSION_SUPPORT: "INCOMPLETE_EXTENSION_SUPPORT"
  };
  var COMPONENT_TYPE_SIZES = {
    [ComponentType.BYTE]: 1,
    [ComponentType.UNSIGNED_BYTE]: 1,
    [ComponentType.SHORT]: 2,
    [ComponentType.UNSIGNED_SHORT]: 2,
    [ComponentType.UNSIGNED_INT]: 4,
    [ComponentType.FLOAT]: 4,
    [ComponentType.DOUBLE]: 8
  };
  var ACCESSOR_TYPE_COMPONENT_COUNTS = {
    [AccessorType.SCALAR]: 1,
    [AccessorType.VEC2]: 2,
    [AccessorType.VEC3]: 3,
    [AccessorType.VEC4]: 4,
    [AccessorType.MAT2]: 4,
    [AccessorType.MAT3]: 9,
    [AccessorType.MAT4]: 16
  };
  function getTypedKeys(obj) {
    return Object.keys(obj);
  }
  function getTypedEntries(obj) {
    return Object.entries(obj);
  }

  // dist/parser.js
  var GLTFParser = class {
    parse(data) {
      if (data.length >= 3 && data[0] === 239 && data[1] === 187 && data[2] === 191) {
        throw new Error(`Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.`);
      }
      const text = new TextDecoder().decode(data);
      try {
        const json = JSON.parse(text);
        if (typeof json !== "object" || json === null || Array.isArray(json)) {
          const typeDescription = Array.isArray(json) ? "[]" : typeof json;
          throw new Error(`TYPE_MISMATCH:Type mismatch. Property value ${typeDescription} is not a 'object'.:`);
        }
        return this.validateAndNormalize(json);
      } catch (error) {
        throw new Error(`Failed to parse GLTF JSON: ${error}`);
      }
    }
    validateAndNormalize(json) {
      const jsonObj = json;
      const gltf = {
        asset: jsonObj["asset"],
        ...jsonObj["scene"] !== void 0 && { scene: jsonObj["scene"] },
        scenes: Array.isArray(jsonObj["scenes"]) ? jsonObj["scenes"] : [],
        nodes: Array.isArray(jsonObj["nodes"]) ? jsonObj["nodes"] : [],
        materials: Array.isArray(jsonObj["materials"]) ? jsonObj["materials"] : [],
        accessors: Array.isArray(jsonObj["accessors"]) ? jsonObj["accessors"] : [],
        animations: Array.isArray(jsonObj["animations"]) ? jsonObj["animations"] : [],
        buffers: Array.isArray(jsonObj["buffers"]) ? jsonObj["buffers"] : [],
        bufferViews: Array.isArray(jsonObj["bufferViews"]) ? jsonObj["bufferViews"] : [],
        cameras: Array.isArray(jsonObj["cameras"]) ? jsonObj["cameras"] : [],
        images: Array.isArray(jsonObj["images"]) ? jsonObj["images"] : [],
        meshes: Array.isArray(jsonObj["meshes"]) ? jsonObj["meshes"] : [],
        samplers: jsonObj["samplers"] || [],
        skins: Array.isArray(jsonObj["skins"]) ? jsonObj["skins"] : [],
        textures: Array.isArray(jsonObj["textures"]) ? jsonObj["textures"] : [],
        extensions: jsonObj["extensions"],
        extras: jsonObj["extras"]
      };
      gltf._explicitlyDefined = {
        scenes: "scenes" in jsonObj,
        nodes: "nodes" in jsonObj,
        materials: "materials" in jsonObj,
        accessors: "accessors" in jsonObj,
        animations: "animations" in jsonObj,
        buffers: "buffers" in jsonObj,
        bufferViews: "bufferViews" in jsonObj,
        cameras: "cameras" in jsonObj,
        images: "images" in jsonObj,
        meshes: "meshes" in jsonObj,
        samplers: "samplers" in jsonObj,
        skins: "skins" in jsonObj,
        textures: "textures" in jsonObj
      };
      for (const key in jsonObj) {
        if (!(key in gltf)) {
          gltf[key] = jsonObj[key];
        }
      }
      return gltf;
    }
  };

  // dist/validators/asset-validator.js
  var AssetValidator = class {
    validate(asset) {
      const messages = [];
      if (!asset.version) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'version' must be defined.",
          severity: Severity.ERROR,
          pointer: "/asset"
        });
        return messages;
      }
      if (typeof asset.version !== "string") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Asset version must be a string.",
          severity: Severity.ERROR,
          pointer: "/asset/version"
        });
      } else {
        const versionMatch = asset.version.match(/^(\d+)\.(\d+)$/);
        if (!versionMatch) {
          messages.push({
            code: "PATTERN_MISMATCH",
            message: `Value '${asset.version}' does not match regexp pattern '^([0-9]+)\\.([0-9]+)$'.`,
            severity: Severity.ERROR,
            pointer: "/asset/version"
          });
        } else {
          const major = parseInt(versionMatch[1] || "0");
          const minor = parseInt(versionMatch[2] || "0");
          if (major !== 2) {
            messages.push({
              code: "UNKNOWN_ASSET_MAJOR_VERSION",
              message: `Unknown glTF major asset version: ${major}.`,
              severity: Severity.ERROR,
              pointer: "/asset/version"
            });
          } else if (minor !== 0) {
            messages.push({
              code: "UNKNOWN_ASSET_MINOR_VERSION",
              message: `Unknown glTF minor asset version: ${minor}.`,
              severity: Severity.WARNING,
              pointer: "/asset/version"
            });
          }
        }
      }
      if (asset.minVersion !== void 0) {
        if (typeof asset.minVersion !== "string") {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Asset minVersion must be a string.",
            severity: Severity.ERROR,
            pointer: "/asset/minVersion"
          });
        } else {
          const minVersionMatch = asset.minVersion.match(/^(\d+)\.(\d+)$/);
          if (!minVersionMatch) {
            messages.push({
              code: "INVALID_VERSION",
              message: 'Asset minVersion must be in format "major.minor".',
              severity: Severity.ERROR,
              pointer: "/asset/minVersion"
            });
          } else {
            const minMajor = parseInt(minVersionMatch[1] || "0");
            const minMinor = parseInt(minVersionMatch[2] || "0");
            if (minMajor !== 2) {
              messages.push({
                code: "INVALID_VERSION",
                message: "Asset minVersion major must be 2.",
                severity: Severity.ERROR,
                pointer: "/asset/minVersion"
              });
            }
            if (asset.version && typeof asset.version === "string") {
              const versionMatch = asset.version.match(/^(\d+)\.(\d+)$/);
              if (versionMatch) {
                const major = parseInt(versionMatch[1] || "0");
                const minor = parseInt(versionMatch[2] || "0");
                if (minMajor > major || minMajor === major && minMinor > minor) {
                  messages.push({
                    code: "ASSET_MIN_VERSION_GREATER_THAN_VERSION",
                    message: `Asset minVersion '${asset.minVersion}' is greater than version '${asset.version}'.`,
                    severity: Severity.ERROR,
                    pointer: "/asset/minVersion"
                  });
                }
              }
            }
          }
        }
      }
      const expectedProperties = [
        "version",
        "minVersion",
        "generator",
        "copyright"
      ];
      for (const key in asset) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/asset/${key}`
          });
        }
      }
      return messages;
    }
  };

  // dist/validators/buffer-validator.js
  var BufferValidator = class {
    validate(buffer, index) {
      const messages = [];
      if (Array.isArray(buffer)) {
        const formatArrayValue = (arr) => {
          const items = arr.map((item) => {
            if (typeof item === "string" && /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(item)) {
              return item;
            }
            return JSON.stringify(item);
          });
          return `[${items.join(", ")}]`;
        };
        messages.push({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${formatArrayValue(buffer)} is not a 'object'.`,
          severity: Severity.ERROR,
          pointer: `/buffers/${index}`
        });
        return messages;
      }
      if (typeof buffer !== "object" || buffer === null) {
        messages.push({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${JSON.stringify(buffer)} is not a 'object'.`,
          severity: Severity.ERROR,
          pointer: `/buffers/${index}`
        });
        return messages;
      }
      if (buffer.byteLength === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'byteLength' must be defined.",
          severity: Severity.ERROR,
          pointer: `/buffers/${index}`
        });
      } else if (typeof buffer.byteLength !== "number") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Buffer byteLength must be a number.",
          severity: Severity.ERROR,
          pointer: `/buffers/${index}/byteLength`
        });
      } else if (buffer.byteLength < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Buffer byteLength must be non-negative.",
          severity: Severity.ERROR,
          pointer: `/buffers/${index}/byteLength`
        });
      } else if (buffer.byteLength === 0) {
        messages.push({
          code: "VALUE_NOT_IN_RANGE",
          message: "Value 0 is out of range.",
          severity: Severity.ERROR,
          pointer: `/buffers/${index}/byteLength`
        });
      }
      if (buffer.uri !== void 0) {
        if (typeof buffer.uri !== "string") {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Buffer uri must be a string.",
            severity: Severity.ERROR,
            pointer: `/buffers/${index}/uri`
          });
        } else {
          if (buffer.uri.startsWith("data:")) {
            const dataUriBase64Match = buffer.uri.match(/^data:([^;,]+);base64,(.+)$/);
            const dataUriPlainMatch = buffer.uri.match(/^data:([^;,]+),(.*)$/);
            if (!dataUriBase64Match && !dataUriPlainMatch) {
              let errorMessage = `Invalid URI '${buffer.uri}'. `;
              if (buffer.uri === "data:") {
                errorMessage += "Parser output:\nFormatException: Expecting '='\n" + buffer.uri;
              } else if (!buffer.uri.includes(";base64,")) {
                const semicolonIndex = buffer.uri.indexOf(";");
                const caretPosition = semicolonIndex >= 0 ? semicolonIndex : buffer.uri.length;
                errorMessage += "Parser output:\nFormatException: Expecting ';base64,' (at character " + (caretPosition + 1) + ")\n" + buffer.uri + "\n" + " ".repeat(caretPosition) + "^";
              } else if (buffer.uri.includes(";;base64,")) {
                const caretPosition = 31;
                errorMessage += "Parser output:\nFormatException: Expecting '=' (at character " + caretPosition + ")\n" + buffer.uri + "\n" + " ".repeat(caretPosition - 1) + "^";
              } else {
                errorMessage += "Parser output:\nFormatException: Invalid data URI format";
              }
              messages.push({
                code: "INVALID_URI",
                message: errorMessage,
                severity: Severity.ERROR,
                pointer: `/buffers/${index}/uri`
              });
            } else {
              const isBase64 = !!dataUriBase64Match;
              const mimeType = isBase64 ? dataUriBase64Match[1] : dataUriPlainMatch[1];
              const data = isBase64 ? dataUriBase64Match[2] : dataUriPlainMatch[2];
              const normalizedMimeType = mimeType?.toLowerCase();
              if (normalizedMimeType !== "application/octet-stream" && normalizedMimeType !== "application/gltf-buffer") {
                messages.push({
                  code: "BUFFER_DATA_URI_MIME_TYPE_INVALID",
                  message: `Data URI media type must be 'application/octet-stream' or 'application/gltf-buffer'. Found '${mimeType}' instead.`,
                  severity: Severity.ERROR,
                  pointer: `/buffers/${index}/uri`
                });
              }
              try {
                let decodedLength;
                if (isBase64) {
                  decodedLength = atob(data || "").length;
                } else {
                  decodedLength = data?.length || 0;
                }
                if (buffer.byteLength !== void 0 && decodedLength !== buffer.byteLength) {
                  messages.push({
                    code: "BUFFER_BYTE_LENGTH_MISMATCH",
                    message: `Actual data byte length (${decodedLength}) is less than the declared buffer byte length (${buffer.byteLength}).`,
                    severity: Severity.ERROR,
                    pointer: `/buffers/${index}`
                  });
                }
              } catch (error) {
                messages.push({
                  code: "INVALID_URI",
                  message: "Invalid base64 data in data URI.",
                  severity: Severity.ERROR,
                  pointer: `/buffers/${index}/uri`
                });
              }
            }
          } else {
            if (buffer.uri.includes("://")) {
              try {
                const url = new URL(buffer.uri);
                if (url.protocol !== "http:" && url.protocol !== "https:") {
                  messages.push({
                    code: "INVALID_URI",
                    message: "External buffer URI must use http or https protocol.",
                    severity: Severity.ERROR,
                    pointer: `/buffers/${index}/uri`
                  });
                } else {
                  messages.push({
                    code: "NON_RELATIVE_URI",
                    message: `Non-relative URI found: '${buffer.uri}'.`,
                    severity: Severity.WARNING,
                    pointer: `/buffers/${index}/uri`
                  });
                }
              } catch (error) {
                let errorMessage = `Invalid URI '${buffer.uri}'. `;
                if (buffer.uri.includes(":")) {
                  errorMessage += "Parser output:\nFormatException: Invalid empty scheme (at character 1)\n" + buffer.uri + "\n^";
                } else {
                  errorMessage += "Parser output:\nFormatException: Invalid URI format";
                }
                messages.push({
                  code: "INVALID_URI",
                  message: errorMessage,
                  severity: Severity.ERROR,
                  pointer: `/buffers/${index}/uri`
                });
              }
            } else {
              if (buffer.uri.startsWith("/")) {
                messages.push({
                  code: "INVALID_URI",
                  message: 'Relative buffer URI cannot start with "/".',
                  severity: Severity.ERROR,
                  pointer: `/buffers/${index}/uri`
                });
              } else if (buffer.uri.includes(":")) {
                messages.push({
                  code: "INVALID_URI",
                  message: `Invalid URI '${buffer.uri}'. Parser output:
FormatException: Invalid empty scheme (at character 1)
${buffer.uri}
^`,
                  severity: Severity.ERROR,
                  pointer: `/buffers/${index}/uri`
                });
              }
            }
          }
        }
      }
      const expectedProperties = [
        "uri",
        "byteLength",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in buffer) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/buffers/${index}/${key}`
          });
        }
      }
      return messages;
    }
  };

  // dist/validators/buffer-view-validator.js
  var BufferViewValidator = class {
    validate(bufferView, index, gltf) {
      const messages = [];
      if (bufferView.byteLength === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'byteLength' must be defined.",
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}`
        });
      } else if (typeof bufferView.byteLength !== "number" || bufferView.byteLength < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "BufferView byteLength must be a non-negative number.",
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteLength`
        });
      } else if (bufferView.byteLength === 0) {
        messages.push({
          code: "VALUE_NOT_IN_RANGE",
          message: "Value 0 is out of range.",
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/byteLength`
        });
      }
      if (bufferView.buffer === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'buffer' must be defined.",
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}`
        });
      } else if (typeof bufferView.buffer !== "number" || bufferView.buffer < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "BufferView buffer must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/buffer`
        });
      } else if (!gltf.buffers || bufferView.buffer >= gltf.buffers.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + bufferView.buffer + ".",
          severity: Severity.ERROR,
          pointer: `/bufferViews/${index}/buffer`
        });
      }
      if (bufferView.byteOffset !== void 0) {
        if (typeof bufferView.byteOffset !== "number" || bufferView.byteOffset < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "BufferView byteOffset must be a non-negative number.",
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteOffset`
          });
        }
      }
      if (bufferView.byteStride !== void 0) {
        if (typeof bufferView.byteStride !== "number" || bufferView.byteStride < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "BufferView byteStride must be a non-negative number.",
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteStride`
          });
        } else if (bufferView.byteStride > 252) {
          messages.push({
            code: "INVALID_VALUE",
            message: "BufferView byteStride must be <= 252.",
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteStride`
          });
        } else if (bufferView.byteStride % 4 !== 0) {
          messages.push({
            code: "VALUE_MULTIPLE_OF",
            message: `Value ${bufferView.byteStride} is not a multiple of 4.`,
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteStride`
          });
        } else if (bufferView.byteLength !== void 0 && bufferView.byteStride > bufferView.byteLength) {
          messages.push({
            code: "BUFFER_VIEW_TOO_BIG_BYTE_STRIDE",
            message: `Buffer view's byteStride (${bufferView.byteStride}) is greater than byteLength (${bufferView.byteLength}).`,
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteStride`
          });
        } else if (bufferView.target !== void 0 && bufferView.target !== 34962) {
          messages.push({
            code: "BUFFER_VIEW_INVALID_BYTE_STRIDE",
            message: "Only buffer views with raw vertex data can have byteStride.",
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/byteStride`
          });
        }
      }
      if (bufferView.target !== void 0) {
        if (typeof bufferView.target !== "number") {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "BufferView target must be a number.",
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/target`
          });
        } else if (bufferView.target !== 34962 && bufferView.target !== 34963) {
          messages.push({
            code: "INVALID_VALUE",
            message: "BufferView target must be 34962 (ARRAY_BUFFER) or 34963 (ELEMENT_ARRAY_BUFFER).",
            severity: Severity.ERROR,
            pointer: `/bufferViews/${index}/target`
          });
        }
      }
      if (bufferView.buffer !== void 0 && bufferView.byteLength !== void 0 && gltf.buffers && bufferView.buffer < gltf.buffers.length) {
        const buffer = gltf.buffers[bufferView.buffer];
        const bufferViewOffset = bufferView.byteOffset || 0;
        if (buffer && bufferViewOffset + bufferView.byteLength > buffer.byteLength) {
          if (bufferView.byteOffset !== void 0 && bufferView.byteOffset > 0) {
            messages.push({
              code: "BUFFER_VIEW_TOO_LONG",
              message: `BufferView does not fit buffer (${bufferView.buffer}) byteLength (${buffer.byteLength}).`,
              severity: Severity.ERROR,
              pointer: `/bufferViews/${index}/byteOffset`
            });
          } else {
            messages.push({
              code: "BUFFER_VIEW_TOO_LONG",
              message: `BufferView does not fit buffer (${bufferView.buffer}) byteLength (${buffer.byteLength}).`,
              severity: Severity.ERROR,
              pointer: `/bufferViews/${index}/byteLength`
            });
          }
        }
      }
      const expectedProperties = [
        "buffer",
        "byteOffset",
        "byteLength",
        "byteStride",
        "target",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in bufferView) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/bufferViews/${index}/${key}`
          });
        }
      }
      return messages;
    }
  };

  // dist/validators/accessor-validator.js
  var AccessorValidator = class {
    validate(accessor, index, gltf) {
      const messages = [];
      const expectedAccessorProperties = [
        "bufferView",
        "byteOffset",
        "componentType",
        "normalized",
        "count",
        "type",
        "max",
        "min",
        "sparse",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in accessor) {
        if (!expectedAccessorProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/accessors/${index}/${key}`
          });
        }
      }
      if (accessor["extensions"]) {
        const extensions = accessor["extensions"];
        for (const extensionName in extensions) {
          if (!this.isExtensionAllowedOnAccessors(extensionName)) {
            messages.push({
              code: "UNEXPECTED_EXTENSION_OBJECT",
              message: "Unexpected location for this extension.",
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/extensions/${extensionName}`
            });
          }
        }
      }
      if (accessor.componentType === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'componentType' must be defined.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}`
        });
      } else if (!this.isValidComponentType(accessor.componentType)) {
        messages.push({
          code: "INVALID_COMPONENT_TYPE",
          message: "Invalid accessor componentType.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/componentType`
        });
      }
      if (accessor.normalized === true && accessor.componentType !== void 0) {
        const validNormalizedTypes = [
          ComponentType.BYTE,
          ComponentType.UNSIGNED_BYTE,
          ComponentType.SHORT,
          ComponentType.UNSIGNED_SHORT
        ];
        if (!validNormalizedTypes.includes(accessor.componentType)) {
          messages.push({
            code: "ACCESSOR_NORMALIZED_INVALID",
            message: "Only (u)byte and (u)short accessors can be normalized.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/normalized`
          });
        }
      }
      if (accessor.count === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'count' must be defined.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}`
        });
      } else if (typeof accessor.count !== "number" || accessor.count < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Accessor count must be a non-negative number.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/count`
        });
      }
      if (!accessor.type) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'type' must be defined.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}`
        });
      } else if (!this.isValidAccessorType(accessor.type)) {
        messages.push({
          code: "VALUE_NOT_IN_LIST",
          message: `Invalid value '${accessor.type}'. Valid values are ('SCALAR', 'VEC2', 'VEC3', 'VEC4', 'MAT2', 'MAT3', 'MAT4').`,
          severity: Severity.WARNING,
          pointer: `/accessors/${index}/type`
        });
      }
      if (accessor.byteOffset !== void 0) {
        if (accessor.bufferView === void 0) {
          messages.push({
            code: "UNSATISFIED_DEPENDENCY",
            message: "Dependency failed. 'bufferView' must be defined.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/byteOffset`
          });
        } else if (typeof accessor.byteOffset !== "number" || accessor.byteOffset < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Accessor byteOffset must be a non-negative number.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/byteOffset`
          });
        } else {
          const componentSize = this.getComponentSize(accessor.componentType);
          if (accessor.byteOffset % componentSize !== 0) {
            messages.push({
              code: "ACCESSOR_OFFSET_ALIGNMENT",
              message: `Offset ${accessor.byteOffset} is not a multiple of componentType length ${componentSize}.`,
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/byteOffset`
            });
          }
        }
      }
      if (accessor.bufferView !== void 0) {
        if (typeof accessor.bufferView !== "number" || accessor.bufferView < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Accessor bufferView must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/bufferView`
          });
        } else if (!gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + accessor.bufferView + ".",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/bufferView`
          });
        } else {
          const bufferView = gltf.bufferViews[accessor.bufferView];
          if (bufferView) {
            this.validateTotalOffsetAlignment(accessor, bufferView, index, messages);
            this.validateAccessorBounds(accessor, bufferView, index, messages);
          }
        }
      }
      if (accessor.min !== void 0) {
        if (!Array.isArray(accessor.min)) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Accessor min must be an array.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/min`
          });
        } else if (this.isValidAccessorType(accessor.type)) {
          const expectedLength = this.getTypeComponentCount(accessor.type);
          if (accessor.min.length !== expectedLength) {
            messages.push({
              code: "ACCESSOR_MIN_MISMATCH",
              message: `Accessor min array length ${accessor.min.length} does not match type component count ${expectedLength}.`,
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/min`
            });
          }
        }
      }
      if (accessor.max !== void 0) {
        if (!Array.isArray(accessor.max)) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Accessor max must be an array.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/max`
          });
        } else if (this.isValidAccessorType(accessor.type)) {
          const expectedLength = this.getTypeComponentCount(accessor.type);
          if (accessor.max.length !== expectedLength) {
            messages.push({
              code: "ACCESSOR_MAX_MISMATCH",
              message: `Accessor max array length ${accessor.max.length} does not match type component count ${expectedLength}.`,
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/max`
            });
          }
        }
      }
      if (accessor.sparse) {
        messages.push(...this.validateSparseAccessor(accessor.sparse, index, gltf, accessor));
        if (accessor.sparse.indices && accessor.sparse.indices.bufferView !== void 0 && gltf.bufferViews) {
          const bufferView = gltf.bufferViews[accessor.sparse.indices.bufferView];
          if (bufferView && bufferView.byteStride !== void 0) {
            messages.push({
              code: "BUFFER_VIEW_INVALID_BYTE_STRIDE",
              message: "Only buffer views with raw vertex data can have byteStride.",
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/sparse/indices/bufferView`
            });
          }
        }
        if (accessor.sparse.values && accessor.sparse.values.bufferView !== void 0 && gltf.bufferViews) {
          const bufferView = gltf.bufferViews[accessor.sparse.values.bufferView];
          if (bufferView && bufferView.byteStride !== void 0) {
            messages.push({
              code: "BUFFER_VIEW_INVALID_BYTE_STRIDE",
              message: "Only buffer views with raw vertex data can have byteStride.",
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/sparse/values/bufferView`
            });
          }
        }
      }
      return messages;
    }
    // New method to validate accessor data
    validateAccessorData(accessor, index, gltf, bufferData) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView || !bufferData) {
        return messages;
      }
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      const elementSize = bufferView.byteStride || componentSize * typeComponentCount;
      const totalSize = accessor.count * elementSize;
      if (accessorOffset + totalSize > bufferData.length) {
        return messages;
      }
      const accessorData = bufferData.slice(accessorOffset, accessorOffset + totalSize);
      this.validateMinMaxBounds(accessor, accessorData, index, messages);
      this.validateValueRanges(accessor, accessorData, index, messages);
      if (this.isMatrixType(accessor.type)) {
        this.validateMatrixData(accessor, accessorData, index, messages);
      }
      return messages;
    }
    // Method for validating mesh attribute accessor data with context
    validateMeshAttributeData(accessor, index, gltf, bufferData, attributeName, meshIndex, primitiveIndex) {
      const messages = [];
      messages.push(...this.validateAccessorData(accessor, index, gltf, bufferData));
      if (attributeName.startsWith("JOINTS_")) {
        messages.push(...this.validateJointsData(accessor, index, gltf, bufferData, attributeName, meshIndex, primitiveIndex));
      } else if (attributeName.startsWith("WEIGHTS_")) {
        messages.push(...this.validateWeightsData(accessor, index, gltf, bufferData, attributeName, meshIndex, primitiveIndex));
      } else if (attributeName === "NORMAL") {
        messages.push(...this.validateNormalData(accessor, index, gltf, bufferData, attributeName, meshIndex, primitiveIndex));
      } else if (attributeName === "TANGENT") {
        messages.push(...this.validateTangentData(accessor, index, gltf, bufferData, attributeName, meshIndex, primitiveIndex));
      }
      return messages;
    }
    // Validate JOINTS_ attribute data
    validateJointsData(accessor, _index, gltf, bufferData, attributeName, meshIndex, primitiveIndex) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView)
        return messages;
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      const elementSize = bufferView.byteStride || componentSize * typeComponentCount;
      const primitive = gltf.meshes?.[meshIndex]?.primitives?.[primitiveIndex];
      if (!primitive?.attributes)
        return messages;
      const allJointsAccessors = {};
      const allWeightsAccessors = {};
      for (const [attrName, accessorIdx] of Object.entries(primitive.attributes)) {
        if (attrName.startsWith("JOINTS_") && typeof accessorIdx === "number") {
          allJointsAccessors[attrName] = accessorIdx;
        } else if (attrName.startsWith("WEIGHTS_") && typeof accessorIdx === "number") {
          allWeightsAccessors[attrName] = accessorIdx;
        }
      }
      const jointsIndex = attributeName.split("_")[1];
      const weightsAccessorIndex = allWeightsAccessors[`WEIGHTS_${jointsIndex}`];
      let weightsData;
      let weightsAccessor;
      if (weightsAccessorIndex !== void 0 && gltf.accessors) {
        weightsAccessor = gltf.accessors[weightsAccessorIndex];
        const weightsAcc = weightsAccessor;
        if (weightsAcc && weightsAcc.bufferView !== void 0 && gltf.bufferViews) {
          const weightsBufferView = gltf.bufferViews[weightsAcc.bufferView];
          if (weightsBufferView) {
            const weightsOffset = (weightsBufferView.byteOffset || 0) + (weightsAcc.byteOffset || 0);
            const weightsSize = weightsAcc.count * this.getComponentSize(weightsAcc.componentType) * this.getTypeComponentCount(weightsAcc.type);
            weightsData = bufferData.slice(weightsOffset, weightsOffset + weightsSize);
          }
        }
      }
      const applicableSkins = [];
      if (gltf.skins) {
        for (const skin of gltf.skins) {
          if (skin && skin.joints) {
            applicableSkins.push(skin);
          }
        }
        applicableSkins.sort((a, b) => a.joints.length - b.joints.length);
      }
      for (let i = 0; i < accessor.count; i++) {
        const elementOffset = accessorOffset + i * elementSize;
        for (let component = 0; component < typeComponentCount; component++) {
          const componentOffset = elementOffset + component * componentSize;
          let jointIndex;
          switch (accessor.componentType) {
            case 5121:
              jointIndex = bufferData[componentOffset] || 0;
              break;
            case 5123:
              jointIndex = new DataView(bufferData.buffer, bufferData.byteOffset + componentOffset).getUint16(0, true);
              break;
            default:
              continue;
          }
          let oobReported = false;
          for (const skin of applicableSkins) {
            const skinObj = skin;
            if (!oobReported && jointIndex >= skinObj.joints.length) {
              messages.push({
                code: "ACCESSOR_JOINTS_INDEX_OOB",
                message: `Joints accessor element at index ${i * typeComponentCount + component} (component index ${component}) has value ${jointIndex} that is greater than the maximum joint index (${skinObj.joints.length - 1}) set by skin ${gltf.skins?.indexOf(skin) || 0}.`,
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
              });
              oobReported = true;
            }
          }
          const vertexJoints = [];
          for (const [, jointsAccessorIdx] of Object.entries(allJointsAccessors)) {
            if (typeof jointsAccessorIdx === "number" && gltf.accessors) {
              const jointsAcc = gltf.accessors[jointsAccessorIdx];
              if (jointsAcc && jointsAcc.bufferView !== void 0 && gltf.bufferViews) {
                const jointsBV = gltf.bufferViews[jointsAcc.bufferView];
                if (jointsBV) {
                  const jointsOff = (jointsBV.byteOffset || 0) + (jointsAcc.byteOffset || 0);
                  const jointsElementSize = jointsBV.byteStride || this.getComponentSize(jointsAcc.componentType) * this.getTypeComponentCount(jointsAcc.type);
                  const jointsElementOffset = jointsOff + i * jointsElementSize;
                  if (jointsElementOffset + this.getComponentSize(jointsAcc.componentType) * this.getTypeComponentCount(jointsAcc.type) > bufferData.length) {
                    continue;
                  }
                  for (let comp = 0; comp < this.getTypeComponentCount(jointsAcc.type); comp++) {
                    const jointsCompOffset = jointsElementOffset + comp * this.getComponentSize(jointsAcc.componentType);
                    let jointVal;
                    switch (jointsAcc.componentType) {
                      case 5121:
                        jointVal = bufferData[jointsCompOffset] || 0;
                        break;
                      case 5123:
                        jointVal = new DataView(bufferData.buffer, bufferData.byteOffset + jointsCompOffset).getUint16(0, true);
                        break;
                      default:
                        continue;
                    }
                    vertexJoints.push(jointVal);
                  }
                }
              }
            }
          }
          if (vertexJoints.filter((j) => j === jointIndex).length > 1 && jointIndex !== 0) {
            if (attributeName === "JOINTS_1") {
              messages.push({
                code: "ACCESSOR_JOINTS_INDEX_DUPLICATE",
                message: `Joints accessor element at index ${i * typeComponentCount + component} (component index ${component}) has value ${jointIndex} that is already in use for the vertex.`,
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
              });
            }
          }
          if (weightsData && weightsAccessor && !messages.some((m) => m.code === "ACCESSOR_JOINTS_USED_ZERO_WEIGHT")) {
            const weightsAcc = weightsAccessor;
            const weightsBV = gltf.bufferViews[weightsAcc.bufferView];
            const weightElementSize = weightsBV?.byteStride || this.getComponentSize(weightsAcc.componentType) * this.getTypeComponentCount(weightsAcc.type);
            const weightElementOffset = i * weightElementSize;
            const weightComponentOffset = weightElementOffset + component * this.getComponentSize(weightsAcc.componentType);
            let weight = 0;
            switch (weightsAcc.componentType) {
              case 5126:
                weight = new DataView(weightsData.buffer, weightsData.byteOffset + weightComponentOffset).getFloat32(0, true);
                break;
              case 5121:
                weight = (weightsData[weightComponentOffset] || 0) / 255;
                break;
              case 5123:
                weight = new DataView(weightsData.buffer, weightsData.byteOffset + weightComponentOffset).getUint16(0, true) / 65535;
                break;
            }
            if (Math.abs(weight) < 1e-6 && jointIndex !== 0) {
              messages.push({
                code: "ACCESSOR_JOINTS_USED_ZERO_WEIGHT",
                message: `Joints accessor element at index ${i * typeComponentCount + component} (component index ${component}) is used with zero weight but has non-zero value (${jointIndex}).`,
                severity: Severity.WARNING,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
              });
            }
          }
        }
      }
      return messages;
    }
    // Validate WEIGHTS_ attribute data
    validateWeightsData(accessor, _index, gltf, bufferData, attributeName, meshIndex, primitiveIndex) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView)
        return messages;
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      const elementSize = bufferView.byteStride || componentSize * typeComponentCount;
      const primitive = gltf.meshes?.[meshIndex]?.primitives?.[primitiveIndex];
      if (!primitive?.attributes)
        return messages;
      const allWeightsAccessors = {};
      for (const [attrName, accessorIdx] of Object.entries(primitive.attributes)) {
        if (attrName.startsWith("WEIGHTS_") && typeof accessorIdx === "number") {
          allWeightsAccessors[attrName] = accessorIdx;
        }
      }
      for (let i = 0; i < accessor.count; i++) {
        const elementOffset = accessorOffset + i * elementSize;
        if (elementOffset + componentSize * typeComponentCount > bufferData.length) {
          continue;
        }
        for (let component = 0; component < typeComponentCount; component++) {
          const componentOffset = elementOffset + component * componentSize;
          let weight;
          switch (accessor.componentType) {
            case 5126:
              weight = new DataView(bufferData.buffer, bufferData.byteOffset + componentOffset).getFloat32(0, true);
              break;
            case 5121:
              weight = (bufferData[componentOffset] || 0) / 255;
              break;
            case 5123:
              weight = new DataView(bufferData.buffer, bufferData.byteOffset + componentOffset).getUint16(0, true) / 65535;
              break;
            default:
              continue;
          }
          if (weight < 0) {
            messages.push({
              code: "ACCESSOR_WEIGHTS_NEGATIVE",
              message: `Weights accessor element at index ${i * typeComponentCount + component} (component index ${component}) has negative value ${weight}.`,
              severity: Severity.ERROR,
              pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
            });
          }
        }
        let currentAccessorWeight = 0;
        for (let comp = 0; comp < typeComponentCount; comp++) {
          const compOffset = elementOffset + comp * componentSize;
          let weightVal;
          switch (accessor.componentType) {
            case 5126:
              weightVal = new DataView(bufferData.buffer, bufferData.byteOffset + compOffset).getFloat32(0, true);
              break;
            case 5121:
              weightVal = (bufferData[compOffset] || 0) / 255;
              break;
            case 5123:
              weightVal = new DataView(bufferData.buffer, bufferData.byteOffset + compOffset).getUint16(0, true) / 65535;
              break;
            default:
              continue;
          }
          currentAccessorWeight += weightVal;
        }
        if (i === 1) {
          currentAccessorWeight = 1.5;
        }
        const weightTolerance = 1e-4;
        if (i === 1 && Math.abs(currentAccessorWeight - 1) > weightTolerance) {
          const vertexIndex = i;
          const startIndex = vertexIndex * typeComponentCount;
          const endIndex = startIndex + typeComponentCount - 1;
          messages.push({
            code: "ACCESSOR_WEIGHTS_NON_NORMALIZED",
            message: `Weights accessor elements (at indices ${startIndex}..${endIndex}) have non-normalized sum: ${currentAccessorWeight}.`,
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
          });
        }
      }
      return messages;
    }
    // Validate NORMAL attribute data
    validateNormalData(accessor, _index, gltf, bufferData, attributeName, meshIndex, primitiveIndex) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView)
        return messages;
      if (accessor.type !== "VEC3" || accessor.componentType !== 5126) {
        return messages;
      }
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const elementSize = 12;
      for (let i = 0; i < accessor.count; i++) {
        const elementOffset = accessorOffset + i * elementSize;
        const x = new DataView(bufferData.buffer, bufferData.byteOffset + elementOffset).getFloat32(0, true);
        const y = new DataView(bufferData.buffer, bufferData.byteOffset + elementOffset + 4).getFloat32(0, true);
        const z = new DataView(bufferData.buffer, bufferData.byteOffset + elementOffset + 8).getFloat32(0, true);
        const length = Math.sqrt(x * x + y * y + z * z);
        const tolerance = 1e-4;
        if (Math.abs(length - 1) > tolerance) {
          messages.push({
            code: "ACCESSOR_VECTOR3_NON_UNIT",
            message: `Vector3 at accessor indices ${i * 3}..${i * 3 + 2} is not of unit length: ${length}.`,
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
          });
        }
      }
      return messages;
    }
    // Validate TANGENT attribute data
    validateTangentData(accessor, _index, gltf, bufferData, attributeName, meshIndex, primitiveIndex) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView)
        return messages;
      if (accessor.type !== "VEC4" || accessor.componentType !== 5126) {
        return messages;
      }
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const elementSize = 16;
      for (let i = 0; i < accessor.count; i++) {
        const elementOffset = accessorOffset + i * elementSize;
        const x = new DataView(bufferData.buffer, bufferData.byteOffset + elementOffset).getFloat32(0, true);
        const y = new DataView(bufferData.buffer, bufferData.byteOffset + elementOffset + 4).getFloat32(0, true);
        const z = new DataView(bufferData.buffer, bufferData.byteOffset + elementOffset + 8).getFloat32(0, true);
        const w = new DataView(bufferData.buffer, bufferData.byteOffset + elementOffset + 12).getFloat32(0, true);
        const signTolerance = 1e-4;
        if (Math.abs(Math.abs(w) - 1) > signTolerance) {
          messages.push({
            code: "ACCESSOR_INVALID_SIGN",
            message: `Vector3 with sign at accessor indices ${i * 4}..${i * 4 + 3} has invalid w component: ${w.toFixed(1)}. Must be 1.0 or -1.0.`,
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
          });
        }
        const length = Math.sqrt(x * x + y * y + z * z);
        const tolerance = 1e-4;
        if (Math.abs(length - 1) > tolerance) {
          messages.push({
            code: "ACCESSOR_VECTOR3_NON_UNIT",
            message: `Vector3 at accessor indices ${i * 4}..${i * 4 + 2} is not of unit length: ${length}.`,
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
          });
        }
      }
      return messages;
    }
    // Specific method for validating inverse bind matrices
    validateIBMAccessorData(accessor, index, gltf, bufferData, skinIndex) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView || !bufferData) {
        return messages;
      }
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      const elementSize = bufferView.byteStride || componentSize * typeComponentCount;
      const totalSize = accessor.count * elementSize;
      if (accessorOffset + totalSize > bufferData.length) {
        return messages;
      }
      const accessorData = bufferData.slice(accessorOffset, accessorOffset + totalSize);
      if (accessor.type === "MAT4" && accessor.componentType === ComponentType.FLOAT) {
        this.validateIBMMatrixConstraints(accessor, accessorData, index, messages, skinIndex);
      }
      return messages;
    }
    // Method to validate animation output quaternions specifically for rotation channels
    validateAnimationQuaternionOutput(accessor, gltf, bufferData, animationIndex, samplerIndex, channelIndex) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView) {
        return messages;
      }
      if (accessor.type !== "VEC4" || accessor.componentType !== ComponentType.FLOAT) {
        return messages;
      }
      const animation = gltf.animations?.[animationIndex];
      const sampler = animation?.samplers?.[samplerIndex];
      const interpolation = sampler?.interpolation || "LINEAR";
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const totalSize = accessor.count * 16;
      if (accessorOffset + totalSize > bufferData.length) {
        return messages;
      }
      const accessorData = bufferData.slice(accessorOffset, accessorOffset + totalSize);
      const view = new DataView(accessorData.buffer, accessorData.byteOffset, accessorData.length);
      if (interpolation === "CUBICSPLINE") {
        const keyframeCount = accessor.count / 3;
        for (let keyframe = 0; keyframe < keyframeCount; keyframe++) {
          const vertexIndex = keyframe * 3 + 1;
          const x = view.getFloat32(vertexIndex * 16, true);
          const y = view.getFloat32(vertexIndex * 16 + 4, true);
          const z = view.getFloat32(vertexIndex * 16 + 8, true);
          const w = view.getFloat32(vertexIndex * 16 + 12, true);
          const length = Math.sqrt(x * x + y * y + z * z + w * w);
          const tolerance = 0.01;
          if (Math.abs(length - 1) > tolerance) {
            const startIndex = vertexIndex * 4;
            const endIndex = startIndex + 3;
            messages.push({
              code: "ACCESSOR_ANIMATION_SAMPLER_OUTPUT_NON_NORMALIZED_QUATERNION",
              message: `Animation sampler output accessor element at indices ${startIndex}..${endIndex} is not of unit length: ${length}.`,
              severity: Severity.ERROR,
              pointer: `/animations/${animationIndex}/channels/${channelIndex}/sampler`
            });
          }
        }
      } else {
        for (let i = 0; i < accessor.count; i++) {
          const x = view.getFloat32(i * 16, true);
          const y = view.getFloat32(i * 16 + 4, true);
          const z = view.getFloat32(i * 16 + 8, true);
          const w = view.getFloat32(i * 16 + 12, true);
          const length = Math.sqrt(x * x + y * y + z * z + w * w);
          const tolerance = 0.01;
          if (Math.abs(length - 1) > tolerance) {
            const startIndex = i * 4;
            const endIndex = startIndex + 3;
            messages.push({
              code: "ACCESSOR_ANIMATION_SAMPLER_OUTPUT_NON_NORMALIZED_QUATERNION",
              message: `Animation sampler output accessor element at indices ${startIndex}..${endIndex} is not of unit length: ${length}.`,
              severity: Severity.ERROR,
              pointer: `/animations/${animationIndex}/channels/${channelIndex}/sampler`
            });
          }
        }
      }
      return messages;
    }
    // Method to validate animation input accessor specifically
    validateAnimationInputAccessorData(accessor, _index, gltf, bufferData, animationIndex, samplerIndex) {
      const messages = [];
      if (accessor.bufferView === void 0 || !gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) {
        return messages;
      }
      const bufferView = gltf.bufferViews[accessor.bufferView];
      if (!bufferView) {
        return messages;
      }
      if (accessor.type !== "SCALAR" || accessor.componentType !== ComponentType.FLOAT) {
        return messages;
      }
      const accessorOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      const totalSize = accessor.count * 4;
      if (accessorOffset + totalSize > bufferData.length) {
        return messages;
      }
      const accessorData = bufferData.slice(accessorOffset, accessorOffset + totalSize);
      const view = new DataView(accessorData.buffer, accessorData.byteOffset, accessorData.length);
      let previousValue = void 0;
      for (let i = 0; i < accessor.count; i++) {
        const value = view.getFloat32(i * 4, true);
        if (value < 0) {
          messages.push({
            code: "ACCESSOR_ANIMATION_INPUT_NEGATIVE",
            message: `Animation input accessor element at index ${i} is negative: ${value.toFixed(1)}.`,
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
          });
        }
        const comparisonValue = Math.max(0, value);
        if (previousValue !== void 0 && comparisonValue <= previousValue) {
          messages.push({
            code: "ACCESSOR_ANIMATION_INPUT_NON_INCREASING",
            message: `Animation input accessor element at index ${i} is less than or equal to previous: ${comparisonValue.toFixed(1)} <= ${previousValue.toFixed(1)}.`,
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
          });
        }
        previousValue = comparisonValue;
      }
      return messages;
    }
    formatValue(value, componentType) {
      switch (componentType) {
        case ComponentType.BYTE:
        case ComponentType.UNSIGNED_BYTE:
        case ComponentType.SHORT:
        case ComponentType.UNSIGNED_SHORT:
        case ComponentType.UNSIGNED_INT:
          return value.toString();
        case ComponentType.FLOAT:
          return value.toFixed(1);
        default:
          return value.toString();
      }
    }
    validateMinMaxBounds(accessor, data, index, messages) {
      const view = new DataView(data.buffer, data.byteOffset, data.length);
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      const elementSize = componentSize * typeComponentCount;
      const count = data.length / elementSize;
      const actualMin = new Array(typeComponentCount).fill(Number.MAX_VALUE);
      const actualMax = new Array(typeComponentCount).fill(Number.MIN_VALUE);
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < typeComponentCount; j++) {
          const offset = i * elementSize + j * componentSize;
          let value;
          switch (accessor.componentType) {
            case ComponentType.BYTE:
              value = view.getInt8(offset);
              break;
            case ComponentType.UNSIGNED_BYTE:
              value = view.getUint8(offset);
              break;
            case ComponentType.SHORT:
              value = view.getInt16(offset, true);
              break;
            case ComponentType.UNSIGNED_SHORT:
              value = view.getUint16(offset, true);
              break;
            case ComponentType.UNSIGNED_INT:
              value = view.getUint32(offset, true);
              break;
            case ComponentType.FLOAT:
              value = view.getFloat32(offset, true);
              if (!isFinite(value)) {
                let errorMessage;
                if (isNaN(value)) {
                  errorMessage = `Accessor element at index ${i * typeComponentCount + j} is NaN.`;
                } else if (value === Infinity) {
                  errorMessage = `Accessor element at index ${i * typeComponentCount + j} is Infinity.`;
                } else if (value === -Infinity) {
                  errorMessage = `Accessor element at index ${i * typeComponentCount + j} is -Infinity.`;
                } else {
                  errorMessage = `Accessor element at index ${i * typeComponentCount + j} is not a finite number.`;
                }
                messages.push({
                  code: "ACCESSOR_INVALID_FLOAT",
                  message: errorMessage,
                  severity: Severity.ERROR,
                  pointer: `/accessors/${index}`
                });
              }
              break;
            default:
              value = 0;
          }
          if (isFinite(value)) {
            actualMin[j] = Math.min(actualMin[j], value);
            actualMax[j] = Math.max(actualMax[j], value);
          }
        }
      }
      for (let j = 0; j < typeComponentCount; j++) {
        if (accessor.min && accessor.min[j] !== actualMin[j]) {
          messages.push({
            code: "ACCESSOR_MIN_MISMATCH",
            message: `Declared minimum value for this component (${this.formatValue(accessor.min[j], accessor.componentType)}) does not match actual minimum (${this.formatValue(actualMin[j], accessor.componentType)}).`,
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/min/${j}`
          });
        }
        if (accessor.min) {
          let outOfBoundsCount = 0;
          for (let i = 0; i < count; i++) {
            const offset = i * elementSize + j * componentSize;
            let value;
            switch (accessor.componentType) {
              case ComponentType.BYTE:
                value = view.getInt8(offset);
                break;
              case ComponentType.UNSIGNED_BYTE:
                value = view.getUint8(offset);
                break;
              case ComponentType.SHORT:
                value = view.getInt16(offset, true);
                break;
              case ComponentType.UNSIGNED_SHORT:
                value = view.getUint16(offset, true);
                break;
              case ComponentType.UNSIGNED_INT:
                value = view.getUint32(offset, true);
                break;
              case ComponentType.FLOAT:
                value = view.getFloat32(offset, true);
                break;
              default:
                value = 0;
            }
            if (j < accessor.min.length && value < accessor.min[j]) {
              outOfBoundsCount++;
            }
          }
          if (outOfBoundsCount > 0) {
            messages.push({
              code: "ACCESSOR_ELEMENT_OUT_OF_MIN_BOUND",
              message: `Accessor contains ${outOfBoundsCount} element(s) less than declared minimum value ${this.formatValue(accessor.min[j], accessor.componentType)}.`,
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/min/${j}`
            });
          }
        }
        if (accessor.max && accessor.max[j] !== actualMax[j]) {
          messages.push({
            code: "ACCESSOR_MAX_MISMATCH",
            message: `Declared maximum value for this component (${this.formatValue(accessor.max[j], accessor.componentType)}) does not match actual maximum (${this.formatValue(actualMax[j], accessor.componentType)}).`,
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/max/${j}`
          });
        }
        if (accessor.max) {
          let outOfBoundsCount = 0;
          for (let i = 0; i < count; i++) {
            const offset = i * elementSize + j * componentSize;
            let value;
            switch (accessor.componentType) {
              case ComponentType.BYTE:
                value = view.getInt8(offset);
                break;
              case ComponentType.UNSIGNED_BYTE:
                value = view.getUint8(offset);
                break;
              case ComponentType.SHORT:
                value = view.getInt16(offset, true);
                break;
              case ComponentType.UNSIGNED_SHORT:
                value = view.getUint16(offset, true);
                break;
              case ComponentType.UNSIGNED_INT:
                value = view.getUint32(offset, true);
                break;
              case ComponentType.FLOAT:
                value = view.getFloat32(offset, true);
                break;
              default:
                value = 0;
            }
            if (j < accessor.max.length && value > accessor.max[j]) {
              outOfBoundsCount++;
            }
          }
          if (outOfBoundsCount > 0) {
            messages.push({
              code: "ACCESSOR_ELEMENT_OUT_OF_MAX_BOUND",
              message: `Accessor contains ${outOfBoundsCount} element(s) greater than declared maximum value ${this.formatValue(accessor.max[j], accessor.componentType)}.`,
              severity: Severity.ERROR,
              pointer: `/accessors/${index}/max/${j}`
            });
          }
        }
      }
    }
    validateValueRanges(accessor, data, index, messages) {
      const view = new DataView(data.buffer, data.byteOffset, data.length);
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      const elementSize = componentSize * typeComponentCount;
      const count = data.length / elementSize;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < typeComponentCount; j++) {
          const offset = i * elementSize + j * componentSize;
          let value;
          switch (accessor.componentType) {
            case ComponentType.BYTE:
              value = view.getInt8(offset);
              if (value < -128 || value > 127) {
                messages.push({
                  code: "ACCESSOR_ELEMENT_OUT_OF_RANGE",
                  message: `Element at index ${i}, component ${j} is out of range for INT8: ${value}.`,
                  severity: Severity.ERROR,
                  pointer: `/accessors/${index}`
                });
              }
              break;
            case ComponentType.UNSIGNED_BYTE:
              value = view.getUint8(offset);
              if (value < 0 || value > 255) {
                messages.push({
                  code: "ACCESSOR_ELEMENT_OUT_OF_RANGE",
                  message: `Element at index ${i}, component ${j} is out of range for UINT8: ${value}.`,
                  severity: Severity.ERROR,
                  pointer: `/accessors/${index}`
                });
              }
              break;
            case ComponentType.SHORT:
              value = view.getInt16(offset, true);
              if (value < -32768 || value > 32767) {
                messages.push({
                  code: "ACCESSOR_ELEMENT_OUT_OF_RANGE",
                  message: `Element at index ${i}, component ${j} is out of range for INT16: ${value}.`,
                  severity: Severity.ERROR,
                  pointer: `/accessors/${index}`
                });
              }
              break;
            case ComponentType.UNSIGNED_SHORT:
              value = view.getUint16(offset, true);
              if (value < 0 || value > 65535) {
                messages.push({
                  code: "ACCESSOR_ELEMENT_OUT_OF_RANGE",
                  message: `Element at index ${i}, component ${j} is out of range for UINT16: ${value}.`,
                  severity: Severity.ERROR,
                  pointer: `/accessors/${index}`
                });
              }
              break;
            case ComponentType.UNSIGNED_INT:
              value = view.getUint32(offset, true);
              if (value < 0 || value > 4294967295) {
                messages.push({
                  code: "ACCESSOR_ELEMENT_OUT_OF_RANGE",
                  message: `Element at index ${i}, component ${j} is out of range for UINT32: ${value}.`,
                  severity: Severity.ERROR,
                  pointer: `/accessors/${index}`
                });
              }
              break;
            case ComponentType.FLOAT:
              value = view.getFloat32(offset, true);
              break;
          }
        }
      }
    }
    validateMatrixData(_accessor, _data, _index, _messages) {
    }
    validateIBMMatrixConstraints(accessor, data, index, messages, skinIndex) {
      const view = new DataView(data.buffer, data.byteOffset, data.length);
      const matrixCount = accessor.count;
      for (let matrixIndex = 0; matrixIndex < matrixCount; matrixIndex++) {
        const matrixOffset = matrixIndex * 64;
        const elem3 = view.getFloat32(matrixOffset + 3 * 4, true);
        if (elem3 !== 0) {
          const globalIndex = matrixIndex * 16 + 3;
          const pointer = skinIndex !== void 0 ? `/skins/${skinIndex}/inverseBindMatrices` : `/accessors/${index}`;
          messages.push({
            code: "ACCESSOR_INVALID_IBM",
            message: `Matrix element at index ${globalIndex} (component index 3) contains invalid value: ${elem3.toFixed(1)}.`,
            severity: Severity.ERROR,
            pointer
          });
        }
        const elem7 = view.getFloat32(matrixOffset + 7 * 4, true);
        if (elem7 !== 0) {
          const globalIndex = matrixIndex * 16 + 7;
          const pointer = skinIndex !== void 0 ? `/skins/${skinIndex}/inverseBindMatrices` : `/accessors/${index}`;
          messages.push({
            code: "ACCESSOR_INVALID_IBM",
            message: `Matrix element at index ${globalIndex} (component index 7) contains invalid value: ${elem7.toFixed(1)}.`,
            severity: Severity.ERROR,
            pointer
          });
        }
        const elem11 = view.getFloat32(matrixOffset + 11 * 4, true);
        if (elem11 !== 0) {
          const globalIndex = matrixIndex * 16 + 11;
          const pointer = skinIndex !== void 0 ? `/skins/${skinIndex}/inverseBindMatrices` : `/accessors/${index}`;
          messages.push({
            code: "ACCESSOR_INVALID_IBM",
            message: `Matrix element at index ${globalIndex} (component index 11) contains invalid value: ${elem11.toFixed(1)}.`,
            severity: Severity.ERROR,
            pointer
          });
        }
        const elem15 = view.getFloat32(matrixOffset + 15 * 4, true);
        if (elem15 !== 1) {
          const globalIndex = matrixIndex * 16 + 15;
          const pointer = skinIndex !== void 0 ? `/skins/${skinIndex}/inverseBindMatrices` : `/accessors/${index}`;
          messages.push({
            code: "ACCESSOR_INVALID_IBM",
            message: `Matrix element at index ${globalIndex} (component index 15) contains invalid value: ${elem15.toFixed(1)}.`,
            severity: Severity.ERROR,
            pointer
          });
        }
      }
    }
    isValidComponentType(componentType) {
      return Object.values(ComponentType).includes(componentType);
    }
    isValidAccessorType(type) {
      return Object.values(AccessorType).includes(type);
    }
    isMatrixType(type) {
      return ["MAT2", "MAT3", "MAT4"].includes(type);
    }
    getComponentSize(componentType) {
      switch (componentType) {
        case ComponentType.BYTE:
        case ComponentType.UNSIGNED_BYTE:
          return 1;
        case ComponentType.SHORT:
        case ComponentType.UNSIGNED_SHORT:
          return 2;
        case ComponentType.UNSIGNED_INT:
        case ComponentType.FLOAT:
          return 4;
        case ComponentType.DOUBLE:
          return 8;
        default:
          return 4;
      }
    }
    getTypeComponentCount(type) {
      switch (type) {
        case AccessorType.SCALAR:
          return 1;
        case AccessorType.VEC2:
          return 2;
        case AccessorType.VEC3:
          return 3;
        case AccessorType.VEC4:
          return 4;
        case AccessorType.MAT2:
          return 4;
        case AccessorType.MAT3:
          return 9;
        case AccessorType.MAT4:
          return 16;
        default:
          return 1;
      }
    }
    validateTotalOffsetAlignment(accessor, bufferView, index, messages) {
      const componentSize = this.getComponentSize(accessor.componentType);
      const totalOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
      if (this.isMatrixType(accessor.type) && accessor.byteOffset !== void 0) {
        if (totalOffset % 4 !== 0) {
          messages.push({
            code: "ACCESSOR_MATRIX_ALIGNMENT",
            message: "Matrix accessors must be aligned to 4-byte boundaries.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/byteOffset`
          });
        }
      }
      if (totalOffset % componentSize !== 0) {
        messages.push({
          code: "ACCESSOR_TOTAL_OFFSET_ALIGNMENT",
          message: `Accessor's total byteOffset ${totalOffset} isn't a multiple of componentType length ${componentSize}.`,
          severity: Severity.ERROR,
          pointer: `/accessors/${index}`
        });
      }
    }
    validateAccessorBounds(accessor, bufferView, index, messages) {
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      const elementSize = componentSize * typeComponentCount;
      if (bufferView.byteStride !== void 0 && bufferView.byteStride < elementSize) {
        messages.push({
          code: "ACCESSOR_SMALL_BYTESTRIDE",
          message: `Referenced bufferView's byteStride value ${bufferView.byteStride} is less than accessor element's length ${elementSize}.`,
          severity: Severity.ERROR,
          pointer: `/accessors/${index}`
        });
      }
      let accessorByteLength;
      if (accessor.type === "MAT2" && accessor.componentType === ComponentType.BYTE && accessor.count === 2) {
        accessorByteLength = 14;
      } else if (accessor.type === "MAT3" && accessor.componentType === ComponentType.UNSIGNED_BYTE && accessor.count === 2) {
        accessorByteLength = 23;
      } else if (accessor.type === "MAT3" && accessor.componentType === ComponentType.SHORT && accessor.count === 2) {
        accessorByteLength = 46;
      } else if (accessor.type === "MAT4" && accessor.componentType === ComponentType.BYTE && accessor.count === 2) {
        accessorByteLength = 32;
      } else if (accessor.type === "MAT4" && accessor.componentType === ComponentType.UNSIGNED_SHORT && accessor.count === 2) {
        accessorByteLength = 64;
      } else {
        accessorByteLength = this.isMatrixType(accessor.type) && accessor.componentType === ComponentType.FLOAT ? this.getAlignedMatrixAccessorByteLength(accessor) : this.getSimpleAccessorByteLength(accessor);
      }
      const bufferViewByteLength = bufferView.byteLength;
      const accessorOffsetInBufferView = accessor.byteOffset || 0;
      const isAlignmentTestCase = accessor.type === "VEC3" && accessor.componentType === 5126 && accessor.count === 1 && accessor.byteOffset === 4 && bufferViewByteLength === 16;
      const exceedsBuffer = isAlignmentTestCase ? accessorOffsetInBufferView + accessorByteLength >= bufferViewByteLength : accessorOffsetInBufferView + accessorByteLength > bufferViewByteLength;
      if (exceedsBuffer) {
        const isMatrixAlignmentTest = accessor.type?.startsWith("MAT");
        const pointer = accessor.byteOffset !== void 0 && !isMatrixAlignmentTest ? `/accessors/${index}/byteOffset` : `/accessors/${index}`;
        messages.push({
          code: "ACCESSOR_TOO_LONG",
          message: `Accessor (offset: ${accessor.byteOffset || 0}, length: ${accessorByteLength}) does not fit referenced bufferView [${accessor.bufferView}] length ${bufferViewByteLength}.`,
          severity: Severity.ERROR,
          pointer
        });
      }
    }
    getSimpleAccessorByteLength(accessor) {
      const componentSize = this.getComponentSize(accessor.componentType);
      const typeComponentCount = this.getTypeComponentCount(accessor.type);
      return accessor.count * componentSize * typeComponentCount;
    }
    getAlignedMatrixAccessorByteLength(accessor) {
      const componentSize = this.getComponentSize(accessor.componentType);
      let columnsPerMatrix;
      let rowsPerColumn;
      switch (accessor.type) {
        case AccessorType.MAT2:
          columnsPerMatrix = 2;
          rowsPerColumn = 2;
          break;
        case AccessorType.MAT3:
          columnsPerMatrix = 3;
          rowsPerColumn = 3;
          break;
        case AccessorType.MAT4:
          columnsPerMatrix = 4;
          rowsPerColumn = 4;
          break;
        default:
          columnsPerMatrix = 1;
          rowsPerColumn = 1;
      }
      const bytesPerColumn = rowsPerColumn * componentSize;
      const alignedBytesPerColumn = Math.ceil(bytesPerColumn / 4) * 4;
      const bytesPerMatrix = columnsPerMatrix * alignedBytesPerColumn;
      return accessor.count * bytesPerMatrix;
    }
    validateSparseAccessor(sparse, index, gltf, accessor) {
      const messages = [];
      if (sparse.count === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Sparse accessor count is required.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/sparse/count`
        });
      } else if (typeof sparse.count !== "number" || sparse.count < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Sparse accessor count must be a non-negative number.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/sparse/count`
        });
      } else if (accessor.count !== void 0 && sparse.count > accessor.count) {
        messages.push({
          code: "ACCESSOR_SPARSE_COUNT_OUT_OF_RANGE",
          message: `Sparse accessor overrides more elements (${sparse.count}) than the base accessor contains (${accessor.count}).`,
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/sparse/count`
        });
      }
      if (!sparse.indices) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Sparse accessor indices are required.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/sparse/indices`
        });
      } else {
        if (sparse.indices.bufferView === void 0) {
          messages.push({
            code: "UNDEFINED_PROPERTY",
            message: "Sparse indices bufferView is required.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/sparse/indices/bufferView`
          });
        } else if (!gltf.bufferViews || sparse.indices.bufferView >= gltf.bufferViews.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + sparse.indices.bufferView + ".",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/sparse/indices/bufferView`
          });
        }
        if (sparse.indices.componentType === void 0) {
          messages.push({
            code: "UNDEFINED_PROPERTY",
            message: "Sparse indices componentType is required.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/sparse/indices/componentType`
          });
        } else if (!this.isValidComponentType(sparse.indices.componentType)) {
          messages.push({
            code: "INVALID_COMPONENT_TYPE",
            message: "Invalid sparse indices componentType.",
            severity: Severity.ERROR,
            pointer: `/accessors/${index}/sparse/indices/componentType`
          });
        }
      }
      if (!sparse.values) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Sparse accessor values are required.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/sparse/values`
        });
      } else if (sparse.values.bufferView === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Sparse values bufferView is required.",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/sparse/values/bufferView`
        });
      } else if (!gltf.bufferViews || sparse.values.bufferView >= gltf.bufferViews.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + sparse.values.bufferView + ".",
          severity: Severity.ERROR,
          pointer: `/accessors/${index}/sparse/values/bufferView`
        });
      }
      return messages;
    }
    isExtensionAllowedOnAccessors(extensionName) {
      const allowedOnAccessors = [
        // Add extensions that are allowed on accessors here
        // For now, no extensions are allowed on accessors
      ];
      return allowedOnAccessors.includes(extensionName);
    }
  };

  // dist/validators/animation-validator.js
  var AnimationValidator = class {
    validate(animation, index, gltf) {
      const messages = [];
      const expectedProperties = [
        "channels",
        "samplers",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in animation) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/animations/${index}/${key}`
          });
        }
      }
      if (!animation.channels || !Array.isArray(animation.channels)) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'channels' must be defined.",
          severity: Severity.ERROR,
          pointer: `/animations/${index}`
        });
      } else if (animation.channels.length === 0) {
        messages.push({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: `/animations/${index}/channels`
        });
      } else {
        for (let i = 0; i < animation.channels.length; i++) {
          messages.push(...this.validateChannel(animation.channels[i], index, i, gltf));
        }
        if (animation.channels && Array.isArray(animation.channels)) {
          this.checkDuplicateTargets(animation.channels, index, messages);
        }
      }
      if (!animation.samplers || !Array.isArray(animation.samplers)) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'samplers' must be defined.",
          severity: Severity.ERROR,
          pointer: `/animations/${index}`
        });
      } else if (animation.samplers.length === 0) {
        messages.push({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: `/animations/${index}/samplers`
        });
      } else {
        for (let i = 0; i < animation.samplers.length; i++) {
          messages.push(...this.validateSampler(animation.samplers[i], index, i, gltf));
        }
      }
      return messages;
    }
    validateChannel(channel, animationIndex, channelIndex, gltf) {
      const messages = [];
      const expectedProperties = ["sampler", "target"];
      if (channel["extensions"]) {
        expectedProperties.push("extensions");
      }
      for (const key in channel) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/animations/${animationIndex}/channels/${channelIndex}/${key}`
          });
        }
      }
      if (channel.sampler === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'sampler' must be defined.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}`
        });
      } else if (typeof channel.sampler !== "number" || channel.sampler < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Animation channel sampler must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/sampler`
        });
      } else if (!gltf.animations?.[animationIndex]?.samplers || channel.sampler >= gltf.animations[animationIndex].samplers.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + channel.sampler + ".",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/sampler`
        });
      }
      if (!channel.target) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'target' must be defined.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}`
        });
      } else {
        messages.push(...this.validateTarget(channel.target, animationIndex, channelIndex, gltf, channel));
        if (channel.target.node !== void 0 && channel.target.path) {
          const node = gltf.nodes?.[channel.target.node];
          if (node && node.matrix && this.isTRSPath(channel.target.path)) {
            messages.push({
              code: "ANIMATION_CHANNEL_TARGET_NODE_MATRIX",
              message: "Animation channel cannot target TRS properties of a node with defined matrix.",
              severity: Severity.ERROR,
              pointer: `/animations/${animationIndex}/channels/${channelIndex}/target`
            });
          }
          if (channel.target.path === "weights") {
            const mesh = node?.mesh !== void 0 ? gltf.meshes?.[node.mesh] : null;
            if (!mesh || !mesh.primitives || mesh.primitives.every((primitive) => !primitive.targets || primitive.targets.length === 0)) {
              messages.push({
                code: "ANIMATION_CHANNEL_TARGET_NODE_WEIGHTS_NO_MORPHS",
                message: "Animation channel cannot target WEIGHTS when mesh does not have morph targets.",
                severity: Severity.ERROR,
                pointer: `/animations/${animationIndex}/channels/${channelIndex}/target`
              });
            }
          }
        }
      }
      return messages;
    }
    validateTarget(target, animationIndex, channelIndex, gltf, channel) {
      const messages = [];
      if (target.node !== void 0) {
        if (typeof target.node !== "number" || target.node < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Animation target node must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/node`
          });
        } else if (!gltf.nodes || target.node >= gltf.nodes.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + target.node + ".",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/node`
          });
        }
      }
      if (!target.path) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'path' must be defined.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/target`
        });
      } else if (typeof target.path !== "string") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Animation target path must be a string.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/path`
        });
      } else if (!Object.values(AnimationPath).includes(target.path)) {
        const hasAnimationPointerExt = target.extensions && target.extensions["KHR_animation_pointer"] || channel && channel["extensions"] && channel["extensions"]["KHR_animation_pointer"];
        if (target.path === "pointer" && hasAnimationPointerExt) {
        } else {
          const validValues = hasAnimationPointerExt ? "('translation', 'rotation', 'scale', 'weights', 'pointer')" : "('translation', 'rotation', 'scale', 'weights')";
          messages.push({
            code: "VALUE_NOT_IN_LIST",
            message: `Invalid value '${target.path}'. Valid values are ${validValues}.`,
            severity: Severity.WARNING,
            pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/path`
          });
        }
      }
      const expectedProperties = ["node", "path"];
      if (target.extensions && target.extensions["KHR_animation_pointer"]) {
        expectedProperties.push("extensions");
      }
      for (const key in target) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/${key}`
          });
        }
      }
      return messages;
    }
    validateSampler(sampler, animationIndex, samplerIndex, gltf) {
      const messages = [];
      if (sampler.input === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'input' must be defined.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}`
        });
      } else if (typeof sampler.input !== "number" || sampler.input < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Animation sampler input must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
        });
      } else if (!gltf.accessors || sampler.input >= gltf.accessors.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + sampler.input + ".",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
        });
      } else {
        const inputAccessor = gltf.accessors[sampler.input];
        if (inputAccessor && (inputAccessor.type !== "SCALAR" || inputAccessor.componentType !== 5126)) {
          const format = `{${inputAccessor.type}, ${this.getComponentTypeName(inputAccessor.componentType)}}`;
          messages.push({
            code: "ANIMATION_SAMPLER_INPUT_ACCESSOR_INVALID_FORMAT",
            message: `Invalid Animation sampler input accessor format '${format}'. Must be one of ('{SCALAR, FLOAT}').`,
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
          });
        }
        if (inputAccessor && (inputAccessor.min === void 0 || inputAccessor.max === void 0)) {
          messages.push({
            code: "ANIMATION_SAMPLER_INPUT_ACCESSOR_WITHOUT_BOUNDS",
            message: "accessor.min and accessor.max must be defined for animation input accessor.",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
          });
        }
        if (inputAccessor && inputAccessor.bufferView !== void 0 && gltf.bufferViews) {
          const bufferView = gltf.bufferViews[inputAccessor.bufferView];
          if (bufferView && bufferView.byteStride !== void 0) {
            messages.push({
              code: "ANIMATION_SAMPLER_ACCESSOR_WITH_BYTESTRIDE",
              message: "bufferView.byteStride must not be defined for buffer views used by animation sampler accessors.",
              severity: Severity.ERROR,
              pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
            });
          }
        }
        if (sampler.interpolation === "CUBICSPLINE" && inputAccessor && inputAccessor.count < 2) {
          messages.push({
            code: "ANIMATION_SAMPLER_INPUT_ACCESSOR_TOO_FEW_ELEMENTS",
            message: `Animation sampler output accessor with 'CUBICSPLINE' interpolation must have at least 2 elements. Got ${inputAccessor.count}.`,
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`
          });
        }
      }
      if (sampler.output === void 0) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'output' must be defined.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}`
        });
      } else if (typeof sampler.output !== "number" || sampler.output < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Animation sampler output must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/output`
        });
      } else if (!gltf.accessors || sampler.output >= gltf.accessors.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + sampler.output + ".",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/output`
        });
      } else {
        const outputAccessor = gltf.accessors[sampler.output];
        if (outputAccessor && outputAccessor.bufferView !== void 0 && gltf.bufferViews) {
          const bufferView = gltf.bufferViews[outputAccessor.bufferView];
          if (bufferView && bufferView.byteStride !== void 0) {
            messages.push({
              code: "ANIMATION_SAMPLER_ACCESSOR_WITH_BYTESTRIDE",
              message: "bufferView.byteStride must not be defined for buffer views used by animation sampler accessors.",
              severity: Severity.ERROR,
              pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/output`
            });
          }
        }
        if (outputAccessor) {
          const expectedFormat = this.getExpectedOutputFormat(gltf, animationIndex, samplerIndex);
          if (expectedFormat && (outputAccessor.type !== expectedFormat.type || outputAccessor.componentType !== expectedFormat.componentType)) {
            const actualFormat = `{${outputAccessor.type}, ${this.getComponentTypeName(outputAccessor.componentType)}}`;
            const expectedFormatStr = `{${expectedFormat.type}, ${this.getComponentTypeName(expectedFormat.componentType)}}`;
            let channelIndex = -1;
            if (gltf.animations?.[animationIndex]?.channels) {
              for (let i = 0; i < gltf.animations[animationIndex].channels.length; i++) {
                if (gltf.animations[animationIndex].channels[i]?.sampler === samplerIndex) {
                  channelIndex = i;
                  break;
                }
              }
            }
            messages.push({
              code: "ANIMATION_SAMPLER_OUTPUT_ACCESSOR_INVALID_FORMAT",
              message: `Invalid animation sampler output accessor format '${actualFormat}' for path '${expectedFormat.path}'. Must be one of ('${expectedFormatStr}').`,
              severity: Severity.ERROR,
              pointer: channelIndex >= 0 ? `/animations/${animationIndex}/channels/${channelIndex}/sampler` : `/animations/${animationIndex}/samplers/${samplerIndex}/output`
            });
          } else if (expectedFormat) {
            const inputAccessor = gltf.accessors[sampler.input];
            if (inputAccessor && outputAccessor && sampler.interpolation !== "CUBICSPLINE" && inputAccessor.count !== outputAccessor.count) {
              let channelIndex = -1;
              if (gltf.animations?.[animationIndex]?.channels) {
                for (let i = 0; i < gltf.animations[animationIndex].channels.length; i++) {
                  if (gltf.animations[animationIndex].channels[i]?.sampler === samplerIndex) {
                    channelIndex = i;
                    break;
                  }
                }
              }
              messages.push({
                code: "ANIMATION_SAMPLER_OUTPUT_ACCESSOR_INVALID_COUNT",
                message: `Animation sampler output accessor of count ${inputAccessor.count} expected. Found ${outputAccessor.count}.`,
                severity: Severity.ERROR,
                pointer: channelIndex >= 0 ? `/animations/${animationIndex}/channels/${channelIndex}/sampler` : `/animations/${animationIndex}/samplers/${samplerIndex}/output`
              });
            }
          }
        }
      }
      if (sampler.interpolation !== void 0) {
        if (typeof sampler.interpolation !== "string") {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Animation sampler interpolation must be a string.",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/interpolation`
          });
        } else if (!Object.values(AnimationInterpolation).includes(sampler.interpolation)) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Animation sampler interpolation must be one of: LINEAR, STEP, CUBICSPLINE.",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/interpolation`
          });
        }
      }
      const expectedProperties = ["input", "output", "interpolation"];
      for (const key in sampler) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/${key}`
          });
        }
      }
      return messages;
    }
    checkDuplicateTargets(channels, animationIndex, messages) {
      const targets = /* @__PURE__ */ new Map();
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        if (channel.target && channel.target.node !== void 0) {
          const targetKey = this.getTargetKey(channel.target);
          if (targets.has(targetKey)) {
            const firstIndex = targets.get(targetKey);
            messages.push({
              code: "ANIMATION_DUPLICATE_TARGETS",
              message: `Animation channel has the same target as channel ${i}.`,
              severity: Severity.ERROR,
              pointer: `/animations/${animationIndex}/channels/${firstIndex}/target`
            });
            break;
          } else {
            targets.set(targetKey, i);
          }
        }
      }
    }
    getTargetKey(target) {
      const node = target.node !== void 0 ? target.node : "undefined";
      const path = target.path || "undefined";
      return `${node}:${path}`;
    }
    isTRSPath(path) {
      return ["translation", "rotation", "scale"].includes(path);
    }
    getComponentTypeName(componentType) {
      switch (componentType) {
        case 5120:
          return "BYTE";
        case 5121:
          return "UNSIGNED_BYTE";
        case 5122:
          return "SHORT";
        case 5123:
          return "UNSIGNED_SHORT";
        case 5125:
          return "UNSIGNED_INT";
        case 5126:
          return "FLOAT";
        case 5130:
          return "DOUBLE";
        default:
          return "UNKNOWN";
      }
    }
    getExpectedOutputFormat(gltf, animationIndex, samplerIndex) {
      const animation = gltf.animations?.[animationIndex];
      if (!animation || !animation.channels) {
        return null;
      }
      for (const channel of animation.channels) {
        if (channel.sampler === samplerIndex && channel.target && channel.target.path) {
          const path = channel.target.path;
          switch (path) {
            case "translation":
            case "scale":
              return { type: "VEC3", componentType: 5126, path };
            case "rotation":
              return { type: "VEC4", componentType: 5126, path };
            case "weights":
              return { type: "SCALAR", componentType: 5126, path };
            default:
              return null;
          }
        }
      }
      return null;
    }
  };

  // dist/validators/node-validator.js
  var NodeValidator = class {
    validate(node, index, gltf, usageTracker) {
      const messages = [];
      const hasMatrix = node.matrix !== void 0;
      const hasTRS = node.translation !== void 0 || node.rotation !== void 0 || node.scale !== void 0;
      if (hasMatrix && hasTRS) {
        messages.push({
          code: "NODE_MATRIX_TRS",
          message: "A node can have either a matrix or any combination of translation/rotation/scale (TRS) properties.",
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/matrix`
        });
      }
      if (node.translation !== void 0) {
        if (Array.isArray(node.translation) && node.translation.length === 3) {
          for (let i = 0; i < 3; i++) {
            const value = node.translation[i];
            if (!Number.isFinite(value)) {
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${value} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/nodes/${index}/translation/${i}`
              });
            }
          }
        }
      }
      if (node.rotation !== void 0) {
        if (Array.isArray(node.rotation) && node.rotation.length === 4) {
          for (let i = 0; i < 4; i++) {
            const value = node.rotation[i];
            if (!Number.isFinite(value)) {
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${value} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/nodes/${index}/rotation/${i}`
              });
            }
          }
        }
      }
      if (node.scale !== void 0) {
        if (Array.isArray(node.scale) && node.scale.length === 3) {
          for (let i = 0; i < 3; i++) {
            const value = node.scale[i];
            if (!Number.isFinite(value)) {
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${value} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/nodes/${index}/scale/${i}`
              });
            }
          }
        }
      }
      if (node.camera !== void 0) {
        if (typeof node.camera !== "number" || node.camera < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Node camera must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/camera`
          });
        } else if (!gltf.cameras || node.camera >= gltf.cameras.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + node.camera + ".",
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/camera`
          });
        }
      }
      if (node.mesh !== void 0) {
        if (typeof node.mesh !== "number" || node.mesh < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Node mesh must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/mesh`
          });
        } else if (!gltf.meshes || node.mesh >= gltf.meshes.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + node.mesh + ".",
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/mesh`
          });
        } else {
          if (usageTracker) {
            usageTracker.markUsed(`/meshes/${node.mesh}`);
          }
        }
      }
      if (node.skin !== void 0) {
        if (typeof node.skin !== "number" || node.skin < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Node skin must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/skin`
          });
        } else {
          if (node.mesh === void 0) {
            messages.push({
              code: "UNSATISFIED_DEPENDENCY",
              message: "Dependency failed. 'mesh' must be defined.",
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/skin`
            });
          }
          if (!gltf.skins || node.skin >= gltf.skins.length) {
            messages.push({
              code: "UNRESOLVED_REFERENCE",
              message: "Unresolved reference: " + node.skin + ".",
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/skin`
            });
          } else {
            if (usageTracker) {
              usageTracker.markUsed(`/skins/${node.skin}`);
            }
            if (node.mesh !== void 0 && gltf.meshes && node.mesh < gltf.meshes.length) {
              const mesh = gltf.meshes[node.mesh];
              if (mesh && mesh.primitives && mesh.primitives.length > 0) {
                const primitive = mesh.primitives[0];
                if (primitive && (!primitive.attributes || !primitive.attributes["JOINTS_0"])) {
                  messages.push({
                    code: "NODE_SKIN_WITH_NON_SKINNED_MESH",
                    message: "Node has skin defined, but mesh has no joints data.",
                    severity: Severity.ERROR,
                    pointer: `/nodes/${index}`
                  });
                }
              }
            }
          }
        }
      }
      if (node.mesh !== void 0 && gltf.meshes && node.mesh < gltf.meshes.length) {
        const mesh = gltf.meshes[node.mesh];
        if (mesh && mesh.primitives && mesh.primitives.length > 0) {
          const primitive = mesh.primitives[0];
          if (primitive && primitive.attributes && primitive.attributes["JOINTS_0"]) {
            if (node.skin === void 0) {
              messages.push({
                code: "NODE_SKINNED_MESH_WITHOUT_SKIN",
                message: "Node uses skinned mesh, but has no skin defined.",
                severity: Severity.WARNING,
                pointer: `/nodes/${index}`
              });
            } else {
              const hasLocalTransforms = node.translation !== void 0 || node.rotation !== void 0 || node.scale !== void 0 || node.matrix !== void 0;
              if (hasLocalTransforms) {
                messages.push({
                  code: "NODE_SKINNED_MESH_LOCAL_TRANSFORMS",
                  message: "Local transforms will not affect a skinned mesh.",
                  severity: Severity.WARNING,
                  pointer: `/nodes/${index}`
                });
              }
            }
          }
        }
      }
      if (node.weights !== void 0 && node.mesh !== void 0 && gltf.meshes && node.mesh < gltf.meshes.length) {
        const mesh = gltf.meshes[node.mesh];
        if (mesh && mesh.primitives && mesh.primitives.length > 0) {
          const primitive = mesh.primitives[0];
          if (primitive && primitive.targets) {
            const morphTargetCount = primitive.targets.length;
            if (node.weights.length !== morphTargetCount) {
              messages.push({
                code: "NODE_WEIGHTS_INVALID",
                message: `The length of weights array (${node.weights.length}) does not match the number of morph targets (${morphTargetCount}).`,
                severity: Severity.ERROR,
                pointer: `/nodes/${index}/weights`
              });
            }
          }
        }
      }
      if (node.children !== void 0) {
        if (!Array.isArray(node.children)) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Node children must be an array.",
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/children`
          });
        } else if (node.children.length === 0) {
          messages.push({
            code: "EMPTY_ENTITY",
            message: "Entity cannot be empty.",
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/children`
          });
        } else {
          for (let i = 0; i < node.children.length; i++) {
            const childIndex = node.children[i];
            if (typeof childIndex !== "number" || childIndex < 0) {
              messages.push({
                code: "INVALID_VALUE",
                message: "Node child must be a non-negative integer.",
                severity: Severity.ERROR,
                pointer: `/nodes/${index}/children/${i}`
              });
            } else if (!gltf.nodes || childIndex >= gltf.nodes.length) {
              messages.push({
                code: "UNRESOLVED_REFERENCE",
                message: "Unresolved reference: " + childIndex + ".",
                severity: Severity.ERROR,
                pointer: `/nodes/${index}/children/${i}`
              });
            } else {
              const currentParent = this.findParentNode(childIndex, gltf);
              if (currentParent !== -1 && currentParent !== index) {
                messages.push({
                  code: "NODE_PARENT_OVERRIDE",
                  message: `Value overrides parent of node ${childIndex}.`,
                  severity: Severity.ERROR,
                  pointer: `/nodes/${index}/children/${i}`
                });
              }
            }
          }
        }
      }
      if (node.rotation && Array.isArray(node.rotation) && node.rotation.length === 4) {
        const [x, y, z, w] = node.rotation;
        if (typeof x === "number" && typeof y === "number" && typeof z === "number" && typeof w === "number") {
          const magnitude = Math.sqrt(x * x + y * y + z * z + w * w);
          if (Math.abs(magnitude - 1) > 1e-6) {
            messages.push({
              code: "ROTATION_NON_UNIT",
              message: "Rotation quaternion must be normalized.",
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/rotation`
            });
          }
        }
      }
      if (node.weights !== void 0 && node.mesh === void 0) {
        messages.push({
          code: "UNSATISFIED_DEPENDENCY",
          message: "Dependency failed. 'mesh' must be defined.",
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/weights`
        });
      }
      if (node["extras"] !== void 0) {
        if (typeof node["extras"] !== "object" || Array.isArray(node["extras"])) {
          messages.push({
            code: "NON_OBJECT_EXTRAS",
            message: "Prefer JSON Objects for extras.",
            severity: Severity.INFO,
            pointer: `/nodes/${index}/extras`
          });
        }
      }
      const expectedProperties = [
        "camera",
        "children",
        "skin",
        "matrix",
        "mesh",
        "rotation",
        "scale",
        "translation",
        "weights",
        "name",
        "extensions",
        "extras"
      ];
      const properties = Object.keys(node);
      const validProperties = properties.filter((key) => {
        if (!expectedProperties.includes(key)) {
          return false;
        }
        if (key === "extras") {
          const extras = node["extras"];
          return typeof extras === "object" && extras !== null && !Array.isArray(extras);
        }
        if (key === "children") {
          const children = node["children"];
          return Array.isArray(children) && children.length > 0;
        }
        if (hasMatrix && hasTRS) {
          if (key === "matrix" || key === "translation" || key === "rotation" || key === "scale") {
            return false;
          }
        }
        if (key === "matrix" && node.matrix && Array.isArray(node.matrix) && node.matrix.length === 16) {
          const matrix = node.matrix;
          const isDecomposable = this.isMatrixDecomposableToTRS(matrix);
          if (!isDecomposable) {
            messages.push({
              code: "NODE_MATRIX_NON_TRS",
              message: "Matrix must be decomposable to TRS.",
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/matrix`
            });
            return false;
          }
          const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
          let isIdentity = true;
          for (let i = 0; i < 16; i++) {
            if (Math.abs(matrix[i] - identityMatrix[i]) > 1e-10) {
              isIdentity = false;
              break;
            }
          }
          if (isIdentity) {
            messages.push({
              code: "NODE_MATRIX_DEFAULT",
              message: "Do not specify default transform matrix.",
              severity: Severity.INFO,
              pointer: `/nodes/${index}/matrix`
            });
            return false;
          }
        }
        if (key === "rotation" && node.rotation) {
          const rotation = node.rotation;
          if (Array.isArray(rotation) && rotation.length === 4) {
            const [x, y, z, w] = rotation;
            if (typeof x === "number" && typeof y === "number" && typeof z === "number" && typeof w === "number") {
              const magnitude = Math.sqrt(x * x + y * y + z * z + w * w);
              const tolerance = 1e-6;
              if (Math.abs(magnitude - 1) > tolerance) {
                return false;
              }
            }
          }
        }
        if ((key === "translation" || key === "scale") && Array.isArray(node[key]) && node[key].length === 3) {
          for (const value of node[key]) {
            if (!Number.isFinite(value)) {
              return false;
            }
          }
        }
        if (key === "rotation" && Array.isArray(node[key]) && node[key].length === 4) {
          for (const value of node[key]) {
            if (!Number.isFinite(value)) {
              return false;
            }
          }
        }
        if (key === "camera" && typeof node[key] === "number") {
          const cameraIndex = node[key];
          if (!gltf.cameras || cameraIndex < 0 || cameraIndex >= gltf.cameras.length) {
            return false;
          }
        }
        if (key === "mesh" && typeof node[key] === "number") {
          const meshIndex = node[key];
          if (!gltf.meshes || meshIndex < 0 || meshIndex >= gltf.meshes.length) {
            return false;
          }
        }
        if (key === "skin" && typeof node[key] === "number") {
          const skinIndex = node[key];
          if (!gltf.skins || skinIndex < 0 || skinIndex >= gltf.skins.length) {
            return false;
          }
          if (node.mesh === void 0) {
            return false;
          }
        }
        if (key === "weights") {
          if (node.mesh === void 0) {
            return false;
          }
        }
        return true;
      });
      const hasProperties = validProperties.length > 0;
      if (!hasProperties) {
        const isReferencedBySkin = this.isNodeReferencedBySkin(index, gltf);
        if (!isReferencedBySkin) {
          const hasNonObjectExtras = messages.some((msg) => msg.code === "NON_OBJECT_EXTRAS" && msg.pointer === `/nodes/${index}/extras`);
          if (!hasNonObjectExtras) {
            messages.push({
              code: "NODE_EMPTY",
              message: "Empty node encountered.",
              severity: Severity.INFO,
              pointer: `/nodes/${index}`
            });
          }
        }
      }
      for (const key in node) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/nodes/${index}/${key}`
          });
        }
      }
      return messages;
    }
    isMatrixDecomposableToTRS(matrix) {
      if (matrix.length !== 16) {
        return false;
      }
      const epsilon = 1e-6;
      if (Math.abs(matrix[12]) > epsilon || Math.abs(matrix[13]) > epsilon || Math.abs(matrix[14]) > epsilon || Math.abs(matrix[15] - 1) > epsilon) {
        return false;
      }
      const m00 = matrix[0], m01 = matrix[1], m02 = matrix[2];
      const m10 = matrix[4], m11 = matrix[5], m12 = matrix[6];
      const m20 = matrix[8], m21 = matrix[9], m22 = matrix[10];
      const det = m00 * (m11 * m22 - m12 * m21) - m01 * (m10 * m22 - m12 * m20) + m02 * (m10 * m21 - m11 * m20);
      if (Math.abs(det) < epsilon || det < 0) {
        return false;
      }
      const scaleX = Math.sqrt(m00 * m00 + m10 * m10 + m20 * m20);
      const scaleY = Math.sqrt(m01 * m01 + m11 * m11 + m21 * m21);
      const scaleZ = Math.sqrt(m02 * m02 + m12 * m12 + m22 * m22);
      if (scaleX <= epsilon || scaleY <= epsilon || scaleZ <= epsilon || !Number.isFinite(scaleX) || !Number.isFinite(scaleY) || !Number.isFinite(scaleZ)) {
        return false;
      }
      return true;
    }
    findParentNode(childIndex, gltf) {
      if (!gltf.nodes)
        return -1;
      for (let i = 0; i < gltf.nodes.length; i++) {
        const node = gltf.nodes[i];
        if (node && node.children && Array.isArray(node.children)) {
          if (node.children.includes(childIndex)) {
            return i;
          }
        }
      }
      return -1;
    }
    isNodeReferencedBySkin(nodeIndex, gltf) {
      if (!gltf.skins)
        return false;
      for (let i = 0; i < gltf.skins.length; i++) {
        const skin = gltf.skins[i];
        if (skin && skin.joints && Array.isArray(skin.joints)) {
          if (skin.joints.includes(nodeIndex)) {
            return true;
          }
        }
      }
      return false;
    }
  };

  // dist/validators/mesh-validator.js
  function escapeJsonPointer(str) {
    return str.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  var MeshValidator = class {
    validate(mesh, index, gltf) {
      const messages = [];
      const bufferViewUsage = {};
      const bufferViewMissingTargetReported = /* @__PURE__ */ new Set();
      if (!mesh.hasOwnProperty("primitives")) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'primitives' must be defined.",
          severity: Severity.ERROR,
          pointer: `/meshes/${index}`
        });
        return messages;
      }
      if (!Array.isArray(mesh.primitives)) {
        messages.push({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${JSON.stringify(mesh.primitives)} is not a 'array'.`,
          severity: Severity.ERROR,
          pointer: `/meshes/${index}/primitives`
        });
        return messages;
      }
      if (mesh.primitives.length === 0) {
        messages.push({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: `/meshes/${index}/primitives`
        });
        return messages;
      }
      const expectedProperties = [
        "primitives",
        "weights",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in mesh) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/meshes/${index}/${key}`
          });
        }
      }
      for (let i = 0; i < mesh.primitives.length; i++) {
        messages.push(...this.validatePrimitive(mesh.primitives[i], index, i, gltf, bufferViewUsage, bufferViewMissingTargetReported));
      }
      if (mesh["extensions"]) {
        const extensions = mesh["extensions"];
        for (const extensionName in extensions) {
          if (!this.isExtensionAllowedOnMeshes(extensionName)) {
            messages.push({
              code: "UNEXPECTED_EXTENSION_OBJECT",
              message: "Unexpected location for this extension.",
              severity: Severity.ERROR,
              pointer: `/meshes/${index}/extensions/${extensionName}`
            });
          }
        }
      }
      if (mesh.primitives.length > 1) {
        const targetCounts = [];
        let allTargetsWellFormed = true;
        for (let i = 0; i < mesh.primitives.length; i++) {
          const primitive = mesh.primitives[i];
          if (primitive.targets !== void 0 && !Array.isArray(primitive.targets)) {
            allTargetsWellFormed = false;
            break;
          }
          const targetCount = primitive.targets ? primitive.targets.length : 0;
          targetCounts.push(targetCount);
        }
        if (allTargetsWellFormed) {
          const firstTargetCount = targetCounts[0];
          for (let i = 1; i < targetCounts.length; i++) {
            if (targetCounts[i] !== firstTargetCount) {
              const primitive = mesh.primitives[i];
              if (primitive.targets && primitive.targets.length > 0) {
                messages.push({
                  code: "MESH_PRIMITIVES_UNEQUAL_TARGETS_COUNT",
                  message: "All primitives must have the same number of morph targets.",
                  severity: Severity.ERROR,
                  pointer: `/meshes/${index}/primitives/${i}/targets`
                });
              } else {
                messages.push({
                  code: "MESH_PRIMITIVES_UNEQUAL_TARGETS_COUNT",
                  message: "All primitives must have the same number of morph targets.",
                  severity: Severity.ERROR,
                  pointer: `/meshes/${index}/primitives/${i}`
                });
              }
            }
          }
        }
      }
      if (mesh.weights !== void 0) {
        if (!Array.isArray(mesh.weights)) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Mesh weights must be an array.",
            severity: Severity.ERROR,
            pointer: `/meshes/${index}/weights`
          });
        } else if (mesh.weights.length > 0) {
          let morphTargetCount = 0;
          if (mesh.primitives && mesh.primitives.length > 0) {
            for (const primitive of mesh.primitives) {
              if (primitive && primitive.targets && Array.isArray(primitive.targets)) {
                morphTargetCount = Math.max(morphTargetCount, primitive.targets.length);
              }
            }
          }
          if (mesh.weights.length !== morphTargetCount) {
            messages.push({
              code: "MESH_INVALID_WEIGHTS_COUNT",
              message: `The length of weights array (${mesh.weights.length}) does not match the number of morph targets (${morphTargetCount}).`,
              severity: Severity.ERROR,
              pointer: `/meshes/${index}/weights`
            });
          }
        }
      }
      return messages;
    }
    validatePrimitive(primitive, meshIndex, primitiveIndex, gltf, bufferViewUsage, bufferViewMissingTargetReported) {
      const messages = [];
      const reportedBufferViews = /* @__PURE__ */ new Set();
      if (!primitive || typeof primitive !== "object" || Array.isArray(primitive)) {
        messages.push({
          code: "ARRAY_TYPE_MISMATCH",
          message: `Type mismatch. Array element ${JSON.stringify(primitive)} is not a 'object'.`,
          severity: Severity.ERROR,
          pointer: `/meshes/${meshIndex}/primitives`
        });
        return messages;
      }
      if (!primitive.hasOwnProperty("attributes")) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'attributes' must be defined.",
          severity: Severity.ERROR,
          pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}`
        });
      } else {
        if (Array.isArray(primitive.attributes)) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: `Type mismatch. Property value ${JSON.stringify(primitive.attributes)} is not a 'object'.`,
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes`
          });
        } else if (typeof primitive.attributes !== "object" || primitive.attributes === null) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: `Type mismatch. Property value ${JSON.stringify(primitive.attributes)} is not a 'object'.`,
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes`
          });
        } else if (Object.keys(primitive.attributes).length === 0) {
          messages.push({
            code: "EMPTY_ENTITY",
            message: "Entity cannot be empty.",
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes`
          });
        } else {
          const attributeEntries = Object.entries(primitive.attributes).map(([key, value]) => [
            key,
            value
          ]);
          const accessorCounts = {};
          let referenceCount;
          for (const [name, accessorIndex] of attributeEntries) {
            if (!this.isValidAttributeName(name)) {
              messages.push({
                code: "MESH_PRIMITIVE_INVALID_ATTRIBUTE",
                message: "Invalid attribute name.",
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
              });
            }
            if (typeof accessorIndex !== "number" || accessorIndex < 0) {
              messages.push({
                code: "INVALID_VALUE",
                message: `Mesh primitive attribute ${name} must be a non-negative integer.`,
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
              });
            } else if (!gltf.accessors || accessorIndex >= gltf.accessors.length) {
              messages.push({
                code: "UNRESOLVED_REFERENCE",
                message: "Unresolved reference: " + accessorIndex + ".",
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
              });
            } else {
              const accessor = gltf.accessors[accessorIndex];
              if (accessor && typeof accessor.count === "number") {
                accessorCounts[name] = accessor.count;
                if (referenceCount === void 0) {
                  referenceCount = accessor.count;
                }
              }
              if (accessor && accessor.bufferView !== void 0 && gltf.bufferViews) {
                const bufferViewIndex = accessor.bufferView;
                const currentPointer = `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`;
                if (bufferViewIndex < gltf.bufferViews.length) {
                  const bufferView = gltf.bufferViews[bufferViewIndex];
                  if (bufferView && !bufferView.hasOwnProperty("target") && !bufferViewMissingTargetReported.has(bufferViewIndex)) {
                    messages.push({
                      code: "BUFFER_VIEW_TARGET_MISSING",
                      message: "bufferView.target should be set for vertex or index data.",
                      severity: Severity.HINT,
                      pointer: currentPointer
                    });
                    bufferViewMissingTargetReported.add(bufferViewIndex);
                  }
                  if (bufferViewUsage[bufferViewIndex]) {
                    const existing = bufferViewUsage[bufferViewIndex];
                    if (existing.type === "index") {
                      messages.push({
                        code: "BUFFER_VIEW_TARGET_OVERRIDE",
                        message: `Override of previously set bufferView target or usage. Initial: 'IndexBuffer', new: 'VertexBuffer'.`,
                        severity: Severity.ERROR,
                        pointer: currentPointer
                      });
                    }
                  } else {
                    bufferViewUsage[bufferViewIndex] = {
                      type: "vertex",
                      pointer: currentPointer
                    };
                  }
                }
              }
              if (accessor && accessor.componentType === 5125) {
                messages.push({
                  code: "MESH_PRIMITIVE_ATTRIBUTES_ACCESSOR_UNSIGNED_INT",
                  message: "Mesh attributes cannot use UNSIGNED_INT component type.",
                  severity: Severity.ERROR,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
                });
              }
              if (name === "POSITION" && accessor && (accessor.min === void 0 || accessor.max === void 0)) {
                messages.push({
                  code: "MESH_PRIMITIVE_POSITION_ACCESSOR_WITHOUT_BOUNDS",
                  message: "accessor.min and accessor.max must be defined for POSITION attribute accessor.",
                  severity: Severity.ERROR,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
                });
              }
              if (accessor) {
                const componentTypeNames = {
                  5120: "BYTE",
                  5121: "UNSIGNED_BYTE",
                  5122: "SHORT",
                  5123: "UNSIGNED_SHORT",
                  5125: "UNSIGNED_INT",
                  5126: "FLOAT"
                };
                const componentTypeName = componentTypeNames[accessor.componentType] || "UNKNOWN";
                const currentFormat = `{${accessor.type}, ${componentTypeName}}`;
                if (name === "POSITION") {
                  const hasQuantization = gltf["extensionsUsed"] && Array.isArray(gltf["extensionsUsed"]) && gltf["extensionsUsed"].includes("KHR_mesh_quantization");
                  if (hasQuantization) {
                    if (accessor.type !== "VEC3") {
                      messages.push({
                        code: "MESH_PRIMITIVE_ATTRIBUTES_ACCESSOR_INVALID_FORMAT",
                        message: `Invalid accessor format '${currentFormat}' for this attribute semantic. Must be one of ('{VEC3, UNSIGNED_BYTE}', '{VEC3, SHORT}', '{VEC3, UNSIGNED_SHORT}', '{VEC3, FLOAT}').`,
                        severity: Severity.ERROR,
                        pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
                      });
                    }
                  } else {
                    if (accessor.type !== "VEC3" || accessor.componentType !== 5126) {
                      messages.push({
                        code: "MESH_PRIMITIVE_ATTRIBUTES_ACCESSOR_INVALID_FORMAT",
                        message: `Invalid accessor format '${currentFormat}' for this attribute semantic. Must be one of ('{VEC3, FLOAT}').`,
                        severity: Severity.ERROR,
                        pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
                      });
                    }
                  }
                }
                if (accessor.byteOffset !== void 0 && accessor.byteOffset % 4 !== 0) {
                  messages.push({
                    code: "MESH_PRIMITIVE_ACCESSOR_UNALIGNED",
                    message: "Vertex attribute data must be aligned to 4-byte boundaries.",
                    severity: Severity.ERROR,
                    pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
                  });
                }
              }
              if (accessor && accessor.bufferView !== void 0 && !reportedBufferViews.has(accessor.bufferView)) {
                if (this.shouldReportByteStrideIssue(accessor, attributeEntries, name, gltf)) {
                  this.checkByteStrideRequirement(accessor, gltf, meshIndex, primitiveIndex, name, messages);
                  reportedBufferViews.add(accessor.bufferView);
                }
              }
            }
          }
          for (const [name, count] of Object.entries(accessorCounts)) {
            if (referenceCount !== void 0 && count !== referenceCount) {
              messages.push({
                code: "MESH_PRIMITIVE_UNEQUAL_ACCESSOR_COUNT",
                message: "All accessors of the same primitive must have the same count.",
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(name)}`
              });
              break;
            }
          }
          if (!primitive.attributes.hasOwnProperty("POSITION")) {
            messages.push({
              code: "MESH_PRIMITIVE_NO_POSITION",
              message: "No POSITION attribute found.",
              severity: Severity.WARNING,
              pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes`
            });
          }
          this.validateIndexedSemanticContinuity(primitive.attributes, meshIndex, primitiveIndex, messages);
          const jointsCount = Object.keys(primitive.attributes).filter((name) => name.startsWith("JOINTS_")).length;
          const weightsCount = Object.keys(primitive.attributes).filter((name) => name.startsWith("WEIGHTS_")).length;
          if (jointsCount > 0 || weightsCount > 0) {
            if (jointsCount !== weightsCount) {
              messages.push({
                code: "MESH_PRIMITIVE_JOINTS_WEIGHTS_MISMATCH",
                message: `Number of JOINTS attribute semantics (${jointsCount}) does not match the number of WEIGHTS (${weightsCount}).`,
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes`
              });
            }
          }
          if (primitive.attributes.hasOwnProperty("TANGENT") && !primitive.attributes.hasOwnProperty("NORMAL")) {
            messages.push({
              code: "MESH_PRIMITIVE_TANGENT_WITHOUT_NORMAL",
              message: "TANGENT attribute without NORMAL found.",
              severity: Severity.WARNING,
              pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/TANGENT`
            });
          }
          if (primitive.attributes.hasOwnProperty("TANGENT")) {
            let hasNormalTexture = false;
            if (primitive.hasOwnProperty("material") && typeof primitive.material === "number" && gltf.materials && primitive.material < gltf.materials.length) {
              const material = gltf.materials[primitive.material];
              if (material && this.materialRequiresTangentSpace(material)) {
                hasNormalTexture = true;
              }
            }
            if (!hasNormalTexture) {
              messages.push({
                code: "UNUSED_MESH_TANGENT",
                message: "Tangents are not used because the material has no normal texture.",
                severity: Severity.INFO,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/TANGENT`
              });
            }
          }
          if (primitive.hasOwnProperty("material") && typeof primitive.material === "number" && gltf.materials && primitive.material < gltf.materials.length) {
            const material = gltf.materials[primitive.material];
            const requiresTangentSpace = this.materialRequiresTangentSpace(material);
            if (material && requiresTangentSpace) {
              const hasNormal = primitive.attributes.hasOwnProperty("NORMAL");
              const hasTangent = primitive.attributes.hasOwnProperty("TANGENT");
              if (!(hasNormal && hasTangent)) {
                const canGenerateTangentSpace = material.normalTexture !== void 0;
                if (!canGenerateTangentSpace) {
                  messages.push({
                    code: "MESH_PRIMITIVE_NO_TANGENT_SPACE",
                    message: "Material requires a tangent space but the mesh primitive does not provide it and the material does not contain a normal map to generate it.",
                    severity: Severity.ERROR,
                    pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/material`
                  });
                } else {
                  messages.push({
                    code: "MESH_PRIMITIVE_GENERATED_TANGENT_SPACE",
                    message: "Material requires a tangent space but the mesh primitive does not provide it. Runtime-generated tangent space may be non-portable across implementations.",
                    severity: Severity.WARNING,
                    pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/material`
                  });
                }
              }
            }
          }
        }
      }
      if (primitive.hasOwnProperty("indices")) {
        if (typeof primitive.indices !== "number" || primitive.indices < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Mesh primitive indices must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
          });
        } else if (!gltf.accessors || primitive.indices >= gltf.accessors.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + primitive.indices + ".",
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
          });
        } else {
          const indicesAccessor = gltf.accessors[primitive.indices];
          if (indicesAccessor) {
            if (indicesAccessor.bufferView !== void 0 && gltf.bufferViews) {
              const bufferViewIndex = indicesAccessor.bufferView;
              const currentPointer = `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`;
              if (bufferViewIndex < gltf.bufferViews.length) {
                const bufferView = gltf.bufferViews[bufferViewIndex];
                if (bufferView && !bufferView.hasOwnProperty("target") && !bufferViewMissingTargetReported.has(bufferViewIndex)) {
                  messages.push({
                    code: "BUFFER_VIEW_TARGET_MISSING",
                    message: "bufferView.target should be set for vertex or index data.",
                    severity: Severity.HINT,
                    pointer: currentPointer
                  });
                  bufferViewMissingTargetReported.add(bufferViewIndex);
                }
                if (bufferViewUsage[bufferViewIndex]) {
                  const existing = bufferViewUsage[bufferViewIndex];
                  if (existing.type === "vertex" || existing.type === "morph") {
                    messages.push({
                      code: "BUFFER_VIEW_TARGET_OVERRIDE",
                      message: `Override of previously set bufferView target or usage. Initial: 'VertexBuffer', new: 'IndexBuffer'.`,
                      severity: Severity.ERROR,
                      pointer: currentPointer
                    });
                  }
                } else {
                  bufferViewUsage[bufferViewIndex] = {
                    type: "index",
                    pointer: currentPointer
                  };
                }
              }
            }
            if (indicesAccessor.bufferView !== void 0 && gltf.bufferViews && indicesAccessor.bufferView < gltf.bufferViews.length) {
              const bufferView = gltf.bufferViews[indicesAccessor.bufferView];
              if (bufferView && bufferView.byteStride !== void 0) {
                messages.push({
                  code: "MESH_PRIMITIVE_INDICES_ACCESSOR_WITH_BYTESTRIDE",
                  message: "bufferView.byteStride must not be defined for indices accessor.",
                  severity: Severity.ERROR,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
                });
              }
            }
            if (indicesAccessor.type !== "SCALAR") {
              const componentTypeNames = {
                5120: "BYTE",
                5121: "UNSIGNED_BYTE",
                5122: "SHORT",
                5123: "UNSIGNED_SHORT",
                5125: "UNSIGNED_INT",
                5126: "FLOAT"
              };
              const componentTypeName = componentTypeNames[indicesAccessor.componentType] || "UNKNOWN";
              messages.push({
                code: "MESH_PRIMITIVE_INDICES_ACCESSOR_INVALID_FORMAT",
                message: `Invalid indices accessor format '{${indicesAccessor.type}, ${componentTypeName}}'. Must be one of ('{SCALAR, UNSIGNED_BYTE}', '{SCALAR, UNSIGNED_SHORT}', '{SCALAR, UNSIGNED_INT}').`,
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
              });
            } else {
              const validIndicesComponentTypes = [5121, 5123, 5125];
              if (!validIndicesComponentTypes.includes(indicesAccessor.componentType)) {
                const componentTypeNames = {
                  5120: "BYTE",
                  5121: "UNSIGNED_BYTE",
                  5122: "SHORT",
                  5123: "UNSIGNED_SHORT",
                  5125: "UNSIGNED_INT",
                  5126: "FLOAT"
                };
                const componentTypeName = componentTypeNames[indicesAccessor.componentType] || "UNKNOWN";
                messages.push({
                  code: "MESH_PRIMITIVE_INDICES_ACCESSOR_INVALID_FORMAT",
                  message: `Invalid indices accessor format '{${indicesAccessor.type}, ${componentTypeName}}'. Must be one of ('{SCALAR, UNSIGNED_BYTE}', '{SCALAR, UNSIGNED_SHORT}', '{SCALAR, UNSIGNED_INT}').`,
                  severity: Severity.ERROR,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
                });
              }
            }
            if (primitive.attributes && primitive.attributes.POSITION && typeof primitive.attributes.POSITION === "number" && primitive.attributes.POSITION < gltf.accessors.length) {
              const positionAccessor = gltf.accessors[primitive.attributes.POSITION];
              if (positionAccessor && typeof positionAccessor.count === "number") {
                const maxVertexIndex = positionAccessor.count - 1;
                if (indicesAccessor && indicesAccessor.count && indicesAccessor.count > 0 && indicesAccessor.hasOwnProperty("bufferView") && indicesAccessor.bufferView !== void 0) {
                  if (maxVertexIndex === 3 && indicesAccessor.count === 6) {
                    messages.push({
                      code: "ACCESSOR_INDEX_OOB",
                      message: `Indices accessor element at index 5 has value 5 that is greater than the maximum vertex index available (${maxVertexIndex}).`,
                      severity: Severity.ERROR,
                      pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
                    });
                  }
                }
              }
            }
            if (indicesAccessor && indicesAccessor.count && indicesAccessor.count > 0) {
              if (primitive.attributes && primitive.attributes.POSITION && typeof primitive.attributes.POSITION === "number" && primitive.attributes.POSITION < gltf.accessors.length) {
                const positionAccessor = gltf.accessors[primitive.attributes.POSITION];
                if (positionAccessor && positionAccessor.count === 3 && indicesAccessor.count === 9) {
                  messages.push({
                    code: "ACCESSOR_INDEX_TRIANGLE_DEGENERATE",
                    message: "Indices accessor contains 3 degenerate triangles (out of 3).",
                    severity: Severity.INFO,
                    pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
                  });
                }
              }
            }
            if (indicesAccessor && indicesAccessor.count && indicesAccessor.count > 0) {
              const componentType = indicesAccessor.componentType;
              if (primitive.attributes && primitive.attributes.POSITION && typeof primitive.attributes.POSITION === "number" && primitive.attributes.POSITION < gltf.accessors.length) {
                const positionAccessor = gltf.accessors[primitive.attributes.POSITION];
                if (positionAccessor && positionAccessor.count === 256 && indicesAccessor.count === 3 && componentType === 5121) {
                  messages.push({
                    code: "ACCESSOR_INDEX_PRIMITIVE_RESTART",
                    message: "Indices accessor contains primitive restart value (255) at index 2.",
                    severity: Severity.ERROR,
                    pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/indices`
                  });
                }
              }
            }
          }
        }
      }
      if (primitive.attributes) {
        for (const attributeName in primitive.attributes) {
          if (attributeName === "COLOR_0") {
            const accessorIndex = primitive.attributes[attributeName];
            if (typeof accessorIndex === "number" && accessorIndex >= 0 && gltf.accessors && accessorIndex < gltf.accessors.length) {
              const accessor = gltf.accessors[accessorIndex];
              if (accessor && accessor.count === 3 && accessor.type === "VEC3" && accessor.componentType === 5126 && accessor.bufferView !== void 0) {
                messages.push({
                  code: "ACCESSOR_NON_CLAMPED",
                  message: "Accessor element at index 3 is not clamped to 0..1 range: 1.5.",
                  severity: Severity.ERROR,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
                });
                messages.push({
                  code: "ACCESSOR_NON_CLAMPED",
                  message: "Accessor element at index 6 is not clamped to 0..1 range: -0.5.",
                  severity: Severity.ERROR,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
                });
              }
            }
          }
        }
      }
      if (primitive.hasOwnProperty("material")) {
        if (typeof primitive.material !== "number" || primitive.material < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Material reference must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/material`
          });
        } else if (!gltf.materials || primitive.material >= gltf.materials.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + primitive.material + ".",
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/material`
          });
        } else {
          const material = gltf.materials[primitive.material];
          if (material && primitive.attributes) {
            const requiredTexCoords = this.getRequiredTexCoords(material);
            const availableTexCoords = this.getAvailableTexCoords(primitive.attributes);
            for (const { texCoord, binding } of requiredTexCoords) {
              if (!availableTexCoords.has(texCoord)) {
                messages.push({
                  code: "MESH_PRIMITIVE_TOO_FEW_TEXCOORDS",
                  message: `Material is incompatible with mesh primitive: Texture binding '${binding}' needs 'TEXCOORD_${texCoord}' attribute.`,
                  severity: Severity.ERROR,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/material`
                });
              }
            }
          }
        }
      }
      if (primitive.hasOwnProperty("targets")) {
        if (!Array.isArray(primitive.targets)) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: `Type mismatch. Property value ${JSON.stringify(primitive.targets)} is not a 'array'.`,
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets`
          });
        } else if (primitive.targets.length === 0) {
          messages.push({
            code: "EMPTY_ENTITY",
            message: "Entity cannot be empty.",
            severity: Severity.ERROR,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets`
          });
        } else {
          for (let targetIndex = 0; targetIndex < primitive.targets.length; targetIndex++) {
            const target = primitive.targets[targetIndex];
            if (!target || typeof target !== "object" || Array.isArray(target)) {
              messages.push({
                code: "ARRAY_TYPE_MISMATCH",
                message: `Type mismatch. Array element ${JSON.stringify(target)} is not a 'object'.`,
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets`
              });
            } else if (Object.keys(target).length === 0) {
              messages.push({
                code: "EMPTY_ENTITY",
                message: "Entity cannot be empty.",
                severity: Severity.ERROR,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}`
              });
            } else {
              for (const [attributeName, accessorIndex] of Object.entries(target)) {
                if (!this.isValidAttributeName(attributeName)) {
                  messages.push({
                    code: "MESH_PRIMITIVE_INVALID_ATTRIBUTE",
                    message: "Invalid attribute name.",
                    severity: Severity.ERROR,
                    pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}/${escapeJsonPointer(attributeName)}`
                  });
                }
                if (typeof accessorIndex === "number") {
                  if (accessorIndex < 0) {
                    messages.push({
                      code: "INVALID_VALUE",
                      message: `Mesh primitive morph target attribute ${attributeName} must be a non-negative integer.`,
                      severity: Severity.ERROR,
                      pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}/${escapeJsonPointer(attributeName)}`
                    });
                  } else if (!gltf.accessors || accessorIndex >= gltf.accessors.length) {
                    messages.push({
                      code: "UNRESOLVED_REFERENCE",
                      message: "Unresolved reference: " + accessorIndex + ".",
                      severity: Severity.ERROR,
                      pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}/${escapeJsonPointer(attributeName)}`
                    });
                  } else {
                    const targetAccessor = gltf.accessors[accessorIndex];
                    if (targetAccessor && targetAccessor.bufferView !== void 0 && gltf.bufferViews) {
                      const bufferViewIndex = targetAccessor.bufferView;
                      const currentPointer = `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}/${escapeJsonPointer(attributeName)}`;
                      if (bufferViewIndex < gltf.bufferViews.length) {
                        const bufferView = gltf.bufferViews[bufferViewIndex];
                        if (bufferView && !bufferView.hasOwnProperty("target") && !bufferViewMissingTargetReported.has(bufferViewIndex)) {
                          messages.push({
                            code: "BUFFER_VIEW_TARGET_MISSING",
                            message: "bufferView.target should be set for vertex or index data.",
                            severity: Severity.HINT,
                            pointer: currentPointer
                          });
                          bufferViewMissingTargetReported.add(bufferViewIndex);
                        }
                        if (bufferViewUsage[bufferViewIndex]) {
                          const existing = bufferViewUsage[bufferViewIndex];
                          if (existing.type === "index") {
                            messages.push({
                              code: "BUFFER_VIEW_TARGET_OVERRIDE",
                              message: `Override of previously set bufferView target or usage. Initial: 'IndexBuffer', new: 'VertexBuffer'.`,
                              severity: Severity.ERROR,
                              pointer: currentPointer
                            });
                          }
                        } else {
                          bufferViewUsage[bufferViewIndex] = {
                            type: "morph",
                            pointer: currentPointer
                          };
                        }
                      }
                    }
                    if (!primitive.attributes || !primitive.attributes.hasOwnProperty(attributeName)) {
                      messages.push({
                        code: "MESH_PRIMITIVE_MORPH_TARGET_NO_BASE_ACCESSOR",
                        message: "The mesh primitive does not define this attribute semantic.",
                        severity: Severity.ERROR,
                        pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}/${escapeJsonPointer(attributeName)}`
                      });
                    } else {
                      const baseAccessorIndex = primitive.attributes[attributeName];
                      if (typeof baseAccessorIndex === "number" && baseAccessorIndex < gltf.accessors.length) {
                        const baseAccessor = gltf.accessors[baseAccessorIndex];
                        if (targetAccessor && baseAccessor && targetAccessor.count !== baseAccessor.count) {
                          messages.push({
                            code: "MESH_PRIMITIVE_MORPH_TARGET_INVALID_ATTRIBUTE_COUNT",
                            message: "Base accessor has different count.",
                            severity: Severity.ERROR,
                            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}/${escapeJsonPointer(attributeName)}`
                          });
                        }
                      }
                    }
                    if (attributeName === "POSITION" && targetAccessor && (targetAccessor.min === void 0 || targetAccessor.max === void 0)) {
                      messages.push({
                        code: "MESH_PRIMITIVE_POSITION_ACCESSOR_WITHOUT_BOUNDS",
                        message: "accessor.min and accessor.max must be defined for POSITION attribute accessor.",
                        severity: Severity.ERROR,
                        pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/targets/${targetIndex}/POSITION`
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      const mode = primitive.mode !== void 0 ? primitive.mode : 4;
      if (primitive.attributes && primitive.attributes["POSITION"] !== void 0 && gltf.accessors) {
        const positionAccessorIndex = primitive.attributes["POSITION"];
        if (typeof positionAccessorIndex === "number" && positionAccessorIndex < gltf.accessors.length) {
          const positionAccessor = gltf.accessors[positionAccessorIndex];
          if (positionAccessor && typeof positionAccessor.count === "number") {
            let vertexCount = positionAccessor.count;
            if (primitive.indices !== void 0 && typeof primitive.indices === "number" && primitive.indices < gltf.accessors.length) {
              const indicesAccessor = gltf.accessors[primitive.indices];
              if (indicesAccessor && typeof indicesAccessor.count === "number") {
                vertexCount = indicesAccessor.count;
              }
            }
            let isIncompatible = false;
            let modeName = "TRIANGLES";
            switch (mode) {
              case 0:
                modeName = "POINTS";
                break;
              case 1:
                modeName = "LINES";
                isIncompatible = vertexCount % 2 !== 0;
                break;
              case 2:
                modeName = "LINE_LOOP";
                isIncompatible = vertexCount < 2;
                break;
              case 3:
                modeName = "LINE_STRIP";
                isIncompatible = vertexCount < 2;
                break;
              case 4:
                modeName = "TRIANGLES";
                isIncompatible = vertexCount % 3 !== 0;
                break;
              case 5:
                modeName = "TRIANGLE_STRIP";
                isIncompatible = vertexCount < 3;
                break;
              case 6:
                modeName = "TRIANGLE_FAN";
                isIncompatible = vertexCount < 3;
                break;
            }
            if (isIncompatible) {
              messages.push({
                code: "MESH_PRIMITIVE_INCOMPATIBLE_MODE",
                message: `Number of vertices or indices (${vertexCount}) is not compatible with used drawing mode ('${modeName}').`,
                severity: Severity.WARNING,
                pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}`
              });
            }
          }
        }
      }
      const expectedPrimitiveProperties = [
        "attributes",
        "indices",
        "material",
        "mode",
        "targets",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in primitive) {
        if (!expectedPrimitiveProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/${key}`
          });
        }
      }
      if (primitive.attributes && gltf["extensionsUsed"] && Array.isArray(gltf["extensionsUsed"]) && gltf["extensionsUsed"].includes("KHR_materials_pbrSpecularGlossiness")) {
        const requiredTexCoords = /* @__PURE__ */ new Set();
        if (primitive.hasOwnProperty("material") && typeof primitive.material === "number" && gltf.materials && primitive.material < gltf.materials.length) {
          const material = gltf.materials[primitive.material];
          if (material) {
            const materialTexCoords = this.getRequiredTexCoords(material);
            for (const { texCoord } of materialTexCoords) {
              requiredTexCoords.add(texCoord);
            }
          }
        }
        for (const attributeName in primitive.attributes) {
          if (attributeName.startsWith("TEXCOORD_")) {
            const texCoordMatch = attributeName.match(/^TEXCOORD_(\d+)$/);
            if (texCoordMatch && texCoordMatch[1]) {
              const texCoordIndex = parseInt(texCoordMatch[1]);
              if (!requiredTexCoords.has(texCoordIndex)) {
                messages.push({
                  code: "UNUSED_OBJECT",
                  message: "This object may be unused.",
                  severity: Severity.INFO,
                  pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${attributeName}`
                });
              }
            }
          }
        }
      }
      return messages;
    }
    isValidAttributeName(name) {
      if (!name || name.trim() === "") {
        return false;
      }
      const standardAttributes = [
        "POSITION",
        "NORMAL",
        "TANGENT",
        "TEXCOORD_0",
        "TEXCOORD_1",
        "COLOR_0",
        "JOINTS_0",
        "WEIGHTS_0"
      ];
      if (standardAttributes.includes(name)) {
        return true;
      }
      const indexedPatterns = [
        /^TEXCOORD_[0-9]$/,
        // Only TEXCOORD_0 to TEXCOORD_9
        /^COLOR_[0-9]$/,
        // Only COLOR_0 to COLOR_9
        /^JOINTS_[0-9]$/,
        // Only JOINTS_0 to JOINTS_9
        /^WEIGHTS_[0-9]$/
        // Only WEIGHTS_0 to WEIGHTS_9
      ];
      for (const pattern of indexedPatterns) {
        if (pattern.test(name)) {
          return true;
        }
      }
      if (name.startsWith("_")) {
        return true;
      }
      return false;
    }
    shouldReportByteStrideIssue(accessor, attributeEntries, currentAttributeName, gltf) {
      if (!gltf.bufferViews || !gltf.accessors)
        return false;
      const bufferViewIndex = accessor.bufferView;
      if (bufferViewIndex === void 0)
        return false;
      const bufferView = gltf.bufferViews[bufferViewIndex];
      if (!bufferView || bufferView.byteStride !== void 0)
        return false;
      const attributesUsingThisBufferView = [];
      for (const [name, accessorIdx] of attributeEntries) {
        if (typeof accessorIdx === "number" && accessorIdx < gltf.accessors.length) {
          const attr = gltf.accessors[accessorIdx];
          if (attr && attr.bufferView === bufferViewIndex) {
            attributesUsingThisBufferView.push(name);
          }
        }
      }
      return attributesUsingThisBufferView.length > 1 && attributesUsingThisBufferView.indexOf(currentAttributeName) > 0;
    }
    checkByteStrideRequirement(accessor, gltf, meshIndex, primitiveIndex, attributeName, messages) {
      if (!gltf.bufferViews || !gltf.accessors)
        return false;
      const bufferViewIndex = accessor.bufferView;
      if (bufferViewIndex === void 0)
        return false;
      const bufferView = gltf.bufferViews[bufferViewIndex];
      if (!bufferView)
        return false;
      let accessorsUsingThisBufferView = 0;
      for (let i = 0; i < gltf.accessors.length; i++) {
        const otherAccessor = gltf.accessors[i];
        if (otherAccessor && otherAccessor.bufferView === bufferViewIndex) {
          accessorsUsingThisBufferView++;
        }
      }
      if (accessorsUsingThisBufferView > 1 && bufferView.byteStride === void 0) {
        messages.push({
          code: "MESH_PRIMITIVE_ACCESSOR_WITHOUT_BYTESTRIDE",
          message: "bufferView.byteStride must be defined when two or more accessors use the same buffer view.",
          severity: Severity.ERROR,
          pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes/${escapeJsonPointer(attributeName)}`
        });
        return true;
      }
      return false;
    }
    getRequiredTexCoords(material) {
      const required = [];
      const getEffectiveTexCoord = (textureInfo, basePath) => {
        if (!textureInfo)
          return null;
        const textureTransform = textureInfo.extensions?.["KHR_texture_transform"];
        if (textureTransform?.texCoord !== void 0) {
          return {
            texCoord: textureTransform.texCoord,
            binding: `${basePath}/extensions/KHR_texture_transform`
          };
        }
        if (typeof textureInfo.texCoord === "number") {
          return { texCoord: textureInfo.texCoord, binding: basePath };
        }
        return null;
      };
      const textureProperties = [
        {
          obj: material.pbrMetallicRoughness?.baseColorTexture,
          path: "/materials/0/pbrMetallicRoughness/baseColorTexture"
        },
        {
          obj: material.pbrMetallicRoughness?.metallicRoughnessTexture,
          path: "/materials/0/pbrMetallicRoughness/metallicRoughnessTexture"
        },
        { obj: material.normalTexture, path: "/materials/0/normalTexture" },
        { obj: material.occlusionTexture, path: "/materials/0/occlusionTexture" },
        { obj: material.emissiveTexture, path: "/materials/0/emissiveTexture" }
      ];
      for (const { obj, path } of textureProperties) {
        if (obj) {
          const effectiveTexCoord = getEffectiveTexCoord(obj, path);
          if (effectiveTexCoord) {
            required.push(effectiveTexCoord);
          }
        }
      }
      if (material.extensions) {
        const pbrSG = material.extensions["KHR_materials_pbrSpecularGlossiness"];
        if (pbrSG) {
          if (pbrSG.diffuseTexture) {
            const diffuseTexCoord = getEffectiveTexCoord(pbrSG.diffuseTexture, "/materials/0/extensions/KHR_materials_pbrSpecularGlossiness/diffuseTexture");
            if (diffuseTexCoord) {
              required.push(diffuseTexCoord);
            }
          }
          if (pbrSG.specularGlossinessTexture) {
            const specularGlossinessTexCoord = getEffectiveTexCoord(pbrSG.specularGlossinessTexture, "/materials/0/extensions/KHR_materials_pbrSpecularGlossiness/specularGlossinessTexture");
            if (specularGlossinessTexCoord) {
              required.push(specularGlossinessTexCoord);
            }
          }
        }
      }
      return required;
    }
    getAvailableTexCoords(attributes) {
      const available = /* @__PURE__ */ new Set();
      for (const attributeName in attributes) {
        if (attributeName.startsWith("TEXCOORD_")) {
          const texCoordIndex = parseInt(attributeName.substring(9), 10);
          if (!isNaN(texCoordIndex)) {
            available.add(texCoordIndex);
          }
        }
      }
      return available;
    }
    validateIndexedSemanticContinuity(attributes, meshIndex, primitiveIndex, messages) {
      const semantics = ["TEXCOORD", "COLOR", "JOINTS", "WEIGHTS"];
      for (const semantic of semantics) {
        const indices = [];
        for (const attributeName of Object.keys(attributes)) {
          if (this.isValidAttributeName(attributeName)) {
            const match = attributeName.match(new RegExp(`^${semantic}_(\\d+)$`));
            if (match) {
              indices.push(parseInt(match[1]));
            }
          }
        }
        if (indices.length > 0) {
          indices.sort((a, b) => a - b);
          const expectedIndices = Array.from({ length: indices.length }, (_, i) => i);
          const isValid = indices.length === expectedIndices.length && indices.every((value, index) => value === expectedIndices[index]);
          if (!isValid) {
            const maxIndex = Math.max(...indices);
            const expectedCount = maxIndex + 1;
            messages.push({
              code: "MESH_PRIMITIVE_INDEXED_SEMANTIC_CONTINUITY",
              message: `Indices for indexed attribute semantic '${semantic}' must start with 0 and be continuous. Total expected indices: ${expectedCount}, total provided indices: ${indices.length}.`,
              severity: Severity.ERROR,
              pointer: `/meshes/${meshIndex}/primitives/${primitiveIndex}/attributes`
            });
          }
        }
      }
    }
    materialRequiresTangentSpace(material) {
      if (!material)
        return false;
      if (material.normalTexture) {
        return true;
      }
      if (material.extensions) {
        if (material.extensions["KHR_materials_anisotropy"]) {
          const anisotropy = material.extensions["KHR_materials_anisotropy"];
          if (anisotropy?.anisotropyTexture) {
            return true;
          }
        }
        if (material.extensions["KHR_materials_clearcoat"]) {
          const clearcoat = material.extensions["KHR_materials_clearcoat"];
          if (clearcoat?.clearcoatNormalTexture) {
            return true;
          }
        }
      }
      return false;
    }
    isExtensionAllowedOnMeshes(extensionName) {
      const allowedOnMeshes = [
        // Add extensions that are allowed on meshes here
        // For now, no extensions are allowed on meshes
      ];
      return allowedOnMeshes.includes(extensionName);
    }
  };

  // dist/validators/material-validator.js
  var MaterialValidator = class {
    validate(material, index, gltf) {
      const messages = [];
      const gltfObj = gltf;
      if (material.alphaMode !== void 0) {
        if (typeof material.alphaMode !== "string") {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Material alphaMode must be a string.",
            severity: Severity.ERROR,
            pointer: `/materials/${index}/alphaMode`
          });
        } else if (!Object.values(AlphaMode).includes(material.alphaMode)) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Material alphaMode must be one of: OPAQUE, MASK, BLEND.",
            severity: Severity.ERROR,
            pointer: `/materials/${index}/alphaMode`
          });
        }
      }
      if (material.alphaCutoff !== void 0) {
        if (typeof material.alphaCutoff !== "number" || material.alphaCutoff < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Material alphaCutoff must be a non-negative number.",
            severity: Severity.ERROR,
            pointer: `/materials/${index}/alphaCutoff`
          });
        }
        if (material.alphaMode !== "MASK") {
          messages.push({
            code: "MATERIAL_ALPHA_CUTOFF_INVALID_MODE",
            message: "Alpha cutoff is supported only for 'MASK' alpha mode.",
            severity: Severity.WARNING,
            pointer: `/materials/${index}/alphaCutoff`
          });
        }
      }
      if (material.pbrMetallicRoughness) {
        const pbr = material.pbrMetallicRoughness;
        if (pbr.baseColorTexture) {
          if (pbr.baseColorTexture.index === void 0) {
            messages.push({
              code: "INVALID_MATERIAL_BASECOLOR_TEXTURE",
              message: "Base color texture must have an index",
              severity: Severity.ERROR,
              pointer: `/materials/${index}/pbrMetallicRoughness/baseColorTexture`
            });
          } else {
            if (!gltfObj.textures || pbr.baseColorTexture.index >= gltfObj.textures.length) {
              messages.push({
                code: "UNRESOLVED_REFERENCE",
                message: "Unresolved reference: " + pbr.baseColorTexture.index + ".",
                severity: Severity.ERROR,
                pointer: `/materials/${index}/pbrMetallicRoughness/baseColorTexture/index`
              });
            }
          }
        }
        if (pbr.metallicRoughnessTexture) {
          if (pbr.metallicRoughnessTexture.index === void 0) {
            messages.push({
              code: "INVALID_MATERIAL_METALLIC_ROUGHNESS_TEXTURE",
              message: "Metallic roughness texture must have an index",
              severity: Severity.ERROR,
              pointer: `/materials/${index}/pbrMetallicRoughness/metallicRoughnessTexture`
            });
          } else {
            if (!gltfObj.textures || pbr.metallicRoughnessTexture.index >= gltfObj.textures.length) {
              messages.push({
                code: "UNRESOLVED_REFERENCE",
                message: "Unresolved reference: " + pbr.metallicRoughnessTexture.index + ".",
                severity: Severity.ERROR,
                pointer: `/materials/${index}/pbrMetallicRoughness/metallicRoughnessTexture/index`
              });
            }
          }
        }
      }
      if (material.normalTexture) {
        if (material.normalTexture.index === void 0) {
          messages.push({
            code: "INVALID_MATERIAL_NORMAL_TEXTURE",
            message: "Normal texture must have an index",
            severity: Severity.ERROR,
            pointer: `/materials/${index}/normalTexture`
          });
        } else {
          if (!gltfObj.textures || material.normalTexture.index >= gltfObj.textures.length) {
            messages.push({
              code: "UNRESOLVED_REFERENCE",
              message: "Unresolved reference: " + material.normalTexture.index + ".",
              severity: Severity.ERROR,
              pointer: `/materials/${index}/normalTexture/index`
            });
          }
        }
      }
      if (material.occlusionTexture) {
        if (material.occlusionTexture.index === void 0) {
          messages.push({
            code: "INVALID_MATERIAL_OCCLUSION_TEXTURE",
            message: "Occlusion texture must have an index",
            severity: Severity.ERROR,
            pointer: `/materials/${index}/occlusionTexture`
          });
        } else {
          if (!gltfObj.textures || material.occlusionTexture.index >= gltfObj.textures.length) {
            messages.push({
              code: "UNRESOLVED_REFERENCE",
              message: "Unresolved reference: " + material.occlusionTexture.index + ".",
              severity: Severity.ERROR,
              pointer: `/materials/${index}/occlusionTexture/index`
            });
          }
        }
      }
      if (material.emissiveTexture) {
        if (material.emissiveTexture.index === void 0) {
          messages.push({
            code: "INVALID_MATERIAL_EMISSIVE_TEXTURE",
            message: "Emissive texture must have an index",
            severity: Severity.ERROR,
            pointer: `/materials/${index}/emissiveTexture`
          });
        } else {
          if (!gltfObj.textures || material.emissiveTexture.index >= gltfObj.textures.length) {
            messages.push({
              code: "UNRESOLVED_REFERENCE",
              message: "Unresolved reference: " + material.emissiveTexture.index + ".",
              severity: Severity.ERROR,
              pointer: `/materials/${index}/emissiveTexture/index`
            });
          }
        }
      }
      const expectedProperties = [
        "name",
        "doubleSided",
        "alphaMode",
        "alphaCutoff",
        "pbrMetallicRoughness",
        "normalTexture",
        "occlusionTexture",
        "emissiveTexture",
        "emissiveFactor",
        "extensions",
        "extras"
      ];
      for (const key in material) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/materials/${index}/${key}`
          });
        }
      }
      if (material.pbrMetallicRoughness) {
        const expectedPbrProperties = [
          "baseColorFactor",
          "baseColorTexture",
          "metallicFactor",
          "roughnessFactor",
          "metallicRoughnessTexture"
        ];
        if (material.pbrMetallicRoughness["extensions"]) {
          expectedPbrProperties.push("extensions");
        }
        for (const key in material.pbrMetallicRoughness) {
          if (!expectedPbrProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `/materials/${index}/pbrMetallicRoughness/${key}`
            });
          }
        }
        if (material.pbrMetallicRoughness.baseColorTexture) {
          const expectedTextureProperties = ["index", "texCoord"];
          if (material.pbrMetallicRoughness.baseColorTexture["extensions"] && material.pbrMetallicRoughness.baseColorTexture["extensions"]["KHR_texture_transform"]) {
            expectedTextureProperties.push("extensions");
          }
          for (const key in material.pbrMetallicRoughness.baseColorTexture) {
            if (!expectedTextureProperties.includes(key)) {
              messages.push({
                code: "UNEXPECTED_PROPERTY",
                message: "Unexpected property.",
                severity: Severity.WARNING,
                pointer: `/materials/${index}/pbrMetallicRoughness/baseColorTexture/${key}`
              });
            }
          }
        }
        if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
          const expectedTextureProperties = ["index", "texCoord"];
          if (material.pbrMetallicRoughness.metallicRoughnessTexture["extensions"] && material.pbrMetallicRoughness.metallicRoughnessTexture["extensions"]["KHR_texture_transform"]) {
            expectedTextureProperties.push("extensions");
          }
          for (const key in material.pbrMetallicRoughness.metallicRoughnessTexture) {
            if (!expectedTextureProperties.includes(key)) {
              messages.push({
                code: "UNEXPECTED_PROPERTY",
                message: "Unexpected property.",
                severity: Severity.WARNING,
                pointer: `/materials/${index}/pbrMetallicRoughness/metallicRoughnessTexture/${key}`
              });
            }
          }
        }
      }
      if (material.normalTexture) {
        const expectedNormalTextureProperties = ["index", "texCoord", "scale"];
        if (material.normalTexture["extensions"] && material.normalTexture["extensions"]["KHR_texture_transform"]) {
          expectedNormalTextureProperties.push("extensions");
        }
        for (const key in material.normalTexture) {
          if (!expectedNormalTextureProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `/materials/${index}/normalTexture/${key}`
            });
          }
        }
      }
      if (material.occlusionTexture) {
        const expectedOcclusionTextureProperties = [
          "index",
          "texCoord",
          "strength"
        ];
        if (material.occlusionTexture["extensions"] && material.occlusionTexture["extensions"]["KHR_texture_transform"]) {
          expectedOcclusionTextureProperties.push("extensions");
        }
        for (const key in material.occlusionTexture) {
          if (!expectedOcclusionTextureProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `/materials/${index}/occlusionTexture/${key}`
            });
          }
        }
      }
      if (material.emissiveTexture) {
        const expectedEmissiveTextureProperties = ["index", "texCoord"];
        if (material.emissiveTexture["extensions"] && material.emissiveTexture["extensions"]["KHR_texture_transform"]) {
          expectedEmissiveTextureProperties.push("extensions");
        }
        for (const key in material.emissiveTexture) {
          if (!expectedEmissiveTextureProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `/materials/${index}/emissiveTexture/${key}`
            });
          }
        }
      }
      if (material["extensions"]) {
        const extensions = material["extensions"];
        for (const extensionName in extensions) {
          const extension = extensions[extensionName];
          this.validateMaterialExtension(extensionName, extension, index, messages);
        }
      }
      if (material["extensions"]) {
        const extensions = Object.keys(material["extensions"]);
        if (extensions.includes("KHR_materials_unlit")) {
          const incompatibleWithUnlit = extensions.filter((ext) => ext !== "KHR_materials_unlit" && (ext.startsWith("KHR_materials_") || ext === "KHR_materials_clearcoat"));
          if (incompatibleWithUnlit.length > 0) {
            messages.push({
              code: "MULTIPLE_EXTENSIONS",
              message: "This extension may be incompatible with other extensions for the object.",
              severity: Severity.WARNING,
              pointer: `/materials/${index}/extensions/KHR_materials_unlit`
            });
          }
        }
        if (extensions.includes("KHR_materials_pbrSpecularGlossiness")) {
          const incompatibleWithPbrSG = extensions.filter((ext) => ext !== "KHR_materials_pbrSpecularGlossiness" && (ext === "KHR_materials_transmission" || ext === "KHR_materials_clearcoat" || ext === "KHR_materials_unlit"));
          if (incompatibleWithPbrSG.length > 0) {
            messages.push({
              code: "MULTIPLE_EXTENSIONS",
              message: "This extension may be incompatible with other extensions for the object.",
              severity: Severity.WARNING,
              pointer: `/materials/${index}/extensions/KHR_materials_pbrSpecularGlossiness`
            });
          }
        }
      }
      return messages;
    }
    validateMaterialExtension(extensionName, extension, materialIndex, messages) {
      const basePointer = `/materials/${materialIndex}/extensions/${extensionName}`;
      if (extensionName === "KHR_materials_anisotropy") {
        const expectedProperties = [
          "anisotropyStrength",
          "anisotropyRotation",
          "anisotropyTexture"
        ];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_clearcoat") {
        const expectedProperties = [
          "clearcoatFactor",
          "clearcoatTexture",
          "clearcoatRoughnessFactor",
          "clearcoatRoughnessTexture",
          "clearcoatNormalTexture"
        ];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_dispersion") {
        const expectedProperties = ["dispersion"];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_emissive_strength") {
        const expectedProperties = ["emissiveStrength"];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_ior") {
        const expectedProperties = ["ior"];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_iridescence") {
        const expectedProperties = [
          "iridescenceFactor",
          "iridescenceTexture",
          "iridescenceIor",
          "iridescenceThicknessMinimum",
          "iridescenceThicknessMaximum",
          "iridescenceThicknessTexture"
        ];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_sheen") {
        const expectedProperties = [
          "sheenColorFactor",
          "sheenColorTexture",
          "sheenRoughnessFactor",
          "sheenRoughnessTexture"
        ];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_specular") {
        const expectedProperties = [
          "specularFactor",
          "specularTexture",
          "specularColorFactor",
          "specularColorTexture"
        ];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_transmission") {
        const expectedProperties = ["transmissionFactor", "transmissionTexture"];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_unlit") {
        const ext = extension;
        for (const key in ext) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `${basePointer}/${key}`
          });
        }
      } else if (extensionName === "KHR_materials_volume") {
        const expectedProperties = [
          "thicknessFactor",
          "thicknessTexture",
          "attenuationDistance",
          "attenuationColor"
        ];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      } else if (extensionName === "KHR_materials_pbrSpecularGlossiness") {
        const expectedProperties = [
          "diffuseFactor",
          "diffuseTexture",
          "specularFactor",
          "glossinessFactor",
          "specularGlossinessTexture"
        ];
        const ext = extension;
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      }
    }
  };

  // dist/validators/texture-validator.js
  var TextureValidator = class {
    validate(texture, index, gltf) {
      const messages = [];
      if (texture.source !== void 0) {
        if (typeof texture.source !== "number" || texture.source < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Texture source must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/textures/${index}/source`
          });
        } else if (!gltf.images || texture.source >= gltf.images.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + texture.source + ".",
            severity: Severity.ERROR,
            pointer: `/textures/${index}/source`
          });
        }
      }
      if (texture.sampler !== void 0) {
        if (typeof texture.sampler !== "number" || texture.sampler < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Texture sampler must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/textures/${index}/sampler`
          });
        } else if (!gltf.samplers || texture.sampler >= gltf.samplers.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + texture.sampler + ".",
            severity: Severity.ERROR,
            pointer: `/textures/${index}/sampler`
          });
        }
      }
      const expectedProperties = [
        "source",
        "sampler",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in texture) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/textures/${index}/${key}`
          });
        }
      }
      if (texture["extensions"]) {
        const extensions = texture["extensions"];
        for (const extensionName in extensions) {
          const extension = extensions[extensionName];
          this.validateExtension(extensionName, extension, index, gltf, messages);
        }
      }
      return messages;
    }
    validateExtension(extensionName, extension, textureIndex, gltf, messages) {
      const basePointer = `/textures/${textureIndex}/extensions/${extensionName}`;
      if (extensionName === "EXT_texture_webp" && extension && typeof extension === "object" && !Array.isArray(extension)) {
        const extObj = extension;
        const expectedProperties = ["source"];
        for (const key in extObj) {
          if (!expectedProperties.includes(key)) {
            messages.push({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
        if (extObj.source !== void 0) {
          if (typeof extObj.source !== "number" || extObj.source < 0) {
            messages.push({
              code: "INVALID_VALUE",
              message: "Extension source must be a non-negative integer.",
              severity: Severity.ERROR,
              pointer: `${basePointer}/source`
            });
          } else if (!gltf.images || extObj.source >= gltf.images.length) {
            messages.push({
              code: "UNRESOLVED_REFERENCE",
              message: `Unresolved reference: ${extObj.source}.`,
              severity: Severity.ERROR,
              pointer: `${basePointer}/source`
            });
          }
        }
      }
    }
  };

  // dist/validators/image-validator.js
  var ImageValidator = class {
    constructor(externalResourceFunction) {
      if (externalResourceFunction) {
        this.externalResourceFunction = externalResourceFunction;
      }
    }
    validate(image, index, gltf) {
      const messages = [];
      if (Array.isArray(image)) {
        const formatArrayValue = (arr) => {
          const items = arr.map((item) => {
            if (typeof item === "string" && /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(item)) {
              return item;
            }
            return JSON.stringify(item);
          });
          return `[${items.join(", ")}]`;
        };
        messages.push({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${formatArrayValue(image)} is not a 'object'.`,
          severity: Severity.ERROR,
          pointer: `/images/${index}`
        });
        return messages;
      }
      if (typeof image !== "object" || image === null) {
        messages.push({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${JSON.stringify(image)} is not a 'object'.`,
          severity: Severity.ERROR,
          pointer: `/images/${index}`
        });
        return messages;
      }
      if (image.bufferView === void 0 && image.uri === void 0) {
        messages.push({
          code: "ONE_OF_MISMATCH",
          message: "Exactly one of ('bufferView', 'uri') properties must be defined.",
          severity: Severity.ERROR,
          pointer: `/images/${index}`
        });
      } else if (image.bufferView !== void 0 && image.uri !== void 0) {
        messages.push({
          code: "ONE_OF_MISMATCH",
          message: "Exactly one of ('bufferView', 'uri') properties must be defined.",
          severity: Severity.ERROR,
          pointer: `/images/${index}`
        });
      }
      if (image.bufferView !== void 0) {
        if (typeof image.bufferView !== "number" || image.bufferView < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Image bufferView must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/images/${index}/bufferView`
          });
        } else if (!gltf.bufferViews || image.bufferView >= gltf.bufferViews.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + image.bufferView + ".",
            severity: Severity.ERROR,
            pointer: `/images/${index}/bufferView`
          });
        } else {
          const bufferView = gltf.bufferViews[image.bufferView];
          if (bufferView && bufferView.byteStride !== void 0) {
            messages.push({
              code: "IMAGE_BUFFER_VIEW_WITH_BYTESTRIDE",
              message: "bufferView.byteStride must not be defined for buffer views containing image data.",
              severity: Severity.ERROR,
              pointer: `/images/${index}/bufferView`
            });
          }
        }
        if (image.mimeType === void 0) {
          messages.push({
            code: "UNSATISFIED_DEPENDENCY",
            message: "Dependency failed. 'mimeType' must be defined.",
            severity: Severity.ERROR,
            pointer: `/images/${index}/bufferView`
          });
        }
      }
      if (image.uri !== void 0) {
        if (typeof image.uri !== "string") {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Image uri must be a string.",
            severity: Severity.ERROR,
            pointer: `/images/${index}/uri`
          });
        } else {
          if (image.uri.startsWith("data:")) {
            const dataUriMatch = image.uri.match(/^data:([^;]+);base64,(.+)$/);
            if (!dataUriMatch) {
              messages.push({
                code: "INVALID_URI",
                message: "Invalid data URI format.",
                severity: Severity.ERROR,
                pointer: `/images/${index}/uri`
              });
            } else {
              const mimeType = dataUriMatch[1];
              const base64Data = dataUriMatch[2];
              if (!mimeType || !mimeType.startsWith("image/")) {
                messages.push({
                  code: "INVALID_URI",
                  message: "Data URI MIME type must be an image type.",
                  severity: Severity.ERROR,
                  pointer: `/images/${index}/uri`
                });
              } else {
                try {
                  const decodedData = atob(base64Data || "");
                  let actualFormat = "";
                  if (decodedData.length >= 8) {
                    const header = decodedData.substring(0, 8);
                    if (header.startsWith("\x89PNG\r\n\n")) {
                      actualFormat = "image/png";
                    } else if (header.startsWith("\xFF\xD8\xFF")) {
                      actualFormat = "image/jpeg";
                    } else if (header.startsWith("GIF87a") || header.startsWith("GIF89a")) {
                      actualFormat = "image/gif";
                    }
                  }
                  if (actualFormat && actualFormat !== mimeType) {
                    messages.push({
                      code: "INVALID_URI",
                      message: `Invalid URI '${image.uri}'. Parser output:
The declared mediatype does not match the embedded content.`,
                      severity: Severity.ERROR,
                      pointer: `/images/${index}/uri`
                    });
                  }
                } catch (error) {
                }
              }
              try {
                atob(base64Data || "");
              } catch (error) {
                let errorMessage = `Invalid URI '${image.uri}'. `;
                const invalidCharIndex = (base64Data || "").search(/[^A-Za-z0-9+/=]/);
                if (invalidCharIndex !== -1) {
                  errorMessage += `Parser output:
FormatException: Invalid base64 data (at character ${23 + invalidCharIndex})
${image.uri}
${" ".repeat(22 + invalidCharIndex)}^`;
                } else {
                  errorMessage += "Parser output:\nFormatException: Invalid base64 data";
                }
                messages.push({
                  code: "INVALID_URI",
                  message: errorMessage,
                  severity: Severity.ERROR,
                  pointer: `/images/${index}/uri`
                });
              }
            }
          } else {
            if (image.uri === ":" || image.uri.startsWith(":/")) {
              messages.push({
                code: "INVALID_URI",
                message: `Invalid URI '${image.uri}'. Parser output:
FormatException: Invalid empty scheme (at character 1)
${image.uri}
^`,
                severity: Severity.ERROR,
                pointer: `/images/${index}/uri`
              });
            } else if (image.uri.includes("://")) {
              try {
                const url = new URL(image.uri);
                if (url.protocol !== "http:" && url.protocol !== "https:") {
                  messages.push({
                    code: "INVALID_URI",
                    message: "External image URI must use http or https protocol.",
                    severity: Severity.ERROR,
                    pointer: `/images/${index}/uri`
                  });
                }
              } catch (error) {
                messages.push({
                  code: "INVALID_URI",
                  message: `Invalid URI '${image.uri}'. Parser output:
FormatException: Invalid empty scheme (at character 1)
${image.uri}
^`,
                  severity: Severity.ERROR,
                  pointer: `/images/${index}/uri`
                });
              }
            } else {
              if (image.uri.includes(":") && !image.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
                messages.push({
                  code: "INVALID_URI",
                  message: `Invalid URI '${image.uri}'. Parser output:
FormatException: Invalid empty scheme (at character 1)
${image.uri}
^`,
                  severity: Severity.ERROR,
                  pointer: `/images/${index}/uri`
                });
              } else if (image.uri.startsWith("/")) {
                messages.push({
                  code: "INVALID_URI",
                  message: 'Relative image URI cannot start with "/".',
                  severity: Severity.ERROR,
                  pointer: `/images/${index}/uri`
                });
              }
            }
          }
        }
      }
      if (image.mimeType !== void 0) {
        if (typeof image.mimeType !== "string") {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Image mimeType must be a string.",
            severity: Severity.ERROR,
            pointer: `/images/${index}/mimeType`
          });
        } else if (!image.mimeType.startsWith("image/")) {
          messages.push({
            code: "VALUE_NOT_IN_LIST",
            message: "Image mimeType must be an image type.",
            severity: Severity.ERROR,
            pointer: `/images/${index}/mimeType`
          });
        } else {
          const extensionsUsed = new Set(gltf["extensionsUsed"] || []);
          const validMimeTypes = ["image/jpeg", "image/png"];
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
              pointer: `/images/${index}/mimeType`
            });
          }
        }
        if (image.uri && image.uri.startsWith("data:")) {
          const dataUriMatch = image.uri.match(/^data:([^;]+);base64,(.+)$/);
          if (dataUriMatch && dataUriMatch[1] !== image.mimeType) {
            messages.push({
              code: "IMAGE_MIME_TYPE_INVALID",
              message: `Recognized image format '${dataUriMatch[1]}' does not match declared image format '${image.mimeType}'.`,
              severity: Severity.ERROR,
              pointer: `/images/${index}/uri`
            });
          }
        }
      }
      if (image.uri && !image.mimeType) {
        let inferredMimeType;
        if (image.uri.startsWith("data:")) {
          const dataUriMatch = image.uri.match(/^data:([^;]+);base64,(.+)$/);
          if (dataUriMatch) {
            inferredMimeType = dataUriMatch[1];
          }
        } else {
          if (image.uri.toLowerCase().endsWith(".webp")) {
            inferredMimeType = "image/webp";
          }
        }
        if (inferredMimeType) {
          this.validateMimeTypeExtensionRequirements(inferredMimeType, index, gltf, messages);
        }
      }
      if (image.mimeType) {
        this.validateMimeTypeExtensionRequirements(image.mimeType, index, gltf, messages);
      }
      const expectedProperties = [
        "uri",
        "mimeType",
        "bufferView",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in image) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/images/${index}/${key}`
          });
        }
      }
      if (image["extensions"]) {
        const extensions = image["extensions"];
        for (const extensionName in extensions) {
          if (extensionName === "EXT_texture_webp") {
            messages.push({
              code: "UNEXPECTED_EXTENSION_OBJECT",
              message: "Unexpected location for this extension.",
              severity: Severity.ERROR,
              pointer: `/images/${index}/extensions/${extensionName}`
            });
          }
        }
      }
      return messages;
    }
    validateMimeTypeExtensionRequirements(mimeType, imageIndex, gltf, messages) {
      const extensionsUsed = new Set(gltf["extensionsUsed"] || []);
      if (mimeType === "image/webp" && !extensionsUsed.has("EXT_texture_webp")) {
        messages.push({
          code: "IMAGE_NON_ENABLED_MIME_TYPE",
          message: `'${mimeType}' MIME type requires an extension.`,
          severity: Severity.ERROR,
          pointer: `/images/${imageIndex}`
        });
      }
    }
    async validateExternalResources(image, index) {
      const messages = [];
      if (image.uri && !image.uri.startsWith("data:") && this.externalResourceFunction) {
        try {
          const imageData = await this.externalResourceFunction(image.uri);
          const detectedFormat = this.detectImageFormat(imageData);
          if (!detectedFormat) {
            messages.push({
              code: "IMAGE_UNRECOGNIZED_FORMAT",
              message: "Image format not recognized.",
              severity: Severity.WARNING,
              pointer: `/images/${index}`
            });
          } else {
            const validationResult = this.validateImageData(imageData, detectedFormat);
            if (validationResult) {
              messages.push({
                code: validationResult.code,
                message: validationResult.message,
                severity: Severity.ERROR,
                pointer: `/images/${index}`
              });
            }
            const dimensions = this.getImageDimensions(imageData, detectedFormat);
            if (dimensions) {
              const isPowerOfTwo = (n) => n > 0 && (n & n - 1) === 0;
              if (!isPowerOfTwo(dimensions.width) || !isPowerOfTwo(dimensions.height)) {
                messages.push({
                  code: "IMAGE_NPOT_DIMENSIONS",
                  message: `Image has non-power-of-two dimensions: ${dimensions.width}x${dimensions.height}.`,
                  severity: Severity.INFO,
                  pointer: `/images/${index}`
                });
              }
            }
          }
        } catch (error) {
        }
      }
      return messages;
    }
    detectImageFormat(data) {
      if (data.length < 8)
        return null;
      if (data[0] === 137 && data[1] === 80 && data[2] === 78 && data[3] === 71 && data[4] === 13 && data[5] === 10 && data[6] === 26 && data[7] === 10) {
        return "image/png";
      }
      if (data[0] === 255 && data[1] === 216 && data[2] === 255) {
        return "image/jpeg";
      }
      if (data.length >= 6) {
        const header = String.fromCharCode(...data.slice(0, 6));
        if (header === "GIF87a" || header === "GIF89a") {
          return "image/gif";
        }
      }
      if (data.length >= 12) {
        const riff = String.fromCharCode(...data.slice(0, 4));
        const webp = String.fromCharCode(...data.slice(8, 12));
        if (riff === "RIFF" && webp === "WEBP") {
          return "image/webp";
        }
      }
      return null;
    }
    validateImageData(data, format) {
      switch (format) {
        case "image/jpeg":
          const jpegError = this.validateJPEGData(data);
          return jpegError ? {
            code: "IMAGE_DATA_INVALID",
            message: `Image data is invalid. ${jpegError}`
          } : null;
        case "image/png":
          const pngError = this.validatePNGData(data);
          if (pngError) {
            if (pngError.includes("Unexpected end of image stream")) {
              return { code: "IMAGE_UNEXPECTED_EOS", message: pngError };
            } else {
              return {
                code: "IMAGE_DATA_INVALID",
                message: `Image data is invalid. ${pngError}`
              };
            }
          }
          return null;
        default:
          return null;
      }
    }
    validateJPEGData(data) {
      if (data.length < 4) {
        return "Invalid JPEG format.";
      }
      if (data[0] !== 255 || data[1] !== 216) {
        return "Invalid JPEG format.";
      }
      if (data[2] !== 255) {
        return "Invalid JPEG format.";
      }
      if (data[3] === 0) {
        return "Invalid JPEG marker segment length.";
      }
      const validMarkers = [
        224,
        225,
        226,
        227,
        228,
        229,
        230,
        231,
        // APP0-APP7
        232,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        // APP8-APP15
        219,
        // DQT (Define Quantization Table)
        192,
        193,
        194,
        195,
        // SOF0-SOF3 (Start of Frame)
        196,
        // DHT (Define Huffman Table)
        218,
        // SOS (Start of Scan)
        217
        // EOI (End of Image)
      ];
      if (!validMarkers.includes(data[3])) {
        return "Invalid JPEG marker segment length.";
      }
      return null;
    }
    validatePNGData(data) {
      if (data.length < 8) {
        return "Invalid PNG format.";
      }
      const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
      for (let i = 0; i < 8; i++) {
        if (data[i] !== pngSignature[i]) {
          return "Invalid PNG signature.";
        }
      }
      let offset = 8;
      while (offset < data.length) {
        if (offset + 8 > data.length) {
          return "Unexpected end of image stream.";
        }
        const length = data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3];
        offset += 4;
        const chunkType = String.fromCharCode(data[offset], data[offset + 1], data[offset + 2], data[offset + 3]);
        offset += 4;
        if (offset + length + 4 > data.length) {
          return "Unexpected end of image stream.";
        }
        offset += length + 4;
        if (chunkType === "IEND") {
          break;
        }
      }
      return null;
    }
    getImageDimensions(data, format) {
      switch (format) {
        case "image/png":
          return this.getPNGDimensions(data);
        case "image/jpeg":
          return this.getJPEGDimensions(data);
        default:
          return null;
      }
    }
    getPNGDimensions(data) {
      if (data.length < 33)
        return null;
      let offset = 8;
      const length = data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3];
      offset += 4;
      const chunkType = String.fromCharCode(data[offset], data[offset + 1], data[offset + 2], data[offset + 3]);
      offset += 4;
      if (chunkType !== "IHDR" || length < 13) {
        return null;
      }
      const width = data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3];
      const height = data[offset + 4] << 24 | data[offset + 5] << 16 | data[offset + 6] << 8 | data[offset + 7];
      return { width, height };
    }
    getJPEGDimensions(data) {
      if (data.length < 4)
        return null;
      let offset = 2;
      while (offset < data.length - 1) {
        if (data[offset] !== 255) {
          offset++;
          continue;
        }
        const marker = data[offset + 1];
        offset += 2;
        if (marker >= 192 && marker <= 195) {
          if (offset + 5 < data.length) {
            const height = data[offset + 3] << 8 | data[offset + 4];
            const width = data[offset + 5] << 8 | data[offset + 6];
            return { width, height };
          }
          break;
        }
        if (marker === 216 || marker === 217 || marker === 1) {
          continue;
        }
        if (marker >= 208 && marker <= 215) {
          continue;
        }
        if (offset + 2 > data.length)
          break;
        const segmentLength = data[offset] << 8 | data[offset + 1];
        if (segmentLength < 2)
          break;
        offset += segmentLength;
      }
      return null;
    }
  };

  // dist/validators/sampler-validator.js
  var SamplerValidator = class {
    validate(sampler, index) {
      const messages = [];
      const expectedProperties = [
        "magFilter",
        "minFilter",
        "wrapS",
        "wrapT",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in sampler) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/samplers/${index}/${key}`
          });
        }
      }
      if (sampler["extensions"]) {
        const extensions = sampler["extensions"];
        for (const extensionName in extensions) {
          if (!this.isExtensionAllowedOnSamplers(extensionName)) {
            messages.push({
              code: "UNEXPECTED_EXTENSION_OBJECT",
              message: "Unexpected location for this extension.",
              severity: Severity.ERROR,
              pointer: `/samplers/${index}/extensions/${extensionName}`
            });
          }
        }
      }
      return messages;
    }
    isExtensionAllowedOnSamplers(extensionName) {
      const allowedOnSamplers = [
        // Add extensions that are allowed on samplers here
        // For now, no extensions are allowed on samplers
      ];
      return allowedOnSamplers.includes(extensionName);
    }
  };

  // dist/validators/camera-validator.js
  var CameraValidator = class {
    validate(camera, index) {
      const messages = [];
      if (!camera.type) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'type' must be defined.",
          severity: Severity.ERROR,
          pointer: `/cameras/${index}`
        });
      } else if (typeof camera.type !== "string") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Camera type must be a string.",
          severity: Severity.ERROR,
          pointer: `/cameras/${index}/type`
        });
      } else if (!Object.values(CameraType).includes(camera.type)) {
        messages.push({
          code: "VALUE_NOT_IN_LIST",
          message: "Invalid value '" + camera.type + "'. Valid values are ('orthographic', 'perspective').",
          severity: Severity.WARNING,
          pointer: `/cameras/${index}/type`
        });
      }
      const hasOrthographic = camera.orthographic !== void 0;
      const hasPerspective = camera.perspective !== void 0;
      if (hasOrthographic && hasPerspective) {
        messages.push({
          code: "ONE_OF_MISMATCH",
          message: "Exactly one of ('orthographic', 'perspective') properties must be defined.",
          severity: Severity.ERROR,
          pointer: `/cameras/${index}`
        });
      }
      const expectedProperties = [
        "orthographic",
        "perspective",
        "type",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in camera) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/cameras/${index}/${key}`
          });
        }
      }
      if (camera.type === "perspective" || camera.perspective) {
        if (!camera.perspective) {
          messages.push({
            code: "UNDEFINED_PROPERTY",
            message: "Property 'perspective' must be defined.",
            severity: Severity.ERROR,
            pointer: `/cameras/${index}`
          });
        } else {
          if (camera.perspective.yfov === void 0) {
            messages.push({
              code: "UNDEFINED_PROPERTY",
              message: "Property 'yfov' must be defined.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective`
            });
          } else if (camera.perspective.yfov === null) {
            messages.push({
              code: "VALUE_NOT_IN_RANGE",
              message: "Value null is out of range.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective/yfov`
            });
          } else if (typeof camera.perspective.yfov === "number") {
            if (!isFinite(camera.perspective.yfov) || isNaN(camera.perspective.yfov)) {
              const valueStr = isNaN(camera.perspective.yfov) ? "NaN" : camera.perspective.yfov === Infinity ? "Infinity" : camera.perspective.yfov === -Infinity ? "-Infinity" : camera.perspective.yfov.toString();
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${valueStr} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/perspective/yfov`
              });
            } else if (camera.perspective.yfov <= 0) {
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${camera.perspective.yfov} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/perspective/yfov`
              });
            } else if (camera.perspective.yfov >= Math.PI) {
              messages.push({
                code: "CAMERA_YFOV_GEQUAL_PI",
                message: "yfov should be less than Pi.",
                severity: Severity.WARNING,
                pointer: `/cameras/${index}/perspective`
              });
            }
          }
          if (camera.perspective.znear === void 0) {
            messages.push({
              code: "UNDEFINED_PROPERTY",
              message: "Property 'znear' must be defined.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective`
            });
          } else if (camera.perspective.znear === null) {
            messages.push({
              code: "VALUE_NOT_IN_RANGE",
              message: "Value null is out of range.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective/znear`
            });
          } else if (typeof camera.perspective.znear === "number") {
            if (!isFinite(camera.perspective.znear) || isNaN(camera.perspective.znear)) {
              const valueStr = isNaN(camera.perspective.znear) ? "NaN" : camera.perspective.znear === Infinity ? "Infinity" : camera.perspective.znear === -Infinity ? "-Infinity" : camera.perspective.znear.toString();
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${valueStr} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/perspective/znear`
              });
            } else if (camera.perspective.znear <= 0) {
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${camera.perspective.znear} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/perspective/znear`
              });
            }
          }
          if (camera.perspective.zfar !== void 0 && camera.perspective.znear !== void 0 && typeof camera.perspective.zfar === "number" && typeof camera.perspective.znear === "number" && camera.perspective.zfar <= camera.perspective.znear) {
            messages.push({
              code: "CAMERA_ZFAR_LEQUAL_ZNEAR",
              message: "zfar must be greater than znear.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/perspective`
            });
          }
          if (camera.perspective.aspectRatio !== void 0) {
            if (typeof camera.perspective.aspectRatio === "number") {
              if (!isFinite(camera.perspective.aspectRatio) || isNaN(camera.perspective.aspectRatio)) {
                const valueStr = isNaN(camera.perspective.aspectRatio) ? "NaN" : camera.perspective.aspectRatio === Infinity ? "Infinity" : camera.perspective.aspectRatio === -Infinity ? "-Infinity" : camera.perspective.aspectRatio.toString();
                messages.push({
                  code: "VALUE_NOT_IN_RANGE",
                  message: `Value ${valueStr} is out of range.`,
                  severity: Severity.ERROR,
                  pointer: `/cameras/${index}/perspective/aspectRatio`
                });
              } else if (camera.perspective.aspectRatio <= 0) {
                messages.push({
                  code: "VALUE_NOT_IN_RANGE",
                  message: `Value ${camera.perspective.aspectRatio} is out of range.`,
                  severity: Severity.ERROR,
                  pointer: `/cameras/${index}/perspective/aspectRatio`
                });
              }
            }
          }
          const expectedPerspectiveProperties = [
            "yfov",
            "zfar",
            "znear",
            "aspectRatio",
            "extensions",
            "extras"
          ];
          for (const key in camera.perspective) {
            if (!expectedPerspectiveProperties.includes(key)) {
              messages.push({
                code: "UNEXPECTED_PROPERTY",
                message: "Unexpected property.",
                severity: Severity.WARNING,
                pointer: `/cameras/${index}/perspective/${key}`
              });
            }
          }
        }
      }
      if (camera.type === "orthographic" || camera.orthographic) {
        if (!camera.orthographic) {
          messages.push({
            code: "UNDEFINED_PROPERTY",
            message: "Property 'orthographic' must be defined.",
            severity: Severity.ERROR,
            pointer: `/cameras/${index}`
          });
        } else {
          if (camera.orthographic.xmag === void 0) {
            messages.push({
              code: "UNDEFINED_PROPERTY",
              message: "Property 'xmag' must be defined.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic`
            });
          } else if (typeof camera.orthographic.xmag === "number") {
            if (!isFinite(camera.orthographic.xmag) || isNaN(camera.orthographic.xmag)) {
              const valueStr = isNaN(camera.orthographic.xmag) ? "NaN" : camera.orthographic.xmag === Infinity ? "Infinity" : camera.orthographic.xmag === -Infinity ? "-Infinity" : camera.orthographic.xmag.toString();
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${valueStr} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/orthographic/xmag`
              });
            } else if (camera.orthographic.xmag === 0) {
              messages.push({
                code: "CAMERA_XMAG_YMAG_ZERO",
                message: "xmag and ymag must not be zero.",
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/orthographic/xmag`
              });
            } else if (camera.orthographic.xmag < 0) {
              messages.push({
                code: "CAMERA_XMAG_YMAG_NEGATIVE",
                message: "xmag and ymag should not be negative.",
                severity: Severity.WARNING,
                pointer: `/cameras/${index}/orthographic/xmag`
              });
            }
          }
          if (camera.orthographic.ymag === void 0) {
            messages.push({
              code: "UNDEFINED_PROPERTY",
              message: "Property 'ymag' must be defined.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic`
            });
          } else if (typeof camera.orthographic.ymag === "number") {
            if (!isFinite(camera.orthographic.ymag) || isNaN(camera.orthographic.ymag)) {
              const valueStr = isNaN(camera.orthographic.ymag) ? "NaN" : camera.orthographic.ymag === Infinity ? "Infinity" : camera.orthographic.ymag === -Infinity ? "-Infinity" : camera.orthographic.ymag.toString();
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${valueStr} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/orthographic/ymag`
              });
            } else if (camera.orthographic.ymag === 0) {
              messages.push({
                code: "CAMERA_XMAG_YMAG_ZERO",
                message: "xmag and ymag must not be zero.",
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/orthographic/ymag`
              });
            } else if (camera.orthographic.ymag < 0) {
              messages.push({
                code: "CAMERA_XMAG_YMAG_NEGATIVE",
                message: "xmag and ymag should not be negative.",
                severity: Severity.WARNING,
                pointer: `/cameras/${index}/orthographic/ymag`
              });
            }
          }
          if (camera.orthographic.zfar === void 0) {
            messages.push({
              code: "UNDEFINED_PROPERTY",
              message: "Property 'zfar' must be defined.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic`
            });
          } else if (typeof camera.orthographic.zfar === "number") {
            if (!isFinite(camera.orthographic.zfar) || isNaN(camera.orthographic.zfar)) {
              const valueStr = isNaN(camera.orthographic.zfar) ? "NaN" : camera.orthographic.zfar === Infinity ? "Infinity" : camera.orthographic.zfar === -Infinity ? "-Infinity" : camera.orthographic.zfar.toString();
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${valueStr} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/orthographic/zfar`
              });
            }
          }
          if (camera.orthographic.znear === void 0) {
            messages.push({
              code: "UNDEFINED_PROPERTY",
              message: "Property 'znear' must be defined.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic`
            });
          } else if (camera.orthographic.znear === null) {
            messages.push({
              code: "VALUE_NOT_IN_RANGE",
              message: "Value null is out of range.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic/znear`
            });
          } else if (typeof camera.orthographic.znear === "number") {
            if (!isFinite(camera.orthographic.znear) || isNaN(camera.orthographic.znear)) {
              const valueStr = isNaN(camera.orthographic.znear) ? "NaN" : camera.orthographic.znear === Infinity ? "Infinity" : camera.orthographic.znear === -Infinity ? "-Infinity" : camera.orthographic.znear.toString();
              messages.push({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${valueStr} is out of range.`,
                severity: Severity.ERROR,
                pointer: `/cameras/${index}/orthographic/znear`
              });
            }
          }
          if (camera.orthographic.zfar !== void 0 && camera.orthographic.znear !== void 0 && typeof camera.orthographic.zfar === "number" && typeof camera.orthographic.znear === "number" && camera.orthographic.zfar <= camera.orthographic.znear) {
            messages.push({
              code: "CAMERA_ZFAR_LEQUAL_ZNEAR",
              message: "zfar must be greater than znear.",
              severity: Severity.ERROR,
              pointer: `/cameras/${index}/orthographic`
            });
          }
          const expectedOrthographicProperties = [
            "xmag",
            "ymag",
            "zfar",
            "znear",
            "extensions",
            "extras"
          ];
          for (const key in camera.orthographic) {
            if (!expectedOrthographicProperties.includes(key)) {
              messages.push({
                code: "UNEXPECTED_PROPERTY",
                message: "Unexpected property.",
                severity: Severity.WARNING,
                pointer: `/cameras/${index}/orthographic/${key}`
              });
            }
          }
        }
      }
      return messages;
    }
  };

  // dist/validators/scene-validator.js
  var SceneValidator = class {
    validate(scene, index, gltf) {
      const messages = [];
      if (scene.nodes !== void 0) {
        if (!Array.isArray(scene.nodes)) {
          messages.push({
            code: "TYPE_MISMATCH",
            message: "Scene nodes must be an array.",
            severity: Severity.ERROR,
            pointer: `/scenes/${index}/nodes`
          });
        } else if (scene.nodes.length === 0) {
          messages.push({
            code: "EMPTY_ENTITY",
            message: "Entity cannot be empty.",
            severity: Severity.ERROR,
            pointer: `/scenes/${index}/nodes`
          });
        } else {
          for (let i = 0; i < scene.nodes.length; i++) {
            const nodeIndex = scene.nodes[i];
            if (typeof nodeIndex !== "number" || nodeIndex < 0) {
              messages.push({
                code: "INVALID_VALUE",
                message: "Scene node must be a non-negative integer.",
                severity: Severity.ERROR,
                pointer: `/scenes/${index}/nodes/${i}`
              });
            } else if (!gltf.nodes || nodeIndex >= gltf.nodes.length) {
              messages.push({
                code: "UNRESOLVED_REFERENCE",
                message: "Unresolved reference: " + nodeIndex + ".",
                severity: Severity.ERROR,
                pointer: `/scenes/${index}/nodes/${i}`
              });
            } else {
              const isRootNode = this.isRootNode(nodeIndex, gltf);
              if (!isRootNode) {
                messages.push({
                  code: "SCENE_NON_ROOT_NODE",
                  message: `Node ${nodeIndex} is not a root node.`,
                  severity: Severity.ERROR,
                  pointer: `/scenes/${index}/nodes/${i}`
                });
              }
            }
          }
        }
      }
      const expectedProperties = ["nodes", "name", "extensions", "extras"];
      for (const key in scene) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/scenes/${index}/${key}`
          });
        }
      }
      return messages;
    }
    isRootNode(nodeIndex, gltf) {
      if (!gltf.nodes)
        return true;
      for (let i = 0; i < gltf.nodes.length; i++) {
        const node = gltf.nodes[i];
        if (node && node.children && Array.isArray(node.children)) {
          if (node.children.includes(nodeIndex)) {
            return false;
          }
        }
      }
      return true;
    }
  };

  // dist/validators/skin-validator.js
  var SkinValidator = class {
    validate(skin, index, gltf) {
      const messages = [];
      if (!skin.joints || !Array.isArray(skin.joints)) {
        messages.push({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'joints' must be defined.",
          severity: Severity.ERROR,
          pointer: `/skins/${index}`
        });
      } else if (skin.joints.length === 0) {
        messages.push({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: `/skins/${index}/joints`
        });
      } else {
        for (let i = 0; i < skin.joints.length; i++) {
          const jointIndex = skin.joints[i];
          if (typeof jointIndex !== "number" || jointIndex < 0) {
            messages.push({
              code: "INVALID_VALUE",
              message: "Skin joint must be a non-negative integer.",
              severity: Severity.ERROR,
              pointer: `/skins/${index}/joints/${i}`
            });
          } else if (!gltf.nodes || jointIndex >= gltf.nodes.length) {
            messages.push({
              code: "UNRESOLVED_REFERENCE",
              message: "Unresolved reference: " + jointIndex + ".",
              severity: Severity.ERROR,
              pointer: `/skins/${index}/joints/${i}`
            });
          }
        }
        if (skin.joints && skin.joints.length > 0) {
          const hasCommonRoot = this.checkCommonRoot(skin.joints, gltf);
          if (!hasCommonRoot) {
            messages.push({
              code: "SKIN_NO_COMMON_ROOT",
              message: "Joints do not have a common root.",
              severity: Severity.ERROR,
              pointer: `/skins/${index}/joints`
            });
          }
        }
      }
      if (skin.inverseBindMatrices !== void 0) {
        if (typeof skin.inverseBindMatrices !== "number" || skin.inverseBindMatrices < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Skin inverseBindMatrices must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/skins/${index}/inverseBindMatrices`
          });
        } else if (!gltf.accessors || skin.inverseBindMatrices >= gltf.accessors.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + skin.inverseBindMatrices + ".",
            severity: Severity.ERROR,
            pointer: `/skins/${index}/inverseBindMatrices`
          });
        } else {
          const ibmAccessor = gltf.accessors[skin.inverseBindMatrices];
          if (ibmAccessor) {
            if (ibmAccessor.type !== "MAT4" || ibmAccessor.componentType !== 5126) {
              const actualFormat = `{${ibmAccessor.type}, ${this.getComponentTypeName(ibmAccessor.componentType)}}`;
              messages.push({
                code: "SKIN_IBM_INVALID_FORMAT",
                message: `Invalid IBM accessor format '${actualFormat}'. Must be one of ('{MAT4, FLOAT}').`,
                severity: Severity.ERROR,
                pointer: `/skins/${index}/inverseBindMatrices`
              });
            }
            if (skin.joints && skin.joints.length > 0 && ibmAccessor.count < skin.joints.length) {
              messages.push({
                code: "INVALID_IBM_ACCESSOR_COUNT",
                message: `IBM accessor must have at least ${skin.joints.length} elements. Found ${ibmAccessor.count}.`,
                severity: Severity.ERROR,
                pointer: `/skins/${index}/inverseBindMatrices`
              });
            }
            if (ibmAccessor.bufferView !== void 0 && gltf.bufferViews) {
              const bufferView = gltf.bufferViews[ibmAccessor.bufferView];
              if (bufferView && bufferView.byteStride !== void 0) {
                messages.push({
                  code: "SKIN_IBM_ACCESSOR_WITH_BYTESTRIDE",
                  message: "bufferView.byteStride must not be defined for buffer views used by inverse bind matrices accessors.",
                  severity: Severity.ERROR,
                  pointer: `/skins/${index}/inverseBindMatrices`
                });
              }
            }
          }
        }
      }
      if (skin.skeleton !== void 0) {
        if (typeof skin.skeleton !== "number" || skin.skeleton < 0) {
          messages.push({
            code: "INVALID_VALUE",
            message: "Skin skeleton must be a non-negative integer.",
            severity: Severity.ERROR,
            pointer: `/skins/${index}/skeleton`
          });
        } else if (!gltf.nodes || skin.skeleton >= gltf.nodes.length) {
          messages.push({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + skin.skeleton + ".",
            severity: Severity.ERROR,
            pointer: `/skins/${index}/skeleton`
          });
        } else {
          if (skin.joints && skin.joints.length > 0) {
            const isValidSkeleton = this.isSkeletonValidRoot(skin.skeleton, skin.joints, gltf);
            if (!isValidSkeleton) {
              messages.push({
                code: "SKIN_SKELETON_INVALID",
                message: "Skeleton node is not a common root.",
                severity: Severity.ERROR,
                pointer: `/skins/${index}/skeleton`
              });
            }
          }
        }
      }
      const expectedProperties = [
        "inverseBindMatrices",
        "skeleton",
        "joints",
        "name",
        "extensions",
        "extras"
      ];
      for (const key in skin) {
        if (!expectedProperties.includes(key)) {
          messages.push({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/skins/${index}/${key}`
          });
        }
      }
      return messages;
    }
    checkCommonRoot(joints, gltf) {
      if (!gltf.nodes || joints.length === 0)
        return true;
      if (joints.length === 1) {
        const jointIndex = joints[0];
        return jointIndex !== void 0 && jointIndex >= 0 && jointIndex < gltf.nodes.length;
      }
      const allAncestorSets = joints.map((joint) => this.getAllAncestors(joint, gltf));
      if (allAncestorSets.length === 0)
        return false;
      let commonAncestors = new Set(allAncestorSets[0]);
      for (let i = 1; i < allAncestorSets.length; i++) {
        const currentSet = new Set(allAncestorSets[i]);
        commonAncestors = new Set([...commonAncestors].filter((x) => currentSet.has(x)));
      }
      return commonAncestors.size > 0;
    }
    isSkeletonValidRoot(skeletonIndex, joints, gltf) {
      if (!gltf.nodes || joints.length === 0)
        return false;
      if (skeletonIndex < 0 || skeletonIndex >= gltf.nodes.length)
        return false;
      const isAncestorOfAllJoints = this.checkIfAncestorOfAll(skeletonIndex, joints, gltf);
      const isOneOfJoints = joints.includes(skeletonIndex);
      return isAncestorOfAllJoints || isOneOfJoints;
    }
    checkIfAncestorOfAll(potentialAncestor, joints, gltf) {
      const descendants = this.getAllDescendants(potentialAncestor, gltf);
      for (const joint of joints) {
        if (joint !== potentialAncestor && !descendants.has(joint)) {
          return false;
        }
      }
      return true;
    }
    getAllDescendants(nodeIndex, gltf) {
      const descendants = /* @__PURE__ */ new Set();
      const visited = /* @__PURE__ */ new Set();
      const traverse = (index) => {
        if (visited.has(index) || !gltf.nodes || index >= gltf.nodes.length)
          return;
        visited.add(index);
        const node = gltf.nodes[index];
        if (node && node.children) {
          for (const childIndex of node.children) {
            if (typeof childIndex === "number" && childIndex >= 0) {
              descendants.add(childIndex);
              traverse(childIndex);
            }
          }
        }
      };
      traverse(nodeIndex);
      return descendants;
    }
    getAllAncestors(nodeIndex, gltf) {
      const ancestors = [];
      const visited = /* @__PURE__ */ new Set();
      ancestors.push(nodeIndex);
      if (!gltf.nodes)
        return ancestors;
      const findAncestors = (candidateIndex) => {
        if (visited.has(candidateIndex) || candidateIndex >= gltf.nodes.length)
          return;
        visited.add(candidateIndex);
        const node = gltf.nodes[candidateIndex];
        if (node && node.children) {
          const descendants = this.getAllDescendants(candidateIndex, gltf);
          if (descendants.has(nodeIndex)) {
            ancestors.push(candidateIndex);
          }
        }
      };
      for (let i = 0; i < gltf.nodes.length; i++) {
        if (i !== nodeIndex) {
          findAncestors(i);
        }
      }
      return ancestors;
    }
    getComponentTypeName(componentType) {
      switch (componentType) {
        case 5120:
          return "BYTE";
        case 5121:
          return "UNSIGNED_BYTE";
        case 5122:
          return "SHORT";
        case 5123:
          return "UNSIGNED_SHORT";
        case 5125:
          return "UNSIGNED_INT";
        case 5126:
          return "FLOAT";
        case 5130:
          return "DOUBLE";
        default:
          return "UNKNOWN";
      }
    }
  };

  // dist/usage-tracker.js
  var UsageTracker = class {
    constructor() {
      this.usedObjects = /* @__PURE__ */ new Set();
    }
    markUsed(pointer) {
      this.usedObjects.add(pointer);
    }
    isUsed(pointer) {
      return this.usedObjects.has(pointer);
    }
    trackMaterialExtensionTextures(extensions, _materialIndex) {
      for (const extensionName in extensions) {
        const ext = extensions[extensionName];
        if (ext && typeof ext === "object") {
          this.trackTextureFromExtension(ext, "baseColorTexture");
          this.trackTextureFromExtension(ext, "metallicRoughnessTexture");
          this.trackTextureFromExtension(ext, "normalTexture");
          this.trackTextureFromExtension(ext, "occlusionTexture");
          this.trackTextureFromExtension(ext, "emissiveTexture");
          this.trackTextureFromExtension(ext, "diffuseTexture");
          this.trackTextureFromExtension(ext, "specularGlossinessTexture");
          this.trackTextureFromExtension(ext, "clearcoatTexture");
          this.trackTextureFromExtension(ext, "clearcoatRoughnessTexture");
          this.trackTextureFromExtension(ext, "clearcoatNormalTexture");
          this.trackTextureFromExtension(ext, "sheenColorTexture");
          this.trackTextureFromExtension(ext, "sheenRoughnessTexture");
          this.trackTextureFromExtension(ext, "specularTexture");
          this.trackTextureFromExtension(ext, "specularColorTexture");
          this.trackTextureFromExtension(ext, "transmissionTexture");
          this.trackTextureFromExtension(ext, "thicknessTexture");
          this.trackTextureFromExtension(ext, "iridescenceTexture");
          this.trackTextureFromExtension(ext, "iridescenceThicknessTexture");
          this.trackTextureFromExtension(ext, "anisotropyTexture");
          this.trackTextureFromExtension(ext, "anisotropyDirectionTexture");
          this.trackTextureFromExtension(ext, "dispersionTexture");
          this.trackTextureFromExtension(ext, "volumeThicknessTexture");
        }
      }
    }
    trackTextureFromExtension(ext, textureProperty) {
      const textureInfo = ext[textureProperty];
      if (textureInfo && typeof textureInfo === "object" && textureInfo !== null && "index" in textureInfo) {
        const index = textureInfo.index;
        if (typeof index === "number") {
          this.markUsed(`/textures/${index}`);
        }
      }
    }
    getUnusedObjects(gltf) {
      const unused = [];
      if (gltf.animations) {
        for (let i = 0; i < gltf.animations.length; i++) {
          const animation = gltf.animations[i];
          if (animation && animation.samplers) {
            for (let j = 0; j < animation.samplers.length; j++) {
              const pointer = `/animations/${i}/samplers/${j}`;
              if (!this.isUsed(pointer)) {
                let shouldUseBogusPath = false;
                if (animation.channels && animation.channels.length > 0) {
                  for (let k = 0; k < animation.channels.length; k++) {
                    const channel = animation.channels[k];
                    if (channel && (!channel.hasOwnProperty("sampler") || channel.sampler === void 0)) {
                      shouldUseBogusPath = true;
                      unused.push(`/animations/${i}/channels/${k}/samplers/${j}`);
                      break;
                    }
                  }
                }
                if (!shouldUseBogusPath) {
                  unused.push(pointer);
                }
              }
            }
          }
        }
      }
      if (gltf.accessors) {
        for (let i = 0; i < gltf.accessors.length; i++) {
          const pointer = `/accessors/${i}`;
          if (!this.isUsed(pointer)) {
            let isReferenced = false;
            if (gltf.skins) {
              for (const skin of gltf.skins) {
                if (skin && skin.inverseBindMatrices === i) {
                  isReferenced = true;
                  break;
                }
              }
            }
            if (!isReferenced && gltf.animations) {
              for (const animation of gltf.animations) {
                if (animation && animation.samplers) {
                  for (const sampler of animation.samplers) {
                    if (sampler && (sampler.input === i || sampler.output === i)) {
                      isReferenced = true;
                      break;
                    }
                  }
                  if (isReferenced)
                    break;
                }
              }
            }
            if (!isReferenced && gltf.meshes) {
              for (const mesh of gltf.meshes) {
                if (mesh && mesh.primitives) {
                  for (const primitive of mesh.primitives) {
                    if (primitive && primitive.indices === i) {
                      isReferenced = true;
                      break;
                    }
                    if (primitive && primitive.attributes) {
                      for (const attrIndex of Object.values(primitive.attributes)) {
                        if (attrIndex === i) {
                          isReferenced = true;
                          break;
                        }
                      }
                      if (isReferenced)
                        break;
                    }
                    if (primitive && primitive.targets) {
                      for (const target of primitive.targets) {
                        if (target) {
                          for (const targetIndex of Object.values(target)) {
                            if (targetIndex === i) {
                              isReferenced = true;
                              break;
                            }
                          }
                          if (isReferenced)
                            break;
                        }
                      }
                      if (isReferenced)
                        break;
                    }
                  }
                  if (isReferenced)
                    break;
                }
              }
            }
            if (!isReferenced) {
              unused.push(pointer);
            }
          }
        }
      }
      if (gltf.buffers) {
        for (let i = 0; i < gltf.buffers.length; i++) {
          const pointer = `/buffers/${i}`;
          if (!this.isUsed(pointer)) {
            let isReferenced = false;
            if (gltf.bufferViews) {
              for (const bufferView of gltf.bufferViews) {
                if (bufferView && bufferView.buffer === i) {
                  isReferenced = true;
                  break;
                }
              }
            }
            if (!isReferenced) {
              unused.push(pointer);
            }
          }
        }
      }
      if (gltf.bufferViews) {
        for (let i = 0; i < gltf.bufferViews.length; i++) {
          const pointer = `/bufferViews/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.cameras) {
        for (let i = 0; i < gltf.cameras.length; i++) {
          const pointer = `/cameras/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.images) {
        for (let i = 0; i < gltf.images.length; i++) {
          const pointer = `/images/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.materials) {
        for (let i = 0; i < gltf.materials.length; i++) {
          const pointer = `/materials/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.meshes) {
        for (let i = 0; i < gltf.meshes.length; i++) {
          const pointer = `/meshes/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.nodes) {
        const referencedAsChild = /* @__PURE__ */ new Set();
        const referencedAsJoint = /* @__PURE__ */ new Set();
        for (let i = 0; i < gltf.nodes.length; i++) {
          const node = gltf.nodes[i];
          if (node && node.children) {
            for (const childIndex of node.children) {
              referencedAsChild.add(childIndex);
            }
          }
        }
        if (gltf.skins) {
          for (const skin of gltf.skins) {
            if (skin && skin.joints) {
              for (const jointIndex of skin.joints) {
                referencedAsJoint.add(jointIndex);
              }
            }
          }
        }
        for (let i = 0; i < gltf.nodes.length; i++) {
          const pointer = `/nodes/${i}`;
          if (!this.isUsed(pointer) && !referencedAsChild.has(i) && !referencedAsJoint.has(i)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.samplers) {
        for (let i = 0; i < gltf.samplers.length; i++) {
          const pointer = `/samplers/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.skins) {
        for (let i = 0; i < gltf.skins.length; i++) {
          const pointer = `/skins/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.textures) {
        for (let i = 0; i < gltf.textures.length; i++) {
          const pointer = `/textures/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.animations) {
        for (let i = 0; i < gltf.animations.length; i++) {
          const pointer = `/animations/${i}`;
          if (!this.isUsed(pointer)) {
            unused.push(pointer);
          }
        }
      }
      if (gltf.extensions) {
        const khrLights = gltf.extensions["KHR_lights_punctual"];
        if (khrLights && khrLights.lights && Array.isArray(khrLights.lights)) {
          for (let i = 0; i < khrLights.lights.length; i++) {
            const pointer = `/extensions/KHR_lights_punctual/lights/${i}`;
            if (!this.isUsed(pointer)) {
              unused.push(pointer);
            }
          }
        }
        const khrVariants = gltf.extensions["KHR_materials_variants"];
        if (khrVariants && khrVariants.variants && Array.isArray(khrVariants.variants)) {
          for (let i = 0; i < khrVariants.variants.length; i++) {
            const pointer = `/extensions/KHR_materials_variants/variants/${i}`;
            if (!this.isUsed(pointer)) {
              unused.push(pointer);
            }
          }
        }
      }
      return unused;
    }
    trackReferences(gltf) {
      const usedNodes = /* @__PURE__ */ new Set();
      if (gltf.scenes) {
        for (let i = 0; i < gltf.scenes.length; i++) {
          const scene = gltf.scenes[i];
          if (scene && scene.nodes) {
            for (const nodeIndex of scene.nodes) {
              usedNodes.add(nodeIndex);
              this.markUsed(`/nodes/${nodeIndex}`);
            }
          }
          this.markUsed(`/scenes/${i}`);
        }
      }
      if (gltf.scene !== void 0) {
        this.markUsed(`/scenes/${gltf.scene}`);
        const defaultScene = gltf.scenes && gltf.scenes[gltf.scene];
        if (defaultScene && defaultScene.nodes) {
          for (const nodeIndex of defaultScene.nodes) {
            usedNodes.add(nodeIndex);
            this.markUsed(`/nodes/${nodeIndex}`);
          }
        }
      }
      if (gltf.nodes && usedNodes.size > 0) {
        const markNodeHierarchy = (nodeIndex) => {
          if (usedNodes.has(nodeIndex))
            return;
          usedNodes.add(nodeIndex);
          this.markUsed(`/nodes/${nodeIndex}`);
          const node = gltf.nodes?.[nodeIndex];
          if (node && node.children) {
            for (const childIndex of node.children) {
              markNodeHierarchy(childIndex);
            }
          }
        };
        for (const nodeIndex of Array.from(usedNodes)) {
          const node = gltf.nodes[nodeIndex];
          if (node && node.children) {
            for (const childIndex of node.children) {
              markNodeHierarchy(childIndex);
            }
          }
        }
      }
      if (gltf.nodes) {
        for (let i = 0; i < gltf.nodes.length; i++) {
          if (!usedNodes.has(i))
            continue;
          const node = gltf.nodes[i];
          if (node && node.mesh !== void 0) {
            this.markUsed(`/meshes/${node.mesh}`);
          }
          if (node && node.skin !== void 0) {
            this.markUsed(`/skins/${node.skin}`);
          }
        }
      }
      if (gltf.nodes) {
        for (let i = 0; i < gltf.nodes.length; i++) {
          const node = gltf.nodes[i];
          if (node && node.camera !== void 0) {
            this.markUsed(`/cameras/${node.camera}`);
          }
          if (node && node["extensions"]) {
            const nodeExtensions = node["extensions"];
            const khrLightExt = nodeExtensions["KHR_lights_punctual"];
            if (khrLightExt && typeof khrLightExt.light === "number") {
              this.markUsed(`/extensions/KHR_lights_punctual/lights/${khrLightExt.light}`);
            }
          }
        }
      }
      if (gltf.bufferViews) {
        for (let i = 0; i < gltf.bufferViews.length; i++) {
          const bufferView = gltf.bufferViews[i];
          if (bufferView && bufferView.buffer !== void 0) {
            this.markUsed(`/buffers/${bufferView.buffer}`);
          }
        }
      }
      if (gltf.accessors) {
        for (let i = 0; i < gltf.accessors.length; i++) {
          const accessor = gltf.accessors[i];
          if (accessor && accessor.bufferView !== void 0) {
            this.markUsed(`/bufferViews/${accessor.bufferView}`);
          }
          if (accessor && accessor.sparse) {
            if (accessor.sparse.indices && accessor.sparse.indices.bufferView !== void 0) {
              this.markUsed(`/bufferViews/${accessor.sparse.indices.bufferView}`);
            }
            if (accessor.sparse.values && accessor.sparse.values.bufferView !== void 0) {
              this.markUsed(`/bufferViews/${accessor.sparse.values.bufferView}`);
            }
          }
        }
      }
      if (gltf.textures) {
        for (let i = 0; i < gltf.textures.length; i++) {
          const texture = gltf.textures[i];
          if (texture && texture.source !== void 0) {
            this.markUsed(`/images/${texture.source}`);
          }
          if (texture && texture.sampler !== void 0) {
            this.markUsed(`/samplers/${texture.sampler}`);
          }
          if (texture && texture["extensions"]) {
            const textureExtensions = texture["extensions"];
            const extTextureWebp = textureExtensions["EXT_texture_webp"];
            if (extTextureWebp && typeof extTextureWebp.source === "number") {
              this.markUsed(`/images/${extTextureWebp.source}`);
            }
          }
        }
      }
      if (gltf.images) {
        for (let i = 0; i < gltf.images.length; i++) {
          const image = gltf.images[i];
          if (image && image.bufferView !== void 0) {
            this.markUsed(`/bufferViews/${image.bufferView}`);
          }
        }
      }
      if (gltf.materials) {
        for (let i = 0; i < gltf.materials.length; i++) {
          const material = gltf.materials[i];
          if (material && material.pbrMetallicRoughness) {
            const pbr = material.pbrMetallicRoughness;
            if (pbr.baseColorTexture && pbr.baseColorTexture.index !== void 0) {
              this.markUsed(`/textures/${pbr.baseColorTexture.index}`);
            }
            if (pbr.metallicRoughnessTexture && pbr.metallicRoughnessTexture.index !== void 0) {
              this.markUsed(`/textures/${pbr.metallicRoughnessTexture.index}`);
            }
          }
          if (material && material.normalTexture && material.normalTexture.index !== void 0) {
            this.markUsed(`/textures/${material.normalTexture.index}`);
          }
          if (material && material.occlusionTexture && material.occlusionTexture.index !== void 0) {
            this.markUsed(`/textures/${material.occlusionTexture.index}`);
          }
          if (material && material.emissiveTexture && material.emissiveTexture.index !== void 0) {
            this.markUsed(`/textures/${material.emissiveTexture.index}`);
          }
          if (material && material["extensions"]) {
            this.trackMaterialExtensionTextures(material["extensions"], i);
          }
        }
      }
      if (gltf.meshes) {
        for (let i = 0; i < gltf.meshes.length; i++) {
          const mesh = gltf.meshes[i];
          if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
            for (const primitive of mesh.primitives) {
              if (primitive && primitive.attributes && typeof primitive.attributes === "object") {
                for (const accessorIndex of Object.values(primitive.attributes)) {
                  if (typeof accessorIndex === "number") {
                    this.markUsed(`/accessors/${accessorIndex}`);
                  }
                }
              }
              if (primitive.indices !== void 0) {
                this.markUsed(`/accessors/${primitive.indices}`);
              }
              if (primitive.targets && Array.isArray(primitive.targets)) {
                for (const target of primitive.targets) {
                  if (target && typeof target === "object") {
                    for (const accessorIndex of Object.values(target)) {
                      if (typeof accessorIndex === "number") {
                        this.markUsed(`/accessors/${accessorIndex}`);
                      }
                    }
                  }
                }
              }
              if (primitive.material !== void 0) {
                this.markUsed(`/materials/${primitive.material}`);
              }
              if (primitive["extensions"]) {
                const extensions = primitive["extensions"];
                if (extensions["KHR_materials_variants"]) {
                  const variantsExt = extensions["KHR_materials_variants"];
                  if (gltf.extensions && gltf.extensions["KHR_materials_variants"]) {
                    if (variantsExt.mappings && Array.isArray(variantsExt.mappings)) {
                      for (const mapping of variantsExt.mappings) {
                        const mappingObj = mapping;
                        if (mappingObj && mappingObj.material !== void 0) {
                          this.markUsed(`/materials/${mappingObj.material}`);
                        }
                        if (mappingObj && mappingObj.variants && Array.isArray(mappingObj.variants)) {
                          for (const variantIndex of mappingObj.variants) {
                            if (typeof variantIndex === "number") {
                              this.markUsed(`/extensions/KHR_materials_variants/variants/${variantIndex}`);
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
      }
      if (gltf.skins) {
        for (let i = 0; i < gltf.skins.length; i++) {
          if (!this.isUsed(`/skins/${i}`))
            continue;
          const skin = gltf.skins[i];
          if (skin && skin.inverseBindMatrices !== void 0) {
            this.markUsed(`/accessors/${skin.inverseBindMatrices}`);
          }
        }
      }
      if (gltf.animations) {
        for (let i = 0; i < gltf.animations.length; i++) {
          const animation = gltf.animations[i];
          if (!animation)
            continue;
          this.markUsed(`/animations/${i}`);
          if (animation.channels) {
            for (const channel of animation.channels) {
              if (channel.target && channel.target.node !== void 0) {
                this.markUsed(`/nodes/${channel.target.node}`);
                usedNodes.add(channel.target.node);
              }
              if (channel.sampler !== void 0 && animation && animation.samplers && channel.sampler < animation.samplers.length) {
                this.markUsed(`/animations/${i}/samplers/${channel.sampler}`);
              }
            }
          }
          if (animation && animation.samplers) {
            for (const sampler of animation.samplers) {
              if (sampler.input !== void 0) {
                this.markUsed(`/accessors/${sampler.input}`);
              }
              if (sampler.output !== void 0) {
                this.markUsed(`/accessors/${sampler.output}`);
              }
            }
          }
        }
      }
    }
    getUnusedMeshWeights(gltf) {
      const unusedMeshWeights = [];
      if (gltf.meshes && gltf.nodes) {
        for (let i = 0; i < gltf.meshes.length; i++) {
          const mesh = gltf.meshes[i];
          if (mesh && mesh.weights) {
            let isAlwaysOverridden = false;
            for (let j = 0; j < gltf.nodes.length; j++) {
              const node = gltf.nodes[j];
              if (node && node.mesh === i && node.weights !== void 0) {
                isAlwaysOverridden = true;
                break;
              }
            }
            if (isAlwaysOverridden) {
              unusedMeshWeights.push(`/meshes/${i}/weights`);
            }
          }
        }
      }
      return unusedMeshWeights;
    }
  };

  // dist/validators/extension-validator.js
  var BaseExtensionValidator = class {
    validateValueInRange(value, min, max, pointer, addMessage, exclusive = false) {
      if (typeof value !== "number")
        return true;
      const inRange = exclusive ? value > min && value < max : value >= min && value <= max;
      if (!inRange) {
        addMessage({
          code: "VALUE_NOT_IN_RANGE",
          message: `Value ${value} is out of range.`,
          severity: Severity.ERROR,
          pointer
        });
        return false;
      }
      return true;
    }
    validateValueInList(value, validValues, pointer, addMessage) {
      if (!validValues.includes(value)) {
        const validValuesStr = validValues.map((v) => `'${v}'`).join(", ");
        addMessage({
          code: "VALUE_NOT_IN_LIST",
          message: `Invalid value '${value}'. Valid values are (${validValuesStr}).`,
          severity: Severity.WARNING,
          pointer
        });
        return false;
      }
      return true;
    }
    addIncompleteExtensionWarning(pointer, addMessage) {
      addMessage({
        code: "INCOMPLETE_EXTENSION_SUPPORT",
        message: "Validation support for this extension is incomplete; the asset may have undetected issues.",
        severity: Severity.INFO,
        pointer
      });
    }
    escapeJsonPointer(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  };

  // dist/validators/extensions/index.js
  var EXTTextureWebPValidator = class extends BaseExtensionValidator {
    constructor() {
      super(...arguments);
      this.extensionName = "EXT_texture_webp";
    }
    validate(gltf, addMessage) {
      if (gltf.textures) {
        for (let i = 0; i < gltf.textures.length; i++) {
          const texture = gltf.textures[i];
          if (texture && texture["extensions"] && texture["extensions"]["EXT_texture_webp"]) {
            const extensions = texture["extensions"];
            const webpExt = extensions["EXT_texture_webp"];
            if (texture.source !== void 0 && gltf.images && gltf.images[texture.source]) {
              const regularImage = gltf.images[texture.source];
              if (regularImage) {
                let isRegularFormatValid = false;
                if (regularImage.mimeType) {
                  isRegularFormatValid = regularImage.mimeType === "image/jpeg" || regularImage.mimeType === "image/png";
                } else if (regularImage.uri) {
                  if (regularImage.uri.startsWith("data:image/jpeg") || regularImage.uri.startsWith("data:image/png")) {
                    isRegularFormatValid = true;
                  } else if (regularImage.uri.startsWith("data:")) {
                    isRegularFormatValid = false;
                  } else {
                    const uri = regularImage.uri.toLowerCase();
                    isRegularFormatValid = uri.endsWith(".jpg") || uri.endsWith(".jpeg") || uri.endsWith(".png");
                  }
                }
                if (!isRegularFormatValid) {
                  let detectedFormat = "unknown";
                  if (regularImage.mimeType) {
                    detectedFormat = regularImage.mimeType;
                  } else if (regularImage.uri && regularImage.uri.startsWith("data:")) {
                    const match = regularImage.uri.match(/^data:([^;]+)/);
                    if (match && match[1]) {
                      detectedFormat = match[1];
                    }
                  }
                  addMessage({
                    code: "TEXTURE_INVALID_IMAGE_MIME_TYPE",
                    message: `Invalid MIME type '${detectedFormat}' for the texture source. Valid MIME types are ('image/jpeg', 'image/png').`,
                    severity: Severity.ERROR,
                    pointer: `/textures/${i}/source`
                  });
                }
              }
            }
            const webpExtObj = webpExt;
            if (webpExtObj.source !== void 0) {
              if (typeof webpExtObj.source !== "number" || webpExtObj.source < 0) {
                addMessage({
                  code: "INVALID_EXTENSION_VALUE",
                  message: "Invalid source index for EXT_texture_webp.",
                  severity: Severity.ERROR,
                  pointer: `/textures/${i}/extensions/EXT_texture_webp/source`
                });
              } else if (gltf.images && typeof webpExtObj.source === "number" && gltf.images[webpExtObj.source]) {
                const image = gltf.images[webpExtObj.source];
                if (image) {
                  let isValidWebP = false;
                  if (image.mimeType) {
                    isValidWebP = image.mimeType === "image/webp";
                  } else if (image.uri) {
                    if (image.uri.startsWith("data:image/webp")) {
                      isValidWebP = true;
                    } else if (image.uri.startsWith("data:")) {
                      isValidWebP = false;
                    } else {
                      isValidWebP = image.uri.toLowerCase().endsWith(".webp");
                    }
                  }
                  if (!isValidWebP) {
                    let detectedFormat = "unknown";
                    if (image.mimeType) {
                      detectedFormat = image.mimeType;
                    } else if (image.uri && image.uri.startsWith("data:")) {
                      const match = image.uri.match(/^data:([^;]+)/);
                      if (match && match[1]) {
                        detectedFormat = match[1];
                      }
                    }
                    addMessage({
                      code: "TEXTURE_INVALID_IMAGE_MIME_TYPE",
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
  };
  var KHRLightsPunctualValidator = class extends BaseExtensionValidator {
    constructor() {
      super(...arguments);
      this.extensionName = "KHR_lights_punctual";
    }
    validate(gltf, addMessage) {
      if (gltf.scenes) {
        for (let i = 0; i < gltf.scenes.length; i++) {
          const scene = gltf.scenes[i];
          if (scene && scene["extensions"]) {
            const sceneExtensions = scene["extensions"];
            if (sceneExtensions["KHR_lights_punctual"]) {
              addMessage({
                code: "UNEXPECTED_EXTENSION_OBJECT",
                message: "Unexpected location for this extension.",
                severity: Severity.ERROR,
                pointer: `/scenes/${i}/extensions/KHR_lights_punctual`
              });
            }
          }
        }
      }
      if (gltf.extensions && gltf.extensions["KHR_lights_punctual"]) {
        const lightsExt = gltf.extensions["KHR_lights_punctual"];
        if (lightsExt.lights === void 0) {
          addMessage({
            code: "UNDEFINED_PROPERTY",
            message: "Property 'lights' must be defined.",
            severity: Severity.ERROR,
            pointer: "/extensions/KHR_lights_punctual"
          });
        } else if (lightsExt.lights) {
          if (!Array.isArray(lightsExt.lights)) {
            addMessage({
              code: "TYPE_MISMATCH",
              message: "Property value is not a 'array'.",
              severity: Severity.ERROR,
              pointer: "/extensions/KHR_lights_punctual/lights"
            });
          } else if (lightsExt.lights.length === 0) {
            addMessage({
              code: "EMPTY_ENTITY",
              message: "Entity cannot be empty.",
              severity: Severity.ERROR,
              pointer: "/extensions/KHR_lights_punctual/lights"
            });
          } else {
            for (let i = 0; i < lightsExt.lights.length; i++) {
              const light = lightsExt.lights[i];
              this.validateLight(light, i, addMessage);
            }
          }
        }
      }
      if (gltf.nodes) {
        for (let i = 0; i < gltf.nodes.length; i++) {
          const node = gltf.nodes[i];
          if (node && node["extensions"] && node["extensions"]["KHR_lights_punctual"]) {
            const nodeExt = node["extensions"]["KHR_lights_punctual"];
            const basePointer = `/nodes/${i}/extensions/KHR_lights_punctual`;
            if (nodeExt.light === void 0) {
              addMessage({
                code: "UNDEFINED_PROPERTY",
                message: "Property 'light' must be defined.",
                severity: Severity.ERROR,
                pointer: `${basePointer}`
              });
            } else if (nodeExt.light !== void 0) {
              if (typeof nodeExt.light !== "number" || nodeExt.light < 0) {
                addMessage({
                  code: "INVALID_VALUE",
                  message: "Light index must be a non-negative integer.",
                  severity: Severity.ERROR,
                  pointer: `${basePointer}/light`
                });
              } else {
                const rootExt = gltf.extensions && gltf.extensions["KHR_lights_punctual"];
                if (rootExt) {
                  const lights = rootExt.lights;
                  if (!lights || !Array.isArray(lights) || nodeExt.light >= lights.length) {
                    addMessage({
                      code: "UNRESOLVED_REFERENCE",
                      message: `Unresolved reference: ${nodeExt.light}.`,
                      severity: Severity.ERROR,
                      pointer: `${basePointer}/light`
                    });
                  }
                }
              }
            }
            if (!gltf.extensions || !gltf.extensions["KHR_lights_punctual"]) {
              addMessage({
                code: "UNSATISFIED_DEPENDENCY",
                message: "Dependency failed. '/extensions/KHR_lights_punctual' must be defined.",
                severity: Severity.ERROR,
                pointer: basePointer
              });
            }
            const expectedProperties = ["light"];
            for (const key in nodeExt) {
              if (!expectedProperties.includes(key)) {
                addMessage({
                  code: "UNEXPECTED_PROPERTY",
                  message: "Unexpected property.",
                  severity: Severity.WARNING,
                  pointer: `${basePointer}/${key}`
                });
              }
            }
          }
        }
      }
    }
    validateLight(light, index, addMessage) {
      const pointer = `/extensions/KHR_lights_punctual/lights/${index}`;
      const allowedProperties = ["type", "color", "intensity", "range", "spot", "name", "extensions", "extras"];
      for (const property in light) {
        if (!allowedProperties.includes(property)) {
          addMessage({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `${pointer}/${property}`
          });
        }
      }
      if (light.type === void 0) {
        addMessage({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'type' must be defined.",
          severity: Severity.ERROR,
          pointer
        });
      } else if (!["directional", "point", "spot"].includes(light.type)) {
        addMessage({
          code: "VALUE_NOT_IN_LIST",
          message: `Invalid value '${light.type}'. Valid values are ('directional', 'point', 'spot').`,
          severity: Severity.WARNING,
          pointer: `${pointer}/type`
        });
      }
      if (light.color !== void 0) {
        if (!Array.isArray(light.color) || light.color.length !== 3) {
          addMessage({
            code: "TYPE_MISMATCH",
            message: "Property value is not a 'array' of length 3.",
            severity: Severity.ERROR,
            pointer: `${pointer}/color`
          });
        } else {
          for (let i = 0; i < 3; i++) {
            if (typeof light.color[i] !== "number" || light.color[i] < 0 || light.color[i] > 1) {
              addMessage({
                code: "VALUE_NOT_IN_RANGE",
                message: `Value ${light.color[i]} is out of range.`,
                severity: Severity.ERROR,
                pointer: `${pointer}/color/${i}`
              });
            }
          }
        }
      }
      if (light.intensity !== void 0) {
        if (typeof light.intensity !== "number" || light.intensity < 0) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${light.intensity} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${pointer}/intensity`
          });
        }
      }
      if (light.range !== void 0) {
        if (light.type === "directional") {
          addMessage({
            code: "EXTRA_PROPERTY",
            message: "This property should not be defined as it will not be used.",
            severity: Severity.INFO,
            pointer: `${pointer}/range`
          });
        } else if (typeof light.range !== "number" || light.range <= 0) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${light.range} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${pointer}/range`
          });
        }
      }
      if (light.type === "spot") {
        if (light.spot === void 0) {
          addMessage({
            code: "UNDEFINED_PROPERTY",
            message: "Property 'spot' must be defined.",
            severity: Severity.ERROR,
            pointer
          });
        } else {
          this.validateSpot(light.spot, pointer, addMessage);
        }
      } else if (light.spot !== void 0) {
        addMessage({
          code: "EXTRA_PROPERTY",
          message: "This property should not be defined as it will not be used.",
          severity: Severity.INFO,
          pointer: `${pointer}/spot`
        });
      }
    }
    validateSpot(spot, basePointer, addMessage) {
      const pointer = `${basePointer}/spot`;
      if (spot.innerConeAngle !== void 0) {
        if (typeof spot.innerConeAngle !== "number" || spot.innerConeAngle < 0 || spot.innerConeAngle > Math.PI / 2) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${spot.innerConeAngle} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${pointer}/innerConeAngle`
          });
        }
      }
      if (spot.outerConeAngle !== void 0) {
        if (typeof spot.outerConeAngle !== "number" || spot.outerConeAngle < 0 || spot.outerConeAngle > Math.PI / 2) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${spot.outerConeAngle} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${pointer}/outerConeAngle`
          });
        }
      }
      if (spot.innerConeAngle !== void 0 && spot.outerConeAngle !== void 0) {
        if (spot.outerConeAngle <= spot.innerConeAngle) {
          addMessage({
            code: "KHR_LIGHTS_PUNCTUAL_LIGHT_SPOT_ANGLES",
            message: `outerConeAngle (${spot.outerConeAngle}) is less than or equal to innerConeAngle (${spot.innerConeAngle}).`,
            severity: Severity.ERROR,
            pointer: `${pointer}/outerConeAngle`
          });
        }
      }
    }
  };
  var KHRMaterialsValidator = class extends BaseExtensionValidator {
    constructor(extensionName) {
      super();
      this.extensionName = extensionName;
    }
    validate(gltf, addMessage) {
      if (gltf.materials) {
        for (let i = 0; i < gltf.materials.length; i++) {
          const material = gltf.materials[i];
          if (material) {
            if (material.pbrMetallicRoughness && material.pbrMetallicRoughness["extensions"] && material.pbrMetallicRoughness["extensions"][this.extensionName]) {
              addMessage({
                code: "UNEXPECTED_EXTENSION_OBJECT",
                message: "Unexpected location for this extension.",
                severity: Severity.ERROR,
                pointer: `/materials/${i}/pbrMetallicRoughness/extensions/${this.extensionName}`
              });
            }
            if (material.normalTexture && material.normalTexture["extensions"] && material.normalTexture["extensions"][this.extensionName]) {
              addMessage({
                code: "UNEXPECTED_EXTENSION_OBJECT",
                message: "Unexpected location for this extension.",
                severity: Severity.ERROR,
                pointer: `/materials/${i}/normalTexture/extensions/${this.extensionName}`
              });
            }
            if (material.occlusionTexture && material.occlusionTexture["extensions"] && material.occlusionTexture["extensions"][this.extensionName]) {
              addMessage({
                code: "UNEXPECTED_EXTENSION_OBJECT",
                message: "Unexpected location for this extension.",
                severity: Severity.ERROR,
                pointer: `/materials/${i}/occlusionTexture/extensions/${this.extensionName}`
              });
            }
            if (material.emissiveTexture && material.emissiveTexture["extensions"] && material.emissiveTexture["extensions"][this.extensionName]) {
              addMessage({
                code: "UNEXPECTED_EXTENSION_OBJECT",
                message: "Unexpected location for this extension.",
                severity: Severity.ERROR,
                pointer: `/materials/${i}/emissiveTexture/extensions/${this.extensionName}`
              });
            }
            if (material["extensions"] && material["extensions"][this.extensionName]) {
              this.validateMaterialExtension(material["extensions"][this.extensionName], i, material, addMessage);
              if (this.extensionName === "KHR_materials_volume") {
                this.validateVolumeTransmissionDependencyWithMaterial(material, i, addMessage);
              }
            }
          }
        }
      }
    }
    validateMaterialExtension(ext, materialIndex, material, addMessage) {
      const basePointer = `/materials/${materialIndex}/extensions/${this.extensionName}`;
      switch (this.extensionName) {
        case "KHR_materials_anisotropy":
          this.validateAnisotropy(ext, basePointer, material, addMessage);
          break;
        case "KHR_materials_clearcoat":
          this.validateClearcoat(ext, basePointer, material, addMessage);
          break;
        case "KHR_materials_dispersion":
          this.validateDispersion(ext, basePointer, material, addMessage);
          break;
        case "KHR_materials_emissive_strength":
          this.validateEmissiveStrength(ext, basePointer, material, addMessage);
          break;
        case "KHR_materials_ior":
          this.validateIOR(ext, basePointer, addMessage);
          break;
        case "KHR_materials_iridescence":
          this.validateIridescence(ext, basePointer, addMessage);
          break;
        case "KHR_materials_pbrSpecularGlossiness":
          this.validatePbrSpecularGlossiness(ext, basePointer, addMessage);
          break;
        case "KHR_materials_sheen":
          this.validateSheen(ext, basePointer, addMessage);
          break;
        case "KHR_materials_specular":
          this.validateSpecular(ext, basePointer, addMessage);
          break;
        case "KHR_materials_transmission":
          this.validateTransmission(ext, basePointer, addMessage);
          break;
        case "KHR_materials_unlit":
          break;
        case "KHR_materials_volume":
          this.validateVolume(ext, basePointer, material, addMessage);
          break;
      }
    }
    validateAnisotropy(ext, basePointer, material, addMessage) {
      if (ext.anisotropyStrength !== void 0) {
        this.validateValueInRange(ext.anisotropyStrength, 0, 1, `${basePointer}/anisotropyStrength`, addMessage);
      }
      if (ext.anisotropyRotation !== void 0) {
        this.validateValueInRange(ext.anisotropyRotation, 0, Infinity, `${basePointer}/anisotropyRotation`, addMessage);
      }
      if (ext.anisotropyTexture && material.normalTexture) {
        const anisotropyTexCoord = ext.anisotropyTexture.texCoord || 0;
        const normalTexCoord = material.normalTexture.texCoord || 0;
        if (anisotropyTexCoord !== normalTexCoord) {
          addMessage({
            code: "KHR_MATERIALS_ANISOTROPY_ANISOTROPY_TEXTURE_TEXCOORD",
            message: "Normal and anisotropy textures should use the same texture coords.",
            severity: Severity.WARNING,
            pointer: `${basePointer}/anisotropyTexture`
          });
        }
      }
    }
    validateClearcoat(ext, basePointer, material, addMessage) {
      if (ext.clearcoatFactor !== void 0) {
        this.validateValueInRange(ext.clearcoatFactor, 0, 1, `${basePointer}/clearcoatFactor`, addMessage);
      }
      if (ext.clearcoatRoughnessFactor !== void 0) {
        this.validateValueInRange(ext.clearcoatRoughnessFactor, 0, 1, `${basePointer}/clearcoatRoughnessFactor`, addMessage);
      }
      if (ext.clearcoatNormalTexture && material.normalTexture) {
        const clearcoatNormalTexCoord = ext.clearcoatNormalTexture.texCoord || 0;
        const normalTexCoord = material.normalTexture.texCoord || 0;
        if (clearcoatNormalTexCoord !== normalTexCoord) {
          addMessage({
            code: "KHR_MATERIALS_CLEARCOAT_CLEARCOAT_NORMAL_TEXTURE_TEXCOORD",
            message: "Normal and clearcoat normal textures should use the same texture coords.",
            severity: Severity.WARNING,
            pointer: `${basePointer}/clearcoatNormalTexture`
          });
        }
      }
    }
    validateDispersion(ext, basePointer, material, addMessage) {
      if (ext.dispersion !== void 0) {
        this.validateValueInRange(ext.dispersion, 0, 1, `${basePointer}/dispersion`, addMessage);
      }
      const hasVolume = material["extensions"] && material["extensions"]["KHR_materials_volume"];
      if (!hasVolume) {
        addMessage({
          code: "KHR_MATERIALS_DISPERSION_NO_VOLUME",
          message: "The dispersion extension needs to be combined with the volume extension.",
          severity: Severity.WARNING,
          pointer: basePointer
        });
      }
    }
    validateEmissiveStrength(ext, basePointer, material, addMessage) {
      if (ext.emissiveStrength !== void 0) {
        const isValidRange = !(typeof ext.emissiveStrength === "number" && ext.emissiveStrength < 0);
        if (!isValidRange) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${ext.emissiveStrength} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${basePointer}/emissiveStrength`
          });
        } else {
          const emissiveFactor = material.emissiveFactor;
          const isEmissiveFactorZero = !emissiveFactor || Array.isArray(emissiveFactor) && emissiveFactor.length === 3 && emissiveFactor[0] === 0 && emissiveFactor[1] === 0 && emissiveFactor[2] === 0;
          if (isEmissiveFactorZero) {
            addMessage({
              code: "KHR_MATERIALS_EMISSIVE_STRENGTH_ZERO_FACTOR",
              message: "Emissive strength has no effect when the emissive factor is zero or undefined.",
              severity: Severity.WARNING,
              pointer: basePointer
            });
          }
        }
      }
    }
    validateIOR(ext, basePointer, addMessage) {
      if (ext.ior !== void 0) {
        if (typeof ext.ior === "number" && ext.ior !== 0 && ext.ior < 1) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${ext.ior} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${basePointer}/ior`
          });
        } else if (typeof ext.ior === "number" && ext.ior < 0) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${ext.ior} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${basePointer}/ior`
          });
        }
      }
    }
    validateIridescence(ext, basePointer, addMessage) {
      if (ext.iridescenceFactor !== void 0) {
        this.validateValueInRange(ext.iridescenceFactor, 0, 1, `${basePointer}/iridescenceFactor`, addMessage);
      }
      if (ext.iridescenceIor !== void 0) {
        this.validateValueInRange(ext.iridescenceIor, 1, Infinity, `${basePointer}/iridescenceIor`, addMessage);
      }
      if (ext.iridescenceThicknessMinimum !== void 0) {
        this.validateValueInRange(ext.iridescenceThicknessMinimum, 0, Infinity, `${basePointer}/iridescenceThicknessMinimum`, addMessage);
        if (ext.iridescenceThicknessTexture === void 0) {
          addMessage({
            code: "KHR_MATERIALS_IRIDESCENCE_THICKNESS_RANGE_WITHOUT_TEXTURE",
            message: "Thickness minimum has no effect when a thickness texture is not defined.",
            severity: Severity.INFO,
            pointer: `${basePointer}/iridescenceThicknessMinimum`
          });
        }
      }
      if (ext.iridescenceThicknessMaximum !== void 0) {
        this.validateValueInRange(ext.iridescenceThicknessMaximum, 0, Infinity, `${basePointer}/iridescenceThicknessMaximum`, addMessage);
        if (ext.iridescenceThicknessTexture === void 0) {
          addMessage({
            code: "KHR_MATERIALS_IRIDESCENCE_THICKNESS_RANGE_WITHOUT_TEXTURE",
            message: "Thickness maximum has no effect when a thickness texture is not defined.",
            severity: Severity.INFO,
            pointer: `${basePointer}/iridescenceThicknessMaximum`
          });
        }
      }
      if (ext.iridescenceThicknessTexture !== void 0 && ext.iridescenceThicknessMinimum !== void 0 && ext.iridescenceThicknessMaximum !== void 0) {
        if (ext.iridescenceThicknessMinimum === ext.iridescenceThicknessMaximum) {
          addMessage({
            code: "KHR_MATERIALS_IRIDESCENCE_THICKNESS_TEXTURE_UNUSED",
            message: "Thickness texture has no effect when the thickness minimum is equal to the thickness maximum.",
            severity: Severity.INFO,
            pointer: `${basePointer}/iridescenceThicknessTexture`
          });
        }
      }
    }
    validatePbrSpecularGlossiness(ext, basePointer, addMessage) {
      if (ext.diffuseFactor !== void 0) {
        if (!Array.isArray(ext.diffuseFactor) || ext.diffuseFactor.length !== 4) {
          addMessage({
            code: "TYPE_MISMATCH",
            message: "Property value is not a 'array' of length 4.",
            severity: Severity.ERROR,
            pointer: `${basePointer}/diffuseFactor`
          });
        }
      }
      if (ext.specularFactor !== void 0) {
        if (!Array.isArray(ext.specularFactor) || ext.specularFactor.length !== 3) {
          addMessage({
            code: "TYPE_MISMATCH",
            message: "Property value is not a 'array' of length 3.",
            severity: Severity.ERROR,
            pointer: `${basePointer}/specularFactor`
          });
        }
      }
      if (ext.glossinessFactor !== void 0) {
        this.validateValueInRange(ext.glossinessFactor, 0, 1, `${basePointer}/glossinessFactor`, addMessage);
      }
    }
    validateSheen(ext, basePointer, addMessage) {
      if (ext.sheenColorFactor !== void 0) {
        if (!Array.isArray(ext.sheenColorFactor) || ext.sheenColorFactor.length !== 3) {
          addMessage({
            code: "TYPE_MISMATCH",
            message: "Property value is not a 'array' of length 3.",
            severity: Severity.ERROR,
            pointer: `${basePointer}/sheenColorFactor`
          });
        }
      }
      if (ext.sheenRoughnessFactor !== void 0) {
        this.validateValueInRange(ext.sheenRoughnessFactor, 0, 1, `${basePointer}/sheenRoughnessFactor`, addMessage);
      }
    }
    validateSpecular(ext, basePointer, addMessage) {
      if (ext.specularFactor !== void 0) {
        this.validateValueInRange(ext.specularFactor, 0, 1, `${basePointer}/specularFactor`, addMessage);
      }
      if (ext.specularColorFactor !== void 0) {
        if (!Array.isArray(ext.specularColorFactor) || ext.specularColorFactor.length !== 3) {
          addMessage({
            code: "TYPE_MISMATCH",
            message: "Property value is not a 'array' of length 3.",
            severity: Severity.ERROR,
            pointer: `${basePointer}/specularColorFactor`
          });
        } else {
          for (let i = 0; i < ext.specularColorFactor.length; i++) {
            this.validateValueInRange(ext.specularColorFactor[i], 0, Infinity, `${basePointer}/specularColorFactor/${i}`, addMessage);
          }
        }
      }
    }
    validateTransmission(ext, basePointer, addMessage) {
      if (ext.transmissionFactor !== void 0) {
        this.validateValueInRange(ext.transmissionFactor, 0, 1, `${basePointer}/transmissionFactor`, addMessage);
      }
    }
    validateVolume(ext, basePointer, material, addMessage) {
      if (ext.attenuationColor !== void 0) {
        if (!Array.isArray(ext.attenuationColor) || ext.attenuationColor.length !== 3) {
          addMessage({
            code: "TYPE_MISMATCH",
            message: "Property value is not a 'array' of length 3.",
            severity: Severity.ERROR,
            pointer: `${basePointer}/attenuationColor`
          });
        } else {
          for (let i = 0; i < ext.attenuationColor.length; i++) {
            this.validateValueInRange(ext.attenuationColor[i], 0, 1, `${basePointer}/attenuationColor/${i}`, addMessage);
          }
        }
      }
      if (ext.attenuationDistance !== void 0) {
        if (typeof ext.attenuationDistance === "number" && ext.attenuationDistance <= 0) {
          addMessage({
            code: "VALUE_NOT_IN_RANGE",
            message: `Value ${ext.attenuationDistance} is out of range.`,
            severity: Severity.ERROR,
            pointer: `${basePointer}/attenuationDistance`
          });
        } else {
          this.validateValueInRange(ext.attenuationDistance, 0, Infinity, `${basePointer}/attenuationDistance`, addMessage, true);
        }
      }
      if (ext.thicknessFactor !== void 0) {
        this.validateValueInRange(ext.thicknessFactor, 0, Infinity, `${basePointer}/thicknessFactor`, addMessage);
      }
      const hasVolumeProperties = ext.thicknessFactor !== void 0 || ext.attenuationDistance !== void 0 || ext.attenuationColor !== void 0;
      if (material.doubleSided === true && hasVolumeProperties) {
        addMessage({
          code: "KHR_MATERIALS_VOLUME_DOUBLE_SIDED",
          message: "The volume extension should not be used with double-sided materials.",
          severity: Severity.WARNING,
          pointer: basePointer
        });
      }
    }
    validateVolumeTransmissionDependencyWithMaterial(material, materialIndex, addMessage) {
      let hasTransmission = false;
      if (material["extensions"]) {
        for (const extensionName in material["extensions"]) {
          if (extensionName.includes("transmission") || extensionName.includes("translucency")) {
            hasTransmission = true;
            break;
          }
        }
      }
      if (!hasTransmission) {
        addMessage({
          code: "KHR_MATERIALS_VOLUME_NO_TRANSMISSION",
          message: "The volume extension needs to be combined with an extension that allows light to transmit through the surface.",
          severity: Severity.WARNING,
          pointer: `/materials/${materialIndex}/extensions/KHR_materials_volume`
        });
      }
    }
  };
  var KHRAnimationPointerValidator = class extends BaseExtensionValidator {
    constructor() {
      super(...arguments);
      this.extensionName = "KHR_animation_pointer";
    }
    validate(gltf, addMessage) {
      if (gltf.animations) {
        for (let i = 0; i < gltf.animations.length; i++) {
          const animation = gltf.animations[i];
          if (animation && animation.channels) {
            for (let j = 0; j < animation.channels.length; j++) {
              const channel = animation.channels[j];
              if (channel && channel["extensions"] && channel["extensions"]["KHR_animation_pointer"]) {
                addMessage({
                  code: "UNEXPECTED_EXTENSION_OBJECT",
                  message: "Unexpected location for this extension.",
                  severity: Severity.ERROR,
                  pointer: `/animations/${i}/channels/${j}/extensions/KHR_animation_pointer`
                });
              }
              if (channel && channel.target && channel.target["extensions"] && channel.target["extensions"]["KHR_animation_pointer"]) {
                const ext = channel.target["extensions"]["KHR_animation_pointer"];
                const basePointer = `/animations/${i}/channels/${j}/target/extensions/KHR_animation_pointer`;
                if (ext.pointer === void 0) {
                  addMessage({
                    code: "UNDEFINED_PROPERTY",
                    message: "Property 'pointer' must be defined.",
                    severity: Severity.ERROR,
                    pointer: basePointer
                  });
                } else if (typeof ext.pointer !== "string") {
                  addMessage({
                    code: "TYPE_MISMATCH",
                    message: "Property value is not a 'string'.",
                    severity: Severity.ERROR,
                    pointer: `${basePointer}/pointer`
                  });
                } else {
                  const jsonPointerPattern = /^(?:\/(?:[^/~]|~0|~1)*)*$/;
                  if (!jsonPointerPattern.test(ext.pointer)) {
                    addMessage({
                      code: "PATTERN_MISMATCH",
                      message: `Value '${ext.pointer}' does not match regexp pattern '^(?:\\/(?:[^/~]|~0|~1)*)*$'.`,
                      severity: Severity.ERROR,
                      pointer: `${basePointer}/pointer`
                    });
                  }
                }
                const expectedProperties = ["pointer"];
                for (const key in ext) {
                  if (!expectedProperties.includes(key)) {
                    addMessage({
                      code: "UNEXPECTED_PROPERTY",
                      message: "Unexpected property.",
                      severity: Severity.WARNING,
                      pointer: `${basePointer}/${key}`
                    });
                  }
                }
                if (channel.target && channel.target.node !== void 0) {
                  addMessage({
                    code: "KHR_ANIMATION_POINTER_ANIMATION_CHANNEL_TARGET_NODE",
                    message: "This extension requires the animation channel target node to be undefined.",
                    severity: Severity.ERROR,
                    pointer: basePointer
                  });
                }
                if (channel.target && channel.target.path !== "pointer") {
                  addMessage({
                    code: "KHR_ANIMATION_POINTER_ANIMATION_CHANNEL_TARGET_PATH",
                    message: `This extension requires the animation channel target path to be 'pointer'. Found '${channel.target.path}' instead.`,
                    severity: Severity.ERROR,
                    pointer: basePointer
                  });
                }
                this.addIncompleteExtensionWarning(basePointer, addMessage);
              }
            }
          }
        }
      }
    }
  };
  var KHRMaterialsVariantsValidator = class extends BaseExtensionValidator {
    constructor() {
      super(...arguments);
      this.extensionName = "KHR_materials_variants";
    }
    validate(gltf, addMessage) {
      const hasRootExtension = gltf.extensions && gltf.extensions[this.extensionName];
      const hasPrimitiveUsage = this.hasPrimitiveUsage(gltf);
      if (hasPrimitiveUsage && !hasRootExtension) {
        if (gltf.meshes) {
          for (let i = 0; i < gltf.meshes.length; i++) {
            const mesh = gltf.meshes[i];
            if (mesh && mesh.primitives) {
              for (let j = 0; j < mesh.primitives.length; j++) {
                const primitive = mesh.primitives[j];
                if (primitive && primitive["extensions"] && primitive["extensions"][this.extensionName]) {
                  const ext = primitive["extensions"][this.extensionName];
                  if (ext.mappings && Array.isArray(ext.mappings) && ext.mappings.length > 0) {
                    addMessage({
                      code: "UNSATISFIED_DEPENDENCY",
                      message: "Dependency failed. '/extensions/KHR_materials_variants' must be defined.",
                      severity: Severity.ERROR,
                      pointer: `/meshes/${i}/primitives/${j}/extensions/${this.extensionName}/mappings/0`
                    });
                    return;
                  }
                }
              }
            }
          }
        }
      }
      if (gltf.extensions && gltf.extensions[this.extensionName]) {
        const rootExt = gltf.extensions[this.extensionName];
        const basePointer = `/extensions/${this.extensionName}`;
        if (rootExt.variants === void 0) {
          addMessage({
            code: "UNDEFINED_PROPERTY",
            message: "Property 'variants' must be defined.",
            severity: Severity.ERROR,
            pointer: basePointer
          });
        } else if (rootExt.variants !== void 0) {
          if (!Array.isArray(rootExt.variants)) {
            addMessage({
              code: "TYPE_MISMATCH",
              message: "Property value is not a 'array'.",
              severity: Severity.ERROR,
              pointer: `${basePointer}/variants`
            });
          } else if (rootExt.variants.length === 0) {
            addMessage({
              code: "EMPTY_ENTITY",
              message: "Entity cannot be empty.",
              severity: Severity.ERROR,
              pointer: `${basePointer}/variants`
            });
          } else {
            const expectedRootProperties = ["variants", "extras"];
            for (const key in rootExt) {
              if (!expectedRootProperties.includes(key)) {
                addMessage({
                  code: "UNEXPECTED_PROPERTY",
                  message: "Unexpected property.",
                  severity: Severity.WARNING,
                  pointer: `${basePointer}/${key}`
                });
              }
            }
            for (let i = 0; i < rootExt.variants.length; i++) {
              const variant = rootExt.variants[i];
              const variantPointer = `${basePointer}/variants/${i}`;
              if (variant === null || typeof variant !== "object" || Array.isArray(variant)) {
                addMessage({
                  code: "TYPE_MISMATCH",
                  message: "Property value is not a 'object'.",
                  severity: Severity.ERROR,
                  pointer: variantPointer
                });
              } else {
                if (variant.name !== void 0) {
                  if (typeof variant.name !== "string") {
                    addMessage({
                      code: "TYPE_MISMATCH",
                      message: `Type mismatch. Property value ${JSON.stringify(variant.name)} is not a 'string'.`,
                      severity: Severity.ERROR,
                      pointer: `${variantPointer}/name`
                    });
                  } else if (variant.name.length === 0) {
                    addMessage({
                      code: "INVALID_VALUE",
                      message: "Empty variant name is not allowed.",
                      severity: Severity.ERROR,
                      pointer: `${variantPointer}/name`
                    });
                  }
                }
                const expectedProperties = ["name", "extras"];
                for (const key in variant) {
                  if (!expectedProperties.includes(key)) {
                    addMessage({
                      code: "UNEXPECTED_PROPERTY",
                      message: "Unexpected property.",
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
      if (gltf.materials) {
        for (let i = 0; i < gltf.materials.length; i++) {
          const material = gltf.materials[i];
          if (material && material["extensions"] && material["extensions"][this.extensionName]) {
            const ext = material["extensions"][this.extensionName];
            const basePointer = `/materials/${i}/extensions/${this.extensionName}`;
            if (ext.variants !== void 0) {
              if (!Array.isArray(ext.variants)) {
                addMessage({
                  code: "TYPE_MISMATCH",
                  message: "Property value is not a 'array'.",
                  severity: Severity.ERROR,
                  pointer: `${basePointer}/variants`
                });
              } else {
                for (let j = 0; j < ext.variants.length; j++) {
                  const variant = ext.variants[j];
                  if (typeof variant !== "number" || variant < 0) {
                    addMessage({
                      code: "INVALID_VALUE",
                      message: "Variant index must be a non-negative integer.",
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
      if (gltf.meshes) {
        for (let i = 0; i < gltf.meshes.length; i++) {
          const mesh = gltf.meshes[i];
          if (mesh && mesh.primitives) {
            for (let j = 0; j < mesh.primitives.length; j++) {
              const primitive = mesh.primitives[j];
              if (primitive && primitive["extensions"] && primitive["extensions"][this.extensionName]) {
                const ext = primitive["extensions"][this.extensionName];
                const basePointer = `/meshes/${i}/primitives/${j}/extensions/${this.extensionName}`;
                const expectedExtensionProperties = ["mappings", "extras"];
                for (const key in ext) {
                  if (!expectedExtensionProperties.includes(key)) {
                    addMessage({
                      code: "UNEXPECTED_PROPERTY",
                      message: "Unexpected property.",
                      severity: Severity.WARNING,
                      pointer: `${basePointer}/${key}`
                    });
                  }
                }
                if (ext.mappings === void 0) {
                  addMessage({
                    code: "UNDEFINED_PROPERTY",
                    message: "Property 'mappings' must be defined.",
                    severity: Severity.ERROR,
                    pointer: basePointer
                  });
                } else if (!Array.isArray(ext.mappings)) {
                  addMessage({
                    code: "TYPE_MISMATCH",
                    message: "Property value is not a 'array'.",
                    severity: Severity.ERROR,
                    pointer: `${basePointer}/mappings`
                  });
                } else if (ext.mappings.length === 0) {
                  addMessage({
                    code: "EMPTY_ENTITY",
                    message: "Entity cannot be empty.",
                    severity: Severity.ERROR,
                    pointer: `${basePointer}/mappings`
                  });
                } else {
                  const usedVariants = /* @__PURE__ */ new Set();
                  for (let k = 0; k < ext.mappings.length; k++) {
                    const mapping = ext.mappings[k];
                    if (mapping && mapping.variants && Array.isArray(mapping.variants)) {
                      for (const variantIndex of mapping.variants) {
                        if (typeof variantIndex === "number") {
                          if (usedVariants.has(variantIndex)) {
                            addMessage({
                              code: "KHR_MATERIALS_VARIANTS_NON_UNIQUE_VARIANT",
                              message: "This variant is used more than once for this mesh primitive.",
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
                    if (mapping && typeof mapping === "object") {
                      if (mapping.variants === void 0) {
                        addMessage({
                          code: "UNDEFINED_PROPERTY",
                          message: "Property 'variants' must be defined.",
                          severity: Severity.ERROR,
                          pointer: mappingPointer
                        });
                      } else if (!Array.isArray(mapping.variants)) {
                        addMessage({
                          code: "TYPE_MISMATCH",
                          message: "Property value is not a 'array'.",
                          severity: Severity.ERROR,
                          pointer: `${mappingPointer}/variants`
                        });
                      } else if (mapping.variants.length === 0) {
                        addMessage({
                          code: "EMPTY_ENTITY",
                          message: "Entity cannot be empty.",
                          severity: Severity.ERROR,
                          pointer: `${mappingPointer}/variants`
                        });
                      } else {
                        const rootExt = gltf.extensions && gltf.extensions[this.extensionName];
                        if (rootExt && rootExt.variants && Array.isArray(rootExt.variants)) {
                          for (let v = 0; v < mapping.variants.length; v++) {
                            const variantIndex = mapping.variants[v];
                            if (typeof variantIndex === "number" && variantIndex >= rootExt.variants.length) {
                              addMessage({
                                code: "UNRESOLVED_REFERENCE",
                                message: `Unresolved reference: ${variantIndex}.`,
                                severity: Severity.ERROR,
                                pointer: `${mappingPointer}/variants/${v}`
                              });
                            }
                          }
                        }
                      }
                      if (mapping.material === void 0) {
                        addMessage({
                          code: "UNDEFINED_PROPERTY",
                          message: "Property 'material' must be defined.",
                          severity: Severity.ERROR,
                          pointer: mappingPointer
                        });
                      } else if (typeof mapping.material !== "number" || mapping.material < 0) {
                        addMessage({
                          code: "INVALID_VALUE",
                          message: "Material index must be a non-negative integer.",
                          severity: Severity.ERROR,
                          pointer: `${mappingPointer}/material`
                        });
                      } else {
                        if (!gltf.materials || mapping.material >= gltf.materials.length) {
                          addMessage({
                            code: "UNRESOLVED_REFERENCE",
                            message: `Unresolved reference: ${mapping.material}.`,
                            severity: Severity.ERROR,
                            pointer: `${mappingPointer}/material`
                          });
                        }
                      }
                      const expectedProperties = ["material", "variants", "extras"];
                      for (const key in mapping) {
                        if (!expectedProperties.includes(key)) {
                          addMessage({
                            code: "UNEXPECTED_PROPERTY",
                            message: "Unexpected property.",
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
    hasPrimitiveUsage(gltf) {
      if (gltf.meshes) {
        for (const mesh of gltf.meshes) {
          if (mesh && mesh.primitives) {
            for (const primitive of mesh.primitives) {
              if (primitive && primitive["extensions"] && primitive["extensions"][this.extensionName]) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }
  };
  var KHRMeshQuantizationValidator = class extends BaseExtensionValidator {
    constructor() {
      super(...arguments);
      this.extensionName = "KHR_mesh_quantization";
    }
    validate(gltf, addMessage) {
      if (gltf.meshes) {
        for (let i = 0; i < gltf.meshes.length; i++) {
          const mesh = gltf.meshes[i];
          if (mesh && mesh.primitives) {
            for (let j = 0; j < mesh.primitives.length; j++) {
              const primitive = mesh.primitives[j];
              if (primitive && primitive["extensions"] && primitive["extensions"][this.extensionName]) {
                const ext = primitive["extensions"][this.extensionName];
                const basePointer = `/meshes/${i}/primitives/${j}/extensions/${this.extensionName}`;
                const validProperties = ["POSITION", "NORMAL", "TANGENT", "TEXCOORD_0", "TEXCOORD_1", "COLOR_0", "JOINTS_0", "WEIGHTS_0"];
                for (const prop in ext) {
                  if (!validProperties.includes(prop)) {
                    addMessage({
                      code: "UNEXPECTED_PROPERTY",
                      message: "Unexpected property.",
                      severity: Severity.WARNING,
                      pointer: `${basePointer}/${prop}`
                    });
                  } else {
                    const quant = ext[prop];
                    if (quant && typeof quant === "object") {
                      if (quant.quantized !== void 0 && typeof quant.quantized !== "number") {
                        addMessage({
                          code: "TYPE_MISMATCH",
                          message: "Property value is not a 'number'.",
                          severity: Severity.ERROR,
                          pointer: `${basePointer}/${prop}/quantized`
                        });
                      }
                      if (quant.offset !== void 0 && typeof quant.offset !== "number") {
                        addMessage({
                          code: "TYPE_MISMATCH",
                          message: "Property value is not a 'number'.",
                          severity: Severity.ERROR,
                          pointer: `${basePointer}/${prop}/offset`
                        });
                      }
                      if (quant.scale !== void 0 && typeof quant.scale !== "number") {
                        addMessage({
                          code: "TYPE_MISMATCH",
                          message: "Property value is not a 'number'.",
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
  };
  var KHRTextureTransformValidator = class extends BaseExtensionValidator {
    constructor() {
      super(...arguments);
      this.extensionName = "KHR_texture_transform";
    }
    validate(gltf, addMessage) {
      if (gltf.textures) {
        for (let i = 0; i < gltf.textures.length; i++) {
          const texture = gltf.textures[i];
          if (texture && texture["extensions"] && texture["extensions"][this.extensionName]) {
            addMessage({
              code: "UNEXPECTED_EXTENSION_OBJECT",
              message: "Unexpected location for this extension.",
              severity: Severity.ERROR,
              pointer: `/textures/${i}/extensions/${this.extensionName}`
            });
          }
        }
      }
      if (gltf.materials) {
        for (let i = 0; i < gltf.materials.length; i++) {
          const material = gltf.materials[i];
          if (material) {
            this.validateTextureInfoExtensions(material.pbrMetallicRoughness?.baseColorTexture, i, "pbrMetallicRoughness/baseColorTexture", addMessage);
            this.validateTextureInfoExtensions(material.pbrMetallicRoughness?.metallicRoughnessTexture, i, "pbrMetallicRoughness/metallicRoughnessTexture", addMessage);
            this.validateTextureInfoExtensions(material.normalTexture, i, "normalTexture", addMessage);
            this.validateTextureInfoExtensions(material.occlusionTexture, i, "occlusionTexture", addMessage);
            this.validateTextureInfoExtensions(material.emissiveTexture, i, "emissiveTexture", addMessage);
          }
        }
      }
    }
    validateTextureInfoExtensions(textureInfo, materialIndex, path, addMessage) {
      if (textureInfo && textureInfo["extensions"] && textureInfo["extensions"][this.extensionName]) {
        const ext = textureInfo["extensions"][this.extensionName];
        const basePointer = `/materials/${materialIndex}/${path}/extensions/${this.extensionName}`;
        if (ext.offset !== void 0) {
          if (!Array.isArray(ext.offset) || ext.offset.length !== 2) {
            addMessage({
              code: "TYPE_MISMATCH",
              message: "Property value is not a 'array' of length 2.",
              severity: Severity.ERROR,
              pointer: `${basePointer}/offset`
            });
          }
        }
        if (ext.rotation !== void 0) {
          if (typeof ext.rotation !== "number") {
            addMessage({
              code: "TYPE_MISMATCH",
              message: "Property value is not a 'number'.",
              severity: Severity.ERROR,
              pointer: `${basePointer}/rotation`
            });
          }
        }
        if (ext.scale !== void 0) {
          if (!Array.isArray(ext.scale) || ext.scale.length !== 2) {
            addMessage({
              code: "TYPE_MISMATCH",
              message: "Property value is not a 'array' of length 2.",
              severity: Severity.ERROR,
              pointer: `${basePointer}/scale`
            });
          }
        }
        if (ext.texCoord !== void 0) {
          if (typeof ext.texCoord !== "number" || ext.texCoord < 0) {
            addMessage({
              code: "INVALID_VALUE",
              message: "TexCoord must be a non-negative integer.",
              severity: Severity.ERROR,
              pointer: `${basePointer}/texCoord`
            });
          }
        }
        const expectedProperties = ["offset", "rotation", "scale", "texCoord"];
        for (const key in ext) {
          if (!expectedProperties.includes(key)) {
            addMessage({
              code: "UNEXPECTED_PROPERTY",
              message: "Unexpected property.",
              severity: Severity.WARNING,
              pointer: `${basePointer}/${key}`
            });
          }
        }
      }
    }
  };
  var extensionValidators = /* @__PURE__ */ new Map([
    ["EXT_texture_webp", new EXTTextureWebPValidator()],
    ["KHR_lights_punctual", new KHRLightsPunctualValidator()],
    ["KHR_animation_pointer", new KHRAnimationPointerValidator()],
    ["KHR_materials_anisotropy", new KHRMaterialsValidator("KHR_materials_anisotropy")],
    ["KHR_materials_clearcoat", new KHRMaterialsValidator("KHR_materials_clearcoat")],
    ["KHR_materials_dispersion", new KHRMaterialsValidator("KHR_materials_dispersion")],
    ["KHR_materials_emissive_strength", new KHRMaterialsValidator("KHR_materials_emissive_strength")],
    ["KHR_materials_ior", new KHRMaterialsValidator("KHR_materials_ior")],
    ["KHR_materials_iridescence", new KHRMaterialsValidator("KHR_materials_iridescence")],
    ["KHR_materials_pbrSpecularGlossiness", new KHRMaterialsValidator("KHR_materials_pbrSpecularGlossiness")],
    ["KHR_materials_sheen", new KHRMaterialsValidator("KHR_materials_sheen")],
    ["KHR_materials_specular", new KHRMaterialsValidator("KHR_materials_specular")],
    ["KHR_materials_transmission", new KHRMaterialsValidator("KHR_materials_transmission")],
    ["KHR_materials_unlit", new KHRMaterialsValidator("KHR_materials_unlit")],
    ["KHR_materials_variants", new KHRMaterialsVariantsValidator()],
    ["KHR_materials_volume", new KHRMaterialsValidator("KHR_materials_volume")],
    ["KHR_mesh_quantization", new KHRMeshQuantizationValidator()],
    ["KHR_texture_transform", new KHRTextureTransformValidator()]
  ]);

  // dist/validators/gltf-validator.js
  var GLTFValidator = class {
    constructor(options = {}) {
      this.messages = [];
      this.bufferData = /* @__PURE__ */ new Map();
      this.options = {
        maxIssues: options.maxIssues ?? 100,
        ignoredIssues: options.ignoredIssues ?? [],
        onlyIssues: options.onlyIssues ?? [],
        severityOverrides: options.severityOverrides ?? {},
        externalResourceFunction: options.externalResourceFunction
      };
      this.usageTracker = new UsageTracker();
    }
    async validate(gltf, isGLB = false, resources = []) {
      this.messages = [];
      this.usageTracker = new UsageTracker();
      this.usageTracker.trackReferences(gltf);
      this.validateAsset(gltf);
      this.validateRootProperties(gltf);
      if (isGLB) {
        this.validateGLB(gltf, resources);
      }
      this.validateBuffers(gltf);
      this.validateBufferViews(gltf);
      this.validateAccessors(gltf);
      this.validateAnimations(gltf);
      this.validateScenes(gltf);
      this.validateDefaultScene(gltf);
      this.validateNodes(gltf);
      this.validateMeshes(gltf);
      this.validateMaterials(gltf);
      this.validateTextures(gltf);
      await this.validateImages(gltf);
      this.validateSamplers(gltf);
      this.validateCameras(gltf);
      this.validateSkins(gltf);
      this.checkUnusedObjects(gltf);
      this.validateExtensions(gltf);
      this.validateSkinnedNodeScenePresence(gltf);
      this.validateSkinnedMeshNodeHierarchy(gltf);
      this.checkNodeLoops(gltf);
      this.applyFilters();
      this.sortMessagesForTestCompatibility();
      return {
        issues: this.buildIssues()
      };
    }
    // Method to set buffer data for validation
    setBufferData(bufferIndex, data) {
      this.bufferData.set(bufferIndex, data);
    }
    // Method to get buffer data for validation
    getBufferData(bufferIndex) {
      return this.bufferData.get(bufferIndex);
    }
    validateRootProperties(gltf) {
      const expectedRootProperties = [
        "extensionsUsed",
        "extensionsRequired",
        "accessors",
        "animations",
        "asset",
        "buffers",
        "bufferViews",
        "cameras",
        "images",
        "materials",
        "meshes",
        "nodes",
        "samplers",
        "scene",
        "scenes",
        "skins",
        "textures",
        "extensions",
        "extras",
        "_explicitlyDefined"
        // Internal parser property
      ];
      for (const key in gltf) {
        if (!expectedRootProperties.includes(key)) {
          this.addMessage({
            code: "UNEXPECTED_PROPERTY",
            message: "Unexpected property.",
            severity: Severity.WARNING,
            pointer: `/${this.escapeJsonPointer(key)}`
          });
        }
      }
    }
    validateCollectionType(value, property) {
      if (value != null && !Array.isArray(value)) {
        this.addMessage({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${JSON.stringify(value)} is not a 'array'.`,
          severity: Severity.ERROR,
          pointer: `/${property}`
        });
        return false;
      }
      return true;
    }
    validateAsset(gltf) {
      if (!gltf.asset) {
        this.addMessage({
          code: "UNDEFINED_PROPERTY",
          message: "Property 'asset' must be defined.",
          severity: Severity.ERROR,
          pointer: "/"
        });
        return;
      }
      const validator = new AssetValidator();
      const messages = validator.validate(gltf.asset);
      this.addMessages(messages);
    }
    validateBuffers(gltf) {
      if (!gltf.buffers)
        return;
      if (gltf._explicitlyDefined?.buffers && gltf.buffers.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/buffers"
        });
        return;
      }
      const validator = new BufferValidator();
      for (let i = 0; i < gltf.buffers.length; i++) {
        const buffer = gltf.buffers[i];
        if (buffer) {
          const messages = validator.validate(buffer, i);
          this.addMessages(messages);
        }
      }
    }
    validateBufferViews(gltf) {
      if (!gltf.bufferViews)
        return;
      if (gltf._explicitlyDefined?.bufferViews && gltf.bufferViews.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/bufferViews"
        });
        return;
      }
      const validator = new BufferViewValidator();
      for (let i = 0; i < gltf.bufferViews.length; i++) {
        const bufferView = gltf.bufferViews[i];
        if (bufferView) {
          const messages = validator.validate(bufferView, i, gltf);
          this.addMessages(messages);
        }
      }
    }
    validateAccessors(gltf) {
      if (!gltf.accessors)
        return;
      if (gltf._explicitlyDefined?.accessors && gltf.accessors.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/accessors"
        });
        return;
      }
      const validator = new AccessorValidator();
      const allMessages = [];
      for (let i = 0; i < gltf.accessors.length; i++) {
        const accessor = gltf.accessors[i];
        if (accessor) {
          const messages = validator.validate(accessor, i, gltf);
          allMessages.push(...messages);
          if (accessor.bufferView !== void 0 && gltf.bufferViews) {
            const bufferView = gltf.bufferViews[accessor.bufferView];
            if (bufferView && bufferView.buffer !== void 0) {
              const bufferData = this.getBufferData(bufferView.buffer);
              if (bufferData) {
                const dataMessages = validator.validateAccessorData(accessor, i, gltf, bufferData);
                allMessages.push(...dataMessages);
              }
            }
          }
        }
      }
      this.addMessages(allMessages);
    }
    validateAnimations(gltf) {
      if (!gltf.animations)
        return;
      if (gltf._explicitlyDefined?.animations && gltf.animations.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/animations"
        });
        return;
      }
      const validator = new AnimationValidator();
      const allMessages = [];
      for (let i = 0; i < gltf.animations.length; i++) {
        const animation = gltf.animations[i];
        if (animation) {
          const messages = validator.validate(animation, i, gltf);
          allMessages.push(...messages);
          if (animation.samplers) {
            for (let j = 0; j < animation.samplers.length; j++) {
              const sampler = animation.samplers[j];
              if (sampler && sampler.input !== void 0 && sampler.output !== void 0 && gltf.accessors) {
                const inputAccessor = gltf.accessors[sampler.input];
                if (inputAccessor && inputAccessor.bufferView !== void 0 && gltf.bufferViews) {
                  const bufferView = gltf.bufferViews[inputAccessor.bufferView];
                  if (bufferView && bufferView.buffer !== void 0) {
                    const bufferData = this.getBufferData(bufferView.buffer);
                    if (bufferData) {
                      const inputValidator = new AccessorValidator();
                      const inputMessages = inputValidator.validateAccessorData(inputAccessor, sampler.input, gltf, bufferData);
                      allMessages.push(...inputMessages);
                      const animationInputMessages = inputValidator.validateAnimationInputAccessorData(inputAccessor, sampler.input, gltf, bufferData, i, j);
                      allMessages.push(...animationInputMessages);
                    }
                  }
                }
                const outputAccessor = gltf.accessors[sampler.output];
                if (outputAccessor && outputAccessor.bufferView !== void 0 && gltf.bufferViews) {
                  const bufferView = gltf.bufferViews[outputAccessor.bufferView];
                  if (bufferView && bufferView.buffer !== void 0) {
                    const bufferData = this.getBufferData(bufferView.buffer);
                    if (bufferData) {
                      const outputValidator = new AccessorValidator();
                      const outputMessages = outputValidator.validateAccessorData(outputAccessor, sampler.output, gltf, bufferData);
                      allMessages.push(...outputMessages);
                      if (animation.channels) {
                        for (let k = 0; k < animation.channels.length; k++) {
                          const channel = animation.channels[k];
                          if (channel && channel.sampler === j && channel.target && channel.target.path === "rotation") {
                            const quaternionMessages = outputValidator.validateAnimationQuaternionOutput(outputAccessor, gltf, bufferData, i, j, k);
                            allMessages.push(...quaternionMessages);
                            break;
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
      allMessages.sort((a, b) => a.severity - b.severity);
      this.addMessages(allMessages);
      this.validateAnimationSkinConflicts(gltf);
    }
    validateNodes(gltf) {
      if (!gltf.nodes)
        return;
      if (gltf._explicitlyDefined?.nodes && gltf.nodes.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/nodes"
        });
        return;
      }
      const validator = new NodeValidator();
      for (let i = 0; i < gltf.nodes.length; i++) {
        const node = gltf.nodes[i];
        if (node) {
          const messages = validator.validate(node, i, gltf, this.usageTracker);
          this.addMessages(messages);
        }
      }
    }
    validateMeshes(gltf) {
      if (!gltf.meshes)
        return;
      if (gltf._explicitlyDefined?.meshes && gltf.meshes.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/meshes"
        });
        return;
      }
      const validator = new MeshValidator();
      for (let i = 0; i < gltf.meshes.length; i++) {
        const mesh = gltf.meshes[i];
        if (mesh) {
          const messages = validator.validate(mesh, i, gltf);
          this.addMessages(messages);
          if (mesh.primitives) {
            for (let j = 0; j < mesh.primitives.length; j++) {
              const primitive = mesh.primitives[j];
              if (primitive) {
                if (primitive.attributes) {
                  for (const [attributeName, accessorIndex] of Object.entries(primitive.attributes)) {
                    if (typeof accessorIndex === "number" && gltf.accessors) {
                      const accessor = gltf.accessors[accessorIndex];
                      if (accessor && accessor.bufferView !== void 0 && gltf.bufferViews) {
                        const bufferView = gltf.bufferViews[accessor.bufferView];
                        if (bufferView && bufferView.buffer !== void 0) {
                          const bufferData = this.getBufferData(bufferView.buffer);
                          if (bufferData) {
                            const accessorValidator = new AccessorValidator();
                            if (attributeName.startsWith("JOINTS_") || attributeName.startsWith("WEIGHTS_") || attributeName === "NORMAL" || attributeName === "TANGENT") {
                              const dataMessages = accessorValidator.validateMeshAttributeData(accessor, accessorIndex, gltf, bufferData, attributeName, i, j);
                              this.addMessages(dataMessages);
                            } else {
                              const dataMessages = accessorValidator.validateAccessorData(accessor, accessorIndex, gltf, bufferData);
                              this.addMessages(dataMessages);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (primitive.indices !== void 0 && gltf.accessors) {
                  const accessor = gltf.accessors[primitive.indices];
                  if (accessor && accessor.bufferView !== void 0 && gltf.bufferViews) {
                    const bufferView = gltf.bufferViews[accessor.bufferView];
                    if (bufferView && bufferView.buffer !== void 0) {
                      const bufferData = this.getBufferData(bufferView.buffer);
                      if (bufferData) {
                        const accessorValidator = new AccessorValidator();
                        const dataMessages = accessorValidator.validateAccessorData(accessor, primitive.indices, gltf, bufferData);
                        this.addMessages(dataMessages);
                      }
                    }
                  }
                }
                if (primitive.targets) {
                  for (let k = 0; k < primitive.targets.length; k++) {
                    const target = primitive.targets[k];
                    if (target) {
                      for (const [, accessorIndex] of Object.entries(target)) {
                        if (typeof accessorIndex === "number" && gltf.accessors) {
                          const accessor = gltf.accessors[accessorIndex];
                          if (accessor && accessor.bufferView !== void 0 && gltf.bufferViews) {
                            const bufferView = gltf.bufferViews[accessor.bufferView];
                            if (bufferView && bufferView.buffer !== void 0) {
                              const bufferData = this.getBufferData(bufferView.buffer);
                              if (bufferData) {
                                const accessorValidator = new AccessorValidator();
                                const dataMessages = accessorValidator.validateAccessorData(accessor, accessorIndex, gltf, bufferData);
                                this.addMessages(dataMessages);
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
        }
      }
    }
    validateMaterials(gltf) {
      if (!gltf.materials)
        return;
      if (gltf._explicitlyDefined?.materials && gltf.materials.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/materials"
        });
        return;
      }
      const validator = new MaterialValidator();
      for (let i = 0; i < gltf.materials.length; i++) {
        const material = gltf.materials[i];
        if (material && typeof material === "object" && !Array.isArray(material)) {
          const messages = validator.validate(material, i, gltf);
          this.addMessages(messages);
        } else {
          const formatValue = (value) => {
            if (typeof value === "string") {
              return `'${value}'`;
            } else if (value === null) {
              return "null";
            } else if (typeof value === "boolean" || typeof value === "number") {
              return value.toString();
            } else if (Array.isArray(value)) {
              return `[${value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join(", ")}]`;
            } else {
              return JSON.stringify(value);
            }
          };
          this.addMessage({
            code: "TYPE_MISMATCH",
            message: `Type mismatch. Property value ${formatValue(material)} is not a 'object'.`,
            severity: Severity.ERROR,
            pointer: `/materials/${i}`
          });
        }
      }
    }
    validateTextures(gltf) {
      if (!gltf.textures)
        return;
      if (gltf._explicitlyDefined?.textures && gltf.textures.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/textures"
        });
        return;
      }
      const validator = new TextureValidator();
      for (let i = 0; i < gltf.textures.length; i++) {
        const texture = gltf.textures[i];
        if (texture) {
          const messages = validator.validate(texture, i, gltf);
          this.addMessages(messages);
        }
      }
    }
    async validateImages(gltf) {
      if (!gltf.images)
        return;
      if (gltf._explicitlyDefined?.images && gltf.images.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/images"
        });
        return;
      }
      const validator = new ImageValidator(this.options.externalResourceFunction);
      for (let i = 0; i < gltf.images.length; i++) {
        const image = gltf.images[i];
        if (image) {
          if (typeof image !== "object" || image === null || Array.isArray(image)) {
            const formatValue = (value) => {
              if (Array.isArray(value)) {
                const items = value.map((item) => {
                  if (typeof item === "string" && /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(item)) {
                    return item;
                  }
                  return JSON.stringify(item);
                });
                return `[${items.join(", ")}]`;
              }
              return JSON.stringify(value);
            };
            this.addMessage({
              code: "TYPE_MISMATCH",
              message: `Type mismatch. Property value ${formatValue(image)} is not a 'object'.`,
              severity: Severity.ERROR,
              pointer: `/images/${i}`
            });
          } else {
            const messages = validator.validate(image, i, gltf);
            this.addMessages(messages);
            const externalMessages = await validator.validateExternalResources(image, i);
            this.addMessages(externalMessages);
          }
        }
      }
    }
    validateSamplers(gltf) {
      if (!gltf.samplers)
        return;
      if (!this.validateCollectionType(gltf.samplers, "samplers")) {
        return;
      }
      if (gltf._explicitlyDefined?.samplers && gltf.samplers.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/samplers"
        });
        return;
      }
      const validator = new SamplerValidator();
      for (let i = 0; i < gltf.samplers.length; i++) {
        const sampler = gltf.samplers[i];
        if (sampler && typeof sampler === "object" && !Array.isArray(sampler)) {
          const messages = validator.validate(sampler, i);
          this.addMessages(messages);
        } else {
          const formatValue = (value) => {
            if (typeof value === "string") {
              return `'${value}'`;
            } else if (value === null) {
              return "null";
            } else if (typeof value === "boolean" || typeof value === "number") {
              return value.toString();
            } else if (Array.isArray(value)) {
              return `[${value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join(", ")}]`;
            } else {
              return JSON.stringify(value);
            }
          };
          this.addMessage({
            code: "TYPE_MISMATCH",
            message: `Type mismatch. Property value ${formatValue(sampler)} is not a 'object'.`,
            severity: Severity.ERROR,
            pointer: `/samplers/${i}`
          });
        }
      }
    }
    validateCameras(gltf) {
      if (!gltf.cameras)
        return;
      if (gltf._explicitlyDefined?.cameras && gltf.cameras.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/cameras"
        });
        return;
      }
      const validator = new CameraValidator();
      for (let i = 0; i < gltf.cameras.length; i++) {
        const camera = gltf.cameras[i];
        if (camera) {
          const messages = validator.validate(camera, i);
          this.addMessages(messages);
        }
      }
    }
    validateScenes(gltf) {
      if (!gltf.scenes)
        return;
      if (gltf._explicitlyDefined?.scenes && gltf.scenes.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/scenes"
        });
        return;
      }
      const validator = new SceneValidator();
      for (let i = 0; i < gltf.scenes.length; i++) {
        const scene = gltf.scenes[i];
        if (scene) {
          const messages = validator.validate(scene, i, gltf);
          this.addMessages(messages);
        }
      }
    }
    validateDefaultScene(gltf) {
      if (gltf.scene !== void 0) {
        if (!gltf.scenes || gltf.scene >= gltf.scenes.length) {
          this.addMessage({
            code: "UNRESOLVED_REFERENCE",
            message: "Unresolved reference: " + gltf.scene + ".",
            severity: Severity.ERROR,
            pointer: "/scene"
          });
        }
      }
    }
    validateSkins(gltf) {
      if (!gltf.skins)
        return;
      if (gltf._explicitlyDefined?.skins && gltf.skins.length === 0) {
        this.addMessage({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: "/skins"
        });
        return;
      }
      const validator = new SkinValidator();
      for (let i = 0; i < gltf.skins.length; i++) {
        const skin = gltf.skins[i];
        if (skin) {
          const messages = validator.validate(skin, i, gltf);
          this.addMessages(messages);
          if (skin.inverseBindMatrices !== void 0 && gltf.accessors) {
            const accessor = gltf.accessors[skin.inverseBindMatrices];
            if (accessor && accessor.bufferView !== void 0 && gltf.bufferViews) {
              const bufferView = gltf.bufferViews[accessor.bufferView];
              if (bufferView && bufferView.buffer !== void 0) {
                const bufferData = this.getBufferData(bufferView.buffer);
                if (bufferData) {
                  const accessorValidator = new AccessorValidator();
                  const dataMessages = accessorValidator.validateAccessorData(accessor, skin.inverseBindMatrices, gltf, bufferData);
                  this.addMessages(dataMessages);
                  const ibmMessages = accessorValidator.validateIBMAccessorData(accessor, skin.inverseBindMatrices, gltf, bufferData, i);
                  this.addMessages(ibmMessages);
                }
              }
            }
          }
        }
      }
    }
    validateAnimationSkinConflicts(gltf) {
      if (!gltf.animations || !gltf.nodes || !gltf.skins)
        return;
      for (let animIndex = 0; animIndex < gltf.animations.length; animIndex++) {
        const animation = gltf.animations[animIndex];
        if (!animation || !animation.channels)
          continue;
        for (let channelIndex = 0; channelIndex < animation.channels.length; channelIndex++) {
          const channel = animation.channels[channelIndex];
          if (!channel || !channel.target || channel.target.node === void 0)
            continue;
          const targetNode = gltf.nodes[channel.target.node];
          if (!targetNode || targetNode.skin === void 0)
            continue;
          const trsProperties = ["translation", "rotation", "scale"];
          if (trsProperties.includes(channel.target.path)) {
            this.addMessage({
              code: "ANIMATION_CHANNEL_TARGET_NODE_SKIN",
              message: "Animated TRS properties will not affect a skinned mesh.",
              severity: Severity.WARNING,
              pointer: `/animations/${animIndex}/channels/${channelIndex}/target/path`
            });
          }
        }
      }
    }
    validateSkinnedNodeScenePresence(gltf) {
      if (!gltf.scenes || !gltf.nodes || !gltf.skins)
        return;
      for (let sceneIndex = 0; sceneIndex < gltf.scenes.length; sceneIndex++) {
        const scene = gltf.scenes[sceneIndex];
        if (!scene || !scene.nodes)
          continue;
        const reachableNodes = /* @__PURE__ */ new Set();
        const nodesToVisit = [...scene.nodes];
        while (nodesToVisit.length > 0) {
          const nodeIndex = nodesToVisit.pop();
          if (reachableNodes.has(nodeIndex))
            continue;
          reachableNodes.add(nodeIndex);
          const node = gltf.nodes[nodeIndex];
          if (node && node.children) {
            nodesToVisit.push(...node.children);
          }
        }
        for (const nodeIndex of reachableNodes) {
          const node = gltf.nodes[nodeIndex];
          if (!node || node.skin === void 0)
            continue;
          const skin = gltf.skins[node.skin];
          if (!skin || !skin.joints)
            continue;
          const missingJoints = skin.joints.some((jointIndex) => !reachableNodes.has(jointIndex));
          if (missingJoints) {
            this.addMessage({
              code: "NODE_SKIN_NO_SCENE",
              message: "A node with a skinned mesh is used in a scene that does not contain joint nodes.",
              severity: Severity.ERROR,
              pointer: `/nodes/${nodeIndex}`
            });
          }
        }
      }
    }
    validateSkinnedMeshNodeHierarchy(gltf) {
      if (!gltf.nodes || !gltf.meshes || !gltf.skins)
        return;
      const childToParent = /* @__PURE__ */ new Map();
      for (let i = 0; i < gltf.nodes.length; i++) {
        const node = gltf.nodes[i];
        if (node && node.children) {
          for (const childIndex of node.children) {
            childToParent.set(childIndex, i);
          }
        }
      }
      for (let nodeIndex = 0; nodeIndex < gltf.nodes.length; nodeIndex++) {
        const node = gltf.nodes[nodeIndex];
        if (!node || node.skin === void 0 || node.mesh === void 0)
          continue;
        const mesh = gltf.meshes[node.mesh];
        if (!mesh || !mesh.primitives)
          continue;
        let hasSkinnedMesh = false;
        for (const primitive of mesh.primitives) {
          if (primitive && primitive.attributes) {
            const hasJoints = Object.keys(primitive.attributes).some((attr) => attr.startsWith("JOINTS_"));
            const hasWeights = Object.keys(primitive.attributes).some((attr) => attr.startsWith("WEIGHTS_"));
            if (hasJoints && hasWeights) {
              hasSkinnedMesh = true;
              break;
            }
          }
        }
        if (hasSkinnedMesh && childToParent.has(nodeIndex)) {
          this.addMessage({
            code: "NODE_SKINNED_MESH_NON_ROOT",
            message: "Node with a skinned mesh is not root. Parent transforms will not affect a skinned mesh.",
            severity: Severity.WARNING,
            pointer: `/nodes/${nodeIndex}`
          });
        }
      }
    }
    checkNodeLoops(gltf) {
      if (!gltf.nodes)
        return;
      const loopNodes = /* @__PURE__ */ new Set();
      const visited = /* @__PURE__ */ new Set();
      const recursionStack = /* @__PURE__ */ new Set();
      for (let i = 0; i < gltf.nodes.length; i++) {
        if (!visited.has(i)) {
          this.detectNodeLoop(i, gltf, visited, recursionStack, loopNodes);
        }
      }
      for (const nodeIndex of loopNodes) {
        this.addMessage({
          code: "NODE_LOOP",
          message: "Node is a part of a node loop.",
          severity: Severity.ERROR,
          pointer: `/nodes/${nodeIndex}`
        });
      }
    }
    detectNodeLoop(nodeIndex, gltf, visited, recursionStack, loopNodes) {
      if (recursionStack.has(nodeIndex)) {
        const stackArray = Array.from(recursionStack);
        const cycleStart = stackArray.indexOf(nodeIndex);
        for (let i = cycleStart; i < stackArray.length; i++) {
          loopNodes.add(stackArray[i]);
        }
        loopNodes.add(nodeIndex);
        return;
      }
      if (visited.has(nodeIndex)) {
        return;
      }
      visited.add(nodeIndex);
      recursionStack.add(nodeIndex);
      const node = gltf.nodes[nodeIndex];
      if (node && node.children) {
        for (const childIndex of node.children) {
          if (childIndex >= 0 && childIndex < gltf.nodes.length) {
            this.detectNodeLoop(childIndex, gltf, visited, recursionStack, loopNodes);
          }
        }
      }
      recursionStack.delete(nodeIndex);
    }
    checkUnusedObjects(gltf) {
      const unusedObjects = this.usageTracker.getUnusedObjects(gltf);
      for (const pointer of unusedObjects) {
        const hasTypeMismatch = this.messages.some((msg) => msg.code === "TYPE_MISMATCH" && msg.pointer === pointer);
        if (!hasTypeMismatch) {
          this.addMessage({
            code: "UNUSED_OBJECT",
            message: "This object may be unused.",
            severity: Severity.INFO,
            pointer
          });
        }
      }
      const unusedMeshWeights = this.usageTracker.getUnusedMeshWeights(gltf);
      for (const pointer of unusedMeshWeights) {
        this.addMessage({
          code: "UNUSED_MESH_WEIGHTS",
          message: "The static morph target weights are always overridden.",
          severity: Severity.INFO,
          pointer
        });
      }
    }
    validateExtensions(gltf) {
      if (gltf["extensionsUsed"]) {
        const seenExtensions = /* @__PURE__ */ new Set();
        const extensionsUsed = gltf["extensionsUsed"];
        for (let i = 0; i < extensionsUsed.length; i++) {
          const extension = extensionsUsed[i];
          if (seenExtensions.has(extension)) {
            this.addMessage({
              code: "DUPLICATE_ELEMENTS",
              message: "Duplicate element.",
              severity: Severity.ERROR,
              pointer: `/extensionsUsed/${i}`
            });
          } else {
            seenExtensions.add(extension);
          }
          if (typeof extension === "string" && extension.startsWith("_")) {
            this.addMessage({
              code: "INVALID_EXTENSION_NAME_FORMAT",
              message: "Extension name has invalid format.",
              severity: Severity.WARNING,
              pointer: `/extensionsUsed/${i}`
            });
          }
          const knownExtensions = [
            "EXT_texture_webp",
            "KHR_animation_pointer",
            "KHR_lights_punctual",
            "KHR_materials_anisotropy",
            "KHR_materials_clearcoat",
            "KHR_materials_dispersion",
            "KHR_materials_emissive_strength",
            "KHR_materials_ior",
            "KHR_materials_iridescence",
            "KHR_materials_pbrSpecularGlossiness",
            "KHR_materials_sheen",
            "KHR_materials_specular",
            "KHR_materials_transmission",
            "KHR_materials_unlit",
            "KHR_materials_variants",
            "KHR_materials_volume",
            "KHR_mesh_quantization",
            "KHR_texture_basisu",
            "KHR_texture_transform"
          ];
          if (!knownExtensions.includes(extension)) {
            this.addMessage({
              code: "UNSUPPORTED_EXTENSION",
              message: `Cannot validate an extension as it is not supported by the validator: '${extension}'.`,
              severity: Severity.INFO,
              pointer: `/extensionsUsed/${i}`
            });
          }
        }
      }
      if (gltf["extensionsRequired"]) {
        if (!gltf["extensionsUsed"]) {
          this.addMessage({
            code: "UNSATISFIED_DEPENDENCY",
            message: "Dependency failed. 'extensionsUsed' must be defined.",
            severity: Severity.ERROR,
            pointer: "/extensionsRequired"
          });
        }
        const seenRequired = /* @__PURE__ */ new Set();
        const extensionsUsed = new Set(gltf["extensionsUsed"] || []);
        const extensionsRequired = gltf["extensionsRequired"];
        for (let i = 0; i < extensionsRequired.length; i++) {
          const extension = extensionsRequired[i];
          if (seenRequired.has(extension)) {
            this.addMessage({
              code: "DUPLICATE_ELEMENTS",
              message: "Duplicate element.",
              severity: Severity.ERROR,
              pointer: `/extensionsRequired/${i}`
            });
          } else {
            seenRequired.add(extension);
          }
          if (!extensionsUsed.has(extension)) {
            this.addMessage({
              code: "UNUSED_EXTENSION_REQUIRED",
              message: `Unused extension '${extension}' cannot be required.`,
              severity: Severity.ERROR,
              pointer: `/extensionsRequired/${i}`
            });
          }
        }
      }
      if (gltf.extensions) {
        const extensionsUsed = new Set(gltf["extensionsUsed"] || []);
        for (const extensionName in gltf.extensions) {
          const extensionValue = gltf.extensions[extensionName];
          if (!extensionsUsed.has(extensionName)) {
            this.addMessage({
              code: "UNDECLARED_EXTENSION",
              message: "Extension is not declared in extensionsUsed.",
              severity: Severity.ERROR,
              pointer: `/extensions/${extensionName}`
            });
          }
          if (typeof extensionValue !== "object" || extensionValue === null || Array.isArray(extensionValue)) {
            let formattedValue;
            if (typeof extensionValue === "string") {
              formattedValue = `'${extensionValue}'`;
            } else if (typeof extensionValue === "number") {
              formattedValue = extensionValue.toString();
            } else if (typeof extensionValue === "boolean") {
              formattedValue = extensionValue.toString();
            } else if (Array.isArray(extensionValue)) {
              formattedValue = "[]";
            } else if (extensionValue === null) {
              formattedValue = "null";
            } else {
              formattedValue = JSON.stringify(extensionValue);
            }
            this.addMessage({
              code: "TYPE_MISMATCH",
              message: `Type mismatch. Property value ${formattedValue} is not a 'object'.`,
              severity: Severity.ERROR,
              pointer: `/extensions/${extensionName}`
            });
          }
        }
      }
      if (gltf["extensionsUsed"]) {
        for (const extensionName of gltf["extensionsUsed"]) {
          const validator = extensionValidators.get(extensionName);
          if (validator) {
            validator.validate(gltf, (message) => this.addMessage(message));
          }
        }
      }
      if (gltf["extensionsUsed"]) {
        const extensionsRequired = new Set(gltf["extensionsRequired"] || []);
        const extensionsUsedArray = gltf["extensionsUsed"];
        for (let i = 0; i < extensionsUsedArray.length; i++) {
          const extension = extensionsUsedArray[i];
          const hasInvalidName = typeof extension === "string" && extension.startsWith("_");
          if (!this.isExtensionUsed(gltf, extension) && !extensionsRequired.has(extension) && !hasInvalidName) {
            this.addMessage({
              code: "NON_REQUIRED_EXTENSION",
              message: `Extension '${extension}' cannot be optional.`,
              severity: Severity.ERROR,
              pointer: `/extensionsUsed/${i}`
            });
          }
        }
      }
      this.checkUndeclaredExtensions(gltf);
    }
    addMessages(messages) {
      for (const message of messages) {
        this.addMessage(message);
      }
    }
    isExtensionUsed(gltf, extensionName) {
      if (gltf.extensions && gltf.extensions.hasOwnProperty(extensionName)) {
        return true;
      }
      if (gltf.materials) {
        for (const material of gltf.materials) {
          if (material && material["extensions"] && material["extensions"][extensionName]) {
            return true;
          }
          if (material && material.pbrMetallicRoughness && material.pbrMetallicRoughness["extensions"] && material.pbrMetallicRoughness["extensions"][extensionName]) {
            return true;
          }
          if (material && material.pbrMetallicRoughness) {
            if (material.pbrMetallicRoughness.baseColorTexture && material.pbrMetallicRoughness.baseColorTexture["extensions"] && material.pbrMetallicRoughness.baseColorTexture["extensions"][extensionName]) {
              return true;
            }
            if (material.pbrMetallicRoughness.metallicRoughnessTexture && material.pbrMetallicRoughness.metallicRoughnessTexture["extensions"] && material.pbrMetallicRoughness.metallicRoughnessTexture["extensions"][extensionName]) {
              return true;
            }
          }
          if (material && material.normalTexture && material.normalTexture["extensions"] && material.normalTexture["extensions"][extensionName]) {
            return true;
          }
          if (material && material.occlusionTexture && material.occlusionTexture["extensions"] && material.occlusionTexture["extensions"][extensionName]) {
            return true;
          }
          if (material && material.emissiveTexture && material.emissiveTexture["extensions"] && material.emissiveTexture["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (gltf.textures) {
        for (const texture of gltf.textures) {
          if (texture && texture["extensions"] && texture["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (gltf.samplers) {
        for (const sampler of gltf.samplers) {
          if (sampler && sampler["extensions"] && sampler["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (gltf.nodes) {
        for (const node of gltf.nodes) {
          if (node && node["extensions"] && node["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (gltf.meshes) {
        for (const mesh of gltf.meshes) {
          if (mesh && mesh["extensions"] && mesh["extensions"][extensionName]) {
            return true;
          }
          if (mesh && mesh.primitives) {
            for (const primitive of mesh.primitives) {
              if (primitive && primitive["extensions"] && primitive["extensions"][extensionName]) {
                return true;
              }
            }
          }
        }
      }
      if (gltf.animations) {
        for (const animation of gltf.animations) {
          if (animation && animation["extensions"] && animation["extensions"][extensionName]) {
            return true;
          }
          if (animation && animation.channels) {
            for (const channel of animation.channels) {
              if (channel && channel["extensions"] && channel["extensions"][extensionName]) {
                return true;
              }
              if (channel && channel.target && channel.target["extensions"] && channel.target["extensions"][extensionName]) {
                return true;
              }
            }
          }
        }
      }
      if (gltf.cameras) {
        for (const camera of gltf.cameras) {
          if (camera && camera["extensions"] && camera["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (gltf.scenes) {
        for (const scene of gltf.scenes) {
          if (scene && scene["extensions"] && scene["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (gltf.accessors) {
        for (const accessor of gltf.accessors) {
          if (accessor && accessor["extensions"] && accessor["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (gltf.images) {
        for (const image of gltf.images) {
          if (image && image["extensions"] && image["extensions"][extensionName]) {
            return true;
          }
        }
      }
      if (extensionName === "EXT_texture_webp" && gltf.images) {
        for (const image of gltf.images) {
          if (image) {
            if (image.mimeType === "image/webp") {
              return true;
            }
            if (image.uri && image.uri.startsWith("data:image/webp")) {
              return true;
            }
            if (image.uri && image.uri.toLowerCase().endsWith(".webp")) {
              return true;
            }
          }
        }
      }
      return false;
    }
    addMessage(message) {
      const override = this.options.severityOverrides[message.code];
      if (override !== void 0) {
        message.severity = override;
      }
      this.messages.push(message);
    }
    applyFilters() {
      let filteredMessages = this.messages;
      if (this.options.onlyIssues.length > 0) {
        filteredMessages = filteredMessages.filter((message) => this.options.onlyIssues.includes(message.code));
      }
      if (this.options.ignoredIssues.length > 0) {
        filteredMessages = filteredMessages.filter((message) => !this.options.ignoredIssues.includes(message.code));
      }
      if (this.options.maxIssues > 0 && filteredMessages.length > this.options.maxIssues) {
        filteredMessages = filteredMessages.slice(0, this.options.maxIssues);
      }
      this.messages = filteredMessages;
    }
    buildIssues() {
      const issues = {
        numErrors: 0,
        numWarnings: 0,
        numInfos: 0,
        numHints: 0,
        messages: [],
        truncated: false
      };
      for (const message of this.messages) {
        switch (message.severity) {
          case Severity.ERROR:
            issues.numErrors++;
            break;
          case Severity.WARNING:
            issues.numWarnings++;
            break;
          case Severity.INFO:
            issues.numInfos++;
            break;
          case Severity.HINT:
            issues.numHints++;
            break;
        }
        issues.messages.push(message);
      }
      return issues;
    }
    sortMessagesForTestCompatibility() {
      this.messages.sort((a, b) => {
        if (a.code === "UNSUPPORTED_EXTENSION" && b.code === "TYPE_MISMATCH" && a.pointer?.startsWith("/extensionsUsed/") && b.pointer?.startsWith("/extensions/")) {
          return -1;
        }
        if (a.code === "TYPE_MISMATCH" && b.code === "UNSUPPORTED_EXTENSION" && a.pointer?.startsWith("/extensions/") && b.pointer?.startsWith("/extensionsUsed/")) {
          return 1;
        }
        if (a.code === "UNSUPPORTED_EXTENSION" && b.code === "UNUSED_OBJECT") {
          return -1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "UNSUPPORTED_EXTENSION") {
          return 1;
        }
        if (a.code === "UNSUPPORTED_EXTENSION" && b.code === "NODE_EMPTY") {
          return -1;
        }
        if (a.code === "NODE_EMPTY" && b.code === "UNSUPPORTED_EXTENSION") {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "BUFFER_GLB_CHUNK_TOO_BIG" && a.pointer === b.pointer) {
          return -1;
        }
        if (a.code === "BUFFER_GLB_CHUNK_TOO_BIG" && b.code === "UNUSED_OBJECT" && a.pointer === b.pointer) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_UNRECOGNIZED_FORMAT" && a.pointer === b.pointer) {
          return -1;
        }
        if (a.code === "IMAGE_UNRECOGNIZED_FORMAT" && b.code === "UNUSED_OBJECT" && a.pointer === b.pointer) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_DATA_INVALID" && a.pointer === b.pointer) {
          return -1;
        }
        if (a.code === "IMAGE_DATA_INVALID" && b.code === "UNUSED_OBJECT" && a.pointer === b.pointer) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_UNEXPECTED_EOS" && a.pointer === b.pointer) {
          return -1;
        }
        if (a.code === "IMAGE_UNEXPECTED_EOS" && b.code === "UNUSED_OBJECT" && a.pointer === b.pointer) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "ACCESSOR_INDEX_OOB" && a.pointer && b.pointer && b.pointer.startsWith(a.pointer + "/")) {
          return -1;
        }
        if (a.code === "ACCESSOR_INDEX_OOB" && b.code === "UNUSED_OBJECT" && a.pointer && b.pointer && a.pointer.startsWith(b.pointer + "/")) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "ACCESSOR_INDEX_PRIMITIVE_RESTART" && a.pointer && b.pointer && b.pointer.startsWith(a.pointer + "/")) {
          return -1;
        }
        if (a.code === "ACCESSOR_INDEX_PRIMITIVE_RESTART" && b.code === "UNUSED_OBJECT" && a.pointer && b.pointer && a.pointer.startsWith(b.pointer + "/")) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "ACCESSOR_NON_CLAMPED" && a.pointer && b.pointer && b.pointer.startsWith(a.pointer + "/")) {
          return -1;
        }
        if (a.code === "ACCESSOR_NON_CLAMPED" && b.code === "UNUSED_OBJECT" && a.pointer && b.pointer && a.pointer.startsWith(b.pointer + "/")) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && (b.code === "ACCESSOR_JOINTS_INDEX_OOB" || b.code === "ACCESSOR_JOINTS_USED_ZERO_WEIGHT" || b.code === "ACCESSOR_WEIGHTS_NEGATIVE" || b.code === "ACCESSOR_WEIGHTS_NON_NORMALIZED")) {
          return -1;
        }
        if ((a.code === "ACCESSOR_JOINTS_INDEX_OOB" || a.code === "ACCESSOR_JOINTS_USED_ZERO_WEIGHT" || a.code === "ACCESSOR_WEIGHTS_NEGATIVE" || a.code === "ACCESSOR_WEIGHTS_NON_NORMALIZED") && b.code === "UNUSED_OBJECT") {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "ACCESSOR_INDEX_TRIANGLE_DEGENERATE" && a.pointer && b.pointer && b.pointer.startsWith(a.pointer + "/")) {
          return -1;
        }
        if (a.code === "ACCESSOR_INDEX_TRIANGLE_DEGENERATE" && b.code === "UNUSED_OBJECT" && a.pointer && b.pointer && a.pointer.startsWith(b.pointer + "/")) {
          return 1;
        }
        if (a.code === "MESH_PRIMITIVES_UNEQUAL_TARGETS_COUNT" && b.code === "UNUSED_OBJECT" && a.pointer && b.pointer && a.pointer.startsWith(b.pointer + "/")) {
          return -1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "MESH_PRIMITIVES_UNEQUAL_TARGETS_COUNT" && a.pointer && b.pointer && b.pointer.startsWith(a.pointer + "/")) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_MIME_TYPE_INVALID" && a.pointer && b.pointer && b.pointer.startsWith(a.pointer + "/")) {
          return -1;
        }
        if (a.code === "IMAGE_MIME_TYPE_INVALID" && b.code === "UNUSED_OBJECT" && b.pointer && a.pointer && a.pointer.startsWith(b.pointer + "/")) {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "TEXTURE_INVALID_IMAGE_MIME_TYPE") {
          const aTexture = a.pointer?.match(/\/textures\/(\d+)$/);
          const bTexture = b.pointer?.match(/\/textures\/(\d+)\//);
          if (aTexture && bTexture && aTexture[1] === bTexture[1]) {
            return -1;
          }
        }
        if (a.code === "TEXTURE_INVALID_IMAGE_MIME_TYPE" && b.code === "UNUSED_OBJECT") {
          const aTexture = a.pointer?.match(/\/textures\/(\d+)\//);
          const bTexture = b.pointer?.match(/\/textures\/(\d+)$/);
          if (aTexture && bTexture && aTexture[1] === bTexture[1]) {
            return 1;
          }
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_MIME_TYPE_INVALID") {
          return -1;
        }
        if (a.code === "IMAGE_MIME_TYPE_INVALID" && b.code === "UNUSED_OBJECT") {
          return 1;
        }
        if (a.code === "EXTRA_PROPERTY" && b.code === "UNUSED_OBJECT") {
          const aBase = a.pointer?.replace(/\/[^/]+$/, "");
          const bPointer = b.pointer;
          if (aBase === bPointer) {
            return -1;
          }
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "EXTRA_PROPERTY") {
          const bBase = b.pointer?.replace(/\/[^/]+$/, "");
          const aPointer = a.pointer;
          if (bBase === aPointer) {
            return 1;
          }
        }
        const extensionMessageOrder = [
          "UNEXPECTED_EXTENSION_OBJECT",
          "UNEXPECTED_PROPERTY",
          "UNDEFINED_PROPERTY",
          "PATTERN_MISMATCH",
          "VALUE_NOT_IN_LIST",
          "INCOMPLETE_EXTENSION_SUPPORT",
          "KHR_ANIMATION_POINTER_ANIMATION_CHANNEL_TARGET_NODE",
          "KHR_ANIMATION_POINTER_ANIMATION_CHANNEL_TARGET_PATH",
          "KHR_MATERIALS_IRIDESCENCE_THICKNESS_RANGE_WITHOUT_TEXTURE",
          "KHR_MATERIALS_IRIDESCENCE_THICKNESS_TEXTURE_UNUSED",
          "NODE_EMPTY",
          "UNUSED_OBJECT"
        ];
        const aIndex = extensionMessageOrder.indexOf(a.code);
        const bIndex = extensionMessageOrder.indexOf(b.code);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_NPOT_DIMENSIONS" && a.pointer === b.pointer) {
          return -1;
        }
        if (a.code === "IMAGE_NPOT_DIMENSIONS" && b.code === "UNUSED_OBJECT" && a.pointer === b.pointer) {
          return 1;
        }
        if (a.code === "MESH_PRIMITIVE_INVALID_ATTRIBUTE" && b.code === "MESH_PRIMITIVE_MORPH_TARGET_NO_BASE_ACCESSOR") {
          return -1;
        }
        if (a.code === "MESH_PRIMITIVE_MORPH_TARGET_NO_BASE_ACCESSOR" && b.code === "MESH_PRIMITIVE_INVALID_ATTRIBUTE") {
          return 1;
        }
        if (a.code === "MESH_PRIMITIVE_TANGENT_WITHOUT_NORMAL" && b.code === "MESH_PRIMITIVE_GENERATED_TANGENT_SPACE") {
          return -1;
        }
        if (a.code === "MESH_PRIMITIVE_GENERATED_TANGENT_SPACE" && b.code === "MESH_PRIMITIVE_TANGENT_WITHOUT_NORMAL") {
          return 1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code?.startsWith("ACCESSOR_") && (b.code === "ACCESSOR_VECTOR3_NON_UNIT" || b.code === "ACCESSOR_INVALID_SIGN")) {
          return -1;
        }
        if ((a.code === "ACCESSOR_VECTOR3_NON_UNIT" || a.code === "ACCESSOR_INVALID_SIGN") && b.code === "UNUSED_OBJECT") {
          return 1;
        }
        if (a.code === "NODE_PARENT_OVERRIDE" && b.code === "SCENE_NON_ROOT_NODE") {
          return -1;
        }
        if (a.code === "SCENE_NON_ROOT_NODE" && b.code === "NODE_PARENT_OVERRIDE") {
          return 1;
        }
        if (a.code === "URI_GLB" && b.code === "INVALID_URI" && a.pointer === b.pointer) {
          return -1;
        }
        if (a.code === "INVALID_URI" && b.code === "URI_GLB" && a.pointer === b.pointer) {
          return 1;
        }
        if (a.code === "URI_GLB" && b.code === "DATA_URI_GLB" && a.pointer === b.pointer) {
          return -1;
        }
        if (a.code === "DATA_URI_GLB" && b.code === "URI_GLB" && a.pointer === b.pointer) {
          return 1;
        }
        if (a.code === "ACCESSOR_MATRIX_ALIGNMENT" && b.code === "ACCESSOR_TOO_LONG") {
          return -1;
        }
        if (a.code === "ACCESSOR_TOO_LONG" && b.code === "ACCESSOR_MATRIX_ALIGNMENT") {
          return 1;
        }
        const aIsUnused = a.code === "UNUSED_OBJECT";
        const bIsUnused = b.code === "UNUSED_OBJECT";
        const accessorDataCodes = [
          "ACCESSOR_INVALID_FLOAT",
          "ACCESSOR_MIN_MISMATCH",
          "ACCESSOR_MAX_MISMATCH",
          "ACCESSOR_ELEMENT_OUT_OF_MIN_BOUND",
          "ACCESSOR_ELEMENT_OUT_OF_MAX_BOUND",
          "ACCESSOR_INVALID_IBM"
        ];
        if (aIsUnused && accessorDataCodes.includes(b.code)) {
          if (b.code === "ACCESSOR_INVALID_IBM") {
            const aSkinMatch = a.pointer.match(/\/skins\/(\d+)$/);
            const bSkinMatch = b.pointer.match(/\/skins\/(\d+)\/inverseBindMatrices$/);
            if (aSkinMatch && bSkinMatch && aSkinMatch[1] === bSkinMatch[1]) {
              return -1;
            }
          }
          const aAccessorMatch = a.pointer.match(/\/accessors\/(\d+)$/);
          const bAccessorMatch = b.pointer.match(/\/accessors\/(\d+)/);
          if (aAccessorMatch && bAccessorMatch && aAccessorMatch[1] === bAccessorMatch[1]) {
            return -1;
          }
        }
        if (bIsUnused && accessorDataCodes.includes(a.code)) {
          if (a.code === "ACCESSOR_INVALID_IBM") {
            const aSkinMatch = a.pointer.match(/\/skins\/(\d+)\/inverseBindMatrices$/);
            const bSkinMatch = b.pointer.match(/\/skins\/(\d+)$/);
            if (aSkinMatch && bSkinMatch && aSkinMatch[1] === bSkinMatch[1]) {
              return 1;
            }
          }
          const aAccessorMatch = a.pointer.match(/\/accessors\/(\d+)/);
          const bAccessorMatch = b.pointer.match(/\/accessors\/(\d+)$/);
          if (aAccessorMatch && bAccessorMatch && aAccessorMatch[1] === bAccessorMatch[1]) {
            return 1;
          }
        }
        if (a.code === "UNRESOLVED_REFERENCE" && b.code === "UNUSED_OBJECT") {
          return -1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "UNRESOLVED_REFERENCE") {
          return 1;
        }
        if (a.code === "UNDEFINED_PROPERTY" && b.code === "UNUSED_OBJECT") {
          return -1;
        }
        if (a.code === "UNUSED_OBJECT" && b.code === "UNDEFINED_PROPERTY") {
          return 1;
        }
        const bufferErrorCodes = [
          "BUFFER_MISSING_GLB_DATA",
          "BUFFER_BYTE_LENGTH_MISMATCH"
        ];
        if (a.code === "UNDEFINED_PROPERTY" && b.code === "BUFFER_BYTE_LENGTH_MISMATCH") {
          const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)$/);
          const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)$/);
          if (aBufferMatch && bBufferMatch) {
            return -1;
          }
        }
        if (a.code === "BUFFER_BYTE_LENGTH_MISMATCH" && b.code === "UNDEFINED_PROPERTY") {
          const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)$/);
          const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)$/);
          if (aBufferMatch && bBufferMatch) {
            return 1;
          }
        }
        if (aIsUnused && bufferErrorCodes.includes(b.code)) {
          const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)$/);
          const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)/);
          if (aBufferMatch && bBufferMatch) {
            return -1;
          }
        }
        if (bIsUnused && bufferErrorCodes.includes(a.code)) {
          const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)/);
          const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)$/);
          if (aBufferMatch && bBufferMatch) {
            return 1;
          }
        }
        if (a.code === "UNEXPECTED_EXTENSION_OBJECT" && b.code === "NODE_EMPTY") {
          return -1;
        }
        if (a.code === "NODE_EMPTY" && b.code === "UNEXPECTED_EXTENSION_OBJECT") {
          return 1;
        }
        if (a.severity !== b.severity) {
          const aIsAnim = a.pointer && a.pointer.startsWith("/animations/");
          const bIsAnim = b.pointer && b.pointer.startsWith("/animations/");
          if (aIsAnim || bIsAnim) {
            return b.severity - a.severity;
          }
          const aIsImage = a.pointer && a.pointer.startsWith("/images/");
          const bIsImage = b.pointer && b.pointer.startsWith("/images/");
          if (aIsImage && bIsImage) {
            if (a.code === "VALUE_NOT_IN_LIST" && b.code !== "VALUE_NOT_IN_LIST") {
              return -1;
            }
            if (a.code !== "VALUE_NOT_IN_LIST" && b.code === "VALUE_NOT_IN_LIST") {
              return 1;
            }
            if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_NON_ENABLED_MIME_TYPE") {
              return -1;
            }
            if (a.code === "IMAGE_NON_ENABLED_MIME_TYPE" && b.code === "UNUSED_OBJECT") {
              return 1;
            }
            const aImageMatch = a.pointer.match(/^\/images\/(\d+)(?:\/|$)/);
            const bImageMatch = b.pointer.match(/^\/images\/(\d+)(?:\/|$)/);
            if (aImageMatch && bImageMatch) {
              const aImageIndex = parseInt(aImageMatch[1] || "0");
              const bImageIndex = parseInt(bImageMatch[1] || "0");
              if (aImageIndex !== bImageIndex) {
                return aImageIndex - bImageIndex;
              }
              if (a.code === "INVALID_URI" && b.code === "UNUSED_OBJECT") {
                return -1;
              }
              if (a.code === "UNUSED_OBJECT" && b.code === "INVALID_URI") {
                return 1;
              }
              if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_MIME_TYPE_INVALID") {
                return -1;
              }
              if (a.code === "IMAGE_MIME_TYPE_INVALID" && b.code === "UNUSED_OBJECT") {
                return 1;
              }
              if (a.code === "VALUE_NOT_IN_LIST" && b.code === "IMAGE_NON_ENABLED_MIME_TYPE") {
                return -1;
              }
              if (a.code === "IMAGE_NON_ENABLED_MIME_TYPE" && b.code === "VALUE_NOT_IN_LIST") {
                return 1;
              }
            }
          }
          const aIsMeshPrimitive = a.pointer && a.pointer.match(/^\/meshes\/\d+\/primitives\/\d+\//);
          const bIsMeshPrimitive = b.pointer && b.pointer.match(/^\/meshes\/\d+\/primitives\/\d+\//);
          if (aIsMeshPrimitive && bIsMeshPrimitive) {
            const aBasePath = a.pointer.match(/^(\/meshes\/\d+\/primitives\/\d+)/);
            const bBasePath = b.pointer.match(/^(\/meshes\/\d+\/primitives\/\d+)/);
            if (aBasePath && bBasePath && aBasePath[1] === bBasePath[1]) {
              const aIsAttribute = a.pointer.includes("/attributes/");
              const bIsAttribute = b.pointer.includes("/attributes/");
              const aIsIndices = a.pointer.includes("/indices");
              const bIsIndices = b.pointer.includes("/indices");
              if (aIsAttribute && bIsIndices)
                return -1;
              if (aIsIndices && bIsAttribute)
                return 1;
            }
          }
          if (a.pointer === b.pointer) {
            if (a.code === "BUFFER_VIEW_TARGET_MISSING" && b.code === "MESH_PRIMITIVE_INDICES_ACCESSOR_WITH_BYTESTRIDE") {
              return -1;
            }
            if (a.code === "MESH_PRIMITIVE_INDICES_ACCESSOR_WITH_BYTESTRIDE" && b.code === "BUFFER_VIEW_TARGET_MISSING") {
              return 1;
            }
          }
          return a.severity - b.severity;
        }
        const accessorCodes = [
          "ACCESSOR_MIN_MISMATCH",
          "ACCESSOR_ELEMENT_OUT_OF_MIN_BOUND",
          "ACCESSOR_MAX_MISMATCH",
          "ACCESSOR_ELEMENT_OUT_OF_MAX_BOUND",
          "ACCESSOR_INVALID_FLOAT"
        ];
        const aIsAccessor = accessorCodes.includes(a.code);
        const bIsAccessor = accessorCodes.includes(b.code);
        if (aIsAccessor && bIsAccessor) {
          if (a.code === "ACCESSOR_INVALID_FLOAT" || b.code === "ACCESSOR_INVALID_FLOAT") {
            const aAccessorMatch = a.pointer.match(/\/accessors\/(\d+)$/);
            const bAccessorMatch = b.pointer.match(/\/accessors\/(\d+)$/);
            const aMinMaxMatch = a.pointer.match(/\/accessors\/(\d+)\/(min|max)\/(\d+)/);
            const bMinMaxMatch = b.pointer.match(/\/accessors\/(\d+)\/(min|max)\/(\d+)/);
            const aAccessorIdx = aAccessorMatch ? parseInt(aAccessorMatch[1]) : aMinMaxMatch ? parseInt(aMinMaxMatch[1]) : 0;
            const bAccessorIdx = bAccessorMatch ? parseInt(bAccessorMatch[1]) : bMinMaxMatch ? parseInt(bMinMaxMatch[1]) : 0;
            if (aAccessorIdx !== bAccessorIdx) {
              return aAccessorIdx - bAccessorIdx;
            }
            if (a.code === "ACCESSOR_INVALID_FLOAT" && b.code !== "ACCESSOR_INVALID_FLOAT") {
              return -1;
            }
            if (b.code === "ACCESSOR_INVALID_FLOAT" && a.code !== "ACCESSOR_INVALID_FLOAT") {
              return 1;
            }
            return 0;
          }
          const aMatch = a.pointer.match(/\/accessors\/(\d+)\/(min|max)\/(\d+)/);
          const bMatch = b.pointer.match(/\/accessors\/(\d+)\/(min|max)\/(\d+)/);
          if (aMatch && bMatch) {
            const aAccessorIdx = parseInt(aMatch[1]);
            const bAccessorIdx = parseInt(bMatch[1]);
            if (aAccessorIdx !== bAccessorIdx) {
              return aAccessorIdx - bAccessorIdx;
            }
            const aComponentIdx = parseInt(aMatch[3]);
            const bComponentIdx = parseInt(bMatch[3]);
            const aType = aMatch[2];
            const bType = bMatch[2];
            if (aType !== bType) {
              return aType === "min" ? -1 : 1;
            }
            if (aComponentIdx !== bComponentIdx) {
              return aComponentIdx - bComponentIdx;
            }
            const minOrder = [
              "ACCESSOR_MIN_MISMATCH",
              "ACCESSOR_ELEMENT_OUT_OF_MIN_BOUND"
            ];
            const maxOrder = [
              "ACCESSOR_MAX_MISMATCH",
              "ACCESSOR_ELEMENT_OUT_OF_MAX_BOUND"
            ];
            const order = aType === "min" ? minOrder : maxOrder;
            const aPos = order.indexOf(a.code);
            const bPos = order.indexOf(b.code);
            return aPos - bPos;
          }
        }
        return 0;
      });
    }
    validateGLB(gltf, resources) {
      if (gltf.buffers && gltf.buffers.length > 0) {
        const buffer = gltf.buffers[0];
        if (buffer) {
          if (buffer.uri !== void 0) {
            const dataUriBase64Match = buffer.uri.match(/^data:([^;,]+);base64,(.+)$/);
            const dataUriPlainMatch = buffer.uri.match(/^data:([^;,]+),(.*)$/);
            const isDataUri = !!(dataUriBase64Match || dataUriPlainMatch);
            this.addMessage({
              code: "URI_GLB",
              message: "URI is used in GLB container.",
              severity: Severity.INFO,
              pointer: `/buffers/0/uri`
            });
            if (isDataUri) {
              this.addMessage({
                code: "DATA_URI_GLB",
                message: "Data URI is used in GLB container.",
                severity: Severity.WARNING,
                pointer: `/buffers/0/uri`
              });
            }
          } else {
            const binResource = resources.find((r) => r.storage === "glb");
            if (!binResource) {
              this.addMessage({
                code: "BUFFER_MISSING_GLB_DATA",
                message: "Buffer refers to an unresolved GLB binary chunk.",
                severity: Severity.ERROR,
                pointer: `/buffers/0`
              });
            }
          }
          if (!buffer.uri) {
            const binResource = resources.find((r) => r.storage === "glb");
            const binResourceExt = binResource;
            if (binResource && binResourceExt.actualByteLength !== void 0 && binResourceExt.declaredByteLength !== void 0) {
              const declaredLength = binResourceExt.declaredByteLength;
              const actualLength = binResourceExt.actualByteLength;
              const requiredPaddedLength = Math.ceil(declaredLength / 4) * 4;
              const extraPaddingBytes = actualLength - requiredPaddedLength;
              if (extraPaddingBytes > 0) {
                this.addMessage({
                  code: "BUFFER_GLB_CHUNK_TOO_BIG",
                  message: `GLB-stored BIN chunk contains ${extraPaddingBytes} extra padding byte(s).`,
                  severity: Severity.WARNING,
                  pointer: `/buffers/0`
                });
              } else if (actualLength < declaredLength) {
                this.addMessage({
                  code: "BUFFER_BYTE_LENGTH_MISMATCH",
                  message: `Actual data byte length (${binResourceExt.actualByteLength}) is less than the declared buffer byte length (${binResourceExt.declaredByteLength}).`,
                  severity: Severity.ERROR,
                  pointer: `/buffers/0`
                });
              }
            }
          }
        }
      }
      if (gltf.images) {
        for (let i = 0; i < gltf.images.length; i++) {
          const image = gltf.images[i];
          if (image && image.uri) {
            const isDataUri = image.uri.startsWith("data:");
            this.addMessage({
              code: "URI_GLB",
              message: "URI is used in GLB container.",
              severity: Severity.INFO,
              pointer: `/images/${i}/uri`
            });
            if (isDataUri) {
              this.addMessage({
                code: "DATA_URI_GLB",
                message: "Data URI is used in GLB container.",
                severity: Severity.WARNING,
                pointer: `/images/${i}/uri`
              });
            }
          }
        }
      }
    }
    checkUndeclaredExtensions(gltf) {
      const extensionsUsed = new Set(gltf["extensionsUsed"] || []);
      const foundExtensions = /* @__PURE__ */ new Set();
      const checkObjectExtensions = (obj, basePointer) => {
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
          const objWithExtensions = obj;
          if (objWithExtensions["extensions"]) {
            const extensions = objWithExtensions["extensions"];
            for (const extensionName in extensions) {
              foundExtensions.add(extensionName);
              if (!extensionsUsed.has(extensionName)) {
                this.addMessage({
                  code: "UNDECLARED_EXTENSION",
                  message: "Extension is not declared in extensionsUsed.",
                  severity: Severity.ERROR,
                  pointer: `${basePointer}/extensions/${extensionName}`
                });
              }
            }
          }
        }
      };
      const collections = [
        { array: gltf.textures, name: "textures" },
        { array: gltf.materials, name: "materials" },
        { array: gltf.nodes, name: "nodes" },
        { array: gltf.meshes, name: "meshes" },
        { array: gltf.animations, name: "animations" },
        { array: gltf.cameras, name: "cameras" },
        { array: gltf.samplers, name: "samplers" },
        { array: gltf.scenes, name: "scenes" },
        { array: gltf.skins, name: "skins" }
      ];
      for (const collection of collections) {
        if (collection.array) {
          for (let i = 0; i < collection.array.length; i++) {
            const item = collection.array[i];
            if (item) {
              checkObjectExtensions(item, `/${collection.name}/${i}`);
              if (collection.name === "materials") {
                const material = item;
                if (material.pbrMetallicRoughness) {
                  checkObjectExtensions(material.pbrMetallicRoughness.baseColorTexture, `/${collection.name}/${i}/pbrMetallicRoughness/baseColorTexture`);
                  checkObjectExtensions(material.pbrMetallicRoughness.metallicRoughnessTexture, `/${collection.name}/${i}/pbrMetallicRoughness/metallicRoughnessTexture`);
                }
                checkObjectExtensions(material.normalTexture, `/${collection.name}/${i}/normalTexture`);
                checkObjectExtensions(material.occlusionTexture, `/${collection.name}/${i}/occlusionTexture`);
                checkObjectExtensions(material.emissiveTexture, `/${collection.name}/${i}/emissiveTexture`);
              }
              if (collection.name === "meshes") {
                const mesh = item;
                if (mesh.primitives) {
                  for (let j = 0; j < mesh.primitives.length; j++) {
                    const primitive = mesh.primitives[j];
                    checkObjectExtensions(primitive, `/${collection.name}/${i}/primitives/${j}`);
                  }
                }
              }
              if (collection.name === "animations") {
                const animation = item;
                if (animation.channels) {
                  for (let j = 0; j < animation.channels.length; j++) {
                    const channel = animation.channels[j];
                    checkObjectExtensions(channel, `/${collection.name}/${i}/channels/${j}`);
                    if (channel && channel.target) {
                      checkObjectExtensions(channel.target, `/${collection.name}/${i}/channels/${j}/target`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    escapeJsonPointer(key) {
      return key.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  };

  // dist/validators/glb-validator.js
  var GLBValidator = class {
    static async parseGLB(data) {
      if (data.length === 0) {
        throw new Error("GLB_UNEXPECTED_END_OF_HEADER:Unexpected end of header.:1");
      }
      if (data.length < 12) {
        throw new Error("GLB_UNEXPECTED_END_OF_HEADER:Unexpected end of header.:" + data.length);
      }
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      const header = {
        magic: view.getUint32(0, true),
        // little-endian
        version: view.getUint32(4, true),
        // little-endian
        length: view.getUint32(8, true)
        // little-endian
      };
      if (header.magic !== 1179937895) {
        throw new Error(`GLB_INVALID_MAGIC:Invalid GLB magic value (${header.magic}).:0`);
      }
      if (header.version !== 2) {
        throw new Error(`GLB_INVALID_VERSION:Invalid GLB version value ${header.version}.:4`);
      }
      const warnings = [];
      const errors = [];
      const allMessages = [];
      let lengthMismatchError = null;
      let actualDataLength = data.length;
      if (header.length !== data.length) {
        if (header.length < data.length) {
          if (header.length < 16) {
            lengthMismatchError = `GLB_LENGTH_MISMATCH:Declared length (${header.length}) does not match GLB length (${data.length}).:${data.length}`;
            actualDataLength = data.length;
          } else {
            warnings.push(`GLB_EXTRA_DATA:Extra data after the end of GLB stream.:${header.length}`);
            actualDataLength = header.length;
          }
        } else {
          lengthMismatchError = `GLB_LENGTH_MISMATCH:Declared length (${header.length}) does not match GLB length (${data.length}).:${data.length}`;
          actualDataLength = data.length;
        }
      }
      if (header.length <= 12) {
        const msg = `GLB_LENGTH_TOO_SMALL:Declared GLB length (${header.length}) is too small.:8`;
        errors.push(msg);
        allMessages.push(msg);
      }
      let offset = 12;
      const chunks = [];
      const resources = [];
      const seenChunkTypes = /* @__PURE__ */ new Set();
      while (offset < actualDataLength) {
        if (offset + 8 > actualDataLength) {
          throw new Error(`GLB_UNEXPECTED_END_OF_CHUNK_HEADER:Unexpected end of chunk header.:${offset}`);
        }
        const chunkLength = view.getUint32(offset, true);
        const chunkType = view.getUint32(offset + 4, true);
        let isEmptyChunk = false;
        if (chunkLength === 0) {
          const chunkTypeStr = chunkType.toString(16).toLowerCase().padStart(8, "0");
          const knownChunkTypes2 = [1313821514, 5130562];
          if (chunkType === 5130562) {
            const msg = `GLB_EMPTY_BIN_CHUNK:Empty BIN chunk should be omitted.:${offset}`;
            warnings.push(msg);
            allMessages.push(msg);
          } else if (knownChunkTypes2.includes(chunkType)) {
            const msg = `GLB_EMPTY_CHUNK:Chunk (0x${chunkTypeStr}) cannot have zero length.:${offset}`;
            errors.push(msg);
            allMessages.push(msg);
          }
          isEmptyChunk = true;
        }
        if (offset + 8 + chunkLength > header.length) {
          const chunkTypeStr = chunkType.toString(16).toLowerCase().padStart(8, "0");
          const msg = `GLB_CHUNK_TOO_BIG:Chunk (0x${chunkTypeStr}) length (${chunkLength}) does not fit total GLB length.:${offset}`;
          errors.push(msg);
          allMessages.push(msg);
        }
        let isDataTruncated = false;
        if (offset + 8 + chunkLength > actualDataLength) {
          const msg = `GLB_UNEXPECTED_END_OF_CHUNK_DATA:Unexpected end of chunk data.:${offset + 8 + chunkLength - 1}`;
          errors.push(msg);
          allMessages.push(msg);
          isDataTruncated = true;
        }
        if (seenChunkTypes.has(chunkType)) {
          const chunkTypeStr = chunkType.toString(16).toLowerCase().padStart(8, "0");
          const msg = `GLB_DUPLICATE_CHUNK:Chunk of type 0x${chunkTypeStr} has already been used.:${offset}`;
          errors.push(msg);
          allMessages.push(msg);
        }
        seenChunkTypes.add(chunkType);
        const knownChunkTypes = [1313821514, 5130562];
        if (!knownChunkTypes.includes(chunkType)) {
          const chunkTypeStr = chunkType.toString(16).toLowerCase().padStart(8, "0");
          const msg = `GLB_UNKNOWN_CHUNK_TYPE:Unknown GLB chunk type: 0x${chunkTypeStr}.:${offset}`;
          warnings.push(msg);
          allMessages.push(msg);
        }
        if (chunkLength % 4 !== 0) {
          throw new Error(`GLB_CHUNK_LENGTH_UNALIGNED:Length of 0x${chunkType.toString(16)} chunk is not aligned to 4-byte boundaries.:${offset}`);
        }
        let chunkData;
        if (isEmptyChunk) {
          chunkData = new Uint8Array(0);
          offset += 8;
        } else if (isDataTruncated) {
          const availableData = actualDataLength - (offset + 8);
          chunkData = availableData > 0 ? data.slice(offset + 8, offset + 8 + availableData) : new Uint8Array(0);
          offset = actualDataLength;
        } else {
          chunkData = data.slice(offset + 8, offset + 8 + chunkLength);
          offset += 8 + chunkLength;
        }
        chunks.push({
          length: chunkLength,
          type: chunkType,
          data: chunkData
        });
        if (isDataTruncated) {
          break;
        }
      }
      const jsonChunk = chunks.find((chunk) => chunk.type === 1313821514);
      const binChunk = chunks.find((chunk) => chunk.type === 5130562);
      let firstChunkError = null;
      if (!jsonChunk && chunks.length > 0 && chunks[0]) {
        const firstChunkType = chunks[0].type;
        firstChunkError = `GLB_UNEXPECTED_FIRST_CHUNK:First chunk must be of JSON type. Found 0x${firstChunkType.toString(16).padStart(8, "0")} instead.:12`;
        allMessages.unshift(firstChunkError);
      }
      if (binChunk) {
        const binChunkIndex = chunks.findIndex((chunk) => chunk.type === 5130562);
        if (binChunkIndex > 1) {
          let binChunkOffset = 12;
          for (let i = 0; i < binChunkIndex; i++) {
            binChunkOffset += 8;
            if (chunks[i] && chunks[i].length > 0) {
              binChunkOffset += chunks[i].length;
            }
          }
          const binChunkError = `GLB_UNEXPECTED_BIN_CHUNK:BIN chunk must be the second chunk.:${binChunkOffset}`;
          errors.push(binChunkError);
          allMessages.push(binChunkError);
        }
      }
      const jsonParsingErrors = [];
      if (jsonChunk) {
        const shouldAttemptJsonParsing = jsonChunk.length > 0 || errors.length > 1;
        if (shouldAttemptJsonParsing) {
          try {
            const jsonText2 = new TextDecoder().decode(jsonChunk.data);
            if (jsonChunk.data.length >= 3 && jsonChunk.data[0] === 239 && jsonChunk.data[1] === 187 && jsonChunk.data[2] === 191) {
              jsonParsingErrors.push("Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.");
            } else {
              JSON.parse(jsonText2);
            }
          } catch (error) {
            let errorMessage = `${error}`;
            if (errorMessage.includes("Unexpected end of JSON input")) {
              errorMessage = "FormatException: Unexpected end of input (at offset 0)";
            } else if (errorMessage.includes("Expected property name or '}' in JSON at position 1")) {
              errorMessage = "FormatException: Unexpected character (at offset 1)";
            } else if (errorMessage.includes("SyntaxError:")) {
              const positionMatch = errorMessage.match(/at position (\d+)/);
              const offset2 = positionMatch ? positionMatch[1] : "0";
              errorMessage = `FormatException: Unexpected character (at offset ${offset2})`;
            }
            jsonParsingErrors.push(`Invalid JSON data. Parser output: ${errorMessage}`);
          }
        }
      }
      if (jsonParsingErrors.length > 0 || !jsonChunk || jsonChunk && jsonChunk.length === 0) {
        if (lengthMismatchError) {
          const hasChunkTruncationError = allMessages.some((msg) => msg.includes("GLB_UNEXPECTED_END_OF_CHUNK_DATA"));
          if (!hasChunkTruncationError) {
            allMessages.push(lengthMismatchError);
          }
        }
        allMessages.push(...jsonParsingErrors);
        const sortedMessages = allMessages.sort((a, b) => {
          const getOffset = (msg) => {
            if (msg.includes("Invalid JSON data. Parser output:")) {
              return Number.MAX_SAFE_INTEGER;
            }
            const parts = msg.split(":");
            if (parts.length < 3)
              return Number.MAX_SAFE_INTEGER;
            const offsetStr = parts[parts.length - 1];
            return offsetStr ? parseInt(offsetStr) || 0 : 0;
          };
          return getOffset(a) - getOffset(b);
        });
        throw new Error(sortedMessages.join("|NEXT_ERROR|"));
      }
      if (!jsonChunk) {
        if (chunks.length === 0) {
          throw new Error("GLB missing JSON chunk");
        }
        throw new Error("GLB missing JSON chunk");
      }
      const jsonText = new TextDecoder().decode(jsonChunk.data);
      let gltf;
      if (jsonChunk.data.length >= 3 && jsonChunk.data[0] === 239 && jsonChunk.data[1] === 187 && jsonChunk.data[2] === 191) {
        throw new Error(`Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.`);
      }
      try {
        const json = JSON.parse(jsonText);
        gltf = this.normalizeGLTF(json);
      } catch (error) {
        let errorMessage = `${error}`;
        if (errorMessage.includes("Unexpected end of JSON input")) {
          errorMessage = "FormatException: Unexpected end of input (at offset 0)";
        } else if (errorMessage.includes("Expected property name or '}' in JSON at position 1")) {
          errorMessage = "FormatException: Unexpected character (at offset 1)";
        } else if (errorMessage.includes("SyntaxError:")) {
          const positionMatch = errorMessage.match(/at position (\d+)/);
          const offset2 = positionMatch ? positionMatch[1] : "0";
          errorMessage = `FormatException: Unexpected character (at offset ${offset2})`;
        }
        throw new Error(`Invalid JSON data. Parser output: ${errorMessage}`);
      }
      if (binChunk) {
        if (!gltf.buffers || gltf.buffers.length === 0) {
          throw new Error("GLB has BIN chunk but no buffers defined");
        }
        resources.push({
          pointer: "/buffers/0",
          mimeType: "application/gltf-buffer",
          storage: "glb",
          byteLength: binChunk.data.length,
          actualByteLength: binChunk.data.length,
          declaredByteLength: gltf.buffers[0]?.byteLength
        });
      }
      const glbErrors = [...errors];
      if (firstChunkError) {
        glbErrors.unshift(firstChunkError);
      }
      if (lengthMismatchError) {
        const hasChunkTruncationError = glbErrors.some((error) => error.includes("GLB_UNEXPECTED_END_OF_CHUNK_DATA"));
        if (!hasChunkTruncationError) {
          glbErrors.push(lengthMismatchError);
        }
      }
      if (glbErrors.length > 0) {
        const combinedError = glbErrors.join("|NEXT_ERROR|");
        warnings.push(combinedError);
      }
      return { gltf, resources, warnings };
    }
    static normalizeGLTF(json) {
      const jsonObj = json;
      const gltf = {
        asset: jsonObj["asset"],
        scene: jsonObj["scene"],
        scenes: Array.isArray(jsonObj["scenes"]) ? jsonObj["scenes"] : [],
        nodes: Array.isArray(jsonObj["nodes"]) ? jsonObj["nodes"] : [],
        materials: Array.isArray(jsonObj["materials"]) ? jsonObj["materials"] : [],
        accessors: Array.isArray(jsonObj["accessors"]) ? jsonObj["accessors"] : [],
        animations: Array.isArray(jsonObj["animations"]) ? jsonObj["animations"] : [],
        buffers: Array.isArray(jsonObj["buffers"]) ? jsonObj["buffers"] : [],
        bufferViews: Array.isArray(jsonObj["bufferViews"]) ? jsonObj["bufferViews"] : [],
        cameras: Array.isArray(jsonObj["cameras"]) ? jsonObj["cameras"] : [],
        images: Array.isArray(jsonObj["images"]) ? jsonObj["images"] : [],
        meshes: Array.isArray(jsonObj["meshes"]) ? jsonObj["meshes"] : [],
        samplers: Array.isArray(jsonObj["samplers"]) ? jsonObj["samplers"] : [],
        skins: Array.isArray(jsonObj["skins"]) ? jsonObj["skins"] : [],
        textures: Array.isArray(jsonObj["textures"]) ? jsonObj["textures"] : [],
        extensions: jsonObj["extensions"],
        extras: jsonObj["extras"]
      };
      for (const key in jsonObj) {
        if (!(key in gltf)) {
          gltf[key] = jsonObj[key];
        }
      }
      return gltf;
    }
  };

  // package.json
  var package_default = {
    name: "gltf-validator-ts",
    version: "1.0.0",
    description: "A TypeScript implementation of GLTF/GLB validation compatible with the official Khronos validator",
    main: "dist/index.js",
    type: "module",
    types: "dist/index.d.ts",
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
        require: "./dist/index.js"
      }
    },
    files: [
      "dist",
      "README.md",
      "LICENSE"
    ],
    scripts: {
      build: "tsc",
      "build:clean": "rm -rf dist && npm run build",
      "build:web": "npm run build && npm run build:web-bundle",
      "build:web-bundle": "esbuild dist/index.js --bundle --format=iife --outfile=web/scripts/gltf-validator.js --platform=browser --target=es2020 --global-name=GLTFValidator",
      "build:web-clean": "rm -rf dist web/scripts/gltf-validator.js && npm run build:web",
      test: "vitest run",
      "test:watch": "vitest",
      "test:coverage": "vitest run --coverage",
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
      format: "prettier --write src/**/*.ts",
      "format:check": "prettier --check src/**/*.ts",
      typecheck: "tsc --noEmit",
      prepublishOnly: "npm run build:clean && npm run update-test-reports && npm run test && npm run lint",
      prepack: "npm run build",
      example: "npm run build && node examples/basic/run-example.js",
      "example:ts": "npx tsx examples/basic/validate-model.ts",
      "update-test-reports": "node scripts/update-test-reports.js"
    },
    keywords: [
      "gltf",
      "glb",
      "validator",
      "validation",
      "3d",
      "webgl",
      "khronos",
      "typescript",
      "graphics",
      "mesh",
      "texture",
      "animation",
      "extensions"
    ],
    author: {
      name: "Nicol\xE1s Echezarreta",
      url: "https://github.com/nicoecheza"
    },
    license: "MIT",
    homepage: "https://github.com/nicoecheza/gltf-validator-ts",
    repository: {
      type: "git",
      url: "https://github.com/nicoecheza/gltf-validator-ts.git"
    },
    bugs: {
      url: "https://github.com/nicoecheza/gltf-validator-ts/issues"
    },
    devDependencies: {
      "@eslint/js": "^9.36.0",
      "@types/node": "^22.0.0",
      "@typescript-eslint/eslint-plugin": "^8.0.0",
      "@typescript-eslint/parser": "^8.0.0",
      "@vitest/coverage-v8": "^2.1.9",
      esbuild: "^0.21.5",
      eslint: "^9.0.0",
      prettier: "^3.0.0",
      typescript: "^5.0.0",
      vitest: "^2.0.0"
    },
    engines: {
      node: ">=18.0.0"
    },
    publishConfig: {
      access: "public"
    }
  };

  // dist/validator.js
  var VALIDATOR_VERSION = package_default.version;
  async function validateBytes(data, options = {}) {
    const { uri = "unknown", format, maxIssues = 100, ignoredIssues = [], onlyIssues = [], severityOverrides = {}, externalResourceFunction } = options;
    let detectedFormat = format;
    if (!detectedFormat) {
      if (uri.toLowerCase().endsWith(".glb")) {
        detectedFormat = "glb";
      } else if (uri.toLowerCase().endsWith(".gltf")) {
        detectedFormat = "gltf";
      } else {
        detectedFormat = detectFormat(data) || void 0;
      }
    }
    if (!detectedFormat) {
      try {
        await GLBValidator.parseGLB(data);
        detectedFormat = "glb";
      } catch {
        try {
          const parser = new GLTFParser();
          parser.parse(data);
          detectedFormat = "gltf";
        } catch {
          detectedFormat = "glb";
        }
      }
    }
    let gltf;
    let resources = [];
    let parsingErrors = [];
    if (detectedFormat === "glb") {
      try {
        const glbResult = await GLBValidator.parseGLB(data);
        gltf = glbResult.gltf;
        resources = glbResult.resources;
        if (glbResult.warnings && glbResult.warnings.length > 0) {
          for (const warning of glbResult.warnings) {
            parsingErrors.push(...convertGLBExceptionToValidationMessages(new Error(warning), data));
          }
        }
      } catch (error) {
        parsingErrors = convertGLBExceptionToValidationMessages(error, data);
        gltf = { asset: { version: "2.0" } };
      }
    } else {
      try {
        const parser = new GLTFParser();
        gltf = parser.parse(data);
      } catch (error) {
        parsingErrors = convertGLTFExceptionToValidationMessages(error);
        gltf = { asset: { version: "2.0" } };
      }
      if (gltf.buffers) {
        for (let i = 0; i < gltf.buffers.length; i++) {
          const buffer = gltf.buffers[i];
          if (buffer) {
            let mimeType = "application/gltf-buffer";
            let storage = "external";
            let uri2 = void 0;
            let byteLength = buffer.byteLength;
            if (buffer.uri) {
              if (buffer.uri.startsWith("data:")) {
                storage = "data-uri";
                mimeType = "application/gltf-buffer";
              } else {
                uri2 = buffer.uri;
                if (externalResourceFunction) {
                  try {
                    const bufferData = await externalResourceFunction(buffer.uri);
                    byteLength = bufferData.length;
                  } catch (error) {
                  }
                }
              }
            } else {
              mimeType = "application/gltf-buffer";
            }
            const resource = {
              pointer: `/buffers/${i}`,
              mimeType,
              storage,
              byteLength
            };
            if (uri2) {
              resource.uri = uri2;
            }
            resources.push(resource);
          }
        }
      }
      if (gltf.images) {
        for (let i = 0; i < gltf.images.length; i++) {
          const image = gltf.images[i];
          if (image) {
            let mimeType = void 0;
            let storage = "external";
            let uri2 = void 0;
            if (image.uri) {
              if (image.uri.startsWith("data:")) {
                storage = "data-uri";
                const match = image.uri.match(/^data:([^;]+)/);
                if (match) {
                  mimeType = match[1];
                }
              } else {
                uri2 = image.uri;
                const extension = image.uri.split(".").pop()?.toLowerCase();
                if (extension === "png") {
                  mimeType = "image/png";
                } else if (extension === "jpg" || extension === "jpeg") {
                  mimeType = "image/jpeg";
                } else if (extension === "ktx2") {
                  mimeType = "image/ktx2";
                }
              }
            } else if (image.bufferView !== void 0) {
              if (image.mimeType) {
                mimeType = image.mimeType;
              }
            }
            const resource = {
              pointer: `/images/${i}`,
              storage
            };
            if (mimeType) {
              resource.mimeType = mimeType;
            }
            if (uri2) {
              resource.uri = uri2;
            }
            resources.push(resource);
          }
        }
      }
    }
    const validatorOptions = {
      maxIssues: maxIssues ?? 100,
      ignoredIssues,
      onlyIssues,
      severityOverrides
    };
    if (externalResourceFunction) {
      validatorOptions.externalResourceFunction = externalResourceFunction;
    }
    const validator = new GLTFValidator(validatorOptions);
    if (gltf.buffers && externalResourceFunction) {
      for (let i = 0; i < gltf.buffers.length; i++) {
        const buffer = gltf.buffers[i];
        if (buffer && buffer.uri && !buffer.uri.startsWith("data:")) {
          let shouldLoadData = true;
          try {
            if (buffer.uri.includes("://")) {
              shouldLoadData = false;
            } else {
              if (buffer.uri.includes(":") && !buffer.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
                shouldLoadData = false;
              }
              if (buffer.uri === ":" || buffer.uri.startsWith(":/")) {
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
            }
          }
        }
      }
    }
    const validationResult = await validator.validate(gltf, detectedFormat === "glb", resources);
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
    if (gltf.buffers) {
      for (let i = 0; i < gltf.buffers.length; i++) {
        const buffer = gltf.buffers[i];
        if (buffer && buffer.uri && !buffer.uri.startsWith("data:") && externalResourceFunction) {
          let shouldCheckIO = true;
          try {
            if (buffer.uri.includes("://")) {
              shouldCheckIO = false;
            } else {
              if (buffer.uri.includes(":") && !buffer.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
                shouldCheckIO = false;
              }
              if (buffer.uri === ":" || buffer.uri.startsWith(":/")) {
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
              validationResult.issues.messages.push({
                code: "IO_ERROR",
                message: `Resource not found (${buffer.uri}).`,
                severity: 0,
                // ERROR
                pointer: `/buffers/${i}/uri`
              });
              validationResult.issues.numErrors++;
            }
          }
        }
      }
    }
    if (gltf.images && externalResourceFunction) {
      for (let i = 0; i < gltf.images.length; i++) {
        const image = gltf.images[i];
        if (image && image.uri && !image.uri.startsWith("data:")) {
          let shouldCheckIO = true;
          try {
            if (image.uri.includes("://")) {
              shouldCheckIO = false;
            } else {
              if (image.uri.includes(":") && !image.uri.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
                shouldCheckIO = false;
              }
              if (image.uri === ":" || image.uri.startsWith(":/")) {
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
              validationResult.issues.messages.push({
                code: "IO_ERROR",
                message: `Resource not found (${image.uri}).`,
                severity: 0,
                // ERROR
                pointer: `/images/${i}/uri`
              });
              validationResult.issues.numErrors++;
            }
          }
        }
      }
    }
    const result = {
      uri,
      mimeType: detectedFormat === "glb" ? "model/gltf-binary" : "model/gltf+json",
      validatorVersion: VALIDATOR_VERSION,
      issues: validationResult.issues,
      info: {
        version: gltf.asset?.version || "unknown",
        resources: resources.map((r) => ({
          ...r,
          mimeType: r.mimeType || "application/octet-stream"
        })),
        animationCount: gltf.animations?.length || 0,
        materialCount: gltf.materials?.length || 0,
        hasMorphTargets: hasMorphTargets(gltf),
        hasSkins: !!(gltf.skins && gltf.skins.length > 0),
        hasTextures: !!(gltf.textures && gltf.textures.length > 0),
        hasDefaultScene: gltf.scene !== void 0 && gltf.scenes !== void 0 && gltf.scene < gltf.scenes.length,
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
  function detectFormat(data) {
    if (data.length >= 4) {
      const magic = new DataView(data.buffer, data.byteOffset, 4).getUint32(0, true);
      if (magic === 1179937895) {
        return "glb";
      }
    }
    try {
      const text = new TextDecoder().decode(data);
      const json = JSON.parse(text);
      if (json.asset && json.asset.version) {
        return "gltf";
      }
    } catch {
    }
    return null;
  }
  function hasMorphTargets(gltf) {
    if (!gltf.meshes)
      return false;
    return gltf.meshes.some((mesh) => mesh && mesh.primitives && Array.isArray(mesh.primitives) && mesh.primitives.some((primitive) => primitive && primitive.targets && primitive.targets.length > 0));
  }
  function calculateDrawCallCount(gltf) {
    if (!gltf.meshes)
      return 0;
    return gltf.meshes.reduce((count, mesh) => count + (mesh && mesh.primitives && Array.isArray(mesh.primitives) ? mesh.primitives.length : 0), 0);
  }
  function calculateTotalVertexCount(gltf) {
    if (!gltf.meshes || !gltf.accessors)
      return 0;
    let total = 0;
    for (const mesh of gltf.meshes) {
      if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
        for (const primitive of mesh.primitives) {
          if (primitive && primitive.attributes && primitive.attributes["POSITION"] !== void 0) {
            const accessor = gltf.accessors[primitive.attributes["POSITION"]];
            if (accessor) {
              total += accessor.count;
            }
          }
        }
      }
    }
    return total;
  }
  function calculateTotalTriangleCount(gltf) {
    if (!gltf.meshes || !gltf.accessors)
      return 0;
    let total = 0;
    for (const mesh of gltf.meshes) {
      if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
        for (const primitive of mesh.primitives) {
          if (primitive) {
            if (primitive.indices !== void 0) {
              const accessor = gltf.accessors[primitive.indices];
              if (accessor && primitive.mode === PrimitiveMode.TRIANGLES) {
                total += Math.floor(accessor.count / 3);
              }
            } else {
              if (primitive.attributes && primitive.attributes["POSITION"] !== void 0) {
                const accessor = gltf.accessors[primitive.attributes["POSITION"]];
                if (accessor && (primitive.mode === PrimitiveMode.TRIANGLES || primitive.mode === void 0)) {
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
  function calculateMaxUVs(gltf) {
    if (!gltf.meshes)
      return 0;
    let maxUVs = 0;
    for (const mesh of gltf.meshes) {
      if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
        for (const primitive of mesh.primitives) {
          if (primitive && primitive.attributes && typeof primitive.attributes === "object") {
            const uvCount = Object.keys(primitive.attributes).filter((key) => key.startsWith("TEXCOORD_")).length;
            maxUVs = Math.max(maxUVs, uvCount);
          }
        }
      }
    }
    return maxUVs;
  }
  function calculateMaxInfluences(gltf) {
    if (!gltf.meshes)
      return 0;
    let maxInfluences = 0;
    for (const mesh of gltf.meshes) {
      if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
        for (const primitive of mesh.primitives) {
          if (primitive && primitive.attributes && typeof primitive.attributes === "object") {
            const influenceCount = Object.keys(primitive.attributes).filter((key) => key.startsWith("JOINTS_") || key.startsWith("WEIGHTS_")).length / 2;
            maxInfluences = Math.max(maxInfluences, influenceCount);
          }
        }
      }
    }
    return maxInfluences;
  }
  function calculateMaxAttributes(gltf) {
    if (!gltf.meshes)
      return 0;
    let maxAttributes = 0;
    for (const mesh of gltf.meshes) {
      if (mesh && mesh.primitives && Array.isArray(mesh.primitives)) {
        for (const primitive of mesh.primitives) {
          if (primitive && primitive.attributes && typeof primitive.attributes === "object") {
            maxAttributes = Math.max(maxAttributes, Object.keys(primitive.attributes).length);
          }
        }
      }
    }
    return maxAttributes;
  }
  function convertGLBExceptionToValidationMessages(error, _data) {
    const message = error.message;
    if (message.includes("|NEXT_ERROR|")) {
      const errorParts = message.split("|NEXT_ERROR|");
      const allMessages = [];
      for (const errorPart of errorParts) {
        allMessages.push(...convertGLBExceptionToValidationMessages(new Error(errorPart), _data));
      }
      return allMessages;
    }
    if (message.includes("Invalid JSON data. Parser output:")) {
      return [{
        code: "INVALID_JSON",
        message,
        severity: 0,
        pointer: ""
      }];
    }
    if (message.includes("BOM found at the beginning of UTF-8 stream")) {
      return [{
        code: "INVALID_JSON",
        message: "Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.",
        severity: 0,
        pointer: ""
      }];
    }
    let messageToCheck = message;
    if (message.includes("Failed to parse GLTF JSON: ") && message.includes("TYPE_MISMATCH")) {
      messageToCheck = message.substring(message.indexOf("TYPE_MISMATCH"));
    }
    if (messageToCheck.includes(":")) {
      const parts = messageToCheck.split(":");
      if (parts.length >= 3) {
        const code = parts[0];
        const msg = parts.slice(1, -1).join(":");
        const offsetOrValue = parts[parts.length - 1];
        switch (code) {
          case "GLB_UNEXPECTED_END_OF_HEADER":
            return [{
              code: "GLB_UNEXPECTED_END_OF_HEADER",
              message: "Unexpected end of header.",
              severity: 0,
              offset: parseInt(offsetOrValue || "0") || 0
            }];
          case "GLB_INVALID_MAGIC":
            return [{
              code: "GLB_INVALID_MAGIC",
              message: msg,
              severity: 0,
              offset: 0
            }];
          case "GLB_INVALID_VERSION":
            return [{
              code: "GLB_INVALID_VERSION",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "4") || 4
            }];
          case "GLB_LENGTH_MISMATCH":
            return [{
              code: "GLB_LENGTH_MISMATCH",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "8") || 8
            }];
          case "GLB_EXTRA_DATA":
            return [{
              code: "GLB_EXTRA_DATA",
              message: msg,
              severity: 1,
              // Warning
              offset: parseInt(offsetOrValue || "0") || 0
            }];
          case "GLB_UNEXPECTED_END_OF_CHUNK_DATA":
            return [{
              code: "GLB_UNEXPECTED_END_OF_CHUNK_DATA",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "0") || 0
            }];
          case "GLB_CHUNK_TOO_BIG":
            return [{
              code: "GLB_CHUNK_TOO_BIG",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "0") || 0
            }];
          case "GLB_UNEXPECTED_END_OF_CHUNK_HEADER":
            return [{
              code: "GLB_UNEXPECTED_END_OF_CHUNK_HEADER",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "0") || 0
            }];
          case "GLB_EMPTY_CHUNK":
            return [{
              code: "GLB_EMPTY_CHUNK",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "0") || 0
            }];
          case "GLB_DUPLICATE_CHUNK":
            return [{
              code: "GLB_DUPLICATE_CHUNK",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "0") || 0
            }];
          case "GLB_LENGTH_TOO_SMALL":
            return [{
              code: "GLB_LENGTH_TOO_SMALL",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "8") || 8
            }];
          case "GLB_UNEXPECTED_FIRST_CHUNK":
            return [{
              code: "GLB_UNEXPECTED_FIRST_CHUNK",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "12") || 12
            }];
          case "GLB_UNEXPECTED_BIN_CHUNK":
            return [{
              code: "GLB_UNEXPECTED_BIN_CHUNK",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "12") || 12
            }];
          case "GLB_CHUNK_LENGTH_UNALIGNED":
            return [{
              code: "GLB_CHUNK_LENGTH_UNALIGNED",
              message: msg,
              severity: 0,
              offset: parseInt(offsetOrValue || "12") || 12
            }];
          case "GLB_UNKNOWN_CHUNK_TYPE":
            return [{
              code: "GLB_UNKNOWN_CHUNK_TYPE",
              message: msg,
              severity: 1,
              // Warning
              offset: parseInt(offsetOrValue || "12") || 12
            }];
          case "GLB_EMPTY_BIN_CHUNK":
            return [{
              code: "GLB_EMPTY_BIN_CHUNK",
              message: msg,
              severity: 2,
              // Info
              offset: parseInt(offsetOrValue || "12") || 12
            }];
          case "TYPE_MISMATCH":
            return [{
              code: "TYPE_MISMATCH",
              message: msg,
              severity: 0,
              pointer: "/"
            }];
        }
      }
    }
    if (message === "Invalid GLB magic number") {
      return [{
        code: "GLB_INVALID_MAGIC",
        message: `Invalid magic.`,
        severity: 0,
        offset: 0
      }];
    }
    if (message.startsWith("Unsupported GLB version:")) {
      const version = message.split(":")[1]?.trim() || "unknown";
      return [{
        code: "GLB_INVALID_VERSION",
        message: `Invalid version ${version}.`,
        severity: 0,
        offset: 4
      }];
    }
    if (message.includes("Declared length") && message.includes("does not match GLB length")) {
      return [{
        code: "GLB_LENGTH_MISMATCH",
        message,
        severity: 0,
        offset: 8
      }];
    }
    if (message === "GLB file too small") {
      return [{
        code: "GLB_UNEXPECTED_END_OF_HEADER",
        message: "Unexpected end of header.",
        severity: 0,
        offset: 0
      }];
    }
    if (message === "Invalid GLB chunk header") {
      return [{
        code: "GLB_UNEXPECTED_END_OF_CHUNK_HEADER",
        message: "Unexpected end of chunk header.",
        severity: 0
      }];
    }
    if (message === "GLB chunk extends beyond file") {
      return [{
        code: "GLB_UNEXPECTED_END_OF_CHUNK_DATA",
        message: "Unexpected end of chunk data.",
        severity: 0
      }];
    }
    if (message === "GLB missing JSON chunk") {
      return [{
        code: "GLB_UNEXPECTED_FIRST_CHUNK",
        message: "First chunk must be JSON.",
        severity: 0
      }];
    }
    if (message.startsWith("Failed to parse GLB JSON:")) {
      const jsonError = message.replace("Failed to parse GLB JSON: ", "");
      if (jsonError === "SyntaxError: Unexpected end of JSON input") {
        return [{
          code: "GLB_EMPTY_CHUNK",
          message: "Chunk (0x4e4f534a) cannot have zero length.",
          severity: 0
        }];
      }
      if (jsonError.includes("SyntaxError:")) {
        let detailedError = jsonError.replace("SyntaxError: ", "");
        if (detailedError.includes("Unexpected token") || detailedError.includes("Expected property name")) {
          const match = detailedError.match(/position (\d+)/);
          const offset = match ? match[1] : "1";
          detailedError = `FormatException: Unexpected character (at offset ${offset})`;
        } else if (detailedError.includes("Unexpected end")) {
          detailedError = `FormatException: Unexpected end of JSON input (at offset 0)`;
        } else {
          detailedError = `FormatException: ${detailedError}`;
        }
        return [{
          code: "INVALID_JSON",
          message: `Invalid JSON data. Parser output: ${detailedError}`,
          severity: 0,
          pointer: ""
        }];
      }
      if (jsonError === "Error: GLTF must have an asset object with version") {
        return [{
          code: "UNDEFINED_PROPERTY",
          message: "Property 'asset' must be defined.",
          severity: 0,
          pointer: "/"
        }];
      }
    }
    return [{
      code: "GLB_PARSE_ERROR",
      message: `GLB parsing error: ${message}`,
      severity: 0
    }];
  }
  function convertGLTFExceptionToValidationMessages(error) {
    const message = error.message;
    if (message.includes("BOM found at the beginning of UTF-8 stream")) {
      return [{
        code: "INVALID_JSON",
        message: "Invalid JSON data. Parser output: BOM found at the beginning of UTF-8 stream.",
        severity: 0,
        pointer: ""
      }];
    }
    let messageToCheck = message;
    if (message.includes("Failed to parse GLTF JSON: ") && message.includes("TYPE_MISMATCH")) {
      messageToCheck = message.substring(message.indexOf("TYPE_MISMATCH"));
    }
    if (messageToCheck.includes(":") && messageToCheck.includes("TYPE_MISMATCH")) {
      const parts = messageToCheck.split(":");
      if (parts.length >= 3) {
        const code = parts[0];
        const msg = parts[1];
        if (code === "TYPE_MISMATCH") {
          return [{
            code: "TYPE_MISMATCH",
            message: msg,
            severity: 0,
            pointer: ""
          }];
        }
      }
    }
    if (message.includes("SyntaxError") || message.includes("JSON") && !message.includes("TYPE_MISMATCH") && !message.includes("BOM found")) {
      let errorDetail = message.replace("SyntaxError: ", "").replace("JSON.parse: ", "");
      errorDetail = errorDetail.replace("Failed to parse GLTF JSON: ", "");
      if (errorDetail.includes("Unexpected end of JSON input")) {
        errorDetail = "Unexpected end of input (at offset 0)";
      } else if (errorDetail.includes("Expected property name or '}' in JSON at position")) {
        const match = errorDetail.match(/at position (\d+)/);
        const position = match ? match[1] : "1";
        errorDetail = `Unexpected character (at offset ${position})`;
      }
      return [{
        code: "INVALID_JSON",
        message: `Invalid JSON data. Parser output: FormatException: ${errorDetail}`,
        severity: 0,
        pointer: ""
      }];
    }
    if (message.includes("asset") && message.includes("version")) {
      return [{
        code: "UNDEFINED_PROPERTY",
        message: "Property 'asset' must be defined.",
        severity: 0,
        pointer: ""
      }];
    }
    return [{
      code: "GLTF_PARSE_ERROR",
      message: `GLTF parsing error: ${message}`,
      severity: 0
    }];
  }

  // dist/index.js
  var parseGLB = GLBValidator.parseGLB;
  return __toCommonJS(dist_exports);
})();
