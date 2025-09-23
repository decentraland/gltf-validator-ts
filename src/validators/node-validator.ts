import { GLTFNode, GLTF, ValidationMessage, Severity } from '../types';
import { UsageTracker } from '../usage-tracker';

export class NodeValidator {
  validate(node: GLTFNode, index: number, gltf: GLTF, usageTracker?: UsageTracker): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    // Check matrix/TRS mutual exclusion
    const hasMatrix = node.matrix !== undefined;
    const hasTRS = node.translation !== undefined || node.rotation !== undefined || node.scale !== undefined;
    
    if (hasMatrix && hasTRS) {
      messages.push({
        code: 'NODE_MATRIX_TRS',
        message: 'A node can have either a matrix or any combination of translation/rotation/scale (TRS) properties.',
        severity: Severity.ERROR,
        pointer: `/nodes/${index}/matrix`
      });
    }

    // Validate transform property values for infinite/NaN
    if (node.translation !== undefined) {
      if (Array.isArray(node.translation) && node.translation.length === 3) {
        for (let i = 0; i < 3; i++) {
          const value = node.translation[i];
          if (!Number.isFinite(value)) {
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${value} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/translation/${i}`
            });
          }
        }
      }
    }

    if (node.rotation !== undefined) {
      if (Array.isArray(node.rotation) && node.rotation.length === 4) {
        for (let i = 0; i < 4; i++) {
          const value = node.rotation[i];
          if (!Number.isFinite(value)) {
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${value} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/rotation/${i}`
            });
          }
        }
      }
    }

    if (node.scale !== undefined) {
      if (Array.isArray(node.scale) && node.scale.length === 3) {
        for (let i = 0; i < 3; i++) {
          const value = node.scale[i];
          if (!Number.isFinite(value)) {
            messages.push({
              code: 'VALUE_NOT_IN_RANGE',
              message: `Value ${value} is out of range.`,
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/scale/${i}`
            });
          }
        }
      }
    }

    // TODO: Add NODE_MATRIX_DEFAULT validation for identity matrix

    // Empty node check will be handled later with more comprehensive logic

    // Check references
    if (node.camera !== undefined) {
      if (typeof node.camera !== 'number' || node.camera < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'Node camera must be a non-negative integer.',
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/camera`
        });
      } else if (!gltf.cameras || node.camera >= gltf.cameras.length) {
        messages.push({
          code: 'UNRESOLVED_REFERENCE',
          message: 'Unresolved reference: ' + node.camera + '.',
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/camera`
        });
      }
    }

    if (node.mesh !== undefined) {
      if (typeof node.mesh !== 'number' || node.mesh < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'Node mesh must be a non-negative integer.',
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/mesh`
        });
      } else if (!gltf.meshes || node.mesh >= gltf.meshes.length) {
        messages.push({
          code: 'UNRESOLVED_REFERENCE',
          message: 'Unresolved reference: ' + node.mesh + '.',
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/mesh`
        });
      } else {
        // Mark the mesh as used if usage tracker is provided
        if (usageTracker) {
          usageTracker.markUsed(`/meshes/${node.mesh}`);
        }
      }
    }

    if (node.skin !== undefined) {
      if (typeof node.skin !== 'number' || node.skin < 0) {
        messages.push({
          code: 'INVALID_VALUE',
          message: 'Node skin must be a non-negative integer.',
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/skin`
        });
      } else {
        // Check dependency: skin requires mesh (check this first for proper ordering)
        if (node.mesh === undefined) {
          messages.push({
            code: 'UNSATISFIED_DEPENDENCY',
            message: 'Dependency failed. \'mesh\' must be defined.',
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/skin`
          });
        }
        
        // Check if skin reference is valid
        if (!gltf.skins || node.skin >= gltf.skins.length) {
          messages.push({
            code: 'UNRESOLVED_REFERENCE',
            message: 'Unresolved reference: ' + node.skin + '.',
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/skin`
          });
        } else {
          // Mark the skin as used if usage tracker is provided
          if (usageTracker) {
            usageTracker.markUsed(`/skins/${node.skin}`);
          }

          // Check if node has skin but mesh doesn't have joints data
          if (node.mesh !== undefined && gltf.meshes && node.mesh < gltf.meshes.length) {
            const mesh = gltf.meshes[node.mesh];
            if (mesh && mesh.primitives && mesh.primitives.length > 0) {
              const primitive = mesh.primitives[0];
              if (primitive && (!primitive.attributes || !primitive.attributes['JOINTS_0'])) {
                messages.push({
                  code: 'NODE_SKIN_WITH_NON_SKINNED_MESH',
                  message: 'Node has skin defined, but mesh has no joints data.',
                  severity: Severity.ERROR,
                  pointer: `/nodes/${index}`
                });
              }
            }
          }
        }
      }
    }

    // Check if node has skinned mesh but no skin
    if (node.mesh !== undefined && gltf.meshes && node.mesh < gltf.meshes.length) {
      const mesh = gltf.meshes[node.mesh];
      if (mesh && mesh.primitives && mesh.primitives.length > 0) {
        const primitive = mesh.primitives[0];
        if (primitive && primitive.attributes && primitive.attributes['JOINTS_0']) {
          // This is a skinned mesh, check if node has skin
          if (node.skin === undefined) {
            messages.push({
              code: 'NODE_SKINNED_MESH_WITHOUT_SKIN',
              message: 'Node uses skinned mesh, but has no skin defined.',
              severity: Severity.WARNING,
              pointer: `/nodes/${index}`
            });
          } else {
            // Check if node has both skin/mesh and local transforms
            const hasLocalTransforms = node.translation !== undefined || 
                                     node.rotation !== undefined || 
                                     node.scale !== undefined ||
                                     node.matrix !== undefined;
            if (hasLocalTransforms) {
              messages.push({
                code: 'NODE_SKINNED_MESH_LOCAL_TRANSFORMS',
                message: 'Local transforms will not affect a skinned mesh.',
                severity: Severity.WARNING,
                pointer: `/nodes/${index}`
              });
            }
          }
        }
      }
    }

    // Check node weights against morph targets
    if (node.weights !== undefined && node.mesh !== undefined && gltf.meshes && node.mesh < gltf.meshes.length) {
      const mesh = gltf.meshes[node.mesh];
      if (mesh && mesh.primitives && mesh.primitives.length > 0) {
        const primitive = mesh.primitives[0];
        if (primitive && primitive.targets) {
          const morphTargetCount = primitive.targets.length;
          if (node.weights.length !== morphTargetCount) {
            messages.push({
              code: 'NODE_WEIGHTS_INVALID',
              message: `The length of weights array (${node.weights.length}) does not match the number of morph targets (${morphTargetCount}).`,
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/weights`
            });
          }
        }
      }
    }

    // Check children
    if (node.children !== undefined) {
      if (!Array.isArray(node.children)) {
        messages.push({
          code: 'TYPE_MISMATCH',
          message: 'Node children must be an array.',
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/children`
        });
      } else if (node.children.length === 0) {
        messages.push({
          code: 'EMPTY_ENTITY',
          message: 'Entity cannot be empty.',
          severity: Severity.ERROR,
          pointer: `/nodes/${index}/children`
        });
      } else {
        for (let i = 0; i < node.children.length; i++) {
          const childIndex = node.children[i];
          if (typeof childIndex !== 'number' || childIndex < 0) {
            messages.push({
              code: 'INVALID_VALUE',
              message: 'Node child must be a non-negative integer.',
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/children/${i}`
            });
          } else if (!gltf.nodes || childIndex >= gltf.nodes.length) {
            messages.push({
              code: 'UNRESOLVED_REFERENCE',
              message: 'Unresolved reference: ' + childIndex + '.',
              severity: Severity.ERROR,
              pointer: `/nodes/${index}/children/${i}`
            });
          } else {
            // Check if this child is already a child of another node (parent override)
            const currentParent = this.findParentNode(childIndex, gltf);
            if (currentParent !== -1 && currentParent !== index) {
              messages.push({
                code: 'NODE_PARENT_OVERRIDE',
                message: `Value overrides parent of node ${childIndex}.`,
                severity: Severity.ERROR,
                pointer: `/nodes/${index}/children/${i}`
              });
            }
          }
        }
      }
    }

    // Check rotation quaternion normalization
    if (node.rotation && Array.isArray(node.rotation) && node.rotation.length === 4) {
      const [x, y, z, w] = node.rotation;
      if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number' && typeof w === 'number') {
        const magnitude = Math.sqrt(x * x + y * y + z * z + w * w);
        if (Math.abs(magnitude - 1.0) > 1e-6) {
          messages.push({
            code: 'ROTATION_NON_UNIT',
            message: 'Rotation quaternion must be normalized.',
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/rotation`
          });
        }
      }
    }


    // Check if node has weights but no mesh
    if (node.weights !== undefined && node.mesh === undefined) {
      messages.push({
        code: 'UNSATISFIED_DEPENDENCY',
        message: "Dependency failed. 'mesh' must be defined.",
        severity: Severity.ERROR,
        pointer: `/nodes/${index}/weights`
      });
    }

    // Check extras
    if (node['extras'] !== undefined) {
      if (typeof node['extras'] !== 'object' || Array.isArray(node['extras'])) {
        // Generate NON_OBJECT_EXTRAS for non-object extras (but not null)
        messages.push({
          code: 'NON_OBJECT_EXTRAS',
          message: 'Prefer JSON Objects for extras.',
          severity: Severity.INFO,
          pointer: `/nodes/${index}/extras`
        });
      }
      // Note: null extras are not considered non-object extras and will be handled by empty node logic
    }

    // Check for empty nodes (only count expected properties as valid)
    const expectedProperties = ['camera', 'children', 'skin', 'matrix', 'mesh', 'rotation', 'scale', 'translation', 'weights', 'name', 'extensions', 'extras'];
    const properties = Object.keys(node);
    const validProperties = properties.filter(key => {
      if (!expectedProperties.includes(key)) {
        return false; // Custom properties don't count as valid for empty node check
      }
      if (key === 'extras') {
        // Don't count non-object extras as valid properties
        const extras = node['extras'];
        return typeof extras === 'object' && extras !== null && !Array.isArray(extras);
      }
      if (key === 'children') {
        // Don't count empty children arrays as valid properties
        const children = node['children'];
        return Array.isArray(children) && children.length > 0;
      }
      // If node has conflicting matrix/TRS, don't count them as valid properties
      if (hasMatrix && hasTRS) {
        if (key === 'matrix' || key === 'translation' || key === 'rotation' || key === 'scale') {
          return false; // Conflicting transform properties don't count as valid
        }
      }
      
      // Matrix validation
      if (key === 'matrix' && node.matrix && Array.isArray(node.matrix) && node.matrix.length === 16) {
        const matrix = node.matrix as number[];

        // Check if matrix is decomposable to TRS
        const isDecomposable = this.isMatrixDecomposableToTRS(matrix);
        if (!isDecomposable) {
          messages.push({
            code: 'NODE_MATRIX_NON_TRS',
            message: 'Matrix must be decomposable to TRS.',
            severity: Severity.ERROR,
            pointer: `/nodes/${index}/matrix`
          });
          return false; // Non-TRS matrix doesn't count as valid content
        }

        // Check for identity matrix
        const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let isIdentity = true;
        for (let i = 0; i < 16; i++) {
          if (Math.abs(matrix[i]! - identityMatrix[i]!) > 1e-10) {
            isIdentity = false;
            break;
          }
        }
        if (isIdentity) {
          // Generate NODE_MATRIX_DEFAULT error for identity matrix
          messages.push({
            code: 'NODE_MATRIX_DEFAULT',
            message: 'Do not specify default transform matrix.',
            severity: Severity.INFO,
            pointer: `/nodes/${index}/matrix`
          });
          return false; // Identity matrix doesn't count as valid content
        }
      }
      
      // Don't count invalid rotation as a valid property
      if (key === 'rotation' && node.rotation) {
        const rotation = node.rotation;
        if (Array.isArray(rotation) && rotation.length === 4) {
          const [x, y, z, w] = rotation;
          if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number' && typeof w === 'number') {
            const magnitude = Math.sqrt(x*x + y*y + z*z + w*w);
            const tolerance = 1e-6;
            if (Math.abs(magnitude - 1.0) > tolerance) {
              return false; // Non-unit rotation doesn't count as valid
            }
          }
        }
      }
      
      // Don't count transform properties with infinite/NaN values as valid properties
      if ((key === 'translation' || key === 'scale') && Array.isArray(node[key]) && node[key].length === 3) {
        for (const value of node[key]) {
          if (!Number.isFinite(value)) {
            return false; // Transform with infinite/NaN values doesn't count as valid
          }
        }
      }
      
      if (key === 'rotation' && Array.isArray(node[key]) && node[key].length === 4) {
        for (const value of node[key]) {
          if (!Number.isFinite(value)) {
            return false; // Rotation with infinite/NaN values doesn't count as valid
          }
        }
      }
      
      // Don't count unresolved references as valid properties
      if (key === 'camera' && typeof node[key] === 'number') {
        const cameraIndex = node[key] as number;
        if (!gltf.cameras || cameraIndex < 0 || cameraIndex >= gltf.cameras.length) {
          return false; // Unresolved camera reference doesn't count as valid
        }
      }
      
      if (key === 'mesh' && typeof node[key] === 'number') {
        const meshIndex = node[key] as number;
        if (!gltf.meshes || meshIndex < 0 || meshIndex >= gltf.meshes.length) {
          return false; // Unresolved mesh reference doesn't count as valid
        }
      }
      
      if (key === 'skin' && typeof node[key] === 'number') {
        const skinIndex = node[key] as number;
        if (!gltf.skins || skinIndex < 0 || skinIndex >= gltf.skins.length) {
          return false; // Unresolved skin reference doesn't count as valid
        }
        // Don't count skin as valid if there's no mesh (unsatisfied dependency)
        if (node.mesh === undefined) {
          return false;
        }
      }
      
      if (key === 'weights') {
        // Don't count weights as valid if there's no mesh (unsatisfied dependency)
        if (node.mesh === undefined) {
          return false;
        }
      }
      
      return true;
    });
    const hasProperties = validProperties.length > 0;
    if (!hasProperties) {
      // Only report NODE_EMPTY if the node is not referenced by any skin
      const isReferencedBySkin = this.isNodeReferencedBySkin(index, gltf);
      if (!isReferencedBySkin) {
        // Don't generate NODE_EMPTY if we already generated NON_OBJECT_EXTRAS for this node
        const hasNonObjectExtras = messages.some(msg => 
          msg.code === 'NON_OBJECT_EXTRAS' && msg.pointer === `/nodes/${index}/extras`
        );
        if (!hasNonObjectExtras) {
          messages.push({
            code: 'NODE_EMPTY',
            message: 'Empty node encountered.',
            severity: Severity.INFO,
            pointer: `/nodes/${index}`
          });
        }
      }
    }

    // Check for unexpected properties
    for (const key in node) {
      if (!expectedProperties.includes(key)) {
        messages.push({
          code: 'UNEXPECTED_PROPERTY',
          message: 'Unexpected property.',
          severity: Severity.WARNING,
          pointer: `/nodes/${index}/${key}`
        });
      }
    }

    return messages;
  }

  private isMatrixDecomposableToTRS(matrix: number[]): boolean {
    // A simplified check for TRS decomposability
    // A matrix is decomposable to TRS if:
    // 1. The bottom row is [0, 0, 0, 1]
    // 2. The upper-left 3x3 can be decomposed into rotation and scale

    if (matrix.length !== 16) {
      return false;
    }

    const epsilon = 1e-6;

    // Check bottom row
    if (Math.abs(matrix[12]!) > epsilon ||
        Math.abs(matrix[13]!) > epsilon ||
        Math.abs(matrix[14]!) > epsilon ||
        Math.abs(matrix[15]! - 1) > epsilon) {
      return false;
    }

    // Extract upper-left 3x3 matrix for rotation/scale analysis
    const m00 = matrix[0]!, m01 = matrix[1]!, m02 = matrix[2]!;
    const m10 = matrix[4]!, m11 = matrix[5]!, m12 = matrix[6]!;
    const m20 = matrix[8]!, m21 = matrix[9]!, m22 = matrix[10]!;

    // Calculate determinant of upper-left 3x3
    const det = m00 * (m11 * m22 - m12 * m21) -
                m01 * (m10 * m22 - m12 * m20) +
                m02 * (m10 * m21 - m11 * m20);

    // Determinant should be non-zero (invertible) and positive (no reflection)
    if (Math.abs(det) < epsilon || det < 0) {
      return false;
    }

    // Calculate scale factors (column lengths)
    const scaleX = Math.sqrt(m00*m00 + m10*m10 + m20*m20);
    const scaleY = Math.sqrt(m01*m01 + m11*m11 + m21*m21);
    const scaleZ = Math.sqrt(m02*m02 + m12*m12 + m22*m22);

    // Scale factors should be positive and finite
    if (scaleX <= epsilon || scaleY <= epsilon || scaleZ <= epsilon ||
        !Number.isFinite(scaleX) || !Number.isFinite(scaleY) || !Number.isFinite(scaleZ)) {
      return false;
    }

    // For a more comprehensive check, we could verify that the normalized
    // upper-left 3x3 matrix forms a valid rotation matrix, but this basic
    // check should catch most problematic matrices like the all-1s matrix

    return true;
  }

  private findParentNode(childIndex: number, gltf: GLTF): number {
    if (!gltf.nodes) return -1;

    // Find the parent of the given child node
    for (let i = 0; i < gltf.nodes.length; i++) {
      const node = gltf.nodes[i];
      if (node && node.children && Array.isArray(node.children)) {
        if (node.children.includes(childIndex)) {
          return i; // Found the parent
        }
      }
    }

    return -1; // No parent found
  }

  private isNodeReferencedBySkin(nodeIndex: number, gltf: GLTF): boolean {
    if (!gltf.skins) return false;

    // Check if the node is referenced by any skin's joints array
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
}
