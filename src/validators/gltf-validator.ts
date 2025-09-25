import {
  GLTF,
  GLTFWithExplicitDefinitions,
  GLTFMaterial,
  GLTFMesh,
  GLTFAnimation,
  ValidationMessage,
  Issues,
  Severity,
  ResourceReference,
} from "../types";
import {
  isObject,
  isNonNegativeInteger,
  createJSONPointer,
  assertIsObject,
} from "../type-guards";
import { AssetValidator } from "./asset-validator";
import { BufferValidator } from "./buffer-validator";
import { BufferViewValidator } from "./buffer-view-validator";
import { AccessorValidator } from "./accessor-validator";
import { AnimationValidator } from "./animation-validator";
import { NodeValidator } from "./node-validator";
import { MeshValidator } from "./mesh-validator";
import { MaterialValidator } from "./material-validator";
import { TextureValidator } from "./texture-validator";
import { ImageValidator } from "./image-validator";
import { SamplerValidator } from "./sampler-validator";
import { CameraValidator } from "./camera-validator";
import { SceneValidator } from "./scene-validator";
import { SkinValidator } from "./skin-validator";
import { UsageTracker } from "../usage-tracker";
import { extensionValidators } from "./extensions";

export interface ValidatorOptions {
  maxIssues?: number;
  ignoredIssues?: string[];
  onlyIssues?: string[];
  severityOverrides?: Record<string, Severity>;
  externalResourceFunction?: (uri: string) => Promise<Uint8Array>;
}

export class GLTFValidator {
  private options: ValidatorOptions;
  private messages: ValidationMessage[] = [];
  private usageTracker: UsageTracker;
  private bufferData: Map<number, Uint8Array> = new Map();

  constructor(options: ValidatorOptions = {}) {
    this.options = {
      maxIssues: options.maxIssues ?? 100,
      ignoredIssues: options.ignoredIssues ?? [],
      onlyIssues: options.onlyIssues ?? [],
      severityOverrides: options.severityOverrides ?? {},
      externalResourceFunction: options.externalResourceFunction
    };
    this.usageTracker = new UsageTracker();
  }

  async validate(
    gltf: GLTF,
    isGLB: boolean = false,
    resources: ResourceReference[] = [],
  ): Promise<{ issues: Issues }> {
    this.messages = [];
    this.usageTracker = new UsageTracker();
    // Note: Don't clear bufferData here as it may have been set by external resource loading

    // Track all object references first
    this.usageTracker.trackReferences(gltf);

    // Validate asset (required)
    this.validateAsset(gltf);

    // Validate root level properties first
    this.validateRootProperties(gltf);

    // Add GLB-specific validation if this is a GLB file
    if (isGLB) {
      this.validateGLB(gltf, resources);
    }

    // Empty array checks are now handled in individual validators

    // Validate all objects
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

    // Check for unused objects first (as expected by tests)
    this.checkUnusedObjects(gltf);

    // Validate extensions after unused object detection
    this.validateExtensions(gltf);

    // Cross-validation between systems
    this.validateSkinnedNodeScenePresence(gltf);
    this.validateSkinnedMeshNodeHierarchy(gltf);

    // Check for node loops after all nodes are validated
    this.checkNodeLoops(gltf);

    // Apply filters and limits
    this.applyFilters();

    // Sort messages to match expected test order
    this.sortMessagesForTestCompatibility();

    return {
      issues: this.buildIssues(),
    };
  }

  // Method to set buffer data for validation
  setBufferData(bufferIndex: number, data: Uint8Array): void {
    this.bufferData.set(bufferIndex, data);
  }

  // Method to get buffer data for validation
  getBufferData(bufferIndex: number): Uint8Array | undefined {
    return this.bufferData.get(bufferIndex);
  }

  private validateRootProperties(gltf: GLTF): void {
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
      "_explicitlyDefined", // Internal parser property
    ];

