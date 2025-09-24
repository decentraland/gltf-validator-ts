import { GLTFScene, GLTF, ValidationMessage, Severity } from "../types";

export class SceneValidator {
  validate(scene: GLTFScene, index: number, gltf: GLTF): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check nodes
    if (scene.nodes !== undefined) {
      if (!Array.isArray(scene.nodes)) {
        messages.push({
          code: "TYPE_MISMATCH",
          message: "Scene nodes must be an array.",
          severity: Severity.ERROR,
          pointer: `/scenes/${index}/nodes`,
        });
      } else if (scene.nodes.length === 0) {
        messages.push({
          code: "EMPTY_ENTITY",
          message: "Entity cannot be empty.",
          severity: Severity.ERROR,
          pointer: `/scenes/${index}/nodes`,
        });
      } else {
        for (let i = 0; i < scene.nodes.length; i++) {
          const nodeIndex = scene.nodes[i];
          if (typeof nodeIndex !== "number" || nodeIndex < 0) {
            messages.push({
              code: "INVALID_VALUE",
              message: "Scene node must be a non-negative integer.",
              severity: Severity.ERROR,
              pointer: `/scenes/${index}/nodes/${i}`,
            });
          } else if (!gltf.nodes || nodeIndex >= gltf.nodes.length) {
            messages.push({
              code: "UNRESOLVED_REFERENCE",
              message: "Unresolved reference: " + nodeIndex + ".",
              severity: Severity.ERROR,
              pointer: `/scenes/${index}/nodes/${i}`,
            });
          } else {
            // Check if this node is actually a root node (not a child of any other node)
            const isRootNode = this.isRootNode(nodeIndex, gltf);
            if (!isRootNode) {
              messages.push({
                code: "SCENE_NON_ROOT_NODE",
                message: `Node ${nodeIndex} is not a root node.`,
                severity: Severity.ERROR,
                pointer: `/scenes/${index}/nodes/${i}`,
              });
            }
          }
        }
      }
    }

    // Check for unexpected properties
    const expectedProperties = ["nodes", "name", "extensions", "extras"];
    for (const key in scene) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: "UNEXPECTED_PROPERTY",
          message: "Unexpected property.",
          severity: Severity.WARNING,
          pointer: `/scenes/${index}/${key}`,
        });
      }
    }

    return messages;
  }

  private isRootNode(nodeIndex: number, gltf: GLTF): boolean {
    if (!gltf.nodes) return true;

    // Check if this node is a child of any other node
    for (let i = 0; i < gltf.nodes.length; i++) {
      const node = gltf.nodes[i];
      if (node && node.children && Array.isArray(node.children)) {
        if (node.children.includes(nodeIndex)) {
          return false; // This node is a child of another node
        }
      }
    }

    return true; // This node is not a child of any other node
  }
}
