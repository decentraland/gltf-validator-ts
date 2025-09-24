import {
  GLTFAnimation,
  GLTF,
  ValidationMessage,
  Severity,
  AnimationPath,
  AnimationInterpolation,
  AnimationChannelWithExtensions,
  AnimationSamplerWithExtensions,
  GLTFAnimationTarget,
} from "../types";

export class AnimationValidator {
  validate(
    animation: GLTFAnimation,
    index: number,
    gltf: GLTF,
  ): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check for unexpected properties first to match expected order
    const expectedProperties = [
      "channels",
      "samplers",
      "name",
      "extensions",
      "extras",
    ];
    for (const key in animation) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/animations/${index}/${key}`,
        });
      }
    }

    // Check required properties
    if (!animation.channels || !Array.isArray(animation.channels)) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'channels' must be defined.",
        severity: Severity.ERROR,
        pointer: `/animations/${index}`,
      });
    } else if (animation.channels.length === 0) {
      messages.push({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: `/animations/${index}/channels`,
      });
    } else {
      // Validate each channel
      for (let i = 0; i < animation.channels.length; i++) {
        messages.push(
          ...this.validateChannel(animation.channels[i] as any, index, i, gltf),
        );
      }

      // Check for duplicate targets
      if (animation.channels && Array.isArray(animation.channels)) {
        this.checkDuplicateTargets(animation.channels as any, index, messages);
      }
    }

    if (!animation.samplers || !Array.isArray(animation.samplers)) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'samplers' must be defined.",
        severity: Severity.ERROR,
        pointer: `/animations/${index}`,
      });
    } else if (animation.samplers.length === 0) {
      messages.push({
        code: "EMPTY_ENTITY",
        message: "Entity cannot be empty.",
        severity: Severity.ERROR,
        pointer: `/animations/${index}/samplers`,
      });
    } else {
      // Validate each sampler
      for (let i = 0; i < animation.samplers.length; i++) {
        messages.push(
          ...this.validateSampler(animation.samplers[i] as any, index, i, gltf),
        );
      }
    }

    return messages;
  }

  private validateChannel(
    channel: AnimationChannelWithExtensions,
    animationIndex: number,
    channelIndex: number,
    gltf: GLTF,
  ): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check for unexpected properties first to match expected order
    const expectedProperties = ["sampler", "target"];

    // Allow 'extensions' property if it contains any extensions (even if they're in wrong location)
    // The specific extension location validation will be handled by extension validators
    if (channel["extensions"]) {
      expectedProperties.push("extensions");
    }

    for (const key in channel) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/${key}`,
        });
      }
    }

    // Check required properties
    if (channel.sampler === undefined) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'sampler' must be defined.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/channels/${channelIndex}`,
      });
    } else if (typeof channel.sampler !== "number" || channel.sampler < 0) {
      messages.push({
        code: "INVALID_VALUE",
        message: "Animation channel sampler must be a non-negative integer.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/channels/${channelIndex}/sampler`,
      });
    } else if (
      !gltf.animations?.[animationIndex]?.samplers ||
      channel.sampler >= gltf.animations[animationIndex].samplers.length
    ) {
      messages.push({
        code: "UNRESOLVED_REFERENCE",
        message: "Unresolved reference: " + channel.sampler + ".",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/channels/${channelIndex}/sampler`,
      });
    }

    if (!channel.target) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'target' must be defined.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/channels/${channelIndex}`,
      });
    } else {
      messages.push(
        ...this.validateTarget(
          channel.target,
          animationIndex,
          channelIndex,
          gltf,
          channel,
        ),
      );

      // Check if target node has matrix and channel targets TRS properties
      if (channel.target.node !== undefined && channel.target.path) {
        const node = gltf.nodes?.[channel.target.node];
        if (node && node.matrix && this.isTRSPath(channel.target.path)) {
          messages.push({
            code: "ANIMATION_CHANNEL_TARGET_NODE_MATRIX",
            message:
              "Animation channel cannot target TRS properties of a node with defined matrix.",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/channels/${channelIndex}/target`,
          });
        }

        // Check if target node has weights but no morph targets
        if (channel.target.path === "weights") {
          const mesh =
            node?.mesh !== undefined ? gltf.meshes?.[node.mesh] : null;
          if (
            !mesh ||
            !mesh.primitives ||
            mesh.primitives.every(
              (primitive) =>
                !primitive.targets || primitive.targets.length === 0,
            )
          ) {
            messages.push({
              code: "ANIMATION_CHANNEL_TARGET_NODE_WEIGHTS_NO_MORPHS",
              message:
                "Animation channel cannot target WEIGHTS when mesh does not have morph targets.",
              severity: Severity.ERROR,
              pointer: `/animations/${animationIndex}/channels/${channelIndex}/target`,
            });
          }
        }
      }
    }

    return messages;
  }

  private validateTarget(
    target: GLTFAnimationTarget,
    animationIndex: number,
    channelIndex: number,
    gltf: GLTF,
    channel?: AnimationChannelWithExtensions,
  ): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    if (target.node !== undefined) {
      if (typeof target.node !== "number" || target.node < 0) {
        messages.push({
          code: "INVALID_VALUE",
          message: "Animation target node must be a non-negative integer.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/node`,
        });
      } else if (!gltf.nodes || target.node >= gltf.nodes.length) {
        messages.push({
          code: "UNRESOLVED_REFERENCE",
          message: "Unresolved reference: " + target.node + ".",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/node`,
        });
      }
    }

    if (!target.path) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'path' must be defined.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/channels/${channelIndex}/target`,
      });
    } else if (typeof target.path !== "string") {
      messages.push({
        code: "TYPE_MISMATCH",
        message: "Animation target path must be a string.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/path`,
      });
    } else if (!Object.values(AnimationPath).includes(target.path as any)) {
      // Allow "pointer" path when KHR_animation_pointer extension is used (in target or channel)
      const hasAnimationPointerExt =
        (target.extensions && target.extensions["KHR_animation_pointer"]) ||
        (channel &&
          channel["extensions"] &&
          channel["extensions"]["KHR_animation_pointer"]);
      if (target.path === "pointer" && hasAnimationPointerExt) {
        // Valid KHR_animation_pointer usage (even if in wrong location)
      } else {
        // Include "pointer" in valid values if KHR_animation_pointer extension is present anywhere in channel or target
        const validValues = hasAnimationPointerExt
          ? "('translation', 'rotation', 'scale', 'weights', 'pointer')"
          : "('translation', 'rotation', 'scale', 'weights')";

        messages.push({
          code: "VALUE_NOT_IN_LIST",
          message: `Invalid value '${target.path}'. Valid values are ${validValues}.`,
          severity: Severity.WARNING,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/path`,
        });
      }
    }

    // Check for unexpected properties
    const expectedProperties = ["node", "path"];
    // Allow extensions when KHR_animation_pointer is used
    if (target.extensions && target.extensions["KHR_animation_pointer"]) {
      expectedProperties.push("extensions");
    }

    for (const key in target) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/animations/${animationIndex}/channels/${channelIndex}/target/${key}`,
        });
      }
    }

    return messages;
  }

  private validateSampler(
    sampler: AnimationSamplerWithExtensions,
    animationIndex: number,
    samplerIndex: number,
    gltf: GLTF,
  ): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check required properties
    if (sampler.input === undefined) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'input' must be defined.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/samplers/${samplerIndex}`,
      });
    } else if (typeof sampler.input !== "number" || sampler.input < 0) {
      messages.push({
        code: "INVALID_VALUE",
        message: "Animation sampler input must be a non-negative integer.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`,
      });
    } else if (!gltf.accessors || sampler.input >= gltf.accessors.length) {
      messages.push({
        code: "UNRESOLVED_REFERENCE",
        message: "Unresolved reference: " + sampler.input + ".",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`,
      });
    } else {
      // Check if input accessor has valid format for animation samplers
      const inputAccessor = gltf.accessors[sampler.input];
      if (
        inputAccessor &&
        (inputAccessor.type !== "SCALAR" ||
          inputAccessor.componentType !== 5126)
      ) {
        const format = `{${inputAccessor.type}, ${this.getComponentTypeName(inputAccessor.componentType)}}`;
        messages.push({
          code: "ANIMATION_SAMPLER_INPUT_ACCESSOR_INVALID_FORMAT",
          message: `Invalid Animation sampler input accessor format '${format}'. Must be one of ('{SCALAR, FLOAT}').`,
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`,
        });
      }

      // Check if input accessor has bounds defined
      if (
        inputAccessor &&
        (inputAccessor.min === undefined || inputAccessor.max === undefined)
      ) {
        messages.push({
          code: "ANIMATION_SAMPLER_INPUT_ACCESSOR_WITHOUT_BOUNDS",
          message:
            "accessor.min and accessor.max must be defined for animation input accessor.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`,
        });
      }

      // Check if input accessor uses a bufferView with byteStride
      if (
        inputAccessor &&
        inputAccessor.bufferView !== undefined &&
        gltf.bufferViews
      ) {
        const bufferView = gltf.bufferViews[inputAccessor.bufferView];
        if (bufferView && bufferView.byteStride !== undefined) {
          messages.push({
            code: "ANIMATION_SAMPLER_ACCESSOR_WITH_BYTESTRIDE",
            message:
              "bufferView.byteStride must not be defined for buffer views used by animation sampler accessors.",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`,
          });
        }
      }

      // Check if CUBICSPLINE interpolation has enough elements
      if (
        sampler.interpolation === "CUBICSPLINE" &&
        inputAccessor &&
        inputAccessor.count < 2
      ) {
        messages.push({
          code: "ANIMATION_SAMPLER_INPUT_ACCESSOR_TOO_FEW_ELEMENTS",
          message: `Animation sampler output accessor with 'CUBICSPLINE' interpolation must have at least 2 elements. Got ${inputAccessor.count}.`,
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/input`,
        });
      }
    }

    if (sampler.output === undefined) {
      messages.push({
        code: "UNDEFINED_PROPERTY",
        message: "Property 'output' must be defined.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/samplers/${samplerIndex}`,
      });
    } else if (typeof sampler.output !== "number" || sampler.output < 0) {
      messages.push({
        code: "INVALID_VALUE",
        message: "Animation sampler output must be a non-negative integer.",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/output`,
      });
    } else if (!gltf.accessors || sampler.output >= gltf.accessors.length) {
      messages.push({
        code: "UNRESOLVED_REFERENCE",
        message: "Unresolved reference: " + sampler.output + ".",
        severity: Severity.ERROR,
        pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/output`,
      });
    } else {
      const outputAccessor = gltf.accessors[sampler.output];
      // Check if output accessor uses a bufferView with byteStride
      if (
        outputAccessor &&
        outputAccessor.bufferView !== undefined &&
        gltf.bufferViews
      ) {
        const bufferView = gltf.bufferViews[outputAccessor.bufferView];
        if (bufferView && bufferView.byteStride !== undefined) {
          messages.push({
            code: "ANIMATION_SAMPLER_ACCESSOR_WITH_BYTESTRIDE",
            message:
              "bufferView.byteStride must not be defined for buffer views used by animation sampler accessors.",
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/output`,
          });
        }
      }

      // Check if output accessor format is valid for the animation path first
      if (outputAccessor) {
        const expectedFormat = this.getExpectedOutputFormat(
          gltf,
          animationIndex,
          samplerIndex,
        );
        if (
          expectedFormat &&
          (outputAccessor.type !== expectedFormat.type ||
            outputAccessor.componentType !== expectedFormat.componentType)
        ) {
          const actualFormat = `{${outputAccessor.type}, ${this.getComponentTypeName(outputAccessor.componentType)}}`;
          const expectedFormatStr = `{${expectedFormat.type}, ${this.getComponentTypeName(expectedFormat.componentType)}}`;
          // Find which channel uses this sampler to get the correct pointer
          let channelIndex = -1;
          if (gltf.animations?.[animationIndex]?.channels) {
            for (
              let i = 0;
              i < gltf.animations[animationIndex].channels.length;
              i++
            ) {
              if (
                gltf.animations[animationIndex].channels[i]?.sampler ===
                samplerIndex
              ) {
                channelIndex = i;
                break;
              }
            }
          }
          messages.push({
            code: "ANIMATION_SAMPLER_OUTPUT_ACCESSOR_INVALID_FORMAT",
            message: `Invalid animation sampler output accessor format '${actualFormat}' for path '${expectedFormat.path}'. Must be one of ('${expectedFormatStr}').`,
            severity: Severity.ERROR,
            pointer:
              channelIndex >= 0
                ? `/animations/${animationIndex}/channels/${channelIndex}/sampler`
                : `/animations/${animationIndex}/samplers/${samplerIndex}/output`,
          });
        } else if (expectedFormat) {
          // Only check count mismatch if the format is valid, but skip for CUBICSPLINE
          const inputAccessor = gltf.accessors[sampler.input];
          if (
            inputAccessor &&
            outputAccessor &&
            sampler.interpolation !== "CUBICSPLINE" &&
            inputAccessor.count !== outputAccessor.count
          ) {
            // Find which channel uses this sampler to get the correct pointer
            let channelIndex = -1;
            if (gltf.animations?.[animationIndex]?.channels) {
              for (
                let i = 0;
                i < gltf.animations[animationIndex].channels.length;
                i++
              ) {
                if (
                  gltf.animations[animationIndex].channels[i]?.sampler ===
                  samplerIndex
                ) {
                  channelIndex = i;
                  break;
                }
              }
            }
            messages.push({
              code: "ANIMATION_SAMPLER_OUTPUT_ACCESSOR_INVALID_COUNT",
              message: `Animation sampler output accessor of count ${inputAccessor.count} expected. Found ${outputAccessor.count}.`,
              severity: Severity.ERROR,
              pointer:
                channelIndex >= 0
                  ? `/animations/${animationIndex}/channels/${channelIndex}/sampler`
                  : `/animations/${animationIndex}/samplers/${samplerIndex}/output`,
            });
          }
        }
      }
    }

    // Check interpolation
    if (sampler.interpolation !== undefined) {
      if (typeof sampler.interpolation !== "string") {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Animation sampler interpolation must be a string.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/interpolation`,
        });
      } else if (
        !Object.values(AnimationInterpolation).includes(
          sampler.interpolation as any,
        )
      ) {
        messages.push({
          code: "INVALID_VALUE",
          message:
            "Animation sampler interpolation must be one of: LINEAR, STEP, CUBICSPLINE.",
          severity: Severity.ERROR,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/interpolation`,
        });
      }
    }

    // Check for unexpected properties
    const expectedProperties = ["input", "output", "interpolation"];
    for (const key in sampler) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/animations/${animationIndex}/samplers/${samplerIndex}/${key}`,
        });
      }
    }

    return messages;
  }

  private checkDuplicateTargets(
    channels: AnimationChannelWithExtensions[],
    animationIndex: number,
    messages: ValidationMessage[],
  ): void {
    const targets = new Map<string, number>();

    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      if (channel.target && channel.target.node !== undefined) {
        const targetKey = this.getTargetKey(channel.target);
        if (targets.has(targetKey)) {
          const firstIndex = targets.get(targetKey)!;
          messages.push({
            code: "ANIMATION_DUPLICATE_TARGETS",
            message: `Animation channel has the same target as channel ${i}.`,
            severity: Severity.ERROR,
            pointer: `/animations/${animationIndex}/channels/${firstIndex}/target`,
          });
          // Only report the first duplicate to match expected behavior
          break;
        } else {
          targets.set(targetKey, i);
        }
      }
    }
  }

  private getTargetKey(target: GLTFAnimationTarget): string {
    const node = target.node !== undefined ? target.node : "undefined";
    const path = target.path || "undefined";
    return `${node}:${path}`;
  }

  private isTRSPath(path: string): boolean {
    return ["translation", "rotation", "scale"].includes(path);
  }

  private getComponentTypeName(componentType: number): string {
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

  private getExpectedOutputFormat(
    gltf: GLTF,
    animationIndex: number,
    samplerIndex: number,
  ): { type: string; componentType: number; path: string } | null {
    const animation = gltf.animations?.[animationIndex];
    if (!animation || !animation.channels) {
      return null;
    }

    // Find the channel that uses this sampler
    for (const channel of animation.channels) {
      if (
        channel.sampler === samplerIndex &&
        channel.target &&
        channel.target.path
      ) {
        const path = channel.target.path;

        // Return expected format based on the animation path
        switch (path) {
          case "translation":
          case "scale":
            return { type: "VEC3", componentType: 5126, path }; // FLOAT
          case "rotation":
            return { type: "VEC4", componentType: 5126, path }; // FLOAT (quaternion)
          case "weights":
            return { type: "SCALAR", componentType: 5126, path }; // FLOAT
          default:
            return null;
        }
      }
    }

    return null;
  }
}