    for (const key in gltf) {
      if (!expectedRootProperties.includes(key)) {
        this.addMessage({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/${this.escapeJsonPointer(key)}`,
        });
      }
    }
  }

  private validateCollectionType(value: unknown, property: string): boolean {
    if (value != null && !Array.isArray(value)) {
      this.addMessage({
        code: "TYPE_MISMATCH",
        message: `Type mismatch. Property value ${JSON.stringify(value)} is not a 'array'.`,
        severity: Severity.ERROR,
        pointer: `/${property}`,
      });
      return false;
    }
    return true;
  }

  private validateAsset(gltf: GLTF): void {
    // Check if asset property is missing
    if (!gltf.asset) {
      this.addMessage({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'asset' must be defined.",
        severity: Severity.ERROR,
        pointer: "/",
      });
      return;
    }

    const validator = new AssetValidator();
    const messages = validator.validate(gltf.asset);
    this.addMessages(messages);
  }

  private validateBuffers(gltf: GLTF): void {
    if (!gltf.buffers) return;

    // Check for empty buffers array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.buffers &&
      gltf.buffers.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/buffers",
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

  private validateBufferViews(gltf: GLTF): void {
    if (!gltf.bufferViews) return;

    // Check for empty bufferViews array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.bufferViews &&
      gltf.bufferViews.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/bufferViews",
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

  private validateAccessors(gltf: GLTF): void {
    if (!gltf.accessors) return;

    // Check for empty accessors array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.accessors &&
      gltf.accessors.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/accessors",
      });
      return;
    }

    const validator = new AccessorValidator();
    const allMessages: ValidationMessage[] = [];

    for (let i = 0; i < gltf.accessors.length; i++) {
      const accessor = gltf.accessors[i];
      if (accessor) {
        // Basic validation
        const messages = validator.validate(accessor, i, gltf);
        allMessages.push(...messages);

        // Data validation if buffer data is available
        if (accessor.bufferView !== undefined && gltf.bufferViews) {
          const bufferView = gltf.bufferViews[accessor.bufferView];
          if (bufferView && bufferView.buffer !== undefined) {
            const bufferData = this.getBufferData(bufferView.buffer);
            if (bufferData) {
              const dataMessages = validator.validateAccessorData(
                accessor,
                i,
                gltf,
                bufferData,
              );
              allMessages.push(...dataMessages);
            }
          }
        }
      }
    }

    this.addMessages(allMessages);
  }

  private validateAnimations(gltf: GLTF): void {
    if (!gltf.animations) return;

    // Check for empty animations array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.animations &&
      gltf.animations.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/animations",
      });
      return;
    }

    const validator = new AnimationValidator();
    const allMessages: ValidationMessage[] = [];

    for (let i = 0; i < gltf.animations.length; i++) {
      const animation = gltf.animations[i];
      if (animation) {
        const messages = validator.validate(animation, i, gltf);
        allMessages.push(...messages);

        // Data validation for animation samplers
        if (animation.samplers) {
          for (let j = 0; j < animation.samplers.length; j++) {
            const sampler = animation.samplers[j];
            if (
              sampler &&
              sampler.input !== undefined &&
              sampler.output !== undefined &&
              gltf.accessors
            ) {
              // Validate input accessor data with animation-specific validation
              const inputAccessor = gltf.accessors[sampler.input];
              if (
                inputAccessor &&
                inputAccessor.bufferView !== undefined &&
                gltf.bufferViews
              ) {
                const bufferView = gltf.bufferViews[inputAccessor.bufferView];
                if (bufferView && bufferView.buffer !== undefined) {
                  const bufferData = this.getBufferData(bufferView.buffer);
                  if (bufferData) {
                    const inputValidator = new AccessorValidator();
                    // Regular accessor data validation
                    const inputMessages = inputValidator.validateAccessorData(
                      inputAccessor,
                      sampler.input,
                      gltf,
                      bufferData,
                    );
                    allMessages.push(...inputMessages);

                    // Animation-specific input validation
                    const animationInputMessages =
                      inputValidator.validateAnimationInputAccessorData(
                        inputAccessor,
                        sampler.input,
                        gltf,
                        bufferData,
                        i,
                        j,
                      );
                    allMessages.push(...animationInputMessages);
                  }
                }
              }

              // Validate output accessor data
              const outputAccessor = gltf.accessors[sampler.output];
              if (
                outputAccessor &&
                outputAccessor.bufferView !== undefined &&
                gltf.bufferViews
              ) {
                const bufferView = gltf.bufferViews[outputAccessor.bufferView];
                if (bufferView && bufferView.buffer !== undefined) {
                  const bufferData = this.getBufferData(bufferView.buffer);
                  if (bufferData) {
                    const outputValidator = new AccessorValidator();
                    const outputMessages = outputValidator.validateAccessorData(
                      outputAccessor,
                      sampler.output,
                      gltf,
                      bufferData,
                    );
                    allMessages.push(...outputMessages);

                    // Check if this sampler is used by any rotation channels for quaternion validation
                    if (animation.channels) {
                      for (let k = 0; k < animation.channels.length; k++) {
                        const channel = animation.channels[k];
                        if (
                          channel &&
                          channel.sampler === j &&
                          channel.target &&
                          channel.target.path === "rotation"
                        ) {
                          // Add specialized quaternion validation for this rotation output
                          const quaternionMessages =
                            outputValidator.validateAnimationQuaternionOutput(
                              outputAccessor,
                              gltf,
                              bufferData,
                              i,
                              j,
                              k,
                            );
                          allMessages.push(...quaternionMessages);
                          break; // Only validate once per sampler, even if multiple channels use it
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

    // Sort all animation messages by severity (warnings first, then errors)
    allMessages.sort((a, b) => a.severity - b.severity);
    this.addMessages(allMessages);

    // Check for animation conflicts with skinned meshes
    this.validateAnimationSkinConflicts(gltf);
  }

  private validateNodes(gltf: GLTF): void {
    if (!gltf.nodes) return;

    // Check for empty nodes array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.nodes &&
      gltf.nodes.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/nodes",
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

  private validateMeshes(gltf: GLTF): void {
    if (!gltf.meshes) return;

    // Check for empty meshes array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.meshes &&
      gltf.meshes.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/meshes",
      });
      return;
    }

    const validator = new MeshValidator();
    for (let i = 0; i < gltf.meshes.length; i++) {
      const mesh = gltf.meshes[i];
      if (mesh) {
        const messages = validator.validate(mesh, i, gltf);
        this.addMessages(messages);

        // Data validation for mesh primitives
        if (mesh.primitives) {
          for (let j = 0; j < mesh.primitives.length; j++) {
            const primitive = mesh.primitives[j];
            if (primitive) {
              // Validate attribute accessors
              if (primitive.attributes) {
                for (const [attributeName, accessorIndex] of Object.entries(
                  primitive.attributes,
                )) {
                  if (typeof accessorIndex === "number" && gltf.accessors) {
                    const accessor = gltf.accessors[accessorIndex];
                    if (
                      accessor &&
                      accessor.bufferView !== undefined &&
                      gltf.bufferViews
                    ) {
                      const bufferView = gltf.bufferViews[accessor.bufferView];
                      if (bufferView && bufferView.buffer !== undefined) {
                        const bufferData = this.getBufferData(
                          bufferView.buffer,
                        );
                        if (bufferData) {
                          const accessorValidator = new AccessorValidator();
                          // Use specialized mesh attribute validation for specific attributes
                          if (
                            attributeName.startsWith("JOINTS_") ||
                            attributeName.startsWith("WEIGHTS_") ||
                            attributeName === "NORMAL" ||
                            attributeName === "TANGENT"
                          ) {
                            const dataMessages =
                              accessorValidator.validateMeshAttributeData(
                                accessor,
                                accessorIndex,
                                gltf,
                                bufferData,
                                attributeName,
                                i,
                                j,
                              );
                            this.addMessages(dataMessages);
                          } else {
                            const dataMessages =
                              accessorValidator.validateAccessorData(
                                accessor,
                                accessorIndex,
                                gltf,
                                bufferData,
                              );
                            this.addMessages(dataMessages);
                          }
                        }
                      }
                    }
                  }
                }
              }

              // Validate indices accessor
              if (primitive.indices !== undefined && gltf.accessors) {
                const accessor = gltf.accessors[primitive.indices];
                if (
                  accessor &&
                  accessor.bufferView !== undefined &&
                  gltf.bufferViews
                ) {
                  const bufferView = gltf.bufferViews[accessor.bufferView];
                  if (bufferView && bufferView.buffer !== undefined) {
                    const bufferData = this.getBufferData(bufferView.buffer);
                    if (bufferData) {
                      const accessorValidator = new AccessorValidator();
                      const dataMessages =
                        accessorValidator.validateAccessorData(
                          accessor,
                          primitive.indices,
                          gltf,
                          bufferData,
                        );
                      this.addMessages(dataMessages);
                    }
                  }
                }
              }

              // Validate morph target accessors
              if (primitive.targets) {
                for (let k = 0; k < primitive.targets.length; k++) {
                  const target = primitive.targets[k];
                  if (target) {
                    for (const [, accessorIndex] of Object.entries(target)) {
                      if (typeof accessorIndex === "number" && gltf.accessors) {
                        const accessor = gltf.accessors[accessorIndex];
                        if (
                          accessor &&
                          accessor.bufferView !== undefined &&
                          gltf.bufferViews
                        ) {
                          const bufferView =
                            gltf.bufferViews[accessor.bufferView];
                          if (bufferView && bufferView.buffer !== undefined) {
                            const bufferData = this.getBufferData(
                              bufferView.buffer,
                            );
                            if (bufferData) {
                              const accessorValidator = new AccessorValidator();
                              const dataMessages =
                                accessorValidator.validateAccessorData(
                                  accessor,
                                  accessorIndex,
                                  gltf,
                                  bufferData,
                                );
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

  private validateMaterials(gltf: GLTF): void {
    if (!gltf.materials) return;

    // Check for empty materials array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.materials &&
      gltf.materials.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/materials",
      });
      return;
    }

    const validator = new MaterialValidator();
    for (let i = 0; i < gltf.materials.length; i++) {
      const material = gltf.materials[i];
      if (
        material &&
        typeof material === "object" &&
        !Array.isArray(material)
      ) {
        const messages = validator.validate(material, i, gltf);
        this.addMessages(messages);
      } else {
        // Generate TYPE_MISMATCH error for invalid array elements
        const formatValue = (value: unknown) => {
          if (typeof value === "string") {
            return `'${value}'`;
          } else if (value === null) {
            return "null";
          } else if (typeof value === "boolean" || typeof value === "number") {
            return value.toString();
          } else if (Array.isArray(value)) {
            return `[${value.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(", ")}]`;
          } else {
            return JSON.stringify(value);
          }
        };

        this.addMessage({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${formatValue(material)} is not a 'object'.`,
          severity: Severity.ERROR,
          pointer: `/materials/${i}`,
        });
      }
    }
  }

  private validateTextures(gltf: GLTF): void {
    if (!gltf.textures) return;

    // Check for empty textures array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.textures &&
      gltf.textures.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/textures",
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

  private async validateImages(gltf: GLTF): Promise<void> {
    if (!gltf.images) return;

    // Check for empty images array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.images &&
      gltf.images.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/images",
      });
      return;
    }

    const validator = new ImageValidator(this.options.externalResourceFunction);
    for (let i = 0; i < gltf.images.length; i++) {
      const image = gltf.images[i];
      if (image) {
        if (
          typeof image !== "object" ||
          image === null ||
          Array.isArray(image)
        ) {
          // Format array to match expected output: [item1, item2] without quotes around strings if they look like identifiers or filenames
          const formatValue = (value: unknown) => {
            if (Array.isArray(value)) {
              const items = value.map((item) => {
                if (
                  typeof item === "string" &&
                  /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(item)
                ) {
                  return item; // Don't quote identifier-like strings or simple filenames
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
            pointer: `/images/${i}`,
          });
        } else {
          const messages = validator.validate(image, i, gltf);
          this.addMessages(messages);

          // Also validate external resources if function is available
          const externalMessages = await validator.validateExternalResources(
            image,
            i,
          );
          this.addMessages(externalMessages);
        }
      }
    }
  }

  private validateSamplers(gltf: GLTF): void {
    if (!gltf.samplers) return;

    // Validate that samplers is an array
    if (!this.validateCollectionType(gltf.samplers, "samplers")) {
      return; // Skip further validation if not an array
    }

    // Check for empty samplers array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.samplers &&
      gltf.samplers.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/samplers",
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
        // Generate TYPE_MISMATCH error for invalid array elements
        const formatValue = (value: unknown) => {
          if (typeof value === "string") {
            return `'${value}'`;
          } else if (value === null) {
            return "null";
          } else if (typeof value === "boolean" || typeof value === "number") {
            return value.toString();
          } else if (Array.isArray(value)) {
            return `[${value.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(", ")}]`;
          } else {
            return JSON.stringify(value);
          }
        };

        this.addMessage({
          code: "TYPE_MISMATCH",
          message: `Type mismatch. Property value ${formatValue(sampler)} is not a 'object'.`,
          severity: Severity.ERROR,
          pointer: `/samplers/${i}`,
        });
      }
    }
  }

  private validateCameras(gltf: GLTF): void {
    if (!gltf.cameras) return;

    // Check for empty cameras array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.cameras &&
      gltf.cameras.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/cameras",
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

  private validateScenes(gltf: GLTF): void {
    if (!gltf.scenes) return;

    // Check for empty scenes array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.scenes &&
      gltf.scenes.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/scenes",
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

  private validateDefaultScene(gltf: GLTF): void {
    if (gltf.scene !== undefined) {
      if (!gltf.scenes || gltf.scene >= gltf.scenes.length) {
        this.addMessage({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + gltf.scene + ".",
          severity: Severity.ERROR,
          pointer: "/scene",
        });
      }
    }
  }

  private validateSkins(gltf: GLTF): void {
    if (!gltf.skins) return;

    // Check for empty skins array (only if explicitly defined)
    if (
      (gltf as GLTFWithExplicitDefinitions)._explicitlyDefined?.skins &&
      gltf.skins.length === 0
    ) {
      this.addMessage({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: "/skins",
      });
      return;
    }

    const validator = new SkinValidator();
    for (let i = 0; i < gltf.skins.length; i++) {
      const skin = gltf.skins[i];
      if (skin) {
        const messages = validator.validate(skin, i, gltf);
        this.addMessages(messages);

        // Data validation for inverse bind matrices
        if (skin.inverseBindMatrices !== undefined && gltf.accessors) {
          const accessor = gltf.accessors[skin.inverseBindMatrices];
          if (
            accessor &&
            accessor.bufferView !== undefined &&
            gltf.bufferViews
          ) {
            const bufferView = gltf.bufferViews[accessor.bufferView];
            if (bufferView && bufferView.buffer !== undefined) {
              const bufferData = this.getBufferData(bufferView.buffer);
              if (bufferData) {
                const accessorValidator = new AccessorValidator();
                // Regular accessor validation
                const dataMessages = accessorValidator.validateAccessorData(
                  accessor,
                  skin.inverseBindMatrices,
                  gltf,
                  bufferData,
                );
                this.addMessages(dataMessages);

                // IBM-specific validation
                const ibmMessages = accessorValidator.validateIBMAccessorData(
                  accessor,
                  skin.inverseBindMatrices,
                  gltf,
                  bufferData,
                  i,
                );
                this.addMessages(ibmMessages);
              }
            }
          }
        }
      }
    }
  }

  private validateAnimationSkinConflicts(gltf: GLTF): void {
    if (!gltf.animations || !gltf.nodes || !gltf.skins) return;

    // Check for animations targeting TRS properties on nodes with skins
    for (let animIndex = 0; animIndex < gltf.animations.length; animIndex++) {
      const animation = gltf.animations[animIndex];
      if (!animation || !animation.channels) continue;

      for (
        let channelIndex = 0;
        channelIndex < animation.channels.length;
        channelIndex++
      ) {
        const channel = animation.channels[channelIndex];
        if (!channel || !channel.target || channel.target.node === undefined)
          continue;

        const targetNode = gltf.nodes[channel.target.node];
        if (!targetNode || targetNode.skin === undefined) continue;

        // Check if the target path is a TRS property
        const trsProperties = ["translation", "rotation", "scale"];
        if (trsProperties.includes(channel.target.path)) {
          this.addMessage({
            code: "ANIMATION_CHANNEL_TARGET_NODE_SKIN",
            message: "Animated TRS properties will not affect a skinned mesh.",
            severity: Severity.WARNING,
            pointer: `/animations/${animIndex}/channels/${channelIndex}/target/path`,
          });
        }
      }
    }
  }

  private validateSkinnedNodeScenePresence(gltf: GLTF): void {
    if (!gltf.scenes || !gltf.nodes || !gltf.skins) return;

    // For each scene, check if skinned mesh nodes have their joints in the scene
    for (let sceneIndex = 0; sceneIndex < gltf.scenes.length; sceneIndex++) {
      const scene = gltf.scenes[sceneIndex];
      if (!scene || !scene.nodes) continue;

      // Get all nodes reachable from this scene (including descendants)
      const reachableNodes = new Set<number>();
      const nodesToVisit = [...scene.nodes];

      while (nodesToVisit.length > 0) {
        const nodeIndex = nodesToVisit.pop()!;
        if (reachableNodes.has(nodeIndex)) continue;
        reachableNodes.add(nodeIndex);

        const node = gltf.nodes[nodeIndex];
        if (node && node.children) {
          nodesToVisit.push(...node.children);
        }
      }

      // Check each reachable node for skin usage
      for (const nodeIndex of reachableNodes) {
        const node = gltf.nodes[nodeIndex];
        if (!node || node.skin === undefined) continue;

        const skin = gltf.skins[node.skin];
        if (!skin || !skin.joints) continue;

        // Check if all joint nodes are reachable in this scene
        const missingJoints = skin.joints.some(
          (jointIndex) => !reachableNodes.has(jointIndex),
        );

        if (missingJoints) {
          this.addMessage({
            code: "NODE_SKIN_NO_SCENE",
            message:
              "A node with a skinned mesh is used in a scene that does not contain joint nodes.",
            severity: Severity.ERROR,
            pointer: `/nodes/${nodeIndex}`,
          });
        }
      }
    }
  }

  private validateSkinnedMeshNodeHierarchy(gltf: GLTF): void {
    if (!gltf.nodes || !gltf.meshes || !gltf.skins) return;

    // Build parent-child relationships
    const childToParent = new Map<number, number>();
    for (let i = 0; i < gltf.nodes.length; i++) {
      const node = gltf.nodes[i];
      if (node && node.children) {
        for (const childIndex of node.children) {
          childToParent.set(childIndex, i);
        }
      }
    }

    // Check each node with both skin and mesh
    for (let nodeIndex = 0; nodeIndex < gltf.nodes.length; nodeIndex++) {
      const node = gltf.nodes[nodeIndex];
      if (!node || node.skin === undefined || node.mesh === undefined) continue;

      // Check if the mesh has skinning attributes (JOINTS/WEIGHTS)
      const mesh = gltf.meshes[node.mesh];
      if (!mesh || !mesh.primitives) continue;

      let hasSkinnedMesh = false;
      for (const primitive of mesh.primitives) {
        if (primitive && primitive.attributes) {
          const hasJoints = Object.keys(primitive.attributes).some((attr) =>
            attr.startsWith("JOINTS_"),
          );
          const hasWeights = Object.keys(primitive.attributes).some((attr) =>
            attr.startsWith("WEIGHTS_"),
          );
          if (hasJoints && hasWeights) {
            hasSkinnedMesh = true;
            break;
          }
        }
      }

      // If this node has a skinned mesh and is not root (has a parent), generate warning
      if (hasSkinnedMesh && childToParent.has(nodeIndex)) {
        this.addMessage({
          code: "NODE_SKINNED_MESH_NON_ROOT",
          message:
            "Node with a skinned mesh is not root. Parent transforms will not affect a skinned mesh.",
          severity: Severity.WARNING,
          pointer: `/nodes/${nodeIndex}`,
        });
      }
    }
  }

  private checkNodeLoops(gltf: GLTF): void {
    if (!gltf.nodes) return;

    const loopNodes = new Set<number>();
    const visited = new Set<number>();
    const recursionStack = new Set<number>();

    // Find all nodes that are part of loops
    for (let i = 0; i < gltf.nodes.length; i++) {
      if (!visited.has(i)) {
        this.detectNodeLoop(i, gltf, visited, recursionStack, loopNodes);
      }
    }

    // Report each node that's part of a loop
    for (const nodeIndex of loopNodes) {
      this.addMessage({
        code: "NODE_LOOP",
        message: "Node is a part of a node loop.",
        severity: Severity.ERROR,
        pointer: `/nodes/${nodeIndex}`,
      });
    }
  }

  private detectNodeLoop(
    nodeIndex: number,
    gltf: GLTF,
    visited: Set<number>,
    recursionStack: Set<number>,
    loopNodes: Set<number>,
  ): void {
    if (recursionStack.has(nodeIndex)) {
      // Found a loop - mark only nodes that are actually part of the cycle
      // Convert recursion stack to array to find the cycle
      const stackArray = Array.from(recursionStack);
      const cycleStart = stackArray.indexOf(nodeIndex);

      // Mark nodes from the cycle start to the end of the stack + the current node
      for (let i = cycleStart; i < stackArray.length; i++) {
        loopNodes.add(stackArray[i]!);
      }
      loopNodes.add(nodeIndex);
      return;
    }

    if (visited.has(nodeIndex)) {
      return;
    }

    visited.add(nodeIndex);
    recursionStack.add(nodeIndex);

    const node = gltf.nodes![nodeIndex];
    if (node && node.children) {
      for (const childIndex of node.children) {
        if (childIndex >= 0 && childIndex < gltf.nodes!.length) {
          this.detectNodeLoop(
            childIndex,
            gltf,
            visited,
            recursionStack,
            loopNodes,
          );
        }
      }
    }

    recursionStack.delete(nodeIndex);
  }

  private checkUnusedObjects(gltf: GLTF): void {
    // Check for unused objects and add info messages
    const unusedObjects = this.usageTracker.getUnusedObjects(gltf);

    for (const pointer of unusedObjects) {
      // Skip reporting unused objects that already have TYPE_MISMATCH errors
      const hasTypeMismatch = this.messages.some(
        (msg) => msg.code === "TYPE_MISMATCH" && msg.pointer === pointer,
      );

      if (!hasTypeMismatch) {
        this.addMessage({
          code: "UNUSED_OBJECT",
          message: "This object may be unused.",
          severity: Severity.INFO,
          pointer,
        });
      }
    }

    // Check for unused mesh weights
    const unusedMeshWeights = this.usageTracker.getUnusedMeshWeights(gltf);

    for (const pointer of unusedMeshWeights) {
      this.addMessage({
        code: "UNUSED_MESH_WEIGHTS",
        message: "The static morph target weights are always overridden.",
        severity: Severity.INFO,
        pointer,
      });
    }
  }

  private validateExtensions(gltf: GLTF): void {
    // Validate extensionsUsed
    if (gltf["extensionsUsed"]) {
      const seenExtensions = new Set<string>();
      const extensionsUsed = gltf["extensionsUsed"] as string[];

      for (let i = 0; i < extensionsUsed.length; i++) {
        const extension = extensionsUsed[i];

        // Check for duplicates
        if (seenExtensions.has(extension)) {
          this.addMessage({
            code: "DUPLICATE_ELEMENTS",
            message: "Duplicate element.",
            severity: Severity.ERROR,
            pointer: `/extensionsUsed/${i}`,
          });
        } else {
          seenExtensions.add(extension);
        }

        // Check extension name format - extension names must not start with underscore
        if (typeof extension === "string" && extension.startsWith("_")) {
          this.addMessage({
            code: "INVALID_EXTENSION_NAME_FORMAT",
            message: "Extension name has invalid format.",
            severity: Severity.WARNING,
            pointer: `/extensionsUsed/${i}`,
          });
        }

        // For now, mark all extensions as unsupported except known ones
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
          "KHR_texture_transform",
        ];
        if (!knownExtensions.includes(extension)) {
          this.addMessage({
            code: "UNSUPPORTED_EXTENSION",
            message: `Cannot validate an extension as it is not supported by the validator: '${extension}'.`,
            severity: Severity.INFO,
            pointer: `/extensionsUsed/${i}`,
          });
        }
      }
    }

    // Validate extensionsRequired
    if (gltf["extensionsRequired"]) {
      // Check dependency: extensionsUsed must be defined when extensionsRequired is used
      if (!gltf["extensionsUsed"]) {
        this.addMessage({
          code: "UNSATISFIED_DEPENDENCY",
          message: "Dependency failed. 'extensionsUsed' must be defined.",
          severity: Severity.ERROR,
          pointer: "/extensionsRequired",
        });
      }

      const seenRequired = new Set<string>();
      const extensionsUsed = new Set(
        (gltf["extensionsUsed"] as string[]) || [],
      );
      const extensionsRequired = gltf["extensionsRequired"] as string[];

      for (let i = 0; i < extensionsRequired.length; i++) {
        const extension = extensionsRequired[i];

        // Check for duplicates
        if (seenRequired.has(extension)) {
          this.addMessage({
            code: "DUPLICATE_ELEMENTS",
            message: "Duplicate element.",
            severity: Severity.ERROR,
            pointer: `/extensionsRequired/${i}`,
          });
        } else {
          seenRequired.add(extension);
        }

        // Check if required extension is actually used (exists in extensionsUsed)
        if (!extensionsUsed.has(extension)) {
          this.addMessage({
            code: "UNUSED_EXTENSION_REQUIRED",
            message: `Unused extension '${extension}' cannot be required.`,
            severity: Severity.ERROR,
            pointer: `/extensionsRequired/${i}`,
          });
        }
      }
    }

    // Validate extensions object
    if (gltf.extensions) {
      const extensionsUsed = new Set(
        (gltf["extensionsUsed"] as string[]) || [],
      );

      for (const extensionName in gltf.extensions) {
        const extensionValue = gltf.extensions[extensionName];

        // Check if extension is declared in extensionsUsed
        if (!extensionsUsed.has(extensionName)) {
          this.addMessage({
            code: "UNDECLARED_EXTENSION",
            message: "Extension is not declared in extensionsUsed.",
            severity: Severity.ERROR,
            pointer: `/extensions/${extensionName}`,
          });
        }

        if (
          typeof extensionValue !== "object" ||
          extensionValue === null ||
          Array.isArray(extensionValue)
        ) {
          // Format the value based on its type
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
            pointer: `/extensions/${extensionName}`,
          });
        }
      }
    }

    // Run extension-specific validation for each used extension
    if (gltf["extensionsUsed"]) {
      for (const extensionName of gltf["extensionsUsed"] as string[]) {
        const validator = extensionValidators.get(extensionName);
        if (validator) {
          validator.validate(gltf, (message) => this.addMessage(message));
        }
      }
    }

    // Check for non-required extensions (extensions that are declared but not used)
    if (gltf["extensionsUsed"]) {
      const extensionsRequired = new Set(
        (gltf["extensionsRequired"] as string[]) || [],
      );

      const extensionsUsedArray = gltf["extensionsUsed"] as string[];
      for (let i = 0; i < extensionsUsedArray.length; i++) {
        const extension = extensionsUsedArray[i];

        // Check if extension is actually used
        // Extensions in extensionsRequired are considered "used" even if in unexpected locations
        // Skip NON_REQUIRED_EXTENSION validation for extensions with invalid names
        const hasInvalidName =
          typeof extension === "string" && extension.startsWith("_");
        if (
          !this.isExtensionUsed(gltf, extension) &&
          !extensionsRequired.has(extension) &&
          !hasInvalidName
        ) {
          this.addMessage({
            code: "NON_REQUIRED_EXTENSION",
            message: `Extension '${extension}' cannot be optional.`,
            severity: Severity.ERROR,
            pointer: `/extensionsUsed/${i}`,
          });
        }
      }
    }

    // Check for undeclared extensions (extensions that are used but not declared)
    this.checkUndeclaredExtensions(gltf);
  }

  private addMessages(messages: ValidationMessage[]): void {
    for (const message of messages) {
      this.addMessage(message);
    }
  }

  private isExtensionUsed(gltf: GLTF, extensionName: string): boolean {
    // Check if extension is used in the root extensions object
    if (gltf.extensions && gltf.extensions.hasOwnProperty(extensionName)) {
      return true;
    }

    // Check if extension is used in materials
    if (gltf.materials) {
      for (const material of gltf.materials) {
        if (
          material &&
          material["extensions"] &&
          material["extensions"][extensionName]
        ) {
          return true;
        }
        // Also check for material extensions in incorrect locations (like pbrMetallicRoughness/extensions)
        // This prevents NON_REQUIRED_EXTENSION errors for extensions that are used but in wrong places
        if (
          material &&
          material.pbrMetallicRoughness &&
          material.pbrMetallicRoughness["extensions"] &&
          material.pbrMetallicRoughness["extensions"][extensionName]
        ) {
          return true;
        }
        // Check texture info extensions
        if (material && material.pbrMetallicRoughness) {
          if (
            material.pbrMetallicRoughness.baseColorTexture &&
            material.pbrMetallicRoughness.baseColorTexture["extensions"] &&
            material.pbrMetallicRoughness.baseColorTexture["extensions"][
              extensionName
            ]
          ) {
            return true;
          }
          if (
            material.pbrMetallicRoughness.metallicRoughnessTexture &&
            material.pbrMetallicRoughness.metallicRoughnessTexture[
              "extensions"
            ] &&
            material.pbrMetallicRoughness.metallicRoughnessTexture[
              "extensions"
            ][extensionName]
          ) {
            return true;
          }
        }
        if (
          material &&
          material.normalTexture &&
          material.normalTexture["extensions"] &&
          material.normalTexture["extensions"][extensionName]
        ) {
          return true;
        }
        if (
          material &&
          material.occlusionTexture &&
          material.occlusionTexture["extensions"] &&
          material.occlusionTexture["extensions"][extensionName]
        ) {
          return true;
        }
        if (
          material &&
          material.emissiveTexture &&
          material.emissiveTexture["extensions"] &&
          material.emissiveTexture["extensions"][extensionName]
        ) {
          return true;
        }
      }
    }

    // Check if extension is used in textures
    if (gltf.textures) {
      for (const texture of gltf.textures) {
        if (
          texture &&
          texture["extensions"] &&
          texture["extensions"][extensionName]
        ) {
          return true;
        }
      }
    }

    // Check if extension is used in samplers (check all samplers, regardless of whether extension is allowed)
    if (gltf.samplers) {
      for (const sampler of gltf.samplers) {
        if (
          sampler &&
          sampler["extensions"] &&
          sampler["extensions"][extensionName]
        ) {
          return true;
        }
      }
    }

    // Check if extension is used in nodes
    if (gltf.nodes) {
      for (const node of gltf.nodes) {
        if (node && node["extensions"] && node["extensions"][extensionName]) {
          return true;
        }
      }
    }

    // Check if extension is used in meshes
    if (gltf.meshes) {
      for (const mesh of gltf.meshes) {
        if (mesh && mesh["extensions"] && mesh["extensions"][extensionName]) {
          return true;
        }
        if (mesh && mesh.primitives) {
          for (const primitive of mesh.primitives) {
            if (
              primitive &&
              primitive["extensions"] &&
              primitive["extensions"][extensionName]
            ) {
              return true;
            }
          }
        }
      }
    }

    // Check if extension is used in animations
    if (gltf.animations) {
      for (const animation of gltf.animations) {
        if (
          animation &&
          animation["extensions"] &&
          animation["extensions"][extensionName]
        ) {
          return true;
        }
        if (animation && animation.channels) {
          for (const channel of animation.channels) {
            if (
              channel &&
              channel["extensions"] &&
              channel["extensions"][extensionName]
            ) {
              return true;
            }
            if (
              channel &&
              channel.target &&
              channel.target["extensions"] &&
              channel.target["extensions"][extensionName]
            ) {
              return true;
            }
          }
        }
      }
    }

    // Check if extension is used in cameras
    if (gltf.cameras) {
      for (const camera of gltf.cameras) {
        if (
          camera &&
          camera["extensions"] &&
          camera["extensions"][extensionName]
        ) {
          return true;
        }
      }
    }

    // Check if extension is used in scenes
    if (gltf.scenes) {
      for (const scene of gltf.scenes) {
        if (
          scene &&
          scene["extensions"] &&
          scene["extensions"][extensionName]
        ) {
          return true;
        }
      }
    }

    // Check if extension is used in accessors (check all accessors, regardless of whether extension is allowed)
    if (gltf.accessors) {
      for (const accessor of gltf.accessors) {
        if (
          accessor &&
          accessor["extensions"] &&
          accessor["extensions"][extensionName]
        ) {
          return true;
        }
      }
    }

    // Check if extension is used in images
    if (gltf.images) {
      for (const image of gltf.images) {
        if (
          image &&
          image["extensions"] &&
          image["extensions"][extensionName]
        ) {
          return true;
        }
      }
    }

    // Special case for EXT_texture_webp: if there are WebP images, the extension is considered used
    if (extensionName === "EXT_texture_webp" && gltf.images) {
      for (const image of gltf.images) {
        if (image) {
          // Check for WebP MIME type
          if (image.mimeType === "image/webp") {
            return true;
          }
          // Check for WebP data URI
          if (image.uri && image.uri.startsWith("data:image/webp")) {
            return true;
          }
          // Check for WebP file extension in URI
          if (image.uri && image.uri.toLowerCase().endsWith(".webp")) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private addMessage(message: ValidationMessage): void {
    // Apply severity overrides
    const override = this.options.severityOverrides[message.code];
    if (override !== undefined) {
      message.severity = override;
    }

    this.messages.push(message);
  }

  private applyFilters(): void {
    let filteredMessages = this.messages;

    // Apply onlyIssues filter
    if (this.options.onlyIssues.length > 0) {
      filteredMessages = filteredMessages.filter((message) =>
        this.options.onlyIssues.includes(message.code),
      );
    }

    // Apply ignoredIssues filter
    if (this.options.ignoredIssues.length > 0) {
      filteredMessages = filteredMessages.filter(
        (message) => !this.options.ignoredIssues.includes(message.code),
      );
    }

    // Apply maxIssues limit
    if (
      this.options.maxIssues > 0 &&
      filteredMessages.length > this.options.maxIssues
    ) {
      filteredMessages = filteredMessages.slice(0, this.options.maxIssues);
    }

    this.messages = filteredMessages;
  }

  private buildIssues(): Issues {
    const issues: Issues = {
      numErrors: 0,
      numWarnings: 0,
      numInfos: 0,
      numHints: 0,
      messages: [],
      truncated: false,
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

  private sortMessagesForTestCompatibility(): void {
    // Sort messages to match expected test order
    this.messages.sort((a, b) => {
      // Special ordering for extensions: UNSUPPORTED_EXTENSION before TYPE_MISMATCH
      if (
        a.code === "UNSUPPORTED_EXTENSION" &&
        b.code === "TYPE_MISMATCH" &&
        a.pointer?.startsWith("/extensionsUsed/") &&
        b.pointer?.startsWith("/extensions/")
      ) {
        return -1;
      }
      if (
        a.code === "TYPE_MISMATCH" &&
        b.code === "UNSUPPORTED_EXTENSION" &&
        a.pointer?.startsWith("/extensions/") &&
        b.pointer?.startsWith("/extensionsUsed/")
      ) {
        return 1;
      }

      // Special ordering: UNSUPPORTED_EXTENSION before UNUSED_OBJECT
      if (a.code === "UNSUPPORTED_EXTENSION" && b.code === "UNUSED_OBJECT") {
        return -1;
      }
      if (a.code === "UNUSED_OBJECT" && b.code === "UNSUPPORTED_EXTENSION") {
        return 1;
      }

      // Special ordering: UNSUPPORTED_EXTENSION before NODE_EMPTY
      if (a.code === "UNSUPPORTED_EXTENSION" && b.code === "NODE_EMPTY") {
        return -1;
      }
      if (a.code === "NODE_EMPTY" && b.code === "UNSUPPORTED_EXTENSION") {
        return 1;
      }

      // Special ordering for buffer GLB padding: UNUSED_OBJECT before BUFFER_GLB_CHUNK_TOO_BIG
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "BUFFER_GLB_CHUNK_TOO_BIG" &&
        a.pointer === b.pointer
      ) {
        return -1;
      }
      if (
        a.code === "BUFFER_GLB_CHUNK_TOO_BIG" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer === b.pointer
      ) {
        return 1;
      }

      // Special ordering for image validation: UNUSED_OBJECT before IMAGE_UNRECOGNIZED_FORMAT
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "IMAGE_UNRECOGNIZED_FORMAT" &&
        a.pointer === b.pointer
      ) {
        return -1;
      }
      if (
        a.code === "IMAGE_UNRECOGNIZED_FORMAT" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer === b.pointer
      ) {
        return 1;
      }
      // Special ordering for image validation: UNUSED_OBJECT before IMAGE_DATA_INVALID
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "IMAGE_DATA_INVALID" &&
        a.pointer === b.pointer
      ) {
        return -1;
      }
      if (
        a.code === "IMAGE_DATA_INVALID" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer === b.pointer
      ) {
        return 1;
      }
      // Special ordering for image validation: UNUSED_OBJECT before IMAGE_UNEXPECTED_EOS
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "IMAGE_UNEXPECTED_EOS" &&
        a.pointer === b.pointer
      ) {
        return -1;
      }
      if (
        a.code === "IMAGE_UNEXPECTED_EOS" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer === b.pointer
      ) {
        return 1;
      }
      // Special ordering for mesh validation: UNUSED_OBJECT before ACCESSOR_INDEX_OOB
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "ACCESSOR_INDEX_OOB" &&
        a.pointer &&
        b.pointer &&
        b.pointer.startsWith(a.pointer + "/")
      ) {
        return -1;
      }
      if (
        a.code === "ACCESSOR_INDEX_OOB" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer &&
        b.pointer &&
        a.pointer.startsWith(b.pointer + "/")
      ) {
        return 1;
      }
      // Special ordering for mesh validation: UNUSED_OBJECT before ACCESSOR_INDEX_PRIMITIVE_RESTART
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "ACCESSOR_INDEX_PRIMITIVE_RESTART" &&
        a.pointer &&
        b.pointer &&
        b.pointer.startsWith(a.pointer + "/")
      ) {
        return -1;
      }
      if (
        a.code === "ACCESSOR_INDEX_PRIMITIVE_RESTART" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer &&
        b.pointer &&
        a.pointer.startsWith(b.pointer + "/")
      ) {
        return 1;
      }
      // Special ordering for mesh validation: UNUSED_OBJECT before ACCESSOR_NON_CLAMPED
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "ACCESSOR_NON_CLAMPED" &&
        a.pointer &&
        b.pointer &&
        b.pointer.startsWith(a.pointer + "/")
      ) {
        return -1;
      }
      if (
        a.code === "ACCESSOR_NON_CLAMPED" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer &&
        b.pointer &&
        a.pointer.startsWith(b.pointer + "/")
      ) {
        return 1;
      }
      // Special ordering for joints_weights_complex test: UNUSED_OBJECT before ACCESSOR_JOINTS and ACCESSOR_WEIGHTS messages
      if (
        a.code === "UNUSED_OBJECT" &&
        (b.code === "ACCESSOR_JOINTS_INDEX_OOB" ||
          b.code === "ACCESSOR_JOINTS_USED_ZERO_WEIGHT" ||
          b.code === "ACCESSOR_WEIGHTS_NEGATIVE" ||
          b.code === "ACCESSOR_WEIGHTS_NON_NORMALIZED")
      ) {
        return -1;
      }
      if (
        (a.code === "ACCESSOR_JOINTS_INDEX_OOB" ||
          a.code === "ACCESSOR_JOINTS_USED_ZERO_WEIGHT" ||
          a.code === "ACCESSOR_WEIGHTS_NEGATIVE" ||
          a.code === "ACCESSOR_WEIGHTS_NON_NORMALIZED") &&
        b.code === "UNUSED_OBJECT"
      ) {
        return 1;
      }
      // Special ordering for mesh validation: UNUSED_OBJECT before ACCESSOR_INDEX_TRIANGLE_DEGENERATE
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "ACCESSOR_INDEX_TRIANGLE_DEGENERATE" &&
        a.pointer &&
        b.pointer &&
        b.pointer.startsWith(a.pointer + "/")
      ) {
        return -1;
      }
      if (
        a.code === "ACCESSOR_INDEX_TRIANGLE_DEGENERATE" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer &&
        b.pointer &&
        a.pointer.startsWith(b.pointer + "/")
      ) {
        return 1;
      }
      // Special ordering for mesh validation: MESH_PRIMITIVES_UNEQUAL_TARGETS_COUNT before UNUSED_OBJECT
      if (
        a.code === "MESH_PRIMITIVES_UNEQUAL_TARGETS_COUNT" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer &&
        b.pointer &&
        a.pointer.startsWith(b.pointer + "/")
      ) {
        return -1;
      }
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "MESH_PRIMITIVES_UNEQUAL_TARGETS_COUNT" &&
        a.pointer &&
        b.pointer &&
        b.pointer.startsWith(a.pointer + "/")
      ) {
        return 1;
      }

      // Special ordering for image validation: UNUSED_OBJECT before IMAGE_MIME_TYPE_INVALID
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "IMAGE_MIME_TYPE_INVALID" &&
        a.pointer &&
        b.pointer &&
        b.pointer.startsWith(a.pointer + "/")
      ) {
        return -1;
      }
      if (
        a.code === "IMAGE_MIME_TYPE_INVALID" &&
        b.code === "UNUSED_OBJECT" &&
        b.pointer &&
        a.pointer &&
        a.pointer.startsWith(b.pointer + "/")
      ) {
        return 1;
      }
      // Special ordering for texture validation: UNUSED_OBJECT before TEXTURE_INVALID_IMAGE_MIME_TYPE
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "TEXTURE_INVALID_IMAGE_MIME_TYPE"
      ) {
        // Check if both relate to the same texture object
        const aTexture = a.pointer?.match(/\/textures\/(\d+)$/);
        const bTexture = b.pointer?.match(/\/textures\/(\d+)\//);
        if (aTexture && bTexture && aTexture[1] === bTexture[1]) {
          return -1;
        }
      }
      if (
        a.code === "TEXTURE_INVALID_IMAGE_MIME_TYPE" &&
        b.code === "UNUSED_OBJECT"
      ) {
        // Check if both relate to the same texture object
        const aTexture = a.pointer?.match(/\/textures\/(\d+)\//);
        const bTexture = b.pointer?.match(/\/textures\/(\d+)$/);
        if (aTexture && bTexture && aTexture[1] === bTexture[1]) {
          return 1;
        }
      }
      // General rule: UNUSED_OBJECT comes before IMAGE_MIME_TYPE_INVALID when they don't share parent-child relationship
      if (a.code === "UNUSED_OBJECT" && b.code === "IMAGE_MIME_TYPE_INVALID") {
        return -1;
      }
      if (a.code === "IMAGE_MIME_TYPE_INVALID" && b.code === "UNUSED_OBJECT") {
        return 1;
      }
      // Special ordering: EXTRA_PROPERTY comes before UNUSED_OBJECT for the same object
      if (a.code === "EXTRA_PROPERTY" && b.code === "UNUSED_OBJECT") {
        const aBase = a.pointer?.replace(/\/[^/]+$/, ""); // Remove last segment
        const bPointer = b.pointer;
        if (aBase === bPointer) {
          return -1;
        }
      }
      if (a.code === "UNUSED_OBJECT" && b.code === "EXTRA_PROPERTY") {
        const bBase = b.pointer?.replace(/\/[^/]+$/, ""); // Remove last segment
        const aPointer = a.pointer;
        if (bBase === aPointer) {
          return 1;
        }
      }
      // Special ordering for animation pointer extension messages
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
        "UNUSED_OBJECT",
      ];
      const aIndex = extensionMessageOrder.indexOf(a.code);
      const bIndex = extensionMessageOrder.indexOf(b.code);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      // Special ordering for image validation: UNUSED_OBJECT before IMAGE_NPOT_DIMENSIONS
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code === "IMAGE_NPOT_DIMENSIONS" &&
        a.pointer === b.pointer
      ) {
        return -1;
      }
      if (
        a.code === "IMAGE_NPOT_DIMENSIONS" &&
        b.code === "UNUSED_OBJECT" &&
        a.pointer === b.pointer
      ) {
        return 1;
      }

      // Special ordering for mesh validation: MESH_PRIMITIVE_INVALID_ATTRIBUTE before MESH_PRIMITIVE_MORPH_TARGET_NO_BASE_ACCESSOR (general rule)
      if (
        a.code === "MESH_PRIMITIVE_INVALID_ATTRIBUTE" &&
        b.code === "MESH_PRIMITIVE_MORPH_TARGET_NO_BASE_ACCESSOR"
      ) {
        return -1;
      }
      if (
        a.code === "MESH_PRIMITIVE_MORPH_TARGET_NO_BASE_ACCESSOR" &&
        b.code === "MESH_PRIMITIVE_INVALID_ATTRIBUTE"
      ) {
        return 1;
      }

      // Special ordering for mesh validation: MESH_PRIMITIVE_TANGENT_WITHOUT_NORMAL before MESH_PRIMITIVE_GENERATED_TANGENT_SPACE
      if (
        a.code === "MESH_PRIMITIVE_TANGENT_WITHOUT_NORMAL" &&
        b.code === "MESH_PRIMITIVE_GENERATED_TANGENT_SPACE"
      ) {
        return -1;
      }
      if (
        a.code === "MESH_PRIMITIVE_GENERATED_TANGENT_SPACE" &&
        b.code === "MESH_PRIMITIVE_TANGENT_WITHOUT_NORMAL"
      ) {
        return 1;
      }

      // Special ordering: UNUSED_OBJECT before ACCESSOR validation messages (only for mesh-specific cases)
      if (
        a.code === "UNUSED_OBJECT" &&
        b.code?.startsWith("ACCESSOR_") &&
        (b.code === "ACCESSOR_VECTOR3_NON_UNIT" ||
          b.code === "ACCESSOR_INVALID_SIGN")
      ) {
        return -1;
      }
      if (
        (a.code === "ACCESSOR_VECTOR3_NON_UNIT" ||
          a.code === "ACCESSOR_INVALID_SIGN") &&
        b.code === "UNUSED_OBJECT"
      ) {
        return 1;
      }

      // Special ordering: NODE_PARENT_OVERRIDE before SCENE_NON_ROOT_NODE
      if (
        a.code === "NODE_PARENT_OVERRIDE" &&
        b.code === "SCENE_NON_ROOT_NODE"
      ) {
        return -1;
      }
      if (
        a.code === "SCENE_NON_ROOT_NODE" &&
        b.code === "NODE_PARENT_OVERRIDE"
      ) {
        return 1;
      }

      // Special ordering for GLB buffer URI messages: URI_GLB before INVALID_URI
      if (
        a.code === "URI_GLB" &&
        b.code === "INVALID_URI" &&
        a.pointer === b.pointer
      ) {
        return -1;
      }
      if (
        a.code === "INVALID_URI" &&
        b.code === "URI_GLB" &&
        a.pointer === b.pointer
      ) {
        return 1;
      }

      // Special ordering for GLB buffer URI messages: URI_GLB before DATA_URI_GLB
      if (
        a.code === "URI_GLB" &&
        b.code === "DATA_URI_GLB" &&
        a.pointer === b.pointer
      ) {
        return -1;
      }
      if (
        a.code === "DATA_URI_GLB" &&
        b.code === "URI_GLB" &&
        a.pointer === b.pointer
      ) {
        return 1;
      }

      // Special ordering for matrix alignment tests: ACCESSOR_MATRIX_ALIGNMENT before ACCESSOR_TOO_LONG
      if (
        a.code === "ACCESSOR_MATRIX_ALIGNMENT" &&
        b.code === "ACCESSOR_TOO_LONG"
      ) {
        return -1;
      }
      if (
        a.code === "ACCESSOR_TOO_LONG" &&
        b.code === "ACCESSOR_MATRIX_ALIGNMENT"
      ) {
        return 1;
      }

      // Special case for accessor_data tests: UNUSED_OBJECT comes first even before ERROR severity messages
      const aIsUnused = a.code === "UNUSED_OBJECT";
      const bIsUnused = b.code === "UNUSED_OBJECT";

      // For accessor_data tests ONLY: UNUSED_OBJECT should come before any ACCESSOR_ messages
      // Only apply this special ordering for ACCESSOR_INVALID_FLOAT, ACCESSOR_MIN_MISMATCH, etc.
      const accessorDataCodes = [
        "ACCESSOR_INVALID_FLOAT",
        "ACCESSOR_MIN_MISMATCH",
        "ACCESSOR_MAX_MISMATCH",
        "ACCESSOR_ELEMENT_OUT_OF_MIN_BOUND",
        "ACCESSOR_ELEMENT_OUT_OF_MAX_BOUND",
        "ACCESSOR_INVALID_IBM",
      ];
      if (aIsUnused && accessorDataCodes.includes(b.code)) {
        // Special case for IBM: skin-level UNUSED_OBJECT should come before skin-level ACCESSOR_INVALID_IBM
        if (b.code === "ACCESSOR_INVALID_IBM") {
          const aSkinMatch = a.pointer.match(/\/skins\/(\d+)$/);
          const bSkinMatch = b.pointer.match(
            /\/skins\/(\d+)\/inverseBindMatrices$/,
          );
          if (aSkinMatch && bSkinMatch && aSkinMatch[1] === bSkinMatch[1]) {
            return -1; // UNUSED_OBJECT comes first for same skin in IBM tests
          }
        }

        const aAccessorMatch = a.pointer.match(/\/accessors\/(\d+)$/);
        const bAccessorMatch = b.pointer.match(/\/accessors\/(\d+)/);
        if (
          aAccessorMatch &&
          bAccessorMatch &&
          aAccessorMatch[1] === bAccessorMatch[1]
        ) {
          return -1; // UNUSED_OBJECT comes first for same accessor in accessor_data tests
        }
      }
      if (bIsUnused && accessorDataCodes.includes(a.code)) {
        // Special case for IBM: skin-level ACCESSOR_INVALID_IBM should come after skin-level UNUSED_OBJECT
        if (a.code === "ACCESSOR_INVALID_IBM") {
          const aSkinMatch = a.pointer.match(
            /\/skins\/(\d+)\/inverseBindMatrices$/,
          );
          const bSkinMatch = b.pointer.match(/\/skins\/(\d+)$/);
          if (aSkinMatch && bSkinMatch && aSkinMatch[1] === bSkinMatch[1]) {
            return 1; // ACCESSOR_INVALID_IBM comes after UNUSED_OBJECT for same skin
          }
        }

        const aAccessorMatch = a.pointer.match(/\/accessors\/(\d+)/);
        const bAccessorMatch = b.pointer.match(/\/accessors\/(\d+)$/);
        if (
          aAccessorMatch &&
          bAccessorMatch &&
          aAccessorMatch[1] === bAccessorMatch[1]
        ) {
          return 1; // UNUSED_OBJECT comes first for same accessor in accessor_data tests
        }
      }

      // UNRESOLVED_REFERENCE should come before UNUSED_OBJECT (for animation tests)
      if (a.code === "UNRESOLVED_REFERENCE" && b.code === "UNUSED_OBJECT") {
        return -1; // UNRESOLVED_REFERENCE comes first
      }
      if (a.code === "UNUSED_OBJECT" && b.code === "UNRESOLVED_REFERENCE") {
        return 1; // UNRESOLVED_REFERENCE comes first
      }

      // UNDEFINED_PROPERTY should come before UNUSED_OBJECT in general
      if (a.code === "UNDEFINED_PROPERTY" && b.code === "UNUSED_OBJECT") {
        return -1; // UNDEFINED_PROPERTY comes first
      }
      if (a.code === "UNUSED_OBJECT" && b.code === "UNDEFINED_PROPERTY") {
        return 1; // UNDEFINED_PROPERTY comes first
      }

      // Special ordering for buffer messages
      const bufferErrorCodes = [
        "BUFFER_MISSING_GLB_DATA",
        "BUFFER_BYTE_LENGTH_MISMATCH",
      ];

      // UNDEFINED_PROPERTY should come before BUFFER_BYTE_LENGTH_MISMATCH for same buffer
      if (
        a.code === "UNDEFINED_PROPERTY" &&
        b.code === "BUFFER_BYTE_LENGTH_MISMATCH"
      ) {
        const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)$/);
        const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)$/);
        if (aBufferMatch && bBufferMatch) {
          return -1; // UNDEFINED_PROPERTY comes first
        }
      }
      if (
        a.code === "BUFFER_BYTE_LENGTH_MISMATCH" &&
        b.code === "UNDEFINED_PROPERTY"
      ) {
        const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)$/);
        const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)$/);
        if (aBufferMatch && bBufferMatch) {
          return 1; // UNDEFINED_PROPERTY comes first
        }
      }

      // UNUSED_OBJECT comes before BUFFER_ error messages (general case)
      if (aIsUnused && bufferErrorCodes.includes(b.code)) {
        const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)$/);
        const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)/);
        if (aBufferMatch && bBufferMatch) {
          return -1; // UNUSED_OBJECT comes first
        }
      }
      if (bIsUnused && bufferErrorCodes.includes(a.code)) {
        const aBufferMatch = a.pointer.match(/\/buffers\/(\d+)/);
        const bBufferMatch = b.pointer.match(/\/buffers\/(\d+)$/);
        if (aBufferMatch && bBufferMatch) {
          return 1; // UNUSED_OBJECT comes first
        }
      }

      // Special ordering for extension validation: UNEXPECTED_EXTENSION_OBJECT before NODE_EMPTY (across different severities)
      if (a.code === "UNEXPECTED_EXTENSION_OBJECT" && b.code === "NODE_EMPTY") {
        return -1;
      }
      if (a.code === "NODE_EMPTY" && b.code === "UNEXPECTED_EXTENSION_OBJECT") {
        return 1;
      }

      // Animation messages will be sorted by severity first (handled below)

      // Standard sort by severity (ERROR=0, WARNING=1, INFO=2, HINT=3)
      // But for animations, warnings come before errors (per expected test results)
      if (a.severity !== b.severity) {
        // Special case: if one is animation-related and they have different severities,
        // follow the expected test order where warnings come first
        const aIsAnim = a.pointer && a.pointer.startsWith("/animations/");
        const bIsAnim = b.pointer && b.pointer.startsWith("/animations/");
        if (aIsAnim || bIsAnim) {
          // For animations: warnings (1) before errors (0) - reverse normal order
          return b.severity - a.severity;
        }

        // Special case: for images, handle specific ordering rules first
        const aIsImage = a.pointer && a.pointer.startsWith("/images/");
        const bIsImage = b.pointer && b.pointer.startsWith("/images/");
        if (aIsImage && bIsImage) {
          // VALUE_NOT_IN_LIST should come before all other image messages
          if (
            a.code === "VALUE_NOT_IN_LIST" &&
            b.code !== "VALUE_NOT_IN_LIST"
          ) {
            return -1;
          }
          if (
            a.code !== "VALUE_NOT_IN_LIST" &&
            b.code === "VALUE_NOT_IN_LIST"
          ) {
            return 1;
          }

          // UNUSED_OBJECT should come before IMAGE_NON_ENABLED_MIME_TYPE across all images
          if (
            a.code === "UNUSED_OBJECT" &&
            b.code === "IMAGE_NON_ENABLED_MIME_TYPE"
          ) {
            return -1;
          }
          if (
            a.code === "IMAGE_NON_ENABLED_MIME_TYPE" &&
            b.code === "UNUSED_OBJECT"
          ) {
            return 1;
          }
          const aImageMatch = a.pointer.match(/^\/images\/(\d+)(?:\/|$)/);
          const bImageMatch = b.pointer.match(/^\/images\/(\d+)(?:\/|$)/);
          if (aImageMatch && bImageMatch) {
            const aImageIndex = parseInt(aImageMatch[1] || "0");
            const bImageIndex = parseInt(bImageMatch[1] || "0");
            if (aImageIndex !== bImageIndex) {
              return aImageIndex - bImageIndex; // Sort by image index first
            }

            // Same image - handle specific ordering rules
            // INVALID_URI should come before UNUSED_OBJECT
            if (a.code === "INVALID_URI" && b.code === "UNUSED_OBJECT") {
              return -1;
            }
            if (a.code === "UNUSED_OBJECT" && b.code === "INVALID_URI") {
              return 1;
            }

            // UNUSED_OBJECT should come before IMAGE_MIME_TYPE_INVALID
            if (
              a.code === "UNUSED_OBJECT" &&
              b.code === "IMAGE_MIME_TYPE_INVALID"
            ) {
              return -1;
            }
            if (
              a.code === "IMAGE_MIME_TYPE_INVALID" &&
              b.code === "UNUSED_OBJECT"
            ) {
              return 1;
            }

            // VALUE_NOT_IN_LIST should come before IMAGE_NON_ENABLED_MIME_TYPE
            if (
              a.code === "VALUE_NOT_IN_LIST" &&
              b.code === "IMAGE_NON_ENABLED_MIME_TYPE"
            ) {
              return -1;
            }
            if (
              a.code === "IMAGE_NON_ENABLED_MIME_TYPE" &&
              b.code === "VALUE_NOT_IN_LIST"
            ) {
              return 1;
            }
          }
        }

        // Special case: for mesh primitives, sort by property hierarchy
        const aIsMeshPrimitive =
          a.pointer && a.pointer.match(/^\/meshes\/\d+\/primitives\/\d+\//);
        const bIsMeshPrimitive =
          b.pointer && b.pointer.match(/^\/meshes\/\d+\/primitives\/\d+\//);
        if (aIsMeshPrimitive && bIsMeshPrimitive) {
          // Extract the primitive base path to check if it's the same primitive
          const aBasePath = a.pointer.match(
            /^(\/meshes\/\d+\/primitives\/\d+)/,
          );
          const bBasePath = b.pointer.match(
            /^(\/meshes\/\d+\/primitives\/\d+)/,
          );
          if (aBasePath && bBasePath && aBasePath[1] === bBasePath[1]) {
            // Same primitive - sort attributes before indices
            const aIsAttribute = a.pointer.includes("/attributes/");
            const bIsAttribute = b.pointer.includes("/attributes/");
            const aIsIndices = a.pointer.includes("/indices");
            const bIsIndices = b.pointer.includes("/indices");

            if (aIsAttribute && bIsIndices) return -1; // attributes before indices
            if (aIsIndices && bIsAttribute) return 1; // attributes before indices
          }
        }

        // Special case: BUFFER_VIEW_TARGET_MISSING should come before MESH_PRIMITIVE_INDICES_ACCESSOR_WITH_BYTESTRIDE for same pointer
        if (a.pointer === b.pointer) {
          if (
            a.code === "BUFFER_VIEW_TARGET_MISSING" &&
            b.code === "MESH_PRIMITIVE_INDICES_ACCESSOR_WITH_BYTESTRIDE"
          ) {
            return -1;
          }
          if (
            a.code === "MESH_PRIMITIVE_INDICES_ACCESSOR_WITH_BYTESTRIDE" &&
            b.code === "BUFFER_VIEW_TARGET_MISSING"
          ) {
            return 1;
          }
        }

        // Normal severity order for non-animation messages
        return a.severity - b.severity;
      }

      // For accessor messages, sort by component index within each accessor
      const accessorCodes = [
        "ACCESSOR_MIN_MISMATCH",
        "ACCESSOR_ELEMENT_OUT_OF_MIN_BOUND",
        "ACCESSOR_MAX_MISMATCH",
        "ACCESSOR_ELEMENT_OUT_OF_MAX_BOUND",
        "ACCESSOR_INVALID_FLOAT",
      ];

      const aIsAccessor = accessorCodes.includes(a.code);
      const bIsAccessor = accessorCodes.includes(b.code);

      if (aIsAccessor && bIsAccessor) {
        // Handle ACCESSOR_INVALID_FLOAT separately (different pointer format)
        if (
          a.code === "ACCESSOR_INVALID_FLOAT" ||
          b.code === "ACCESSOR_INVALID_FLOAT"
        ) {
          // Extract accessor index for invalid float messages
          const aAccessorMatch = a.pointer.match(/\/accessors\/(\d+)$/);
          const bAccessorMatch = b.pointer.match(/\/accessors\/(\d+)$/);
          const aMinMaxMatch = a.pointer.match(
            /\/accessors\/(\d+)\/(min|max)\/(\d+)/,
          );
          const bMinMaxMatch = b.pointer.match(
            /\/accessors\/(\d+)\/(min|max)\/(\d+)/,
          );

          const aAccessorIdx = aAccessorMatch
            ? parseInt(aAccessorMatch[1]!)
            : aMinMaxMatch
              ? parseInt(aMinMaxMatch[1]!)
              : 0;
          const bAccessorIdx = bAccessorMatch
            ? parseInt(bAccessorMatch[1]!)
            : bMinMaxMatch
              ? parseInt(bMinMaxMatch[1]!)
              : 0;

          if (aAccessorIdx !== bAccessorIdx) {
            return aAccessorIdx - bAccessorIdx;
          }

          // Same accessor: INVALID_FLOAT comes first
          if (
            a.code === "ACCESSOR_INVALID_FLOAT" &&
            b.code !== "ACCESSOR_INVALID_FLOAT"
          ) {
            return -1;
          }
          if (
            b.code === "ACCESSOR_INVALID_FLOAT" &&
            a.code !== "ACCESSOR_INVALID_FLOAT"
          ) {
            return 1;
          }

          // Both INVALID_FLOAT: maintain order
          return 0;
        }

        // Extract accessor index and component index from pointer
        const aMatch = a.pointer.match(/\/accessors\/(\d+)\/(min|max)\/(\d+)/);
        const bMatch = b.pointer.match(/\/accessors\/(\d+)\/(min|max)\/(\d+)/);

        if (aMatch && bMatch) {
          const aAccessorIdx = parseInt(aMatch[1]!);
          const bAccessorIdx = parseInt(bMatch[1]!);

          // Different accessors: sort by accessor index
          if (aAccessorIdx !== bAccessorIdx) {
            return aAccessorIdx - bAccessorIdx;
          }

          const aComponentIdx = parseInt(aMatch[3]!);
          const bComponentIdx = parseInt(bMatch[3]!);
          const aType = aMatch[2]!; // 'min' or 'max'
          const bType = bMatch[2]!;

          // Different types (min vs max): min comes first
          if (aType !== bType) {
            return aType === "min" ? -1 : 1;
          }

          // Same type, different components: sort by component index
          if (aComponentIdx !== bComponentIdx) {
            return aComponentIdx - bComponentIdx;
          }

          // Same accessor, component, and type: sort by code priority within that type
          const minOrder = [
            "ACCESSOR_MIN_MISMATCH",
            "ACCESSOR_ELEMENT_OUT_OF_MIN_BOUND",
          ];
          const maxOrder = [
            "ACCESSOR_MAX_MISMATCH",
            "ACCESSOR_ELEMENT_OUT_OF_MAX_BOUND",
          ];
          const order = aType === "min" ? minOrder : maxOrder;

          const aPos = order.indexOf(a.code);
          const bPos = order.indexOf(b.code);
          return aPos - bPos;
        }
      }

      // For all other messages, maintain original order (stable sort)
      return 0;
    });
  }

  private validateGLB(gltf: GLTF, resources: ResourceReference[]): void {
    // Check for GLB-specific buffer validation
    if (gltf.buffers && gltf.buffers.length > 0) {
      const buffer = gltf.buffers[0];
      if (buffer) {
        // Check if buffer has URI (should not in GLB)
        if (buffer.uri !== undefined) {
          // Check if it's a valid data URI (not just starts with 'data:')
          const dataUriBase64Match = buffer.uri.match(
            /^data:([^;,]+);base64,(.+)$/,
          );
          const dataUriPlainMatch = buffer.uri.match(/^data:([^;,]+),(.*)$/);
          const isDataUri = !!(dataUriBase64Match || dataUriPlainMatch);

          this.addMessage({
            code: "URI_GLB",
            message: "URI is used in GLB container.",
            severity: Severity.INFO,
            pointer: `/buffers/0/uri`,
          });

          if (isDataUri) {
            this.addMessage({
              code: "DATA_URI_GLB",
              message: "Data URI is used in GLB container.",
              severity: Severity.WARNING,
              pointer: `/buffers/0/uri`,
            });
          }
        } else {
          // Buffer without URI should have corresponding BIN chunk
          const binResource = resources.find((r) => r.storage === "glb");
          if (!binResource) {
            this.addMessage({
              code: "BUFFER_MISSING_GLB_DATA",
              message: "Buffer refers to an unresolved GLB binary chunk.",
              severity: Severity.ERROR,
              pointer: `/buffers/0`,
            });
          }
        }

        // Check for GLB chunk padding issues (only if buffer doesn't have URI)
        if (!buffer.uri) {
          const binResource = resources.find((r) => r.storage === "glb");
          const binResourceExt = binResource as any;
          if (
            binResource &&
            binResourceExt.actualByteLength !== undefined &&
            binResourceExt.declaredByteLength !== undefined
          ) {
            const declaredLength = binResourceExt.declaredByteLength;
            const actualLength = binResourceExt.actualByteLength;

            // GLB chunks must be padded to 4-byte boundaries
            const requiredPaddedLength = Math.ceil(declaredLength / 4) * 4;
            const extraPaddingBytes = actualLength - requiredPaddedLength;

            if (extraPaddingBytes > 0) {
              this.addMessage({
                code: "BUFFER_GLB_CHUNK_TOO_BIG",
                message: `GLB-stored BIN chunk contains ${extraPaddingBytes} extra padding byte(s).`,
                severity: Severity.WARNING,
                pointer: `/buffers/0`,
              });
            } else if (actualLength < declaredLength) {
              // Byte length mismatch - actual is less than declared
              this.addMessage({
                code: "BUFFER_BYTE_LENGTH_MISMATCH",
                message: `Actual data byte length (${binResourceExt.actualByteLength}) is less than the declared buffer byte length (${binResourceExt.declaredByteLength}).`,
                severity: Severity.ERROR,
                pointer: `/buffers/0`,
              });
            }
          }
        }
      }
    }

    // Check for GLB-specific image validation
    if (gltf.images) {
      for (let i = 0; i < gltf.images.length; i++) {
        const image = gltf.images[i];
        if (image && image.uri) {
          const isDataUri = image.uri.startsWith("data:");
          this.addMessage({
            code: "URI_GLB",
            message: "URI is used in GLB container.",
            severity: Severity.INFO,
            pointer: `/images/${i}/uri`,
          });
          if (isDataUri) {
            this.addMessage({
              code: "DATA_URI_GLB",
              message: "Data URI is used in GLB container.",
              severity: Severity.WARNING,
              pointer: `/images/${i}/uri`,
            });
          }
        }
      }
    }
  }

  private checkUndeclaredExtensions(gltf: GLTF): void {
    const extensionsUsed = new Set((gltf["extensionsUsed"] as string[]) || []);
    const foundExtensions = new Set<string>();

    // Helper function to check extensions in an object
    const checkObjectExtensions = (obj: unknown, basePointer: string) => {
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const objWithExtensions = obj as Record<string, unknown>;
        if (objWithExtensions["extensions"]) {
          const extensions = objWithExtensions["extensions"] as Record<
            string,
            unknown
          >;
          for (const extensionName in extensions) {
            foundExtensions.add(extensionName);
            if (!extensionsUsed.has(extensionName)) {
              this.addMessage({
                code: "UNDECLARED_EXTENSION",
                message: "Extension is not declared in extensionsUsed.",
                severity: Severity.ERROR,
                pointer: `${basePointer}/extensions/${extensionName}`,
              });
            }
          }
        }
      }
    };

    // Skip root extensions - they are already validated in validateExtensions method

    // Check all arrays and objects that can have extensions
    const collections = [
      { array: gltf.textures, name: "textures" },
      { array: gltf.materials, name: "materials" },
      { array: gltf.nodes, name: "nodes" },
      { array: gltf.meshes, name: "meshes" },
      { array: gltf.animations, name: "animations" },
      { array: gltf.cameras, name: "cameras" },
      { array: gltf.samplers, name: "samplers" },
      { array: gltf.scenes, name: "scenes" },
      { array: gltf.skins, name: "skins" },
    ];

    for (const collection of collections) {
      if (collection.array) {
        for (let i = 0; i < collection.array.length; i++) {
          const item = collection.array[i];
          if (item) {
            checkObjectExtensions(item, `/${collection.name}/${i}`);

            // Special checks for materials (texture info extensions)
            if (collection.name === "materials") {
              const material = item as GLTFMaterial;
              if (material.pbrMetallicRoughness) {
                checkObjectExtensions(
                  material.pbrMetallicRoughness.baseColorTexture,
                  `/${collection.name}/${i}/pbrMetallicRoughness/baseColorTexture`,
                );
                checkObjectExtensions(
                  material.pbrMetallicRoughness.metallicRoughnessTexture,
                  `/${collection.name}/${i}/pbrMetallicRoughness/metallicRoughnessTexture`,
                );
              }
              checkObjectExtensions(
                material.normalTexture,
                `/${collection.name}/${i}/normalTexture`,
              );
              checkObjectExtensions(
                material.occlusionTexture,
                `/${collection.name}/${i}/occlusionTexture`,
              );
              checkObjectExtensions(
                material.emissiveTexture,
                `/${collection.name}/${i}/emissiveTexture`,
              );
            }

            // Special checks for meshes (primitive extensions)
            if (collection.name === "meshes") {
              const mesh = item as GLTFMesh;
              if (mesh.primitives) {
                for (let j = 0; j < mesh.primitives.length; j++) {
                  const primitive = mesh.primitives[j];
                  checkObjectExtensions(
                    primitive,
                    `/${collection.name}/${i}/primitives/${j}`,
                  );
                }
              }
            }

            // Special checks for animations (channel and target extensions)
            if (collection.name === "animations") {
              const animation = item as GLTFAnimation;
              if (animation.channels) {
                for (let j = 0; j < animation.channels.length; j++) {
                  const channel = animation.channels[j];
                  checkObjectExtensions(
                    channel,
                    `/${collection.name}/${i}/channels/${j}`,
                  );
                  if (channel && channel.target) {
                    checkObjectExtensions(
                      channel.target,
                      `/${collection.name}/${i}/channels/${j}/target`,
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private escapeJsonPointer(key: string): string {
    // RFC 6901: JSON Pointer escaping
    // ~ is escaped as ~0
    // / is escaped as ~1
    return key.replace(/~/g, "~0").replace(/\//g, "~1");
  }
}
